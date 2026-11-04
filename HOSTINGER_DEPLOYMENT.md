# Deploying GRD-10 to Hostinger

This guide explains how to deploy the **GRD-10 (Shri Ghanshyam Raj Narayan Dube Achiever Awards)** website directly to your **Hostinger** web hosting account (Shared Hosting, Cloud Hosting, or cPanel/hPanel).

---

## 📁 1. Files to Upload

Upload the entire contents of this project folder into your Hostinger website directory:
- **Standard Hostinger path:** `public_html/`

You can upload either:
1. **Via Hostinger File Manager:** Compress the folder contents into a `.zip` file, upload it into `public_html/`, and extract it.
2. **Via FTP / SFTP (FileZilla):** Connect using your Hostinger FTP credentials and drag-and-drop the files into `public_html/`.

---

## ⚙️ 2. Included Hostinger Configurations

The project is pre-configured for Hostinger out-of-the-box:

1. **`.htaccess` (Apache Configuration):**
   - Forces secure HTTPS on all visits.
   - Enables clean URL routing (e.g., `/nominate` opens `nominate.html`).
   - Protects private files (`.env`, `submissions.json`, `.git`).
   - Routes `/api/submit-nomination` to the included PHP handler `/api/submit-nomination.php`.
   - Enables GZIP compression and browser caching for fast loading speeds.

2. **`/api/submit-nomination.php` (PHP Form Handler):**
   - Automatically handles nominations submitted via `nominate.html`.
   - Secures incoming records and appends them to `submissions.json`.
   - Generates unique reference IDs (e.g., `GRD-2026-NOM-XXXXX`).

3. **`submissions.json` (Vault File):**
   - Automatically stores all nominee dossiers submitted through the website.
   - Protected from direct public downloads via `.htaccess`.

---

## 🔒 3. Admin Panel Access on Hostinger

- **URL:** `https://yourdomain.com/admin.html`
- **Default Institutional Passphrase:**
  ```text
  grd2026admin
  ```
- **Features in Admin Panel:**
  - Review, filter, approve, and export submitted nominations as CSV/JSON.
  - Edit website announcements, theme texts, and hero highlights.
  - Add or update official social media links (Instagram, YouTube, Facebook, X).
  - Change your admin password directly with cryptographically salted SHA-256 encryption.

---

## 💻 4. Running Locally

To run and preview the website locally on your computer:

```powershell
# Option A: Universal PowerShell Static Server
powershell -ExecutionPolicy Bypass -File server.ps1

# Option B: Python Simple Server
py -m http.server 8080
```
Then visit: `http://localhost:8080/index.html`

---

## ✅ Deployment Checklist

- [x] Upload files to `public_html/`.
- [x] Ensure `.htaccess` is present in `public_html/`.
- [x] Verify `https://yourdomain.com/` opens the landing page with the royal framed portrait.
- [x] Test a sample nomination on `https://yourdomain.com/nominate.html`.
- [x] Log in to `https://yourdomain.com/admin.html` using `grd2026admin`.
