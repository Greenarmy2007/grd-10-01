/**
 * GRD-10 — SHRI GHANSHYAM DUBE ACHIEVER AWARDS
 * Volunteer Admin & Content Management Controller
 * 
 * Full visual editing of:
 * - Event Settings & Annual Editions (Year, Date, Location, Tagline)
 * - Award Categories (01-10)
 * - Laureates Architecture ("The 10")
 * - Voices Video Testimonies
 * - Jury Vault Nominations & CSV Export
 * - 1-Click JSON Backup & Restore
 */

document.addEventListener('DOMContentLoaded', () => {
  initCMSPortal();
});

function initCMSPortal() {
  const loginSection = document.getElementById('cmsLoginSection');
  const dashboardSection = document.getElementById('cmsDashboardSection');
  const loginForm = document.getElementById('cmsLoginForm');
  const loginPass = document.getElementById('cmsPasswordInput');
  const loginError = document.getElementById('cmsLoginError');
  const logoutBtn = document.getElementById('cmsLogoutBtn');

  // Hardened volunteer passcode (default: grd2026)
  const ADMIN_PASS = 'grd2026';

  if (!loginForm) return;

  // Check existing session
  if (sessionStorage.getItem('grd_admin_auth') === 'true') {
    showDashboard();
  }

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (loginPass.value.trim() === ADMIN_PASS) {
      sessionStorage.setItem('grd_admin_auth', 'true');
      if (loginError) loginError.style.display = 'none';
      showDashboard();
    } else {
      if (loginError) {
        loginError.style.display = 'block';
        loginError.textContent = 'Invalid institutional passkey. Access restricted to authorized committee volunteers.';
      }
    }
  });

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem('grd_admin_auth');
      window.location.reload();
    });
  }

  function showDashboard() {
    if (loginSection) loginSection.style.display = 'none';
    if (dashboardSection) dashboardSection.style.display = 'block';
    initTabs();
    renderDashboardOverview();
    renderNominationsTable();
    initSettingsForm();
    renderCategoriesManager();
    renderAwardeesEditor();
    renderVoicesManager();
    initBackupRestore();
  }

  /* 1. TAB CONTROLLER */
  function initTabs() {
    const tabBar = document.getElementById('cmsTabBar');
    if (!tabBar) return;

    tabBar.querySelectorAll('.cms-tab-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        tabBar.querySelectorAll('.cms-tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.cms-tab-panel').forEach(p => p.classList.remove('active'));

        this.classList.add('active');
        const targetId = this.getAttribute('data-tab');
        const panel = document.getElementById(targetId);
        if (panel) panel.classList.add('active');
      });
    });
  }

  /* 2. RENDER DASHBOARD METRICS */
  function renderDashboardOverview() {
    const nominations = window.grdStore.getPrivateNominations();
    const categories = window.grdStore.getCategories();
    const edition = window.grdStore.getActiveEditionDetails();
    
    const countNomEl = document.getElementById('statTotalNominations');
    const countCatEl = document.getElementById('statTotalCategories');
    const editionEl = document.getElementById('cmsActiveEditionText');

    if (countNomEl) countNomEl.textContent = nominations.length;
    if (countCatEl) countCatEl.textContent = `${categories.length} / 10`;
    if (editionEl && edition) {
      editionEl.textContent = `Active Edition: ${edition.year} • ${edition.date}, ${edition.location}`;
    }
  }

  /* 3. SITE SETTINGS & ANNUAL EDITION EDITOR */
  function initSettingsForm() {
    const form = document.getElementById('cmsSiteSettingsForm');
    if (!form) return;

    const data = window.grdStore.getData();
    const ed = window.grdStore.getActiveEditionDetails();

    const activeEdSelect = document.getElementById('settingActiveEdition');
    const dateInput = document.getElementById('settingEventDate');
    const locInput = document.getElementById('settingEventLocation');
    const statusInput = document.getElementById('settingEventStatus');
    const themeInput = document.getElementById('settingBrandTheme');

    if (activeEdSelect) activeEdSelect.value = data.activeEdition || '2026';
    if (dateInput && ed) dateInput.value = ed.date;
    if (locInput && ed) locInput.value = ed.location;
    if (statusInput && ed) statusInput.value = ed.status;
    if (themeInput && ed) themeInput.value = ed.theme;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const newSettings = {
        activeEdition: activeEdSelect ? activeEdSelect.value : '2026',
        date: dateInput ? dateInput.value.trim() : '10 November 2026',
        location: locInput ? locInput.value.trim() : 'Mumbai, Maharashtra',
        status: statusInput ? statusInput.value.trim() : 'Nominations Open',
        theme: themeInput ? themeInput.value.trim() : 'Honouring Quiet Contributors • Celebrating a Lasting Legacy'
      };

      window.grdStore.updateSiteSettings(newSettings);
      renderDashboardOverview();
      window.showToast('Site Settings & Edition updated successfully.');
    });
  }

  /* 4. PRIVATE NOMINATIONS TABLE */
  function renderNominationsTable() {
    const tableBody = document.getElementById('nominationsTableBody');
    if (!tableBody) return;

    const nominations = window.grdStore.getPrivateNominations();
    tableBody.innerHTML = '';

    if (nominations.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align:center; padding: 2.5rem; color: rgba(245,241,232,0.5);">
            No nominations submitted yet in this session. Submissions made via the Nomination Portal will appear here securely.
          </td>
        </tr>
      `;
      return;
    }

    nominations.forEach((item, index) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-weight:600; color:#E4C97E;">${item.referenceId || 'N/A'}</td>
        <td style="color:#F5F1E8; font-weight:600;">${item.nomineeName || '—'}</td>
        <td style="color:#C8A96A;">${item.category || '—'}</td>
        <td style="color:rgba(245,241,232,0.8);">${item.cityState || '—'}</td>
        <td style="color:rgba(245,241,232,0.8);">${item.nominatorName || '—'}</td>
        <td>
          <button class="btn-sm btn-outline-gold view-nom-btn" data-index="${index}" style="padding:4px 10px; font-size:0.75rem;">View Dossier</button>
        </td>
      `;

      tr.querySelector('.view-nom-btn').addEventListener('click', () => {
        alert(
          `NOMINEE DOSSIER:\n\n` +
          `Ref: ${item.referenceId}\n` +
          `Name: ${item.nomineeName}\n` +
          `Category: ${item.category}\n` +
          `Location: ${item.cityState}\n` +
          `Organisation: ${item.organisation}\n\n` +
          `Reason for Nomination:\n${item.reason}\n\n` +
          `Key Contribution:\n${item.keyContribution}\n\n` +
          `Nominee Contact: ${item.nomineeContact}\n` +
          `Nominator: ${item.nominatorName} (${item.nominatorContact})\n` +
          `Attached Files: ${item.fileNames ? item.fileNames.join(', ') : 'None'}`
        );
      });

      tableBody.appendChild(tr);
    });
  }

  /* CSV EXPORT ENGINE */
  const exportBtn = document.getElementById('exportNominationsCsvBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const nominations = window.grdStore.getPrivateNominations();
      if (nominations.length === 0) {
        alert('No nominations available to export.');
        return;
      }

      let csv = 'Reference ID,Nominee Name,Category,Organisation,City/State,Reason,Contribution,Nominee Contact,Nominator,Nominator Contact,Date\n';
      nominations.forEach(n => {
        const row = [
          `"${n.referenceId || ''}"`,
          `"${(n.nomineeName || '').replace(/"/g, '""')}"`,
          `"${(n.category || '').replace(/"/g, '""')}"`,
          `"${(n.organisation || '').replace(/"/g, '""')}"`,
          `"${(n.cityState || '').replace(/"/g, '""')}"`,
          `"${(n.reason || '').replace(/"/g, '""')}"`,
          `"${(n.keyContribution || '').replace(/"/g, '""')}"`,
          `"${(n.nomineeContact || '').replace(/"/g, '""')}"`,
          `"${(n.nominatorName || '').replace(/"/g, '""')}"`,
          `"${(n.nominatorContact || '').replace(/"/g, '""')}"`,
          `"${n.submittedAt || ''}"`
        ];
        csv += row.join(',') + '\n';
      });

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `GRD10_Nominations_Confidential_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  /* 5. CATEGORIES MANAGER */
  function renderCategoriesManager() {
    const catListEl = document.getElementById('cmsCategoriesList');
    if (!catListEl) return;

    const data = window.grdStore.getData();
    catListEl.innerHTML = '';

    data.categories.forEach((cat) => {
      const card = document.createElement('div');
      card.style.cssText = 'padding:14px 18px; background:#0b1726; border:1px solid rgba(200,169,106,0.2); border-radius:2px; display:flex; justify-content:space-between; align-items:flex-start; gap:10px;';
      card.innerHTML = `
        <div style="flex-grow:1;">
          <span style="font-family:'Playfair Display',serif; font-size:1.1rem; color:#C8A96A; font-weight:700; margin-right:8px;">${cat.number}</span>
          <strong style="color:#F5F1E8; font-size:0.95rem;">${cat.name}</strong>
          <span style="display:inline-block; margin-left:10px; font-size:0.7rem; color:#E4C97E; border:1px solid rgba(200,169,106,0.3); padding:2px 6px;">${cat.status}</span>
          <p style="font-size:0.8rem; color:rgba(245,241,232,0.6); margin-top:4px; margin-bottom:0;">${cat.description}</p>
        </div>
        <div style="display:flex; gap:6px;">
          <button class="btn-sm btn-outline-white edit-cat-btn" style="padding:4px 8px; font-size:0.7rem;">Edit</button>
          <button class="btn-sm btn-outline-gold del-cat-btn" style="padding:4px 8px; font-size:0.7rem; color:#ff8b8b; border-color:rgba(255,0,0,0.3);">&times;</button>
        </div>
      `;

      card.querySelector('.edit-cat-btn').addEventListener('click', () => {
        const newName = prompt('Edit Category Name:', cat.name);
        if (newName) {
          const newDesc = prompt('Edit Category Description:', cat.description) || cat.description;
          window.grdStore.updateCategory(cat.id, { name: newName, description: newDesc });
          renderCategoriesManager();
          window.showToast(`Category ${cat.number} updated.`);
        }
      });

      card.querySelector('.del-cat-btn').addEventListener('click', () => {
        if (confirm(`Remove category "${cat.name}"?`)) {
          window.grdStore.deleteCategory(cat.id);
          renderCategoriesManager();
          renderDashboardOverview();
          window.showToast(`Category removed.`);
        }
      });

      catListEl.appendChild(card);
    });
  }

  /* ADD NEW APPROVED CATEGORY HANDLER */
  const addCategoryForm = document.getElementById('cmsAddCategoryForm');
  if (addCategoryForm) {
    addCategoryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const catNum = document.getElementById('newCatNum')?.value.trim();
      const catName = document.getElementById('newCatName')?.value.trim();
      const catDesc = document.getElementById('newCatDesc')?.value.trim();

      if (!catNum || !catName || !catDesc) return;

      const slug = catName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      
      window.grdStore.addCategory({
        id: `cat-${catNum}`,
        number: catNum.padStart(2, '0'),
        slug: slug,
        name: catName,
        description: catDesc,
        status: "Approved",
        active: true,
        edition: "2026",
        nominationCount: 0,
        criteria: "Approved by Selection Committee."
      });

      addCategoryForm.reset();
      renderCategoriesManager();
      renderDashboardOverview();
      window.showToast(`Category ${catNum} — ${catName} officially activated.`);
    });
  }

  /* 6. AWARDEES ("THE 10") EDITOR */
  function renderAwardeesEditor() {
    const container = document.getElementById('cmsAwardeesEditContainer');
    if (!container) return;

    const data = window.grdStore.getData();
    container.innerHTML = '';

    data.awardees.forEach(a => {
      const card = document.createElement('div');
      card.style.cssText = 'padding:18px 22px; background:#0b1726; border:1px solid rgba(200,169,106,0.25); border-radius:2px;';
      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <div>
            <span style="font-family:'Playfair Display',serif; font-size:1.2rem; color:#C8A96A; font-weight:700;">#${a.number}</span>
            <strong style="color:#F5F1E8; font-size:1.1rem; margin-left:8px;">${a.name}</strong>
            <span style="color:var(--color-champagne-gold); font-size:0.8rem; margin-left:10px;">[${a.categoryName}]</span>
          </div>
          <span style="font-size:0.75rem; color:${a.isPlaceholder ? '#E4C97E' : '#69d27a'};">${a.isPlaceholder ? 'Placeholder Active' : 'Confirmed Laureate'}</span>
        </div>
        <p style="font-size:0.85rem; color:rgba(245,241,232,0.7); margin-bottom:12px;"><strong>Citation:</strong> ${a.shortBio}</p>
        <button class="btn btn-outline-gold edit-awardee-btn" style="font-size:0.75rem; padding:0.4rem 0.9rem;">
          Edit Laureate Profile
        </button>
      `;

      card.querySelector('.edit-awardee-btn').addEventListener('click', () => {
        const newName = prompt(`Enter Laureate Name for #${a.number}:`, a.name);
        if (newName !== null) {
          const newBio = prompt('Enter Short Biography / Citation:', a.shortBio) || a.shortBio;
          const newStory = prompt('Enter Full Story / Background:', a.theirStory) || a.theirStory;
          const newContrib = prompt('Enter Their Key Contribution:', a.theirContribution) || a.theirContribution;
          const newWhy = prompt('Enter Why They Were Chosen:', a.whyChosen) || a.whyChosen;

          window.grdStore.updateAwardee(a.id, {
            name: newName,
            isPlaceholder: false,
            shortBio: newBio,
            theirStory: newStory,
            theirContribution: newContrib,
            whyChosen: newWhy
          });

          renderAwardeesEditor();
          window.showToast(`Laureate #${a.number} updated.`);
        }
      });

      container.appendChild(card);
    });
  }

  /* 7. VOICES & VIDEOS MANAGER */
  function renderVoicesManager() {
    const listEl = document.getElementById('cmsVoicesList');
    if (!listEl) return;

    const data = window.grdStore.getData();
    listEl.innerHTML = '';

    data.voices.forEach(v => {
      const card = document.createElement('div');
      card.style.cssText = 'padding:14px 18px; background:#0b1726; border:1px solid rgba(200,169,106,0.2); border-radius:2px; display:flex; justify-content:space-between; align-items:flex-start; gap:10px;';
      card.innerHTML = `
        <div>
          <strong style="color:#F5F1E8; font-size:0.95rem;">${v.name}</strong>
          <span style="font-size:0.75rem; color:#C8A96A; margin-left:8px;">(${v.role})</span>
          <div style="font-size:0.72rem; color:rgba(245,241,232,0.5); margin-top:2px;">Circle: ${v.group} | Duration: ${v.duration}</div>
          <p style="font-size:0.82rem; color:rgba(245,241,232,0.7); margin-top:4px; margin-bottom:0;">${v.excerpt}</p>
        </div>
        <button class="del-voice-btn" style="color:#ff8b8b; font-size:1.1rem; line-height:1; padding:4px;" title="Delete message">&times;</button>
      `;

      card.querySelector('.del-voice-btn').addEventListener('click', () => {
        if (confirm(`Remove testimony from ${v.name}?`)) {
          window.grdStore.deleteVoice(v.id);
          renderVoicesManager();
          window.showToast('Testimony removed.');
        }
      });

      listEl.appendChild(card);
    });

    const addVoiceForm = document.getElementById('cmsAddVoiceForm');
    if (addVoiceForm) {
      addVoiceForm.onsubmit = (e) => {
        e.preventDefault();
        const name = document.getElementById('voiceSpeakerName')?.value.trim();
        const role = document.getElementById('voiceSpeakerRole')?.value.trim();
        const groupKey = document.getElementById('voiceGroupKey')?.value;
        const videoUrl = document.getElementById('voiceVideoUrl')?.value.trim();
        const excerpt = document.getElementById('voiceExcerpt')?.value.trim();

        if (!name || !videoUrl) return;

        const groupLabels = {
          remembering: 'Remembering Ghanshyam Dube',
          supporting: 'Supporting GRD-10',
          circle: 'The GRD-10 Circle'
        };

        window.grdStore.addVoice({
          id: 'voice-' + Date.now(),
          name,
          role,
          group: groupLabels[groupKey] || 'The GRD-10 Circle',
          groupKey,
          duration: '01:30',
          videoUrl,
          excerpt,
          photo: 'assets/images/shri-ghanshyam-dube-portrait.svg',
          edition: '2026'
        });

        addVoiceForm.reset();
        renderVoicesManager();
        window.showToast(`Testimony from ${name} added.`);
      };
    }
  }

  /* 8. 1-CLICK BACKUP & RESTORE (JSON) */
  function initBackupRestore() {
    const downloadBtn = document.getElementById('cmsDownloadJsonBtn');
    const restoreInput = document.getElementById('cmsRestoreFileInput');
    const applyRestoreBtn = document.getElementById('cmsApplyRestoreBtn');

    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        const json = window.grdStore.exportDataJSON();
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `GRD10_Website_Backup_${new Date().toISOString().slice(0,10)}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.showToast('Full site JSON backup downloaded.');
      });
    }

    if (applyRestoreBtn && restoreInput) {
      applyRestoreBtn.addEventListener('click', () => {
        const file = restoreInput.files[0];
        if (!file) {
          alert('Please select a .json backup file first.');
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          const result = window.grdStore.importDataJSON(e.target.result);
          if (result.success) {
            alert('Site data restored successfully! The page will now reload.');
            window.location.reload();
          } else {
            alert('Restore failed: ' + result.error);
          }
        };
        reader.readAsText(file);
      });
    }
  }
}
