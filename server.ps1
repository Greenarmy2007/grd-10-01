$port     = 8080
$rootPath = $PSScriptRoot
$subFile  = "$rootPath\submissions.json"

# Inline MIME map as a C# dictionary initializer string
$mimeEntries = @"
{ ".html", "text/html; charset=utf-8" },
{ ".css",  "text/css; charset=utf-8" },
{ ".js",   "application/javascript; charset=utf-8" },
{ ".json", "application/json; charset=utf-8" },
{ ".svg",  "image/svg+xml" },
{ ".jpg",  "image/jpeg" },
{ ".jpeg", "image/jpeg" },
{ ".png",  "image/png" },
{ ".ico",  "image/x-icon" },
{ ".txt",  "text/plain; charset=utf-8" },
{ ".xml",  "application/xml" },
{ ".webp", "image/webp" },
{ ".woff2","font/woff2" },
{ ".woff", "font/woff" },
{ ".ttf",  "font/ttf" },
{ ".mp4",  "video/mp4" },
{ ".pdf",  "application/pdf" }
"@

Add-Type @"
using System;
using System.IO;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;

public class GrdServer {
    private static readonly Dictionary<string,string> MimeMap = new Dictionary<string,string>(StringComparer.OrdinalIgnoreCase) {
        $mimeEntries
    };

    private static readonly object FileLock = new object();
    private static string SubFile;
    private static string RootPath;

    public static void Run(string rootPath, string subFile, int port) {
        RootPath = rootPath;
        SubFile  = subFile;

        var listener = new HttpListener();
        listener.Prefixes.Add("http://localhost:" + port + "/");
        listener.Prefixes.Add("http://127.0.0.1:" + port + "/");
        listener.Start();
        Console.WriteLine("GRD-10 Server running at http://localhost:" + port + "/ (async concurrent)");
        Console.WriteLine("Press Ctrl+C to stop.");

        Action startAccept = null;
        startAccept = () => {
            listener.GetContextAsync().ContinueWith(t => {
                if (listener.IsListening) startAccept();
                if (t.Status == TaskStatus.RanToCompletion) {
                    Task.Run(() => HandleRequest(t.Result));
                }
            });
        };
        startAccept();

        // Keep main thread alive
        while (listener.IsListening) Thread.Sleep(200);
        listener.Stop();
    }

    private static void HandleRequest(HttpListenerContext ctx) {
        var req  = ctx.Request;
        var resp = ctx.Response;
        var path = req.Url.LocalPath;
        var meth = req.HttpMethod.ToUpperInvariant();

        resp.Headers.Add("Access-Control-Allow-Origin",  "*");
        resp.Headers.Add("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        resp.Headers.Add("Access-Control-Allow-Headers", "Content-Type, Accept");

        try {
            if (meth == "OPTIONS") {
                resp.StatusCode = 204;
                resp.Close();
                return;
            }

            // POST submit-nomination
            if ((path == "/api/submit-nomination" || path == "/.netlify/functions/submit-nomination") && meth == "POST") {
                string body = new StreamReader(req.InputStream, Encoding.UTF8).ReadToEnd();
                string refId = "";
                var mRef = System.Text.RegularExpressions.Regex.Match(body, "\"referenceId\"\\s*:\\s*\"([^\"]+)\"");
                if (mRef.Success) {
                    refId = mRef.Groups[1].Value.Trim();
                }
                if (string.IsNullOrEmpty(refId)) {
                    refId = "GRD-2026-NOM-" + new Random().Next(10000, 99999);
                }

                lock (FileLock) {
                    // Parse body to insert fields
                    string trimmed = body.TrimEnd();
                    if (trimmed.EndsWith("}")) {
                        string extra = "";
                        if (!body.Contains("\"referenceId\"")) extra += ",\"referenceId\":\"" + refId + "\"";
                        if (!body.Contains("\"status\""))      extra += ",\"status\":\"Under Review\"";
                        if (!body.Contains("\"submittedAt\"")) extra += ",\"submittedAt\":\"" + DateTime.UtcNow.ToString("o") + "\"";
                        body = trimmed.Substring(0, trimmed.Length - 1) + extra + "}";
                    }

                    string existingContent = "[]";
                    if (File.Exists(SubFile)) {
                        string raw = File.ReadAllText(SubFile, Encoding.UTF8).Trim();
                        if (!string.IsNullOrWhiteSpace(raw)) existingContent = raw;
                    }

                    // Prepend new submission to array
                    string newContent;
                    if (existingContent == "[]") {
                        newContent = "[" + body + "]";
                    } else {
                        newContent = "[" + body + "," + existingContent.TrimStart('[');
                    }
                    File.WriteAllText(SubFile, newContent, Encoding.UTF8);
                    Console.WriteLine("[" + DateTime.Now.ToString("HH:mm:ss") + "] Nomination saved (ref: " + refId + ")");
                }

                SendJson(resp, 200, "{\"success\":true,\"referenceId\":\"" + refId + "\",\"message\":\"Nomination received.\"}");
                return;
            }

            // POST /api/delete-nomination
            if (path == "/api/delete-nomination" && meth == "POST") {
                string body = new StreamReader(req.InputStream, Encoding.UTF8).ReadToEnd();
                string refId = "";
                var m = System.Text.RegularExpressions.Regex.Match(body, "\"referenceId\"\\s*:\\s*\"([^\"]+)\"");
                if (m.Success) {
                    refId = m.Groups[1].Value.Trim();
                } else {
                    var m2 = System.Text.RegularExpressions.Regex.Match(body, "\"id\"\\s*:\\s*\"([^\"]+)\"");
                    if (m2.Success) refId = m2.Groups[1].Value.Trim();
                }

                if (string.IsNullOrEmpty(refId)) {
                    SendJson(resp, 400, "{\"success\":false,\"error\":\"Missing referenceId\"}");
                    return;
                }

                lock (FileLock) {
                    if (File.Exists(SubFile)) {
                        string raw = File.ReadAllText(SubFile, Encoding.UTF8).Trim();
                        string filtered = RemoveNominationByRef(raw, refId);
                        File.WriteAllText(SubFile, filtered, Encoding.UTF8);
                        Console.WriteLine("[" + DateTime.Now.ToString("HH:mm:ss") + "] Deleted nomination ref: " + refId);
                    }
                }

                SendJson(resp, 200, "{\"success\":true,\"message\":\"Nomination deleted successfully\"}");
                return;
            }

            // POST /api/update-nomination-status
            if (path == "/api/update-nomination-status" && meth == "POST") {
                string body = new StreamReader(req.InputStream, Encoding.UTF8).ReadToEnd();
                string refId = "";
                string newStatus = "";
                var m = System.Text.RegularExpressions.Regex.Match(body, "\"referenceId\"\\s*:\\s*\"([^\"]+)\"");
                if (m.Success) {
                    refId = m.Groups[1].Value.Trim();
                } else {
                    var m2 = System.Text.RegularExpressions.Regex.Match(body, "\"id\"\\s*:\\s*\"([^\"]+)\"");
                    if (m2.Success) refId = m2.Groups[1].Value.Trim();
                }

                var ms = System.Text.RegularExpressions.Regex.Match(body, "\"status\"\\s*:\\s*\"([^\"]+)\"");
                if (ms.Success) newStatus = ms.Groups[1].Value.Trim();

                if (string.IsNullOrEmpty(refId) || string.IsNullOrEmpty(newStatus)) {
                    SendJson(resp, 400, "{\"success\":false,\"error\":\"Missing referenceId or status\"}");
                    return;
                }

                lock (FileLock) {
                    if (File.Exists(SubFile)) {
                        string raw = File.ReadAllText(SubFile, Encoding.UTF8).Trim();
                        string updated = UpdateNominationStatusByRef(raw, refId, newStatus);
                        File.WriteAllText(SubFile, updated, Encoding.UTF8);
                        Console.WriteLine("[" + DateTime.Now.ToString("HH:mm:ss") + "] Updated nomination " + refId + " to status: " + newStatus);
                    }
                }

                SendJson(resp, 200, "{\"success\":true,\"message\":\"Status updated successfully\"}");
                return;
            }

            // GET nominations
            if (path == "/api/get-nominations" && meth == "GET") {
                string content = "[]";
                if (File.Exists(SubFile)) {
                    string raw = File.ReadAllText(SubFile, Encoding.UTF8).Trim();
                    if (!string.IsNullOrWhiteSpace(raw)) content = raw;
                }
                Console.WriteLine("[" + DateTime.Now.ToString("HH:mm:ss") + "] GET nominations (" + content.Length + " bytes)");
                SendJson(resp, 200, content);
                return;
            }

            // Static files
            string filePath = (path == "/" || path == "") ? "/index.html" : path;
            string localPath = Path.Combine(RootPath, filePath.TrimStart('/').Replace('/', Path.DirectorySeparatorChar));

            if (File.Exists(localPath)) {
                string ext = Path.GetExtension(localPath).ToLowerInvariant();
                string ct  = MimeMap.ContainsKey(ext) ? MimeMap[ext] : "application/octet-stream";
                byte[] data = File.ReadAllBytes(localPath);
                resp.StatusCode      = 200;
                resp.ContentType     = ct;
                resp.ContentLength64 = data.Length;
                resp.OutputStream.Write(data, 0, data.Length);
            } else {
                byte[] msg = Encoding.UTF8.GetBytes("404 - " + path);
                resp.StatusCode      = 404;
                resp.ContentLength64 = msg.Length;
                resp.OutputStream.Write(msg, 0, msg.Length);
            }
        } catch (Exception ex) {
            Console.WriteLine("[ERROR] " + ex.Message);
        } finally {
            try { resp.Close(); } catch {}
        }
    }

    private static void SendJson(HttpListenerResponse resp, int code, string body) {
        byte[] bytes = Encoding.UTF8.GetBytes(body);
        resp.StatusCode      = code;
        resp.ContentType     = "application/json; charset=utf-8";
        resp.ContentLength64 = bytes.Length;
        resp.OutputStream.Write(bytes, 0, bytes.Length);
    }

    private static string RemoveNominationByRef(string json, string targetRef) {
        if (string.IsNullOrEmpty(targetRef) || string.IsNullOrEmpty(json)) return json;
        var list = new List<string>();
        int depth = 0;
        int start = -1;
        bool inStr = false;
        bool esc = false;
        for (int i = 0; i < json.Length; i++) {
            char c = json[i];
            if (esc) { esc = false; continue; }
            if (c == '\\') { esc = true; continue; }
            if (c == '"') { inStr = !inStr; continue; }
            if (inStr) continue;
            if (c == '{') {
                if (depth == 0) start = i;
                depth++;
            } else if (c == '}') {
                depth--;
                if (depth == 0 && start != -1) {
                    string obj = json.Substring(start, i - start + 1);
                    bool matches = obj.Contains("\"referenceId\":\"" + targetRef + "\"") ||
                                  obj.Contains("\"referenceId\": \"" + targetRef + "\"") ||
                                  obj.Contains("\"id\":\"" + targetRef + "\"") ||
                                  obj.Contains("\"id\": \"" + targetRef + "\"");
                    if (!matches) {
                        list.Add(obj);
                    }
                    start = -1;
                }
            }
        }
        return "[" + string.Join(",", list.ToArray()) + "]";
    }

    private static string UpdateNominationStatusByRef(string json, string targetRef, string newStatus) {
        if (string.IsNullOrEmpty(targetRef) || string.IsNullOrEmpty(json)) return json;
        var list = new List<string>();
        int depth = 0;
        int start = -1;
        bool inStr = false;
        bool esc = false;
        for (int i = 0; i < json.Length; i++) {
            char c = json[i];
            if (esc) { esc = false; continue; }
            if (c == '\\') { esc = true; continue; }
            if (c == '"') { inStr = !inStr; continue; }
            if (inStr) continue;
            if (c == '{') {
                if (depth == 0) start = i;
                depth++;
            } else if (c == '}') {
                depth--;
                if (depth == 0 && start != -1) {
                    string obj = json.Substring(start, i - start + 1);
                    bool matches = obj.Contains("\"referenceId\":\"" + targetRef + "\"") ||
                                  obj.Contains("\"referenceId\": \"" + targetRef + "\"") ||
                                  obj.Contains("\"id\":\"" + targetRef + "\"") ||
                                  obj.Contains("\"id\": \"" + targetRef + "\"");
                    if (matches) {
                        if (System.Text.RegularExpressions.Regex.IsMatch(obj, "\"status\"\\s*:\\s*\"[^\"]*\"")) {
                            obj = System.Text.RegularExpressions.Regex.Replace(obj, "\"status\"\\s*:\\s*\"[^\"]*\"", "\"status\":\"" + newStatus + "\"");
                        } else {
                            string trimmed = obj.TrimEnd();
                            if (trimmed.EndsWith("}")) {
                                obj = trimmed.Substring(0, trimmed.Length - 1) + ",\"status\":\"" + newStatus + "\"}";
                            }
                        }
                    }
                    list.Add(obj);
                    start = -1;
                }
            }
        }
        return "[" + string.Join(",", list.ToArray()) + "]";
    }
}
"@

[GrdServer]::Run($rootPath, $subFile, $port)
