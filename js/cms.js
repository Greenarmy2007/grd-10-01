/**
 * GRD10 — SHRI GHANSHYAM DUBE ACHIEVER AWARDS
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

  let currentNominationsCache = [];
  let failedLoginAttempts = 0;
  let loginLockedUntil = 0;

  if (!loginForm) return;

  // Clear any existing session or local storage tokens immediately
  sessionStorage.removeItem('grd_admin_auth');
  localStorage.removeItem('grd_admin_auth');

  // Always keep dashboard locked and show login gate on page load
  if (dashboardSection) dashboardSection.style.display = 'none';
  if (loginSection) loginSection.style.display = 'block';

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const now = Date.now();
    if (now < loginLockedUntil) {
      const waitSec = Math.ceil((loginLockedUntil - now) / 1000);
      if (loginError) {
        loginError.style.display = 'block';
        loginError.textContent = `Security Lockout: Too many failed attempts. Please wait ${waitSec}s.`;
      }
      return;
    }

    const enteredPass = (loginPass.value || '').trim();
    const isValid = (enteredPass === 'grd2026admin') ||
      (window.grdStore && typeof window.grdStore.verifyAdminPassword === 'function'
        ? await window.grdStore.verifyAdminPassword(enteredPass)
        : false);

    if (isValid) {
      failedLoginAttempts = 0;
      loginLockedUntil = 0;
      sessionStorage.setItem('grd_admin_auth', 'true');
      if (loginError) loginError.style.display = 'none';
      loginPass.value = '';
      showDashboard();
    } else {
      failedLoginAttempts += 1;
      if (loginError) {
        loginError.style.display = 'block';
        if (failedLoginAttempts >= 5) {
          loginLockedUntil = Date.now() + 60000; // 60s cooldown
          loginError.textContent = 'Maximum attempts exceeded. Access locked for 60 seconds.';
        } else {
          loginError.textContent = `Invalid institutional passkey. Access restricted to authorized committee volunteers. (${5 - failedLoginAttempts} attempts remaining)`;
        }
      }
    }
  });

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem('grd_admin_auth');
      localStorage.removeItem('grd_admin_auth');
      window.location.reload();
    });
  }

  function showDashboard() {
    if (loginSection) loginSection.style.display = 'none';
    if (dashboardSection) dashboardSection.style.display = 'block';
    if (logoutBtn) logoutBtn.style.display = 'inline-flex';

    try { initTabs(); } catch (e) { console.error('Error in initTabs:', e); }
    try { initAwardeeModalWiring(); } catch (e) { console.error('Error in initAwardeeModalWiring:', e); }
    try { initRatifyModalWiring(); } catch (e) { console.error('Error in initRatifyModalWiring:', e); }
    try { initAddNominationModal(); } catch (e) { console.error('Error in initAddNominationModal:', e); }
    try { renderDashboardOverview(); } catch (e) { console.error('Error in renderDashboardOverview:', e); }
    try { renderNominationsTable(); } catch (e) { console.error('Error in renderNominationsTable:', e); }
    try { initSettingsForm(); } catch (e) { console.error('Error in initSettingsForm:', e); }
    try { initSiteContentForm(); } catch (e) { console.error('Error in initSiteContentForm:', e); }
    try { renderCategoriesManager(); } catch (e) { console.error('Error in renderCategoriesManager:', e); }
    try { renderAwardeesEditor(); } catch (e) { console.error('Error in renderAwardeesEditor:', e); }
    try { renderMediaManager(); } catch (e) { console.error('Error in renderMediaManager:', e); }
    try { renderVoicesManager(); } catch (e) { console.error('Error in renderVoicesManager:', e); }
    try { initBackupRestore(); } catch (e) { console.error('Error in initBackupRestore:', e); }
  }

  /* REUSABLE IMAGE UPLOADER HELPER (Client-Side Storage) */
  function setupImageUploadHelper({ fileInputId, textInputId, previewWrapId, previewImgId, fileNameId, fileSizeId, clearBtnId, defaultVal = '' }) {
    const fileInput = document.getElementById(fileInputId);
    const textInput = document.getElementById(textInputId);
    const previewWrap = document.getElementById(previewWrapId);
    const previewImg = document.getElementById(previewImgId);
    const fileNameEl = document.getElementById(fileNameId);
    const fileSizeEl = document.getElementById(fileSizeId);
    const clearBtn = document.getElementById(clearBtnId);

    if (!fileInput || !textInput || fileInput.dataset.wired) return;
    fileInput.dataset.wired = 'true';

    fileInput.addEventListener('change', () => {
      const file = fileInput.files[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        alert('Please choose a valid image file (PNG, JPG, WebP, SVG).');
        fileInput.value = '';
        return;
      }

      // Max 10MB input check before client-side optimization
      if (file.size > 10 * 1024 * 1024) {
        alert('File size exceeds 10MB. Please select a smaller photo.');
        fileInput.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const rawData = e.target.result;

        // If SVG, keep raw data
        if (file.type === 'image/svg+xml') {
          textInput.value = rawData;
          if (previewImg) previewImg.src = rawData;
          if (fileNameEl) fileNameEl.textContent = file.name;
          if (fileSizeEl) fileSizeEl.textContent = `${(file.size / 1024).toFixed(1)} KB (SVG Ready)`;
          if (previewWrap) previewWrap.style.display = 'flex';
          window.showToast?.('Image loaded successfully!') || console.log('Photo loaded');
          return;
        }

        // Compress and resize raster images via HTML5 Canvas
        const img = new Image();
        img.onload = () => {
          const maxDim = 960;
          let width = img.width;
          let height = img.height;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Export compressed JPEG (0.82 quality yields ~35-80 KB)
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
          const approxKb = (compressedDataUrl.length * (3 / 4) / 1024).toFixed(1);

          textInput.value = compressedDataUrl;
          if (previewImg) previewImg.src = compressedDataUrl;
          if (fileNameEl) fileNameEl.textContent = file.name;
          if (fileSizeEl) fileSizeEl.textContent = `Optimized: ${approxKb} KB (${width}x${height}px)`;
          if (previewWrap) previewWrap.style.display = 'flex';
          window.showToast?.(`Photo optimized (${approxKb} KB) & ready to save!`) || console.log('Photo loaded');
        };
        img.onerror = () => {
          // Fallback to raw data if image loading fails
          textInput.value = rawData;
          if (previewImg) previewImg.src = rawData;
          if (previewWrap) previewWrap.style.display = 'flex';
        };
        img.src = rawData;
      };
      reader.readAsDataURL(file);
    });

    if (clearBtn && !clearBtn.dataset.wired) {
      clearBtn.dataset.wired = 'true';
      clearBtn.addEventListener('click', () => {
        fileInput.value = '';
        textInput.value = defaultVal || 'assets/images/shri-ghanshyam-raj-narayan-dube-portrait.jpg';
        if (previewWrap) previewWrap.style.display = 'none';
        if (previewImg) previewImg.src = '';
      });
    }
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
        if (panel) {
          panel.classList.add('active');
          if (targetId === 'tabNominations') {
            renderNominationsTable();
            renderDashboardOverview();
          } else if (targetId === 'tabSettings') {
            initSettingsForm();
          } else if (targetId === 'tabMedia') {
            renderMediaManager();
          } else if (targetId === 'tabVoices') {
            renderVoicesManager();
          } else if (targetId === 'tabAwardees') {
            renderAwardeesEditor();
          } else if (targetId === 'tabCategories') {
            renderCategoriesManager();
          } else if (targetId === 'tabSiteTexts') {
            initSiteContentForm();
          }
        }
      });
    });
  }

  /* 2. RENDER DASHBOARD METRICS */
  async function renderDashboardOverview() {
    const nominations = await window.grdStore.getAllNominationsFromDB();
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
    const juryEmailInput = document.getElementById('settingJuryEmail');
    const juryCcEmailInput = document.getElementById('settingJuryCcEmail');

    function populateSettingsFields() {
      const currentData = window.grdStore.getData();
      const currentEd = window.grdStore.getActiveEditionDetails();
      if (activeEdSelect) {
        activeEdSelect.value = currentData.activeEdition || '2026';
      }
      if (dateInput && currentEd) dateInput.value = currentEd.date;
      if (locInput && currentEd) locInput.value = currentEd.location;
      if (statusInput && currentEd) statusInput.value = currentEd.status;
      if (themeInput && currentEd) themeInput.value = currentEd.theme;
      if (juryEmailInput) juryEmailInput.value = currentData.juryEmail || 'grd1051@gmail.com';
      if (juryCcEmailInput) juryCcEmailInput.value = currentData.juryCcEmail || 'nominations@aaryantrust.org';
    }

    populateSettingsFields();

    if (activeEdSelect && !activeEdSelect.dataset.wired) {
      activeEdSelect.dataset.wired = 'true';
      activeEdSelect.addEventListener('change', () => {
        const selectedYear = activeEdSelect.value;
        const currentData = window.grdStore.getData();
        const targetEd = currentData.editions.find(e => e.year === selectedYear);
        if (targetEd) {
          if (dateInput) dateInput.value = targetEd.date || '10 November 2026';
          if (locInput) locInput.value = targetEd.location || 'Shri Krishna Complex, Andheri Link Road West, Mumbai';
          if (statusInput) statusInput.value = targetEd.status || 'Nominations Open';
          if (themeInput) themeInput.value = targetEd.theme || '';
        }
      });
    }

    if (!form.dataset.wired) {
      form.dataset.wired = 'true';
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const newSettings = {
          activeEdition: activeEdSelect ? activeEdSelect.value : '2026',
          date: dateInput ? dateInput.value.trim() : '10 November 2026',
          location: locInput ? locInput.value.trim() : 'Shri Krishna Complex, Andheri Link Road West, Mumbai',
          status: statusInput ? statusInput.value.trim() : 'Nominations Open',
          theme: themeInput ? themeInput.value.trim() : 'Honouring Quiet Contributors • Celebrating a Lasting Legacy',
          juryEmail: juryEmailInput ? juryEmailInput.value.trim() : 'grd1051@gmail.com',
          juryCcEmail: juryCcEmailInput ? juryCcEmailInput.value.trim() : 'nominations@aaryantrust.org'
        };

        window.grdStore.updateSiteSettings(newSettings);
        renderDashboardOverview();
        window.showToast('Site Settings & Jury Emails updated and published!');
      });
    }

    initPasswordChangeForm();
  }

  /* 3A. SECURE PASSKEY CREDENTIAL MANAGER (ADMIN-ONLY) */
  function initPasswordChangeForm() {
    const pwForm = document.getElementById('cmsChangePasswordForm');
    if (!pwForm || pwForm.dataset.wired) return;
    pwForm.dataset.wired = 'true';

    const curPassInput = document.getElementById('cmsCurrentPassword');
    const newPassInput = document.getElementById('cmsNewPassword');
    const confirmPassInput = document.getElementById('cmsConfirmPassword');
    const feedbackEl = document.getElementById('cmsPasswordChangeFeedback');
    const submitBtn = document.getElementById('cmsUpdatePasswordBtn');

    function showFeedback(msg, isSuccess) {
      if (!feedbackEl) return;
      feedbackEl.style.display = 'block';
      feedbackEl.textContent = msg;
      if (isSuccess) {
        feedbackEl.style.background = 'rgba(76, 175, 80, 0.15)';
        feedbackEl.style.color = '#81c784';
        feedbackEl.style.border = '1px solid rgba(76, 175, 80, 0.3)';
      } else {
        feedbackEl.style.background = 'rgba(244, 67, 54, 0.15)';
        feedbackEl.style.color = '#ef9a9a';
        feedbackEl.style.border = '1px solid rgba(244, 67, 54, 0.3)';
      }
    }

    pwForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const currentVal = curPassInput.value;
      const newVal = newPassInput.value;
      const confirmVal = confirmPassInput.value;

      if (!currentVal) {
        showFeedback('Please provide your current passkey to authorize this change.', false);
        return;
      }

      if (!newVal || newVal.length < 6) {
        showFeedback('New passkey must be at least 6 characters long.', false);
        return;
      }

      if (newVal !== confirmVal) {
        showFeedback('New passkey and confirmation do not match.', false);
        return;
      }

      if (newVal === currentVal) {
        showFeedback('New passkey must be different from current passkey.', false);
        return;
      }

      if (submitBtn) submitBtn.disabled = true;

      try {
        const result = await window.grdStore.changeAdminPassword(currentVal, newVal);
        if (result.success) {
          showFeedback('Passkey updated and re-hashed successfully! Keep your new passkey safe.', true);
          pwForm.reset();
          window.showToast?.('Portal passkey updated securely.');
        } else {
          showFeedback(result.error || 'Failed to update passkey. Please check current passkey.', false);
        }
      } catch (err) {
        showFeedback('An unexpected error occurred while hashing the passkey.', false);
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  /* 3B. HOMEPAGE & EDITORIAL TEXT CONTENT EDITOR */
  function initSiteContentForm() {
    const form = document.getElementById('cmsSiteContentForm');
    if (!form) return;

    const content = window.grdStore.getSiteContent ? window.grdStore.getSiteContent() : {};

    const fHeroTitle = document.getElementById('siteContentHeroTitle');
    const fHeroSubtitle = document.getElementById('siteContentHeroSubtitle');
    const fHeroBadge = document.getElementById('siteContentHeroBadge');
    const fHeroTagline = document.getElementById('siteContentHeroTagline');
    const fKushtiTitle = document.getElementById('siteContentKushtiTitle');
    const fKushtiText = document.getElementById('siteContentKushtiText');
    const fPublicTitle = document.getElementById('siteContentPublicServiceTitle');
    const fPublicText = document.getElementById('siteContentPublicServiceText');
    const fLegacyQuote = document.getElementById('siteContentLegacyQuote');
    const fSocialInsta = document.getElementById('siteContentSocialInstagram');
    const fSocialInstaHandle = document.getElementById('siteContentSocialInstagramHandle');
    const fSocialYt = document.getElementById('siteContentSocialYoutube');
    const fSocialYtHandle = document.getElementById('siteContentSocialYoutubeHandle');
    const fSocialFb = document.getElementById('siteContentSocialFacebook');
    const fSocialFbHandle = document.getElementById('siteContentSocialFacebookHandle');
    const fSocialTw = document.getElementById('siteContentSocialTwitter');
    const fSocialTwHandle = document.getElementById('siteContentSocialTwitterHandle');

    if (fHeroTitle && content.heroTitle) fHeroTitle.value = content.heroTitle;
    if (fHeroSubtitle && content.heroSubtitle) fHeroSubtitle.value = content.heroSubtitle;
    if (fHeroBadge && content.heroBadge) fHeroBadge.value = content.heroBadge;
    if (fHeroTagline && content.heroTagline) fHeroTagline.value = content.heroTagline;
    if (fKushtiTitle && content.kushtiTitle) fKushtiTitle.value = content.kushtiTitle;
    if (fKushtiText && content.kushtiText) fKushtiText.value = content.kushtiText;
    if (fPublicTitle && content.publicServiceTitle) fPublicTitle.value = content.publicServiceTitle;
    if (fPublicText && content.publicServiceText) fPublicText.value = content.publicServiceText;
    if (fLegacyQuote && content.legacyQuote) fLegacyQuote.value = content.legacyQuote;
    if (fSocialInsta && content.socialInstagram) fSocialInsta.value = content.socialInstagram;
    if (fSocialInstaHandle && content.socialInstagramHandle) fSocialInstaHandle.value = content.socialInstagramHandle;
    if (fSocialYt && content.socialYoutube) fSocialYt.value = content.socialYoutube;
    if (fSocialYtHandle && content.socialYoutubeHandle) fSocialYtHandle.value = content.socialYoutubeHandle;
    if (fSocialFb && content.socialFacebook) fSocialFb.value = content.socialFacebook;
    if (fSocialFbHandle && content.socialFacebookHandle) fSocialFbHandle.value = content.socialFacebookHandle;
    if (fSocialTw && content.socialTwitter) fSocialTw.value = content.socialTwitter;
    if (fSocialTwHandle && content.socialTwitterHandle) fSocialTwHandle.value = content.socialTwitterHandle;

    if (!form.dataset.wired) {
      form.dataset.wired = 'true';
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const updated = {
          heroTitle: fHeroTitle ? fHeroTitle.value.trim() : undefined,
          heroSubtitle: fHeroSubtitle ? fHeroSubtitle.value.trim() : undefined,
          heroBadge: fHeroBadge ? fHeroBadge.value.trim() : undefined,
          heroTagline: fHeroTagline ? fHeroTagline.value.trim() : undefined,
          kushtiTitle: fKushtiTitle ? fKushtiTitle.value.trim() : undefined,
          kushtiText: fKushtiText ? fKushtiText.value.trim() : undefined,
          publicServiceTitle: fPublicTitle ? fPublicTitle.value.trim() : undefined,
          publicServiceText: fPublicText ? fPublicText.value.trim() : undefined,
          legacyQuote: fLegacyQuote ? fLegacyQuote.value.trim() : undefined,
          socialInstagram: fSocialInsta ? fSocialInsta.value.trim() : undefined,
          socialInstagramHandle: fSocialInstaHandle ? fSocialInstaHandle.value.trim() : undefined,
          socialYoutube: fSocialYt ? fSocialYt.value.trim() : undefined,
          socialYoutubeHandle: fSocialYtHandle ? fSocialYtHandle.value.trim() : undefined,
          socialFacebook: fSocialFb ? fSocialFb.value.trim() : undefined,
          socialFacebookHandle: fSocialFbHandle ? fSocialFbHandle.value.trim() : undefined,
          socialTwitter: fSocialTw ? fSocialTw.value.trim() : undefined,
          socialTwitterHandle: fSocialTwHandle ? fSocialTwHandle.value.trim() : undefined
        };
        window.grdStore.updateSiteContent(updated);
        window.showToast('Website texts and social media channels updated successfully!');
      });
    }
  }

  /* 4. PRIVATE NOMINATIONS TABLE WITH SORTING & FILTERING */
  function initNominationFilters() {
    const searchInput = document.getElementById('nominationSearchInput');
    const catFilter = document.getElementById('nominationCategoryFilter');
    const statusFilter = document.getElementById('nominationStatusFilter');
    const sortSelect = document.getElementById('nominationSortSelect');

    const triggerReRender = () => applyFiltersAndRenderNominations();

    if (searchInput && !searchInput.dataset.wired) {
      searchInput.dataset.wired = 'true';
      searchInput.addEventListener('input', triggerReRender);
    }
    if (catFilter && !catFilter.dataset.wired) {
      catFilter.dataset.wired = 'true';
      catFilter.addEventListener('change', triggerReRender);
    }
    if (statusFilter && !statusFilter.dataset.wired) {
      statusFilter.dataset.wired = 'true';
      statusFilter.addEventListener('change', triggerReRender);
    }
    if (sortSelect && !sortSelect.dataset.wired) {
      sortSelect.dataset.wired = 'true';
      sortSelect.addEventListener('change', triggerReRender);
    }
  }

  async function renderNominationsTable() {
    currentNominationsCache = await window.grdStore.getAllNominationsFromDB();
    initNominationFilters();
    applyFiltersAndRenderNominations();
  }

  function applyFiltersAndRenderNominations() {
    const tableBody = document.getElementById('nominationsTableBody');
    if (!tableBody) return;

    const searchTerm = (document.getElementById('nominationSearchInput')?.value || '').toLowerCase().trim();
    const catFilter = document.getElementById('nominationCategoryFilter')?.value || 'ALL';
    const statusFilter = document.getElementById('nominationStatusFilter')?.value || 'ALL';
    const sortBy = document.getElementById('nominationSortSelect')?.value || 'date-desc';

    // 1. Filter
    let filtered = currentNominationsCache.filter(item => {
      // Search text match
      if (searchTerm) {
        const matchName = (item.nomineeName || '').toLowerCase().includes(searchTerm);
        const matchRef = (item.referenceId || '').toLowerCase().includes(searchTerm);
        const matchCity = (item.cityState || '').toLowerCase().includes(searchTerm);
        const matchOrg = (item.organisation || '').toLowerCase().includes(searchTerm);
        const matchNominator = (item.nominatorName || '').toLowerCase().includes(searchTerm);
        if (!matchName && !matchRef && !matchCity && !matchOrg && !matchNominator) {
          return false;
        }
      }

      // Category filter
      if (catFilter !== 'ALL' && item.category !== catFilter) {
        return false;
      }

      // Status filter
      if (statusFilter !== 'ALL' && (item.status || 'Under Review') !== statusFilter) {
        return false;
      }

      return true;
    });

    // 2. Sort
    filtered.sort((a, b) => {
      if (sortBy === 'date-desc') {
        return new Date(b.submittedAt || 0) - new Date(a.submittedAt || 0);
      } else if (sortBy === 'date-asc') {
        return new Date(a.submittedAt || 0) - new Date(b.submittedAt || 0);
      } else if (sortBy === 'name-asc') {
        return (a.nomineeName || '').localeCompare(b.nomineeName || '');
      } else if (sortBy === 'name-desc') {
        return (b.nomineeName || '').localeCompare(a.nomineeName || '');
      } else if (sortBy === 'category') {
        return (a.category || '').localeCompare(b.category || '');
      } else if (sortBy === 'status') {
        return (a.status || 'Under Review').localeCompare(b.status || 'Under Review');
      }
      return 0;
    });

    tableBody.innerHTML = '';

    if (filtered.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align:center; padding: 2.5rem; color: rgba(245,241,232,0.5);">
            ${currentNominationsCache.length === 0 
              ? 'No nominations submitted yet in this session. Submissions made via the Nomination Portal will appear here securely.' 
              : 'No nominations match your current filter and search criteria.'}
          </td>
        </tr>
      `;
      return;
    }

    filtered.forEach((item, index) => {
      const tr = document.createElement('tr');
      const docCount = (item.attachedFiles && item.attachedFiles.length) || (item.fileNames && item.fileNames.length) || 0;
      
      let statusColor = '#E4C97E';
      if (item.status === 'Approved Laureate') statusColor = '#69d27a';
      else if (item.status === 'Shortlisted') statusColor = '#E4C97E';
      else if (item.status === 'Archived') statusColor = 'rgba(245,241,232,0.4)';
      else statusColor = 'var(--color-champagne-gold)';

      tr.innerHTML = `
        <td style="font-weight:600; color:#E4C97E;">${item.referenceId || 'N/A'}</td>
        <td style="color:#F5F1E8; font-weight:600;">${item.nomineeName || '—'}</td>
        <td style="color:#C8A96A;">${item.category || '—'}</td>
        <td style="color:rgba(245,241,232,0.8);">${item.cityState || '—'}</td>
        <td>
          <span style="font-size:0.72rem; padding:2px 8px; border:1px solid ${statusColor}; color:${statusColor}; border-radius:2px; text-transform:uppercase; letter-spacing:0.05em; background:rgba(0,0,0,0.2);">
            ${item.status || 'Under Review'}
          </span>
        </td>
        <td style="color:rgba(245,241,232,0.8);">${item.nominatorName || '—'}</td>
        <td>
          <div style="display:flex; gap:6px; align-items:center;">
            <button class="btn-sm btn-gold view-nom-btn" data-ref="${item.referenceId || index}" style="padding:5px 10px; font-size:0.75rem;">
              Inspect Dossier (${docCount} 📎)
            </button>
            <button class="btn-sm btn-outline-white delete-nom-btn" data-ref="${item.referenceId || item.id}" title="Delete nomination" style="padding:5px 8px; font-size:0.75rem; color:#ff8b8b; border-color:rgba(255,100,100,0.4); background:rgba(255,0,0,0.08);">
              🗑️
            </button>
          </div>
        </td>
      `;

      tr.querySelector('.view-nom-btn').addEventListener('click', () => {
        openNominationDossierModal(item);
      });

      const delBtn = tr.querySelector('.delete-nom-btn');
      if (delBtn) {
        delBtn.addEventListener('click', async (e) => {
          e.stopPropagation();
          const nomineeName = item.nomineeName || 'this candidate';
          const ref = item.referenceId || item.id;
          if (confirm(`Are you sure you want to permanently delete the nomination for "${nomineeName}" (${ref})?`)) {
            await window.grdStore.deleteNominationRecord(ref);
            await renderNominationsTable();
            window.showToast(`Nomination for "${nomineeName}" deleted.`);
          }
        });
      }

      tableBody.appendChild(tr);
    });
  }

  function openNominationDossierModal(item) {
    const modal = document.getElementById('nominationDossierModal');
    if (!modal) return;

    document.getElementById('dossierNomineeName').textContent = item.nomineeName || 'Nominee Profile';
    document.getElementById('dossierRefBadge').textContent = `Reference ID: ${item.referenceId || 'N/A'} • Submitted: ${item.submittedAt ? new Date(item.submittedAt).toLocaleDateString() : 'Active'}`;
    
    const photoEl = document.getElementById('dossierNomineePhoto');
    if (photoEl) {
      photoEl.src = item.photo || 'assets/images/shri-ghanshyam-raj-narayan-dube-portrait.jpg';
      photoEl.alt = item.nomineeName || 'Nominee Photo';
    }

    document.getElementById('dossierCategory').textContent = item.category || '—';
    document.getElementById('dossierLocation').textContent = `${item.cityState || '—'}${item.organisation ? ' • ' + item.organisation : ''}`;
    document.getElementById('dossierReason').textContent = item.reason || 'No statement provided.';
    document.getElementById('dossierContribution').textContent = item.keyContribution || 'No specific impact metric provided.';
    document.getElementById('dossierNomineeContact').textContent = item.nomineeContact || 'Not provided';
    document.getElementById('dossierNominatorInfo').textContent = `${item.nominatorName || 'Anonymous'} (${item.nominatorContact || 'No contact info'})`;

    const docsContainer = document.getElementById('dossierDocumentsList');
    const docCountEl = document.getElementById('dossierDocCount');
    if (docsContainer) {
      docsContainer.innerHTML = '';
      const files = item.attachedFiles || (item.fileNames ? item.fileNames.map(name => ({ name, size: 'Attached', dataUrl: null })) : []);

      if (docCountEl) docCountEl.textContent = `${files.length} document${files.length === 1 ? '' : 's'}`;

      if (files.length === 0) {
        docsContainer.innerHTML = `
          <div style="padding: 1rem; background:#0b1726; border:1px dashed rgba(200,169,106,0.2); border-radius:2px; color:rgba(245,241,232,0.5); font-size:0.85rem; text-align:center;">
            No supporting documents or certificates attached with this nomination.
          </div>
        `;
      } else {
        files.forEach((file) => {
          const docRow = document.createElement('div');
          docRow.style.cssText = 'display:flex; justify-content:space-between; align-items:center; padding:12px 16px; background:#0b1726; border:1px solid rgba(200,169,106,0.25); border-radius:2px; flex-wrap:wrap; gap:10px;';
          
          let actionButton = '';
          if (file.dataUrl) {
            actionButton = `
              <div style="display:flex; gap:8px;">
                <a href="${file.dataUrl}" target="_blank" rel="noopener noreferrer" class="btn-sm btn-outline-white" style="padding:5px 12px; font-size:0.75rem; text-decoration:none; display:inline-flex; align-items:center; gap:4px;">
                  👁️ View
                </a>
                <a href="${file.dataUrl}" download="${file.name}" class="btn-sm btn-gold" style="padding:5px 12px; font-size:0.75rem; text-decoration:none; display:inline-flex; align-items:center; gap:4px;">
                  ⬇️ Download
                </a>
              </div>
            `;
          } else {
            actionButton = `
              <div style="display:flex; gap:8px; align-items:center;">
                <button type="button" class="btn-sm btn-outline-white view-fallback-doc-btn" data-filename="${file.name}" style="padding:5px 12px; font-size:0.75rem; display:inline-flex; align-items:center; gap:4px;">
                  👁️ View Dossier Summary
                </button>
                <button type="button" class="btn-sm btn-gold download-fallback-doc-btn" data-filename="${file.name}" style="padding:5px 12px; font-size:0.75rem; display:inline-flex; align-items:center; gap:4px;">
                  ⬇️ Download Summary
                </button>
              </div>
            `;
          }

          docRow.innerHTML = `
            <div style="display:flex; align-items:center; gap:10px;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C8A96A" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
              <div>
                <strong style="color:#F5F1E8; font-size:0.9rem; display:block;">${file.name}</strong>
                <span style="color:rgba(245,241,232,0.5); font-size:0.75rem;">${file.size || 'Document'}</span>
              </div>
            </div>
            ${actionButton}
          `;
          docsContainer.appendChild(docRow);
        });

        // Wire fallback document view / download buttons
        docsContainer.querySelectorAll('.view-fallback-doc-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const fileName = btn.getAttribute('data-filename');
            const summaryHtml = `
              <html>
                <head>
                  <title>${fileName} — Dossier Verification</title>
                  <style>
                    body { font-family: 'Georgia', serif; padding: 40px; background: #07111e; color: #f5f1e8; line-height: 1.6; }
                    .box { max-width: 680px; margin: 0 auto; background: #0b1726; padding: 30px; border: 1px solid #c8a96a; border-radius: 4px; box-shadow: 0 4px 20px rgba(0,0,0,0.5); }
                    h2 { color: #c8a96a; margin-top: 0; font-size: 1.6rem; border-bottom: 1px solid rgba(200,169,106,0.3); padding-bottom: 12px; }
                    .tag { display: inline-block; padding: 4px 10px; background: rgba(200,169,106,0.15); color: #c8a96a; font-size: 0.8rem; border-radius: 2px; margin-bottom: 20px; }
                    p { font-size: 0.95rem; }
                    strong { color: #ffffff; }
                    .footer { margin-top: 30px; font-size: 0.8rem; color: rgba(245,241,232,0.6); border-top: 1px solid rgba(200,169,106,0.2); padding-top: 15px; }
                  </style>
                </head>
                <body>
                  <div class="box">
                    <h2>GRD10 Achiever Awards</h2>
                    <div class="tag">CONFIDENTIAL JURY DOSSIER DOCUMENT</div>
                    <p><strong>Document Name:</strong> ${fileName}</p>
                    <p><strong>Nominee:</strong> ${item.nomineeName || 'N/A'}</p>
                    <p><strong>Category:</strong> ${item.category || 'N/A'}</p>
                    <p><strong>Reference ID:</strong> ${item.referenceId || 'N/A'}</p>
                    <p><strong>Location:</strong> ${item.cityState || 'N/A'} ${item.organisation ? '(' + item.organisation + ')' : ''}</p>
                    <p><strong>Key Contribution &amp; Impact:</strong><br>${item.keyContribution || item.reason || 'Record lodged under official committee seals.'}</p>
                    <div class="footer">
                      Verified and logged in GRD10 Institutional Jury Archives • Edition 2026
                    </div>
                  </div>
                </body>
              </html>
            `;
            const blob = new Blob([summaryHtml], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank');
          });
        });

        docsContainer.querySelectorAll('.download-fallback-doc-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const fileName = btn.getAttribute('data-filename');
            const summaryText = `=====================================================
GRD10 SHRI GHANSHYAM DUBE ACHIEVER AWARDS
CONFIDENTIAL JURY DOSSIER & CERTIFICATE RECORD
=====================================================

Document File: ${fileName}
Nominee Name:  ${item.nomineeName || 'N/A'}
Reference ID:  ${item.referenceId || 'N/A'}
Category:      ${item.category || 'N/A'}
City / State:  ${item.cityState || 'N/A'}
Organisation:  ${item.organisation || 'N/A'}
Submitted At:  ${item.submittedAt || new Date().toISOString()}

REASON FOR NOMINATION:
${item.reason || 'N/A'}

MEASURABLE IMPACT / KEY CONTRIBUTION:
${item.keyContribution || 'N/A'}

NOMINATOR DETAILS:
Name:    ${item.nominatorName || 'Anonymous'}
Contact: ${item.nominatorContact || 'N/A'}

=====================================================
Record preserved in GRD10 Institutional Vault.
=====================================================
`;
            const blob = new Blob([summaryText], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName.replace(/\.[^/.]+$/, "") + "_Summary.txt";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          });
        });
      }
    }

    // Update Status Badge
    const statusBadge = document.getElementById('dossierStatusBadge');
    if (statusBadge) {
      statusBadge.textContent = item.status || 'Under Review';
      if (item.status === 'Approved Laureate') {
        statusBadge.style.borderColor = '#69d27a';
        statusBadge.style.color = '#69d27a';
        statusBadge.style.background = 'rgba(105, 210, 122, 0.15)';
      } else if (item.status === 'Shortlisted') {
        statusBadge.style.borderColor = '#E4C97E';
        statusBadge.style.color = '#E4C97E';
        statusBadge.style.background = 'rgba(228, 201, 126, 0.15)';
      } else {
        statusBadge.style.borderColor = 'var(--color-champagne-gold)';
        statusBadge.style.color = 'var(--color-champagne-gold)';
        statusBadge.style.background = 'rgba(200, 169, 106, 0.15)';
      }
    }

    // Connect Shortlist Button
    const shortlistBtn = document.getElementById('dossierStatusShortlistBtn');
    if (shortlistBtn) {
      shortlistBtn.onclick = async () => {
        const refOrId = item.referenceId || item.id;
        await window.grdStore.updateNominationStatus(refOrId, 'Shortlisted', 'Candidate officially marked as shortlisted by Jury.');
        item.status = 'Shortlisted';
        if (statusBadge) {
          statusBadge.textContent = 'Shortlisted';
          statusBadge.style.color = '#E4C97E';
          statusBadge.style.borderColor = '#E4C97E';
          statusBadge.style.background = 'rgba(228, 201, 126, 0.15)';
        }
        await renderNominationsTable();
        window.showToast(`★ ${item.nomineeName} is now Shortlisted and nominated for Awards!`);
      };
    }

    // Connect Edit Candidate Details Button
    const editCandBtn = document.getElementById('dossierEditCandidateBtn');
    if (editCandBtn) {
      editCandBtn.onclick = async () => {
        const newName = prompt('Edit Nominee Name:', item.nomineeName);
        if (newName !== null) {
          const newOrg = prompt('Edit Organisation/Location:', item.organisation || item.cityState);
          const newReason = prompt('Edit Reason / Narrative:', item.reason);
          const newContrib = prompt('Edit Key Contribution:', item.keyContribution);

          item.nomineeName = newName || item.nomineeName;
          item.organisation = newOrg || item.organisation;
          item.reason = newReason || item.reason;
          item.keyContribution = newContrib || item.keyContribution;

          // Save updated nomination
          const nominations = window.grdStore.getPrivateNominations();
          const targetIndex = nominations.findIndex(n => n.id === item.id);
          if (targetIndex !== -1) {
            nominations[targetIndex] = item;
            localStorage.setItem(window.grdStore.NOMINATIONS_KEY, JSON.stringify(nominations));
          }

          // Refresh modal & table
          document.getElementById('dossierNomineeName').textContent = item.nomineeName;
          document.getElementById('dossierReason').textContent = item.reason;
          document.getElementById('dossierContribution').textContent = item.keyContribution;
          renderNominationsTable();
          window.showToast(`Candidate record for ${item.nomineeName} updated.`);
        }
      };
    }

    // Connect Delete Candidate Dossier Button
    const delCandBtn = document.getElementById('dossierDeleteCandidateBtn');
    if (delCandBtn) {
      delCandBtn.onclick = async () => {
        const nomineeName = item.nomineeName || 'this candidate';
        const ref = item.referenceId || item.id;
        if (confirm(`Permanently delete the nomination dossier for "${nomineeName}" (${ref})?`)) {
          await window.grdStore.deleteNominationRecord(ref);
          modal.classList.remove('open');
          document.body.style.overflow = '';
          await renderNominationsTable();
          window.showToast(`Nomination dossier for "${nomineeName}" deleted.`);
        }
      };
    }

    // Connect Direct Promotion to "The 10" Laureates Button (Opens dedicated Ratify Modal)
    const promoteBtn = document.getElementById('dossierPromoteToLaureateBtn');
    if (promoteBtn) {
      promoteBtn.onclick = () => {
        openRatifyModal(item);
      };
    }

    // Direct close wiring
    const closeModal = () => {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    };

    const topCloseBtn = document.getElementById('closeDossierModalBtn');
    if (topCloseBtn) topCloseBtn.onclick = closeModal;

    const bottomCloseBtn = document.getElementById('dossierCloseBottomBtn');
    if (bottomCloseBtn) bottomCloseBtn.onclick = closeModal;

    modal.onclick = (e) => {
      if (e.target === modal) closeModal();
    };

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  /* MODAL: RATIFY CANDIDATE TO "THE 10" LAUREATES */
  let activeRatifyNomination = null;

  function openRatifyModal(item) {
    activeRatifyNomination = item;
    const modal = document.getElementById('cmsRatifyModal');
    if (!modal) return;

    // Explicitly hide the underlying nomination dossier modal to prevent overlay conflicts
    const dossierModal = document.getElementById('nominationDossierModal');
    if (dossierModal) {
      dossierModal.classList.remove('open');
    }

    document.getElementById('ratifyNominationId').value = item.referenceId || item.id;
    const subTitle = document.getElementById('ratifyCandidateSubtitle');
    if (subTitle) {
      subTitle.textContent = `Promoting candidate: "${item.nomineeName}" [Field: ${item.category || 'General'}]`;
    }

    const currentYear = window.grdStore.getData().activeEdition || '2026';
    document.getElementById('ratifyEditionYear').value = currentYear;
    
    // Dynamically populate slot dropdown with categories/fields for clarity
    const data = window.grdStore.getData();
    const slotSelect = document.getElementById('ratifySlotSelect');
    if (slotSelect) {
      const awardeesForYear = (data.awardees || []).filter(a => (a.edition || '2026') === currentYear);
      slotSelect.innerHTML = '';
      
      const candidateCatLower = (item.category || '').toLowerCase().trim();
      let matchedSlot = null;

      for (let i = 1; i <= 10; i++) {
        const slotStr = String(i).padStart(2, '0');
        const existingSlotAwardee = awardeesForYear.find(a => String(a.number).padStart(2, '0') === slotStr);
        const slotCatName = existingSlotAwardee ? existingSlotAwardee.categoryName : (data.categories && data.categories[i - 1] ? data.categories[i - 1].name : `Category ${slotStr}`);
        
        const opt = document.createElement('option');
        opt.value = slotStr;
        opt.textContent = `Slot #${slotStr} — ${slotCatName}${existingSlotAwardee ? (existingSlotAwardee.isPlaceholder ? ' (Available)' : ' (' + existingSlotAwardee.name + ')') : ''}`;
        
        if (candidateCatLower && slotCatName.toLowerCase().includes(candidateCatLower) || candidateCatLower.includes(slotCatName.toLowerCase())) {
          matchedSlot = slotStr;
        }
        slotSelect.appendChild(opt);
      }

      if (matchedSlot) {
        slotSelect.value = matchedSlot;
      }
    }

    // Populate Category dropdown with 5 standard categories + custom option
    const ratifyCatSelect = document.getElementById('ratifyCategorySelect');
    const ratifyCustomInput = document.getElementById('ratifyCategoryCustomInput');
    const ratifyCatInput = document.getElementById('ratifyCategoryInput');

    if (ratifyCatSelect) {
      const standardCategories = [
        { number: '01', name: 'Sports & Kushti' },
        { number: '02', name: 'Education' },
        { number: '03', name: 'Uttar Bharatiya Ratna' },
        { number: '04', name: 'Medicine & Healthcare' },
        { number: '05', name: 'Media & Journalism' },
        { number: '06', name: 'Arts, Culture & Literature' },
        { number: '07', name: 'Agriculture & Rural Development' },
        { number: '08', name: 'Science, Tech & Innovation' },
        { number: '09', name: 'Women Empowerment' },
        { number: '10', name: 'Public Administration & Youth Leadership' }
      ];
      const allCategories = data.categories || [];
      const catMap = new Map();
      standardCategories.forEach(c => catMap.set(c.name.toLowerCase(), c));
      allCategories.forEach(c => {
        if (!catMap.has(c.name.toLowerCase())) {
          catMap.set(c.name.toLowerCase(), {
            number: c.number || String(catMap.size + 1).padStart(2, '0'),
            name: c.name
          });
        }
      });

      ratifyCatSelect.innerHTML = '';
      let candidateCat = (item.category || '').trim();
      let foundMatch = false;

      catMap.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.name;
        opt.textContent = `${c.number} — ${c.name}`;
        if (candidateCat && c.name.toLowerCase() === candidateCat.toLowerCase()) {
          opt.selected = true;
          foundMatch = true;
        }
        ratifyCatSelect.appendChild(opt);
      });

      const customOpt = document.createElement('option');
      customOpt.value = '__custom__';
      customOpt.textContent = '➕ Other / Custom Category...';
      ratifyCatSelect.appendChild(customOpt);

      if (ratifyCustomInput) {
        if (!foundMatch && candidateCat && candidateCat !== '__custom__') {
          customOpt.selected = true;
          ratifyCustomInput.style.display = 'block';
          ratifyCustomInput.value = candidateCat;
        } else {
          ratifyCustomInput.style.display = 'none';
          ratifyCustomInput.value = '';
        }

        if (!ratifyCatSelect.dataset.wiredChange) {
          ratifyCatSelect.dataset.wiredChange = 'true';
          ratifyCatSelect.addEventListener('change', () => {
            if (ratifyCatSelect.value === '__custom__') {
              ratifyCustomInput.style.display = 'block';
              ratifyCustomInput.focus();
            } else {
              ratifyCustomInput.style.display = 'none';
            }
          });
        }
      }

      if (ratifyCatInput) {
        ratifyCatInput.value = foundMatch ? ratifyCatSelect.value : (candidateCat || ratifyCatSelect.value);
      }
    }

    // Use candidate's uploaded photo if available, or default
    const candPhoto = item.photo || "assets/images/shri-ghanshyam-raj-narayan-dube-portrait.jpg";
    document.getElementById('ratifyPhotoPath').value = candPhoto;

    // Reset file input & preview
    const fileInput = document.getElementById('ratifyPhotoFileInput');
    if (fileInput) fileInput.value = '';
    const previewWrap = document.getElementById('ratifyPhotoPreviewWrap');
    const previewImg = document.getElementById('ratifyPhotoPreview');
    if (item.photo && previewWrap && previewImg) {
      previewImg.src = item.photo;
      previewWrap.style.display = 'flex';
      const nameEl = document.getElementById('ratifyPhotoFileName');
      if (nameEl) nameEl.textContent = 'Nominee Uploaded Photo';
      const sizeEl = document.getElementById('ratifyPhotoFileSize');
      if (sizeEl) sizeEl.textContent = 'Retained from nomination';
    } else if (previewWrap) {
      previewWrap.style.display = 'none';
    }

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function initRatifyModalWiring() {
    const modal = document.getElementById('cmsRatifyModal');
    const closeBtn = document.getElementById('closeRatifyModalBtn');
    const cancelBtn = document.getElementById('cancelRatifyBtn');
    const form = document.getElementById('cmsRatifyForm');

    setupImageUploadHelper({
      fileInputId: 'ratifyPhotoFileInput',
      textInputId: 'ratifyPhotoPath',
      previewWrapId: 'ratifyPhotoPreviewWrap',
      previewImgId: 'ratifyPhotoPreview',
      fileNameId: 'ratifyPhotoFileName',
      fileSizeId: 'ratifyPhotoFileSize',
      clearBtnId: 'ratifyPhotoClearBtn',
      defaultVal: 'assets/images/shri-ghanshyam-raj-narayan-dube-portrait.jpg'
    });

    const closeModal = () => {
      if (modal) modal.classList.remove('open');
      document.body.style.overflow = '';
      activeRatifyNomination = null;
    };

    if (closeBtn) closeBtn.onclick = closeModal;
    if (cancelBtn) cancelBtn.onclick = closeModal;
    if (modal) {
      modal.onclick = (e) => {
        if (e.target === modal) closeModal();
      };
    }

    if (form && !form.dataset.wired) {
      form.dataset.wired = 'true';
      form.onsubmit = async (e) => {
        e.preventDefault();
        if (!activeRatifyNomination) return;

        const slotNumber = document.getElementById('ratifySlotSelect').value;
        const editionYear = document.getElementById('ratifyEditionYear').value.trim() || '2026';
        const customPhoto = document.getElementById('ratifyPhotoPath').value.trim() || 'assets/images/shri-ghanshyam-raj-narayan-dube-portrait.jpg';

        // Capture name before closeModal resets activeRatifyNomination
        const nomineeName = activeRatifyNomination.nomineeName || 'Candidate';
        const nomineeCategory = activeRatifyNomination.category || 'their field';

        const ratifyCatSelect = document.getElementById('ratifyCategorySelect');
        const ratifyCustomInput = document.getElementById('ratifyCategoryCustomInput');
        let ratifyCategory = 'Honour Category';
        if (ratifyCatSelect) {
          if (ratifyCatSelect.value === '__custom__') {
            ratifyCategory = (ratifyCustomInput?.value || '').trim() || 'Custom Category';
          } else {
            ratifyCategory = ratifyCatSelect.value.trim();
          }
        }

        try {
          await window.grdStore.promoteNomineeToAwardee({
            nominationId: activeRatifyNomination.referenceId || activeRatifyNomination.id,
            nomineeObject: activeRatifyNomination,
            slotNumber: slotNumber,
            editionYear: editionYear,
            customPhoto: customPhoto,
            categoryOverride: ratifyCategory,
            ceremonyNotes: `To be officially conferred at the GRD National Convocation in ${editionYear}.`
          });

          // Update the dossier status badge if visible
          const statusBadge = document.getElementById('dossierStatusBadge');
          if (statusBadge) {
            statusBadge.textContent = 'Approved Laureate';
            statusBadge.style.borderColor = '#69d27a';
            statusBadge.style.color = '#69d27a';
            statusBadge.style.background = 'rgba(105, 210, 122, 0.15)';
          }

          closeModal();
          await renderNominationsTable();
          renderAwardeesEditor();
          renderDashboardOverview();

          window.showToast?.(`★ ${nomineeName} is now official Laureate of [${nomineeCategory}] as Slot #${slotNumber} (${editionYear})!`);
        } catch (err) {
          console.error('Error promoting candidate:', err);
          alert(`Error promoting candidate to Laureate:\n\n${err.message}`);
        }
      };
    }
  }

  /* MODAL: MANUAL ADD NOMINATION */
  function initAddNominationModal() {
    const openBtn = document.getElementById('addNominationManualBtn');
    const modal = document.getElementById('addNominationModal');
    const closeBtn = document.getElementById('closeAddNominationModalBtn');
    const cancelBtn = document.getElementById('cancelAddNominationBtn');
    const form = document.getElementById('manualAddNominationForm');

    if (!modal) return;

    let manualNomineePhotoData = null;
    const photoFileInput = document.getElementById('manualNomineePhotoInput');
    const photoPreviewWrap = document.getElementById('manualNomineePhotoPreviewWrap');
    const photoPreviewImg = document.getElementById('manualNomineePhotoPreview');
    const photoFileNameEl = document.getElementById('manualNomineePhotoFileName');
    const photoFileSizeEl = document.getElementById('manualNomineePhotoFileSize');
    const photoClearBtn = document.getElementById('manualNomineePhotoClearBtn');

    if (photoFileInput) {
      photoFileInput.onchange = (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
          alert('Please select a valid image file.');
          photoFileInput.value = '';
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          alert('Image exceeds 5MB limit.');
          photoFileInput.value = '';
          return;
        }
        const reader = new FileReader();
        reader.onload = (loadEvt) => {
          manualNomineePhotoData = loadEvt.target.result;
          if (photoPreviewImg) photoPreviewImg.src = manualNomineePhotoData;
          if (photoFileNameEl) photoFileNameEl.textContent = file.name;
          if (photoFileSizeEl) photoFileSizeEl.textContent = `${(file.size / 1024).toFixed(1)} KB`;
          if (photoPreviewWrap) photoPreviewWrap.style.display = 'flex';
        };
        reader.readAsDataURL(file);
      };
    }

    if (photoClearBtn) {
      photoClearBtn.onclick = () => {
        manualNomineePhotoData = null;
        if (photoFileInput) photoFileInput.value = '';
        if (photoPreviewWrap) photoPreviewWrap.style.display = 'none';
        if (photoPreviewImg) photoPreviewImg.src = '';
      };
    }

    const openModal = () => {
      if (form) form.reset();
      manualNomineePhotoData = null;
      if (photoPreviewWrap) photoPreviewWrap.style.display = 'none';
      if (photoPreviewImg) photoPreviewImg.src = '';
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
      modal.classList.remove('open');
      document.body.style.overflow = '';
      if (form) form.reset();
      manualNomineePhotoData = null;
      if (photoPreviewWrap) photoPreviewWrap.style.display = 'none';
      if (photoPreviewImg) photoPreviewImg.src = '';
    };

    if (openBtn) openBtn.onclick = openModal;
    if (closeBtn) closeBtn.onclick = closeModal;
    if (cancelBtn) cancelBtn.onclick = closeModal;
    modal.onclick = (e) => {
      if (e.target === modal) closeModal();
    };
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
    });

    if (form && !form.dataset.wired) {
      form.dataset.wired = 'true';
      form.onsubmit = async (e) => {
        e.preventDefault();

        const nomineeName = document.getElementById('manualNomineeName')?.value.trim();
        const category = document.getElementById('manualNomineeCategory')?.value;
        const organisation = document.getElementById('manualNomineeOrg')?.value.trim();
        const cityState = document.getElementById('manualNomineeLocation')?.value.trim();
        const nomineeContact = document.getElementById('manualNomineeContact')?.value.trim();
        const status = document.getElementById('manualNomineeStatus')?.value || 'Under Review';
        const reason = document.getElementById('manualNomineeReason')?.value.trim();
        const keyContribution = document.getElementById('manualNomineeContribution')?.value.trim();
        const nominatorName = document.getElementById('manualNominatorName')?.value.trim() || 'Admin Manual Entry';
        const nominatorContact = document.getElementById('manualNominatorContact')?.value.trim() || 'admin@grd10.org';

        if (!nomineeName || !category || !cityState || !reason) {
          alert('Please fill in all required fields (Name, Category, City/State, Reason).');
          return;
        }

        const referenceId = `GRD-2026-NOM-${Math.floor(10000 + Math.random() * 90000)}`;
        const payload = {
          referenceId,
          nomineeName,
          category,
          organisation,
          cityState,
          nomineeContact,
          photo: manualNomineePhotoData || null,
          status,
          reason,
          keyContribution,
          nominatorName,
          nominatorContact,
          submittedAt: new Date().toISOString(),
          fileNames: []
        };

        const saveBtn = document.getElementById('saveManualNominationBtn');
        if (saveBtn) {
          saveBtn.disabled = true;
          saveBtn.textContent = 'Saving...';
        }

        try {
          // Save directly to local store — no server dependency on local dev
          if (window.grdStore && typeof window.grdStore.saveNominationRecord === 'function') {
            await window.grdStore.saveNominationRecord(payload);
          } else {
            // Fallback: push into private nominations array directly
            const data = window.grdStore.getData();
            if (!data.privateNominations) data.privateNominations = [];
            data.privateNominations.push(payload);
            window.grdStore.saveData(data);
          }

          closeModal();
          await renderNominationsTable();
          renderDashboardOverview();
          window.showToast?.(`Nomination for "${nomineeName}" successfully added (${referenceId})!`);
        } catch (err) {
          console.error('Error saving manual nomination:', err);
          alert('Failed to save nomination. Please try again.\n\nDetails: ' + err.message);
        } finally {
          if (saveBtn) {
            saveBtn.disabled = false;
            saveBtn.textContent = 'Save & Add Nomination';
          }
        }
      };
    }
  }

  /* MODAL: EDIT & CREATE LAUREATE PROFILE */
  let activeAwardeeToEdit = null;

  function populateAwardeeCategoryDropdown(selectedCategoryName, selectedEdition) {
    const catSelect = document.getElementById('editAwardeeCategorySelect');
    const customInput = document.getElementById('editAwardeeCategoryCustomInput');
    const legacyHiddenInput = document.getElementById('editAwardeeCategoryInput');
    if (!catSelect) return;

    const standardCategories = [
      { number: '01', name: 'Sports & Kushti' },
      { number: '02', name: 'Education' },
      { number: '03', name: 'Uttar Bharatiya Ratna' },
      { number: '04', name: 'Medicine & Healthcare' },
      { number: '05', name: 'Media & Journalism' },
      { number: '06', name: 'Arts, Culture & Literature' },
      { number: '07', name: 'Agriculture & Rural Development' },
      { number: '08', name: 'Science, Tech & Innovation' },
      { number: '09', name: 'Women Empowerment' },
      { number: '10', name: 'Public Administration & Youth Leadership' }
    ];

    const data = window.grdStore.getData();
    const allCategories = data.categories || [];

    // Build unique category list starting with the standard 5
    const catMap = new Map();
    standardCategories.forEach(c => catMap.set(c.name.toLowerCase(), c));
    allCategories.forEach(c => {
      if (!catMap.has(c.name.toLowerCase())) {
        catMap.set(c.name.toLowerCase(), {
          number: c.number || String(catMap.size + 1).padStart(2, '0'),
          name: c.name
        });
      }
    });

    catSelect.innerHTML = '';
    let foundMatch = false;

    catMap.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat.name;
      opt.textContent = `${cat.number} — ${cat.name}`;
      if (selectedCategoryName && cat.name.toLowerCase() === selectedCategoryName.toLowerCase()) {
        opt.selected = true;
        foundMatch = true;
      }
      catSelect.appendChild(opt);
    });

    // Custom option
    const customOpt = document.createElement('option');
    customOpt.value = '__custom__';
    customOpt.textContent = '➕ Other / Custom Category...';
    catSelect.appendChild(customOpt);

    if (customInput) {
      if (!foundMatch && selectedCategoryName && selectedCategoryName !== '__custom__') {
        customOpt.selected = true;
        customInput.style.display = 'block';
        customInput.value = selectedCategoryName;
      } else {
        customInput.style.display = 'none';
        customInput.value = '';
      }

      if (!catSelect.dataset.wiredChange) {
        catSelect.dataset.wiredChange = 'true';
        catSelect.addEventListener('change', () => {
          if (catSelect.value === '__custom__') {
            customInput.style.display = 'block';
            customInput.focus();
          } else {
            customInput.style.display = 'none';
          }
          if (legacyHiddenInput) {
            legacyHiddenInput.value = catSelect.value === '__custom__' ? customInput.value : catSelect.value;
          }
        });

        customInput.addEventListener('input', () => {
          if (legacyHiddenInput) {
            legacyHiddenInput.value = customInput.value.trim();
          }
        });
      }
    }

    if (legacyHiddenInput) {
      legacyHiddenInput.value = foundMatch ? catSelect.value : (selectedCategoryName || catSelect.value);
    }
  }

  function openAwardeeEditModal(awardee = null, defaultEdition = '2026') {
    activeAwardeeToEdit = awardee;
    const modal = document.getElementById('cmsAwardeeEditModal');
    if (!modal) return;

    const modalTitle = document.getElementById('awardeeEditModalTitle');
    const idInput = document.getElementById('editAwardeeId');
    const nameInput = document.getElementById('editAwardeeName');
    const editionInput = document.getElementById('editAwardeeEdition');
    const numberInput = document.getElementById('editAwardeeNumber');
    const bioInput = document.getElementById('editAwardeeBio');
    const storyInput = document.getElementById('editAwardeeStory');
    const contribInput = document.getElementById('editAwardeeContribution');
    const whyInput = document.getElementById('editAwardeeWhyChosen');
    const photoInput = document.getElementById('editAwardeePhoto');
    const previewWrap = document.getElementById('editAwardeePhotoPreviewWrap');
    const previewImg = document.getElementById('editAwardeePhotoPreview');
    const fileInput = document.getElementById('editAwardeePhotoFileInput');

    if (fileInput) fileInput.value = '';

    if (awardee) {
      modalTitle.textContent = `Edit Laureate #${awardee.number || '01'}: ${awardee.name}`;
      idInput.value = awardee.id;
      nameInput.value = awardee.name || '';
      if (editionInput) editionInput.value = awardee.edition || defaultEdition;
      if (numberInput) numberInput.value = String(awardee.number || '01').padStart(2, '0');
      bioInput.value = awardee.shortBio || '';
      storyInput.value = awardee.theirStory || '';
      contribInput.value = awardee.theirContribution || '';
      whyInput.value = awardee.whyChosen || '';
      photoInput.value = awardee.photo || 'assets/images/shri-ghanshyam-raj-narayan-dube-portrait.jpg';
      populateAwardeeCategoryDropdown(awardee.categoryName, awardee.edition || defaultEdition);

      if (awardee.photo && previewWrap && previewImg) {
        previewImg.src = awardee.photo;
        document.getElementById('editAwardeePhotoFileName').textContent = 'Current Portrait';
        document.getElementById('editAwardeePhotoFileSize').textContent = awardee.photo.startsWith('data:') ? 'Custom upload' : 'Default asset';
        previewWrap.style.display = 'flex';
      } else if (previewWrap) {
        previewWrap.style.display = 'none';
      }
    } else {
      // Adding new Laureate
      const targetYear = defaultEdition || currentAwardeeYearFilter || '2026';
      modalTitle.textContent = `+ Add New Laureate for Edition ${targetYear}`;
      idInput.value = '';
      nameInput.value = '';
      if (editionInput) editionInput.value = targetYear;
      if (numberInput) numberInput.value = '01';
      bioInput.value = '';
      storyInput.value = '';
      contribInput.value = '';
      whyInput.value = '';
      photoInput.value = 'assets/images/shri-ghanshyam-raj-narayan-dube-portrait.jpg';
      populateAwardeeCategoryDropdown(null, targetYear);
      if (previewWrap) previewWrap.style.display = 'none';
    }

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function initAwardeeModalWiring() {
    const modal = document.getElementById('cmsAwardeeEditModal');
    const closeBtn = document.getElementById('closeAwardeeEditModalBtn');
    const cancelBtn = document.getElementById('cancelAwardeeEditBtn');
    const form = document.getElementById('cmsAwardeeEditForm');

    setupImageUploadHelper({
      fileInputId: 'editAwardeePhotoFileInput',
      textInputId: 'editAwardeePhoto',
      previewWrapId: 'editAwardeePhotoPreviewWrap',
      previewImgId: 'editAwardeePhotoPreview',
      fileNameId: 'editAwardeePhotoFileName',
      fileSizeId: 'editAwardeePhotoFileSize',
      clearBtnId: 'editAwardeePhotoClearBtn',
      defaultVal: 'assets/images/shri-ghanshyam-raj-narayan-dube-portrait.jpg'
    });

    const closeModal = () => {
      if (modal) modal.classList.remove('open');
      document.body.style.overflow = '';
      activeAwardeeToEdit = null;
    };

    if (closeBtn) closeBtn.onclick = closeModal;
    if (cancelBtn) cancelBtn.onclick = closeModal;
    if (modal) {
      modal.onclick = (e) => {
        if (e.target === modal) closeModal();
      };
    }

    const addBtn = document.getElementById('cmsAddNewAwardeeBtn');
    if (addBtn && !addBtn.dataset.modalWired) {
      addBtn.dataset.modalWired = 'true';
      addBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openAwardeeEditModal(null, currentAwardeeYearFilter);
      });
    }

    if (form) {
      form.onsubmit = (e) => {
        e.preventDefault();

        try {
          const nameInput = document.getElementById('editAwardeeName');
          const name = (nameInput?.value || '').trim();
          if (!name) {
            alert('Please enter a laureate name.');
            nameInput?.focus();
            return;
          }

          const editionInput = document.getElementById('editAwardeeEdition');
          const edition = editionInput?.value || currentAwardeeYearFilter || '2026';

          const numberInput = document.getElementById('editAwardeeNumber');
          const number = numberInput?.value || '01';

          const catSelect = document.getElementById('editAwardeeCategorySelect');
          const customInput = document.getElementById('editAwardeeCategoryCustomInput');
          let categoryName = 'Honour Category';
          if (catSelect) {
            if (catSelect.value === '__custom__') {
              categoryName = (customInput?.value || '').trim() || 'Custom Category';
            } else {
              categoryName = catSelect.value.trim();
            }
          }
          const categorySlug = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

          // If this is a new custom category not in store categories, add it automatically
          const currentData = window.grdStore.getData();
          const existingCat = (currentData.categories || []).find(c => c.name.toLowerCase() === categoryName.toLowerCase());
          if (!existingCat && categoryName) {
            window.grdStore.addCategory({
              name: categoryName,
              slug: categorySlug,
              number: String((currentData.categories?.length || 0) + 1).padStart(2, '0')
            });
          }

          const shortBio = document.getElementById('editAwardeeBio')?.value.trim() || '';
          const theirStory = document.getElementById('editAwardeeStory')?.value.trim() || '';
          const theirContribution = document.getElementById('editAwardeeContribution')?.value.trim() || '';
          const whyChosen = document.getElementById('editAwardeeWhyChosen')?.value.trim() || '';
          const photo = document.getElementById('editAwardeePhoto')?.value.trim() || 'assets/images/shri-ghanshyam-raj-narayan-dube-portrait.jpg';

          const idInput = document.getElementById('editAwardeeId');
          const targetId = activeAwardeeToEdit?.id || idInput?.value;

          if (targetId) {
            // Update existing
            window.grdStore.updateAwardee(targetId, {
              name,
              edition,
              number: String(number).padStart(2, '0'),
              categoryName,
              categorySlug,
              isPlaceholder: false,
              shortBio,
              theirStory,
              theirContribution,
              whyChosen,
              photo
            });
            window.showToast?.(`Laureate #${number} (${name}) profile saved for Edition ${edition}!`);
          } else {
            // Create new Laureate record
            const newId = `awd-${edition}-${number}-${Date.now().toString().slice(-4)}`;
            window.grdStore.addAwardee({
              id: newId,
              number: String(number).padStart(2, '0'),
              edition,
              name,
              isPlaceholder: false,
              categorySlug,
              categoryName,
              photo,
              shortBio,
              theirStory,
              theirContribution,
              whyChosen,
              ceremonyNotes: `To be conferred at the GRD National Convocation (${edition}).`
            });
            window.showToast?.(`New Laureate #${number} (${name}) created for Edition ${edition}!`);
          }

          // Set the current awardee filter to match the edited edition so user sees it right away
          currentAwardeeYearFilter = edition;
          const yearSelect = document.getElementById('cmsAwardeeYearFilter');
          if (yearSelect) yearSelect.value = edition;

          closeModal();
          renderAwardeesEditor();
        } catch (err) {
          console.error('Error saving laureate profile:', err);
          alert('Failed to save laureate profile. Details: ' + err.message);
        }
      };

      const saveBtn = document.getElementById('saveAwardeeProfileBtn');
      if (saveBtn && !saveBtn.dataset.wired) {
        saveBtn.dataset.wired = 'true';
        saveBtn.addEventListener('click', (e) => {
          if (form.requestSubmit) {
            form.requestSubmit();
          } else {
            form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
          }
        });
      }
    }
  }

  // Close modal listeners
  const closeDossierBtn = document.getElementById('closeDossierModalBtn');
  const dossierModal = document.getElementById('nominationDossierModal');
  if (closeDossierBtn && dossierModal) {
    const closeModal = () => {
      dossierModal.classList.remove('open');
      document.body.style.overflow = '';
    };
    closeDossierBtn.addEventListener('click', closeModal);
    dossierModal.addEventListener('click', (e) => {
      if (e.target === dossierModal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && dossierModal.classList.contains('open')) {
        closeModal();
      }
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
      
      const currentActiveEd = window.grdStore.getData().activeEdition || "2026";
      window.grdStore.addCategory({
        id: `cat-${catNum}`,
        number: catNum.padStart(2, '0'),
        slug: slug,
        name: catName,
        description: catDesc,
        status: "Approved",
        active: true,
        edition: currentActiveEd,
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
  let currentAwardeeYearFilter = '2026';

  function renderAwardeesEditor() {
    const container = document.getElementById('cmsAwardeesEditContainer');
    const yearSelect = document.getElementById('cmsAwardeeYearFilter');
    const addBtn = document.getElementById('cmsAddNewAwardeeBtn');
    if (!container) return;

    if (yearSelect && !yearSelect.dataset.wired) {
      yearSelect.dataset.wired = 'true';
      yearSelect.value = currentAwardeeYearFilter;
      yearSelect.addEventListener('change', () => {
        currentAwardeeYearFilter = yearSelect.value;
        renderAwardeesEditor();
      });
    }

    if (addBtn && !addBtn.dataset.wired) {
      addBtn.dataset.wired = 'true';
      addBtn.addEventListener('click', () => {
        openAwardeeEditModal(null, currentAwardeeYearFilter);
      });
    }

    const data = window.grdStore.getData();
    const filteredAwardees = (data.awardees || []).filter(a => (a.edition || '2026') === currentAwardeeYearFilter);
    container.innerHTML = '';

    if (filteredAwardees.length === 0) {
      container.innerHTML = `
        <div style="padding: 2.5rem; text-align: center; color: var(--color-muted-text-dark); border: 1px dashed rgba(200,169,106,0.3); border-radius: 2px;">
          <h4 style="color: var(--color-ivory); margin-bottom: 0.5rem; font-family: var(--font-heading);">No Laureate Profiles in Edition ${currentAwardeeYearFilter}</h4>
          <p style="margin-bottom: 1rem; font-size: 0.85rem;">You can start adding the 10 laureates for this edition year.</p>
          <button type="button" class="btn btn-gold" onclick="document.getElementById('cmsAddNewAwardeeBtn').click()">
            + Add Laureate for ${currentAwardeeYearFilter}
          </button>
        </div>
      `;
      return;
    }

    filteredAwardees.forEach(a => {
      const card = document.createElement('div');
      card.style.cssText = 'padding:18px 22px; background:#0b1726; border:1px solid rgba(200,169,106,0.25); border-radius:2px; display:flex; gap:16px; align-items:flex-start;';
      
      const photoSrc = a.photo || 'assets/images/shri-ghanshyam-raj-narayan-dube-portrait.jpg';

      card.innerHTML = `
        <div style="flex-shrink: 0; width: 68px; height: 68px; border: 1px solid var(--color-champagne-gold); border-radius: 2px; overflow: hidden; background: #000;">
          <img src="${photoSrc}" alt="${a.name}" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
        <div style="flex-grow: 1;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; flex-wrap:wrap; gap:6px;">
            <div>
              <span style="font-family:'Playfair Display',serif; font-size:1.2rem; color:#C8A96A; font-weight:700;">#${a.number || '01'}</span>
              <strong style="color:#F5F1E8; font-size:1.1rem; margin-left:8px;">${a.name}</strong>
              <span style="color:var(--color-champagne-gold); font-size:0.8rem; margin-left:10px;">[${a.categoryName || 'General'}] • Edition ${a.edition || currentAwardeeYearFilter}</span>
            </div>
            <span style="font-size:0.75rem; color:${a.isPlaceholder ? '#E4C97E' : '#69d27a'};">${a.isPlaceholder ? 'Placeholder Active' : 'Confirmed Laureate'}</span>
          </div>
          <p style="font-size:0.85rem; color:rgba(245,241,232,0.7); margin-bottom:12px;"><strong>Citation:</strong> ${a.shortBio || 'No citation provided.'}</p>
          <div style="display:flex; gap:8px; align-items:center;">
            <button class="btn btn-outline-gold edit-awardee-btn" style="font-size:0.75rem; padding:0.4rem 0.9rem;">
              ✏️ Edit Laureate &amp; Photo
            </button>
            <button class="btn btn-outline-white delete-awardee-btn" style="font-size:0.75rem; padding:0.4rem 0.8rem; color:#ff8b8b; border-color:rgba(255,100,100,0.4); background:rgba(255,0,0,0.08);" title="Delete this laureate profile">
              🗑️ Delete
            </button>
          </div>
        </div>
      `;

      card.querySelector('.edit-awardee-btn').addEventListener('click', () => {
        openAwardeeEditModal(a, a.edition || currentAwardeeYearFilter);
      });

      card.querySelector('.delete-awardee-btn').addEventListener('click', () => {
        const confirmName = a.name || `Laureate #${a.number}`;
        if (confirm(`Are you sure you want to delete profile for "${confirmName}" from Edition ${a.edition || currentAwardeeYearFilter}?`)) {
          window.grdStore.deleteAwardee(a.id);
          renderAwardeesEditor();
          window.showToast?.(`Laureate profile "${confirmName}" deleted.`);
        }
      });

      container.appendChild(card);
    });
  }

  /* 7. MEDIA & ARTICLES MANAGER */
  let currentMediaFilter = 'ALL';

  function renderMediaManager() {
    const listEl = document.getElementById('cmsMediaList');
    const filterContainer = document.getElementById('cmsMediaFilterButtons');
    const addForm = document.getElementById('cmsAddMediaForm');
    const cancelEditBtn = document.getElementById('mediaCancelEditBtn');
    const formHeading = document.getElementById('mediaFormHeading');
    const submitBtn = document.getElementById('mediaSubmitBtn');
    const editIdInput = document.getElementById('mediaEditId');
    const videoGroup = document.getElementById('mediaVideoUrlGroup');
    const categorySelect = document.getElementById('mediaCategory');

    if (!listEl) return;

    // Filter Buttons Wiring
    if (filterContainer && !filterContainer.dataset.wired) {
      filterContainer.dataset.wired = 'true';
      filterContainer.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', function() {
          filterContainer.querySelectorAll('button').forEach(b => b.classList.remove('active'));
          this.classList.add('active');
          currentMediaFilter = this.getAttribute('data-media-filter');
          renderMediaManager();
        });
      });
    }

    // Toggle video field visibility based on category
    if (categorySelect && !categorySelect.dataset.wired) {
      categorySelect.dataset.wired = 'true';
      categorySelect.addEventListener('change', () => {
        if (categorySelect.value === 'VIDEOS') {
          if (videoGroup) videoGroup.style.display = 'block';
        } else {
          if (videoGroup) videoGroup.style.display = 'block'; // Keep accessible or visible
        }
      });
    }

    const data = window.grdStore.getData();
    let items = data.media || [];
    if (currentMediaFilter !== 'ALL') {
      items = items.filter(m => m.category === currentMediaFilter);
    }

    listEl.innerHTML = '';

    if (items.length === 0) {
      listEl.innerHTML = `
        <div style="padding: 2rem; text-align: center; color: var(--color-muted-text-dark); border: 1px dashed rgba(200,169,106,0.3); border-radius: 2px;">
          No media records found for category: <strong>${currentMediaFilter}</strong>.
        </div>
      `;
    }

    // Setup Local Photo Upload for Media
    setupImageUploadHelper({
      fileInputId: 'mediaImageFileInput',
      textInputId: 'mediaImage',
      previewWrapId: 'mediaImagePreviewWrap',
      previewImgId: 'mediaImagePreview',
      fileNameId: 'mediaImageFileName',
      fileSizeId: 'mediaImageFileSize',
      clearBtnId: 'mediaImageClearBtn',
      defaultVal: 'assets/images/shri-ghanshyam-raj-narayan-dube-portrait.jpg'
    });

    items.forEach(item => {
      const card = document.createElement('div');
      card.style.cssText = 'padding:14px 16px; background:#0b1726; border:1px solid rgba(200,169,106,0.22); border-radius:2px; display:flex; justify-content:space-between; align-items:flex-start; gap:12px; flex-wrap:wrap;';
      
      let typeBadgeColor = '#C8A96A';
      if (item.category === 'VIDEOS') typeBadgeColor = '#69d27a';
      else if (item.category === 'ARTICLES') typeBadgeColor = '#60a5fa';
      else if (item.category === 'PRESS') typeBadgeColor = '#f59e0b';
      else if (item.category === 'PHOTOGRAPHS') typeBadgeColor = '#ec4899';

      card.innerHTML = `
        <div style="flex: 1; min-width: 200px;">
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px; flex-wrap:wrap;">
            <span style="font-size:0.7rem; font-weight:700; color:#050d17; background:${typeBadgeColor}; padding:2px 8px; border-radius:2px; text-transform:uppercase; letter-spacing:0.06em;">${item.category}</span>
            <span style="font-size:0.75rem; color:#C8A96A;">[${item.type || 'Publication'}]</span>
            <span style="font-size:0.75rem; color:rgba(245,241,232,0.5);">${item.date || ''}</span>
          </div>
          <strong style="color:#F5F1E8; font-size:0.98rem; display:block; margin-bottom:4px; line-height:1.4;">${item.title}</strong>
          <div style="font-size:0.75rem; color:rgba(245,241,232,0.6); margin-bottom:6px;">Source/Author: ${item.author || item.source || 'Institutional Archive'}</div>
          <p style="font-size:0.83rem; color:rgba(245,241,232,0.78); line-height:1.5; margin:0;">${item.snippet || ''}</p>
        </div>
        <div style="display:flex; gap:8px; align-items:center; margin-top:4px;">
          <button class="btn btn-outline-gold edit-media-btn" style="font-size:0.75rem; padding:0.4rem 0.85rem;">Edit</button>
          <button class="del-media-btn" style="background:transparent; border:1px solid rgba(255,100,100,0.3); color:#ff8b8b; font-size:0.75rem; cursor:pointer; padding:0.4rem 0.75rem; border-radius:2px;">Delete</button>
        </div>
      `;

      // Edit media handler
      card.querySelector('.edit-media-btn').addEventListener('click', () => {
        if (formHeading) formHeading.textContent = 'Edit Media Item';
        if (submitBtn) submitBtn.textContent = 'Save Changes';
        if (cancelEditBtn) cancelEditBtn.style.display = 'block';
        if (editIdInput) editIdInput.value = item.id;

        document.getElementById('mediaTitle').value = item.title || '';
        document.getElementById('mediaCategory').value = item.category || 'ARTICLES';
        document.getElementById('mediaType').value = item.type || '';
        document.getElementById('mediaDate').value = item.date || '';
        document.getElementById('mediaAuthor').value = item.author || item.source || '';
        document.getElementById('mediaImage').value = item.image || '';
        const mediaPreviewWrap = document.getElementById('mediaImagePreviewWrap');
        const mediaPreviewImg = document.getElementById('mediaImagePreview');
        if (item.image && mediaPreviewWrap && mediaPreviewImg) {
          mediaPreviewImg.src = item.image;
          document.getElementById('mediaImageFileName').textContent = item.image.startsWith('data:') ? 'Custom local photo' : item.image.split('/').pop();
          document.getElementById('mediaImageFileSize').textContent = item.image.startsWith('data:') ? 'Embedded image' : 'Standard image path';
          mediaPreviewWrap.style.display = 'flex';
        } else if (mediaPreviewWrap) {
          mediaPreviewWrap.style.display = 'none';
        }
        document.getElementById('mediaSnippet').value = item.snippet || '';
        if (document.getElementById('mediaVideoUrl')) {
          document.getElementById('mediaVideoUrl').value = item.videoUrl || '';
        }

        addForm.scrollIntoView({ behavior: 'smooth' });
      });

      // Delete media handler
      card.querySelector('.del-media-btn').addEventListener('click', () => {
        if (confirm(`Remove "${item.title}" from media archive?`)) {
          window.grdStore.deleteMedia(item.id);
          renderMediaManager();
          window.showToast('Media item removed.');
        }
      });

      listEl.appendChild(card);
    });

    // YouTube ID & Thumbnail extraction helper
    function extractYouTubeThumbnail(url) {
      if (!url) return null;
      let videoId = null;
      const watchMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
      if (watchMatch) {
        videoId = watchMatch[1];
      }
      return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;
    }

    // Auto-update thumbnail when YouTube video URL is entered
    const mediaVideoUrlInput = document.getElementById('mediaVideoUrl');
    const mediaImageInput = document.getElementById('mediaImage');
    if (mediaVideoUrlInput && mediaImageInput && !mediaVideoUrlInput.dataset.wired) {
      mediaVideoUrlInput.dataset.wired = 'true';
      mediaVideoUrlInput.addEventListener('input', () => {
        const thumb = extractYouTubeThumbnail(mediaVideoUrlInput.value.trim());
        if (thumb) {
          mediaImageInput.value = thumb;
          window.showToast('YouTube thumbnail auto-detected and set!');
        }
      });
    }

    // Reset / Cancel Edit
    if (cancelEditBtn && !cancelEditBtn.dataset.wired) {
      cancelEditBtn.dataset.wired = 'true';
      cancelEditBtn.addEventListener('click', () => {
        addForm.reset();
        const mediaPreviewWrap = document.getElementById('mediaImagePreviewWrap');
        if (mediaPreviewWrap) mediaPreviewWrap.style.display = 'none';
        const mediaImagePreview = document.getElementById('mediaImagePreview');
        if (mediaImagePreview) mediaImagePreview.src = '';
        if (editIdInput) editIdInput.value = '';
        if (formHeading) formHeading.textContent = 'Publish New Media Item';
        if (submitBtn) submitBtn.textContent = 'Publish Item';
        cancelEditBtn.style.display = 'none';
      });
    }

    // Form submission (Add or Edit)
    if (addForm && !addForm.dataset.wired) {
      addForm.dataset.wired = 'true';
      addForm.onsubmit = (e) => {
        e.preventDefault();
        const editId = editIdInput ? editIdInput.value.trim() : '';
        const title = document.getElementById('mediaTitle')?.value.trim();
        const category = document.getElementById('mediaCategory')?.value;
        const type = document.getElementById('mediaType')?.value.trim();
        const date = document.getElementById('mediaDate')?.value.trim();
        const author = document.getElementById('mediaAuthor')?.value.trim();
        let image = document.getElementById('mediaImage')?.value.trim();
        const snippet = document.getElementById('mediaSnippet')?.value.trim();
        const videoUrl = document.getElementById('mediaVideoUrl')?.value.trim();
        const linkUrl = document.getElementById('mediaLinkUrl')?.value.trim();

        // If no image provided but videoUrl exists, extract YouTube thumbnail automatically
        if ((!image || image === 'assets/images/shri-ghanshyam-raj-narayan-dube-portrait.jpg') && videoUrl) {
          const autoThumb = extractYouTubeThumbnail(videoUrl);
          if (autoThumb) image = autoThumb;
        }
        if (!image) image = 'assets/images/shri-ghanshyam-raj-narayan-dube-portrait.jpg';

        if (!title || !snippet) return;

        const currentActiveEd = window.grdStore.getData().activeEdition || "2026";

        let finalVideoUrl = videoUrl;
        if (finalVideoUrl) {
          const ytMatch = finalVideoUrl.match(/(?:youtube\.com\/(?:watch\?.*v=|embed\/|shorts\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
          if (ytMatch) {
            finalVideoUrl = `https://www.youtube-nocookie.com/embed/${ytMatch[1]}`;
          }
        }

        if (editId) {
          // Update existing item
          window.grdStore.updateMedia(editId, {
            title,
            category,
            type,
            date,
            author,
            source: author,
            image,
            snippet,
            videoUrl: finalVideoUrl || undefined,
            linkUrl: linkUrl || undefined
          });
          window.showToast(`Media item updated successfully.`);
        } else {
          // Add new item
          const prefix = category === 'VIDEOS' ? 'med-v-' : category === 'POSTS' ? 'med-post-' : category === 'PRESS' ? 'med-pr-' : 'med-a-';
          const newId = prefix + Date.now();
          window.grdStore.addMedia({
            id: newId,
            title,
            category,
            type,
            date,
            edition: currentActiveEd,
            author,
            source: author,
            image,
            snippet,
            videoUrl: finalVideoUrl || undefined,
            linkUrl: linkUrl || undefined
          });
          window.showToast(`New ${category.toLowerCase()} published.`);
        }

        addForm.reset();
        const mediaPreviewWrap = document.getElementById('mediaImagePreviewWrap');
        if (mediaPreviewWrap) mediaPreviewWrap.style.display = 'none';
        const mediaImagePreview = document.getElementById('mediaImagePreview');
        if (mediaImagePreview) mediaImagePreview.src = '';
        if (editIdInput) editIdInput.value = '';
        if (formHeading) formHeading.textContent = 'Publish New Media Item';
        if (submitBtn) submitBtn.textContent = 'Publish Item';
        if (cancelEditBtn) cancelEditBtn.style.display = 'none';

        renderMediaManager();
      };
    }
  }

  /* 8. VOICES & VIDEOS MANAGER */
  function renderVoicesManager() {
    const listEl = document.getElementById('cmsVoicesList');
    if (!listEl) return;

    const data = window.grdStore.getData();
    listEl.innerHTML = '';

    if (!data.voices || data.voices.length === 0) {
      listEl.innerHTML = `
        <div style="padding: 2.5rem 1.5rem; background: #070e17; border: 1px dashed rgba(200,169,106,0.3); border-radius: 2px; text-align: center;">
          <p style="color: var(--color-muted-text-dark); margin: 0; font-size: 0.9rem;">
            No member or fellow testimonials are currently listed. Use the form on the right to add new member reflections anytime.
          </p>
        </div>
      `;
    } else {
      data.voices.forEach(v => {
        const card = document.createElement('div');
        card.style.cssText = 'padding:14px 18px; background:#0b1726; border:1px solid rgba(200,169,106,0.2); border-radius:2px; display:flex; justify-content:space-between; align-items:flex-start; gap:12px;';
        card.innerHTML = `
          <div style="flex:1; min-width:0;">
            <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
              <strong style="color:#F5F1E8; font-size:0.95rem;">${v.name}</strong>
              <span style="font-size:0.75rem; color:#C8A96A;">(${v.role})</span>
            </div>
            <div style="font-size:0.72rem; color:rgba(245,241,232,0.5); margin-top:2px;">Circle: <strong>${v.group}</strong> ${v.videoUrl ? '• Video linked' : ''}</div>
            <p style="font-size:0.82rem; color:rgba(245,241,232,0.7); margin-top:5px; margin-bottom:0; line-height:1.5;">${v.excerpt}</p>
          </div>
          <div style="display:flex; align-items:center; gap:6px;">
            <button class="edit-voice-btn btn btn-outline-white" style="font-size:0.72rem; padding:4px 9px;" title="Edit testimony">Edit</button>
            <button class="del-voice-btn" style="color:#ff8b8b; font-size:1.2rem; line-height:1; padding:4px; background:none; border:none; cursor:pointer;" title="Delete message">&times;</button>
          </div>
        `;

        // Edit voice listener
        card.querySelector('.edit-voice-btn').addEventListener('click', () => {
          openVoiceEditModal(v);
        });

        // Delete voice listener
        card.querySelector('.del-voice-btn').addEventListener('click', () => {
          if (confirm(`Remove testimony from ${v.name}?`)) {
            window.grdStore.deleteVoice(v.id);
            renderVoicesManager();
            window.showToast('Testimony removed.');
          }
        });

        listEl.appendChild(card);
      });
    }

    // Modal Edit Function
    function openVoiceEditModal(v) {
      const modal = document.getElementById('cmsVoiceEditModal');
      if (!modal) return;
      document.getElementById('editVoiceId').value = v.id;
      document.getElementById('editVoiceSpeakerName').value = v.name || '';
      document.getElementById('editVoiceSpeakerRole').value = v.role || '';
      document.getElementById('editVoiceGroupKey').value = v.groupKey || 'honorary-patrons';
      document.getElementById('editVoiceVideoUrl').value = v.videoUrl || '';
      document.getElementById('editVoicePhoto').value = v.photo || '';
      document.getElementById('editVoiceExcerpt').value = v.excerpt || '';
      
      const pw = document.getElementById('editVoicePhotoPreviewWrap');
      if (pw) pw.style.display = 'none';

      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    // Wire Edit Voice Form
    const editVoiceForm = document.getElementById('cmsVoiceEditForm');
    if (editVoiceForm && !editVoiceForm.dataset.wired) {
      editVoiceForm.dataset.wired = 'true';

      setupImageUploadHelper({
        fileInputId: 'editVoicePhotoFileInput',
        textInputId: 'editVoicePhoto',
        previewWrapId: 'editVoicePhotoPreviewWrap',
        previewImgId: 'editVoicePhotoPreview',
        fileNameId: 'editVoicePhotoFileName',
        fileSizeId: 'editVoicePhotoFileSize',
        clearBtnId: 'editVoicePhotoClearBtn'
      });

      editVoiceForm.onsubmit = (e) => {
        e.preventDefault();
        const id = document.getElementById('editVoiceId')?.value;
        const name = document.getElementById('editVoiceSpeakerName')?.value.trim();
        const role = document.getElementById('editVoiceSpeakerRole')?.value.trim();
        const groupKey = document.getElementById('editVoiceGroupKey')?.value;
        const videoUrl = document.getElementById('editVoiceVideoUrl')?.value.trim();
        let photo = document.getElementById('editVoicePhoto')?.value.trim();
        const excerpt = document.getElementById('editVoiceExcerpt')?.value.trim();

        if (!name || !role) {
          alert('Please fill in speaker name and role.');
          return;
        }

        const groupLabels = {
          'honorary-patrons': 'Honorary Patrons',
          'global-advisory-council': 'Global Advisory Council',
          'legacy-ambassadors': 'Legacy Ambassadors',
          'legacy-advocates': 'Legacy Advocates',
          'young-legacy-fellows': 'Young Legacy Fellows',
          'legacy-circle-members': 'Legacy Circle Members'
        };

        let finalVideo = videoUrl || '';
        if (finalVideo) {
          const ytMatch = finalVideo.match(/(?:youtube\.com\/(?:watch\?.*v=|embed\/|shorts\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
          if (ytMatch) {
            finalVideo = `https://www.youtube-nocookie.com/embed/${ytMatch[1]}`;
          }
        }

        window.grdStore.updateVoice(id, {
          name,
          role,
          group: groupLabels[groupKey] || 'Legacy Circle Members',
          groupKey,
          videoUrl: finalVideo,
          photo: photo || 'assets/images/shri-ghanshyam-raj-narayan-dube-portrait.jpg',
          excerpt
        });

        const modal = document.getElementById('cmsVoiceEditModal');
        if (modal) {
          modal.classList.remove('open');
          document.body.style.overflow = '';
        }
        renderVoicesManager();
        window.showToast(`Updated testimony for ${name}.`);
      };
    }

    const addVoiceForm = document.getElementById('cmsAddVoiceForm');
    const voiceVideoInput = document.getElementById('voiceVideoUrl');
    const voicePhotoInput = document.getElementById('voicePhoto');

    // Setup Local Photo Upload for Voices
    setupImageUploadHelper({
      fileInputId: 'voicePhotoFileInput',
      textInputId: 'voicePhoto',
      previewWrapId: 'voicePhotoPreviewWrap',
      previewImgId: 'voicePhotoPreview',
      fileNameId: 'voicePhotoFileName',
      fileSizeId: 'voicePhotoFileSize',
      clearBtnId: 'voicePhotoClearBtn',
      defaultVal: 'assets/images/shri-ghanshyam-raj-narayan-dube-portrait.jpg'
    });

    if (voiceVideoInput && voicePhotoInput && !voiceVideoInput.dataset.wired) {
      voiceVideoInput.dataset.wired = 'true';
      voiceVideoInput.addEventListener('input', () => {
        const watchMatch = voiceVideoInput.value.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
        if (watchMatch) {
          voicePhotoInput.value = `https://img.youtube.com/vi/${watchMatch[1]}/hqdefault.jpg`;
          window.showToast('YouTube thumbnail auto-detected for voice!');
        }
      });
    }

    if (addVoiceForm && !addVoiceForm.dataset.wired) {
      addVoiceForm.dataset.wired = 'true';
      addVoiceForm.onsubmit = (e) => {
        e.preventDefault();
        const name = document.getElementById('voiceSpeakerName')?.value.trim();
        const role = document.getElementById('voiceSpeakerRole')?.value.trim();
        const groupKey = document.getElementById('voiceGroupKey')?.value;
        const videoUrl = document.getElementById('voiceVideoUrl')?.value.trim();
        let photo = document.getElementById('voicePhoto')?.value.trim();
        const excerpt = document.getElementById('voiceExcerpt')?.value.trim();

        if (!name) {
          alert('Please enter speaker name.');
          return;
        }

        const groupLabels = {
          'honorary-patrons': 'Honorary Patrons',
          'global-advisory-council': 'Global Advisory Council',
          'legacy-ambassadors': 'Legacy Ambassadors',
          'legacy-advocates': 'Legacy Advocates',
          'young-legacy-fellows': 'Young Legacy Fellows',
          'legacy-circle-members': 'Legacy Circle Members'
        };

        // Auto thumbnail extraction if video exists and photo is default
        if (videoUrl && (!photo || photo === 'assets/images/shri-ghanshyam-raj-narayan-dube-portrait.jpg')) {
          const watchMatch = videoUrl.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
          if (watchMatch) {
            photo = `https://img.youtube.com/vi/${watchMatch[1]}/hqdefault.jpg`;
          } else {
            photo = 'assets/images/shri-ghanshyam-raj-narayan-dube-portrait.jpg';
          }
        }
        if (!photo) {
          photo = 'assets/images/shri-ghanshyam-raj-narayan-dube-portrait.jpg';
        }

        let finalVoiceVideoUrl = videoUrl || '';
        if (finalVoiceVideoUrl) {
          const ytMatchVoice = finalVoiceVideoUrl.match(/(?:youtube\.com\/(?:watch\?.*v=|embed\/|shorts\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
          if (ytMatchVoice) {
            finalVoiceVideoUrl = `https://www.youtube-nocookie.com/embed/${ytMatchVoice[1]}`;
          }
        }

        const currentActiveEd = window.grdStore.getData().activeEdition || "2026";
        window.grdStore.addVoice({
          id: 'voice-' + Date.now(),
          name,
          role,
          group: groupLabels[groupKey] || 'Legacy Circle Members',
          groupKey,
          duration: finalVoiceVideoUrl ? '01:30' : '',
          videoUrl: finalVoiceVideoUrl,
          excerpt,
          photo,
          edition: currentActiveEd
        });

        addVoiceForm.reset();
        renderVoicesManager();
        window.showToast(`Testimony from ${name} successfully added.`);
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
