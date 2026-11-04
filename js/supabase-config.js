/**
 * Supabase Cloud Configuration for GRD10
 * File: js/supabase-config.js
 * 
 * Paste your 2 Supabase credentials below from your Supabase Dashboard:
 * Dashboard -> Project Settings -> API
 */

window.GRD10_SUPABASE_CONFIG = {
  // 1. Project URL (e.g., 'https://xyzcompany.supabase.co')
  url: 'https://gxltomzqjkkaeltcpmos.supabase.co',

  // 2. Project Anon/Public Key (starts with 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...')
  anonKey: 'sb_publishable_evvMrp9llY7A__lylamTKg_2ne2k3iK',

  // Table names in Supabase
  tableName: 'site_content',
  nominationsTable: 'nominations'
};

/**
 * Lightweight native REST client for Supabase (no heavy npm packages or SDKs needed).
 * Works directly in vanilla JavaScript in any browser and on any hosting provider.
 */
class SupabaseClient {
  constructor(config) {
    this.config = config || window.GRD10_SUPABASE_CONFIG;
  }

  isConfigured() {
    return this.config &&
      this.config.url &&
      this.config.url !== 'YOUR_SUPABASE_URL_HERE' &&
      this.config.anonKey &&
      this.config.anonKey !== 'YOUR_SUPABASE_ANON_KEY_HERE';
  }

  getHeaders() {
    return {
      'apikey': this.config.anonKey,
      'Authorization': `Bearer ${this.config.anonKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    };
  }

  // Fetch site content JSON from Supabase
  async fetchSiteContent() {
    if (!this.isConfigured()) return null;
    try {
      const endpoint = `${this.config.url}/rest/v1/${this.config.tableName}?content_key=eq.main_config&select=content_json`;
      const resp = await fetch(endpoint, {
        method: 'GET',
        headers: this.getHeaders()
      });
      if (!resp.ok) return null;
      const rows = await resp.json();
      if (rows && rows.length > 0 && rows[0].content_json) {
        return typeof rows[0].content_json === 'string'
          ? JSON.parse(rows[0].content_json)
          : rows[0].content_json;
      }
      return null;
    } catch (e) {
      console.warn('[Supabase Sync Warning] Unable to fetch from cloud:', e);
      return null;
    }
  }

  // Save site content JSON into Supabase (Update / Upsert)
  async saveSiteContent(contentData) {
    if (!this.isConfigured()) {
      console.warn('[Supabase Sync] Not configured or missing credentials.');
      return false;
    }
    try {
      // 1. Try PATCH on existing main_config row first
      const patchEndpoint = `${this.config.url}/rest/v1/${this.config.tableName}?content_key=eq.main_config`;
      const patchResp = await fetch(patchEndpoint, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify({
          content_json: contentData,
          updated_at: new Date().toISOString()
        })
      });

      if (patchResp.ok) {
        console.log('%c[Supabase Sync] Successfully updated Supabase cloud via PATCH!', 'color: #10b981; font-weight: bold;');
        if (typeof window.showToast === 'function') {
          window.showToast('Synced to Supabase cloud database.');
        }
        return true;
      }

      // 2. Fallback to POST upsert if row didn't exist
      const endpoint = `${this.config.url}/rest/v1/${this.config.tableName}?on_conflict=content_key`;
      const payload = [{
        content_key: 'main_config',
        content_json: contentData,
        updated_at: new Date().toISOString()
      }];
      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: {
          ...this.getHeaders(),
          'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify(payload)
      });
      if (resp.ok) {
        console.log('%c[Supabase Sync] Successfully saved to Supabase cloud via POST!', 'color: #10b981; font-weight: bold;');
        if (typeof window.showToast === 'function') {
          window.showToast('Synced to Supabase cloud database.');
        }
        return true;
      } else {
        const errText = await resp.text();
        console.error('[Supabase Save Error HTTP ' + resp.status + ']:', errText);
        return false;
      }
    } catch (e) {
      console.error('[Supabase Save Error]:', e);
      return false;
    }
  }

  // Save a new nomination record into Supabase
  async saveNomination(nominationRecord) {
    if (!this.isConfigured()) return false;
    try {
      const endpoint = `${this.config.url}/rest/v1/${this.config.nominationsTable}`;
      const payload = [{
        reference_id: nominationRecord.referenceId || ('NOM-' + Date.now()),
        category: nominationRecord.category || 'General',
        nominee_name: nominationRecord.nomineeName || '',
        nominee_email: nominationRecord.nomineeEmail || '',
        nominee_phone: nominationRecord.nomineePhone || '',
        dossier_json: nominationRecord,
        status: nominationRecord.status || 'Under Review',
        created_at: new Date().toISOString()
      }];
      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload)
      });
      return resp.ok;
    } catch (e) {
      console.warn('[Supabase Nomination Save Warning]:', e);
      return false;
    }
  }
}

window.grdSupabase = new SupabaseClient();
