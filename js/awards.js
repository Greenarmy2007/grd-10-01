/**
 * GRD10 — SHRI GHANSHYAM DUBE ACHIEVER AWARDS
 * Interactive Renderers for Categories, Voices & Media
 */

document.addEventListener('DOMContentLoaded', () => {
  initEditionSwitcher();
  renderDynamicVoices();
  renderDynamicMedia();

  // Listen for real-time changes made in Admin Panel (across tabs or within same window)
  window.addEventListener('storage', (e) => {
    if (e.key === window.grdStore?.STORAGE_KEY || !e.key) {
      const storeData = window.grdStore.getData();
      currentBrowsingEdition = storeData.activeEdition || '2026';
      if (typeof updateEditionView === 'function') {
        const ed = storeData.editions.find(x => x.year === currentBrowsingEdition) || storeData.editions[0];
        updateEditionView(ed);
      }
      renderDynamicVoices();
      renderDynamicMedia();
    }
  });

  window.addEventListener('grd10:datachanged', () => {
    const storeData = window.grdStore.getData();
    currentBrowsingEdition = storeData.activeEdition || '2026';
    if (typeof updateEditionView === 'function') {
      const ed = storeData.editions.find(x => x.year === currentBrowsingEdition) || storeData.editions[0];
      updateEditionView(ed);
    }
    renderDynamicVoices();
    renderDynamicMedia();
  });

  try {
    if (typeof BroadcastChannel !== 'undefined') {
      const bc = new BroadcastChannel('grd10_sync_channel');
      bc.onmessage = () => {
        const storeData = window.grdStore.getData();
        currentBrowsingEdition = storeData.activeEdition || '2026';
        if (typeof updateEditionView === 'function') {
          const ed = storeData.editions.find(x => x.year === currentBrowsingEdition) || storeData.editions[0];
          updateEditionView(ed);
        }
        renderDynamicVoices();
        renderDynamicMedia();
      };
    }
  } catch (err) {}
});

// Currently selected edition state for awards browsing
let currentBrowsingEdition = null;

function initEditionSwitcher() {
  if (!window.grdStore) return;
  const storeData = window.grdStore.getData();
  currentBrowsingEdition = storeData.activeEdition || '2026';

  const switcher = document.getElementById('awardsEditionSwitcher');
  if (switcher) {
    const editions = window.grdStore.getEditions();
    switcher.innerHTML = '';

    editions.forEach(ed => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `btn-edition-pill ${ed.year === currentBrowsingEdition ? 'active' : ''}`;
      btn.setAttribute('data-year', ed.year);
      
      let label = `Edition ${ed.year}`;
      if (ed.year === '2026' && ed.status === 'Conferred Archive') label = `2026 (Conferred Archive)`;
      else if (ed.year === '2026') label = `Edition 2026 (Inaugural)`;
      else if (ed.year === '2027') label = `2027 (Upcoming)`;

      btn.textContent = label;

      btn.addEventListener('click', () => {
        switcher.querySelectorAll('.btn-edition-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentBrowsingEdition = ed.year;
        updateEditionView(ed);
      });

      switcher.appendChild(btn);
    });
  }

  // Initial render
  const initialEd = storeData.editions.find(e => e.year === currentBrowsingEdition) || storeData.editions[0];
  updateEditionView(initialEd);
}

function updateEditionView(editionObj) {
  const year = editionObj.year;

  // Update Year in headings & labels
  const yearHeader = document.getElementById('displaySelectedEditionYear');
  if (yearHeader) yearHeader.textContent = year;

  document.querySelectorAll('.current-selected-year').forEach(el => {
    el.textContent = year;
  });

  // Dynamic Browser Tab / Page Title update
  if (document.title) {
    document.title = document.title.replace(/\b202\d\b/g, year);
  }

  // Dynamic Navigation Links ("Awards 2026", "Awards 2028")
  document.querySelectorAll('a.nav-link, a.footer-link, a.btn').forEach(link => {
    const href = (link.getAttribute('href') || '').toLowerCase();
    if (href.includes('awards.html')) {
      const text = link.textContent.trim();
      if (/awards\s*202\d/i.test(text)) {
        link.textContent = text.replace(/202\d/g, year);
      } else if (/पुरस्कार\s*(?:202\d|२०२\d)/i.test(text)) {
        link.textContent = text.replace(/(?:202\d|२०२\d)/g, year);
      }
    }
  });

  const statusBadge = document.getElementById('displayEditionStatusBadge');
  if (statusBadge) statusBadge.textContent = editionObj.status || 'Active';

  // Subtitles context
  const laureatesTitle = document.getElementById('laureatesSectionTitle');
  const laureatesSub = document.getElementById('laureatesSectionSubtitle');
  const laureatesEyebrow = document.getElementById('laureatesSectionEyebrow');
  const catReservedBox = document.getElementById('categoryReservedBox');

  if (editionObj.status === 'Conferred Archive') {
    if (laureatesTitle) laureatesTitle.textContent = `The 10 — ${year} Conferred Laureates`;
    if (laureatesSub) laureatesSub.textContent = `Explore the inaugural archive of quiet human excellence and grassroots achievers honored in the retrospective ${year} honorary circle.`;
    if (laureatesEyebrow) laureatesEyebrow.textContent = `Historical Conferred Archive`;
    if (catReservedBox) catReservedBox.style.display = 'none';
  } else if (year === '2026') {
    if (laureatesTitle) laureatesTitle.textContent = `The 10 — Laureate Registry (2026)`;
    if (laureatesSub) laureatesSub.textContent = `Profiles of the 2026 Achievers will be officially unveiled following the conclusion of jury deliberations on 10 November 2026 in Mumbai.`;
    if (laureatesEyebrow) laureatesEyebrow.textContent = `The Registry of Laureates`;
    if (catReservedBox) catReservedBox.style.display = 'none';
  } else if (year === '2027') {
    if (laureatesTitle) laureatesTitle.textContent = `The 10 — Laureate Registry (2027)`;
    if (laureatesSub) laureatesSub.textContent = `Profiles of the 2027 Achievers will be officially unveiled following the conclusion of jury deliberations on 10 November 2027 in Mumbai.`;
    if (laureatesEyebrow) laureatesEyebrow.textContent = `The Registry of Laureates`;
    if (catReservedBox) catReservedBox.style.display = 'none';
  } else {
    if (laureatesTitle) laureatesTitle.textContent = `The 10 — Laureate Registry (${year})`;
    if (laureatesSub) laureatesSub.textContent = `Nominations and selection for Edition ${year} will open according to the national calendar.`;
    if (laureatesEyebrow) laureatesEyebrow.textContent = `Future Edition Convocation`;
    if (catReservedBox) catReservedBox.style.display = 'none';
  }

  renderDynamicCategories(year);
  renderDynamicAwardees(year);
  renderDynamicShortlisted(year);
}

/* 1. RENDER APPROVED CATEGORIES */
function renderDynamicCategories(editionYear = null) {
  const container = document.getElementById('categoriesGridContainer');
  if (!container || !window.grdStore) return;

  const activeEd = window.grdStore.getData().activeEdition || "2026";
  const targetEd = editionYear || currentBrowsingEdition || activeEd;
  let categories = window.grdStore.getCategories(targetEd);
  
  // Fallback to active categories if future/past edition hasn't custom defined categories yet
  if (categories.length === 0) {
    categories = window.grdStore.getCategories(activeEd) || window.grdStore.getCategories("2026");
  }

  container.innerHTML = '';

  categories.forEach(cat => {
    const card = document.createElement('div');
    card.className = 'category-card';
    card.innerHTML = `
      <div class="category-header">
        <div class="category-number">${cat.number}</div>
        <h3 class="category-name">${cat.name}</h3>
      </div>
      <p class="category-desc">${cat.description}</p>
      <div class="category-footer">
        <a href="nominate.html?category=${encodeURIComponent(cat.name)}" class="link-editorial">
          Nominate
        </a>
        <span class="badge-gold">Edition ${targetEd}</span>
      </div>
    `;
    container.appendChild(card);
  });
}

/* 2. RENDER VOICES OF THE LEGACY WITH FILTERING */
function renderDynamicVoices() {
  const container = document.getElementById('voicesGridContainer');
  const homeContainer = document.getElementById('homeVoicesContainer');
  const tabsContainer = document.getElementById('voicesTabsContainer');
  if (!window.grdStore) return;

  // 1. Populate voices.html grid if present
  if (container) {
    const renderList = (filterKey) => {
      const voices = window.grdStore.getVoices(null, filterKey);
      container.innerHTML = '';

      if (voices.length === 0) {
        container.innerHTML = `
          <div style="grid-column: 1 / -1; padding: 3rem; background: var(--color-deep-navy); border: 1px dashed rgba(200,169,106,0.3); border-radius: 2px; text-align: center;">
            <p style="color: var(--color-muted-text-dark); max-width: 500px; margin: 0 auto; font-size: 0.95rem;">
              No circle reflections published at this time. New recorded messages from fellows and patrons will be archived here.
            </p>
          </div>
        `;
        return;
      }

      voices.forEach(voice => {
        const hasVideo = !!(voice.videoUrl && voice.videoUrl.trim());
        const card = document.createElement('div');
        card.className = 'voice-card';
        card.innerHTML = `
          <div class="voice-thumb-wrap" ${hasVideo ? `onclick="openVideoModal('${voice.videoUrl}', '${voice.name.replace(/'/g, "\\'")}', '${voice.role.replace(/'/g, "\\'")}')" style="cursor:pointer;"` : ''}>
            <img src="${voice.photo}" alt="${voice.name}" loading="lazy">
            ${hasVideo ? `
            <div class="voice-play-badge" aria-label="Play Video Message">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            </div>
            <span class="voice-duration-badge">${voice.duration}</span>` : ''}
          </div>
          <div class="voice-card-body">
            <h4 class="voice-speaker-name">${voice.name}</h4>
            <div class="voice-speaker-role">${voice.role}</div>
            <p class="voice-excerpt">${voice.excerpt}</p>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:auto; padding-top:0.75rem;">
              <div class="voice-group-tag">${voice.group}</div>
              ${hasVideo ? `<span class="link-editorial" style="font-size:0.75rem; cursor:pointer;" onclick="openVideoModal('${voice.videoUrl || ''}', '${voice.name.replace(/'/g, "\\'")}', '${voice.role.replace(/'/g, "\\'")}')">Watch Video</span>` : `<span style="font-size:0.75rem; color:var(--color-champagne-gold); letter-spacing:0.08em; text-transform:uppercase;">Fellow Testimony</span>`}
            </div>
          </div>
        `;
        container.appendChild(card);
      });
    };

    // Initial render
    renderList('all');

    // Tab click listeners
    if (tabsContainer) {
      tabsContainer.querySelectorAll('.voice-tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
          tabsContainer.querySelectorAll('.voice-tab-btn').forEach(b => b.classList.remove('active'));
          this.classList.add('active');
          const key = this.getAttribute('data-group');
          renderList(key);
        });
      });
    }
  }

  // 2. Populate index.html landing page container if present
  if (homeContainer) {
    const allVoices = window.grdStore.getVoices(null, 'all');
    homeContainer.innerHTML = '';

    if (allVoices.length === 0) {
      homeContainer.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 2.5rem 1.5rem; background: var(--color-midnight-navy); border: 1px dashed rgba(200,169,106,0.3); border-radius: 4px; text-align: center;">
          <p style="color: var(--color-muted-text-dark); max-width: 580px; margin: 0 auto; font-size: 0.95rem; line-height: 1.6;">
            Recorded fellowship reflections are currently being archived. Direct testimonials from foundation patrons and GRD Circle fellows will appear here following institutional review.
          </p>
        </div>
      `;
    } else {
      // Show up to the first 2 real voices
      allVoices.slice(0, 2).forEach(voice => {
        const hasVideo = !!(voice.videoUrl && voice.videoUrl.trim());
        const card = document.createElement('div');
        card.className = 'voice-card';
        card.style.cssText = 'background: var(--color-midnight-navy); border: 1px solid var(--color-champagne-gold);';
        card.innerHTML = `
          <div class="voice-thumb-wrap" ${hasVideo ? `onclick="openVideoModal('${voice.videoUrl || ''}', '${voice.name.replace(/'/g, "\\'")}', '${voice.role.replace(/'/g, "\\'")}')" style="cursor:pointer;"` : ''}>
            <img src="${voice.photo}" alt="${voice.name}" loading="lazy">
            ${hasVideo ? `
            <div class="voice-play-badge" aria-label="Play Introduction Video">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            </div>
            <span class="voice-duration-badge">${voice.duration}</span>` : ''}
          </div>
          <div class="voice-card-body">
            <span class="badge-gold" style="margin-bottom:0.5rem;">${voice.group || 'Fellow Reflection'}</span>
            <h4 class="voice-speaker-name" style="font-size:1.2rem;">${voice.name}</h4>
            <div class="voice-speaker-role" style="color:var(--color-champagne-gold);">${voice.role}</div>
            <p class="voice-excerpt" style="font-size:0.9rem; line-height:1.6;">${voice.excerpt}</p>
            ${hasVideo ? `
            <button onclick="openVideoModal('${voice.videoUrl || ''}', '${voice.name.replace(/'/g, "\\'")}', '${voice.role.replace(/'/g, "\\'")}')" class="btn btn-outline-gold" style="margin-top:auto; font-size:0.8rem; padding:0.6rem 1.2rem;">
              Watch Video
            </button>` : `
            <a href="voices.html" class="btn btn-outline-gold" style="margin-top:auto; font-size:0.8rem; padding:0.6rem 1.2rem;">
              Read Fellowship Reflection
            </a>`}
          </div>
        `;
        homeContainer.appendChild(card);
      });
    }
  }
}

/* 3. RENDER AWARDEES ARCHITECTURE ("THE 10") WITH MULTI-YEAR SUPPORT */
function renderDynamicAwardees(editionYear = null) {
  const container = document.getElementById('awardeesGridContainer');
  if (!container || !window.grdStore) return;

  const activeEd = window.grdStore.getData().activeEdition || "2026";
  const targetEd = editionYear || currentBrowsingEdition || activeEd;
  const awardees = window.grdStore.getAwardees(targetEd);
  container.innerHTML = '';

  if (awardees.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; padding: 3rem; background: var(--color-deep-navy); border: 1px dashed rgba(200,169,106,0.3); border-radius: 2px; text-align: center;">
        <h3 style="font-family: var(--font-heading); color: var(--color-ivory); margin-bottom: 0.5rem;">
          Edition ${targetEd} Laureates Registry
        </h3>
        <p style="color: var(--color-muted-text-dark); max-width: 600px; margin: 0 auto 1.5rem; font-size: 0.95rem;">
          Dossiers for Edition ${targetEd} will be ratified and presented here upon completion of the jury convocation.
        </p>
        <a href="nominate.html" class="btn btn-gold">Submit Nomination for ${targetEd}</a>
      </div>
    `;
    return;
  }

  awardees.forEach(awardee => {
    const card = document.createElement('div');
    card.className = 'awardee-card';
    card.onclick = () => window.openAwardeeModal(awardee.id);
    card.innerHTML = `
      <div class="awardee-photo-wrap">
        <img src="${awardee.photo}" alt="${awardee.name}" loading="lazy">
        <span class="awardee-num-tag">${awardee.number}</span>
      </div>
      <div class="awardee-card-body">
        <div class="awardee-category-title">${awardee.categoryName} • Edition ${awardee.edition || targetEd}</div>
        <h4 class="awardee-name">${awardee.name}</h4>
        <p class="awardee-short-bio">${awardee.shortBio}</p>
        <span class="link-editorial" style="margin-top:auto;">View Full Dossier</span>
      </div>
    `;
    container.appendChild(card);
  });
}

/* 3B. RENDER SHORTLISTED NOMINEES FOR AWARDS */
async function renderDynamicShortlisted(editionYear = null) {
  const container = document.getElementById('shortlistedGridContainer');
  const section = document.getElementById('shortlistedNomineesSection');
  if (!container || !window.grdStore) return;

  const targetEd = editionYear || currentBrowsingEdition || "2026";
  
  // Only display shortlisted for the active/current edition (2026)
  if (targetEd !== '2026') {
    if (section) section.style.display = 'none';
    return;
  }

  let shortlisted = [];
  try {
    shortlisted = await window.grdStore.getShortlistedNominations();
  } catch (err) {
    console.warn('Error fetching shortlisted nominations:', err);
  }

  if (section) section.style.display = 'block';
  container.innerHTML = '';

  if (shortlisted.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; padding: 2.5rem 2rem; background: var(--color-deep-navy); border: 1px dashed rgba(200,169,106,0.3); border-radius: 2px; text-align: center;">
        <h4 style="font-family: var(--font-heading); color: var(--color-champagne-gold); font-size: 1.2rem; margin-bottom: 0.5rem;">
          Jury Deliberations in Progress
        </h4>
        <p style="color: var(--color-muted-text-dark); max-width: 580px; margin: 0 auto; font-size: 0.9rem; line-height: 1.6;">
          Candidates officially shortlisted by the Selection Committee will appear here as jury adjudications conclude.
        </p>
      </div>
    `;
    return;
  }

  shortlisted.forEach((nom, index) => {
    const card = document.createElement('div');
    card.className = 'awardee-card';
    card.style.borderColor = 'rgba(228, 201, 126, 0.4)';

    const defaultImg = 'assets/images/shri-ghanshyam-raj-narayan-dube-portrait.jpg';
    const photoSrc = nom.photo || defaultImg;
    const shortReason = nom.reason ? (nom.reason.slice(0, 150) + (nom.reason.length > 150 ? '...' : '')) : 'Dossier shortlisted by jury panel.';

    card.innerHTML = `
      <div class="awardee-photo-wrap">
        <img src="${photoSrc}" alt="${nom.nomineeName}" loading="lazy">
        <span class="awardee-num-tag" style="background:#E4C97E; color:#0B1726; font-size:0.75rem; letter-spacing:0.05em; padding: 2px 8px; border-radius: 2px;">
          ★ SHORTLISTED
        </span>
      </div>
      <div class="awardee-card-body">
        <div class="awardee-category-title" style="color: #E4C97E;">
          ${nom.category || 'Special Recommendation'} • ${nom.cityState || 'India'}
        </div>
        <h4 class="awardee-name">${nom.nomineeName}</h4>
        <p class="awardee-short-bio">${shortReason}</p>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:auto; padding-top:0.75rem; border-top:1px solid rgba(200,169,106,0.15);">
          <span style="font-size:0.75rem; color:var(--color-champagne-gold); font-weight:600;">
            Ref: ${nom.referenceId || 'NOM-2026'}
          </span>
          <span class="link-editorial" style="font-size:0.8rem;">View Dossier</span>
        </div>
      </div>
    `;

    card.onclick = () => {
      // Open awardee modal with candidate profile
      const modal = document.getElementById('awardeeModal');
      if (!modal) return;

      const nameEl = modal.querySelector('.modal-awardee-name');
      const catEl = modal.querySelector('.modal-awardee-category');
      const numEl = modal.querySelector('.modal-awardee-num');
      const storyEl = modal.querySelector('.modal-awardee-story');
      const contribEl = modal.querySelector('.modal-awardee-contribution');
      const reasonEl = modal.querySelector('.modal-awardee-reason');
      const notesEl = modal.querySelector('.modal-awardee-notes');
      const imgEl = modal.querySelector('.modal-awardee-img');

      if (nameEl) nameEl.textContent = nom.nomineeName;
      if (catEl) catEl.textContent = `${nom.category || 'Category'} (Officially Shortlisted Candidate)`;
      if (numEl) numEl.textContent = '★';
      if (storyEl) storyEl.textContent = nom.reason || 'Nomination narrative currently preserved in confidential jury archive.';
      if (contribEl) contribEl.textContent = nom.keyContribution || 'Selfless grassroots contribution in ' + (nom.cityState || 'India') + '.';
      if (reasonEl) reasonEl.textContent = `Shortlisted by the Jury Committee. Organisation: ${nom.organisation || 'Independent'} • Region: ${nom.cityState || 'India'}.`;
      if (notesEl) notesEl.textContent = `Candidate Dossier Reference: ${nom.referenceId || 'N/A'}. Under final review for the 2026 National Awards.`;
      if (imgEl) imgEl.src = photoSrc;

      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    };

    container.appendChild(card);
  });
}

/* 4. RENDER MEDIA & ARCHIVE */
function renderDynamicMedia() {
  if (!window.grdStore) return;
  const storeData = window.grdStore.getData();
  const allMedia = storeData.media || [];

  // 1. Generic media grid (if present on other pages)
  const container = document.getElementById('mediaGridContainer');
  const tabsContainer = document.getElementById('mediaTabsContainer');
  if (container) {
    const renderMediaList = (catFilter) => {
      const items = window.grdStore.getMedia(null, catFilter);
      container.innerHTML = '';
      items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'media-card';
        const safeTitle = (item.title || '').replace(/'/g, "\\'");
        const safeAuthor = (item.author || item.source || '').replace(/'/g, "\\'");
        const isVideo = item.category === 'VIDEOS' || !!item.videoUrl;
        const clickAction = isVideo 
          ? `openVideoModal('${item.videoUrl || ''}', '${safeTitle}', '${safeAuthor}')`
          : (item.linkUrl 
              ? `window.open('${item.linkUrl}', '_blank')`
              : (item.category === 'PHOTOGRAPHS' 
                  ? `openPhotoModal('${item.image}', '${safeTitle}', '${(item.snippet || '').replace(/'/g, "\\'")}')`
                  : `alert('Media Item: ' + ${JSON.stringify(item.title)} + '\\n\\n' + ${JSON.stringify(item.snippet)})`));

        card.innerHTML = `
          <div class="media-thumb" style="cursor: pointer;" onclick="${clickAction}">
            <img src="${item.image}" alt="${item.title}" loading="lazy">
            <span class="media-type-tag">${item.category}</span>
            ${isVideo ? `<div class="voice-play-badge" style="width:42px; height:42px;"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg></div>` : ''}
          </div>
          <div class="media-content">
            <div class="media-date">${item.date || ''}</div>
            <h4 class="media-title" style="cursor: pointer;" onclick="${clickAction}">${item.title}</h4>
            <p class="media-snippet">${item.snippet || ''}</p>
            <span class="link-editorial" style="margin-top:1rem; cursor: pointer;" onclick="${clickAction}">
              ${isVideo ? 'Watch Video' : (item.linkUrl ? 'Visit Link' : 'Access Record')}
            </span>
          </div>
        `;
        container.appendChild(card);
      });
    };
    renderMediaList('ALL');

    if (tabsContainer) {
      tabsContainer.querySelectorAll('.media-tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
          tabsContainer.querySelectorAll('.media-tab-btn').forEach(b => b.classList.remove('active'));
          this.classList.add('active');
          const filter = this.getAttribute('data-cat');
          renderMediaList(filter);
        });
      });
    }
  }

  // 2. Videos Section on media.html
  const videosContainer = document.getElementById('mediaVideosContainer');
  const allVideosSection = document.getElementById('allVideosSection');
  if (videosContainer) {
    const videos = allMedia.filter(m => m.category === 'VIDEOS');
    videosContainer.innerHTML = '';
    if (videos.length === 0) {
      if (allVideosSection) {
        allVideosSection.style.display = 'none';
      }
    } else {
      if (allVideosSection) {
        allVideosSection.style.display = 'block';
      }
      videos.forEach(v => {
        const card = document.createElement('div');
        card.className = 'voice-card';
        const safeTitle = (v.title || '').replace(/'/g, "\\'");
        const safeType = (v.type || 'Video').replace(/'/g, "\\'");
        card.innerHTML = `
          <div class="voice-thumb-wrap" onclick="openVideoModal('${v.videoUrl || ''}', '${safeTitle}', '${safeType}')">
            <img src="${v.image || 'assets/images/shri-ghanshyam-raj-narayan-dube-portrait.jpg'}" alt="${v.title}" loading="lazy">
            <div class="voice-play-badge">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            </div>
            <span class="voice-duration-badge">${v.duration || '02:30'}</span>
          </div>
          <div class="voice-card-body">
            <span class="media-type-tag" style="position:static; margin-bottom:0.5rem; display:inline-block;">${v.type || 'Official Video'}</span>
            <h4 class="voice-speaker-name" style="font-size:1.15rem;">${v.title}</h4>
            <p class="voice-excerpt">${v.snippet || ''}</p>
            <span class="link-editorial" style="margin-top:auto; font-size:0.8rem; cursor:pointer;" onclick="openVideoModal('${v.videoUrl || ''}', '${safeTitle}', '${safeType}')">Watch Video</span>
          </div>
        `;
        videosContainer.appendChild(card);
      });
    }
  }

  // 3. Photo Libraries Section on media.html
  const photosContainer = document.getElementById('mediaPhotosContainer');
  if (photosContainer) {
    const photos = allMedia.filter(m => m.category === 'PHOTOGRAPHS');
    photosContainer.innerHTML = '';
    photos.forEach(p => {
      const card = document.createElement('div');
      card.className = 'photo-library-card';
      const safeTitle = (p.title || '').replace(/'/g, "\\'");
      const safeSnippet = (p.snippet || '').replace(/'/g, "\\'");
      const safeImg = (p.image || 'assets/images/shri-ghanshyam-raj-narayan-dube-portrait.jpg');
      card.innerHTML = `
        <div class="media-thumb" style="aspect-ratio: 16/11; cursor: pointer;" onclick="openPhotoModal('${safeImg}', '${safeTitle}', '${safeSnippet}')">
          <img src="${safeImg}" alt="${p.title}" loading="lazy" style="object-position: top center;">
          <span class="media-type-tag">${p.type || 'Photo Library'}</span>
          <div class="photo-count-pill">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            ${p.photoCount ? p.photoCount + ' Photos' : 'Archival Plate'}
          </div>
        </div>
        <div class="media-content">
          <div class="media-date">${p.date || 'Archival Library'}</div>
          <h3 class="media-title">${p.title}</h3>
          <p class="media-snippet">${p.snippet || ''}</p>
          <button onclick="openPhotoModal('${safeImg}', '${safeTitle}', '${safeSnippet}')" class="link-editorial" style="margin-top:1rem; text-align:left; background:transparent; border:none; padding:0; cursor:pointer;">
            View High-Res Photo
          </button>
        </div>
      `;
      photosContainer.appendChild(card);
    });
  }

  // 4. Articles Section on media.html
  const articlesContainer = document.getElementById('mediaArticlesContainer');
  if (articlesContainer) {
    const articles = allMedia.filter(m => m.category === 'ARTICLES');
    articlesContainer.innerHTML = '';
    articles.forEach(a => {
      const articleEl = document.createElement('article');
      articleEl.className = 'article-item-card';
      const readAction = a.linkUrl ? `window.open('${a.linkUrl}', '_blank')` : `alert('Article: ' + ${JSON.stringify(a.title)} + '\\n\\n' + ${JSON.stringify(a.snippet)})`;
      articleEl.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 0.75rem;">
          <span class="badge-gold">${a.type || 'Editorial'}</span>
          <span style="font-size:0.75rem; color:rgba(245,241,232,0.5);">${a.date || ''}</span>
        </div>
        <h3 style="font-family: var(--font-heading); color: var(--color-ivory); font-size: 1.25rem; margin-bottom: 0.75rem; line-height: 1.4;">
          ${a.title}
        </h3>
        <p style="font-size: 0.9rem; color: var(--color-muted-text-dark); line-height: 1.7; margin-bottom: 1.5rem; flex-grow: 1;">
          ${a.snippet || ''}
        </p>
        <div style="border-top: 1px solid var(--color-navy-border); padding-top: 1rem; display:flex; justify-content:space-between; align-items:center;">
          <span style="font-size:0.8rem; color:var(--color-champagne-gold);">By ${a.author || a.source || 'National Editorial Board'}</span>
          <span class="link-editorial" style="font-size:0.82rem; cursor:pointer;" onclick="${readAction}">${a.linkUrl ? 'Read Article Online' : 'Read Full Essay'}</span>
        </div>
      `;
      articlesContainer.appendChild(articleEl);
    });
  }

  // 4B. Online Posts Section on media.html
  const postsContainer = document.getElementById('mediaPostsContainer');
  if (postsContainer) {
    const posts = allMedia.filter(m => m.category === 'POSTS');
    postsContainer.innerHTML = '';
    if (posts.length === 0) {
      postsContainer.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 2rem; text-align: center; color: var(--color-muted-text-dark); border: 1px dashed rgba(200,169,106,0.3); border-radius: 2px;">
          No online posts added yet. Updates and announcements will be published here.
        </div>
      `;
    } else {
      posts.forEach(p => {
        const postEl = document.createElement('article');
        postEl.className = 'article-item-card';
        const postAction = p.linkUrl ? `window.open('${p.linkUrl}', '_blank')` : (p.videoUrl ? `openVideoModal('${p.videoUrl}', '${(p.title || '').replace(/'/g, "\\'")}', '${(p.author || '').replace(/'/g, "\\'")}')` : `alert('Post: ' + ${JSON.stringify(p.title)} + '\\n\\n' + ${JSON.stringify(p.snippet)})`);
        postEl.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 0.75rem;">
            <span class="badge-gold" style="background: rgba(96, 165, 250, 0.2); color: #93c5fd; border-color: rgba(96, 165, 250, 0.4);">${p.type || 'Online Post'}</span>
            <span style="font-size:0.75rem; color:rgba(245,241,232,0.5);">${p.date || 'Digital'}</span>
          </div>
          ${p.image ? `<div style="aspect-ratio: 16/9; margin-bottom: 1rem; overflow: hidden; border-radius: 2px; border: 1px solid rgba(200,169,106,0.2); cursor: pointer;" onclick="${postAction}"><img src="${p.image}" alt="${p.title}" style="width:100%; height:100%; object-fit:cover;"></div>` : ''}
          <h3 style="font-family: var(--font-heading); color: var(--color-ivory); font-size: 1.2rem; margin-bottom: 0.65rem; line-height: 1.4;">
            ${p.title}
          </h3>
          <p style="font-size: 0.9rem; color: var(--color-muted-text-dark); line-height: 1.6; margin-bottom: 1.25rem; flex-grow: 1;">
            ${p.snippet || ''}
          </p>
          <div style="border-top: 1px solid var(--color-navy-border); padding-top: 0.85rem; display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:0.8rem; color:var(--color-champagne-gold);">Via ${p.author || p.source || 'Digital Community'}</span>
            <span class="link-editorial" style="font-size:0.82rem; cursor:pointer;" onclick="${postAction}">View Post</span>
          </div>
        `;
        postsContainer.appendChild(postEl);
      });
    }
  }

  // 5. Press Releases Section on media.html
  const pressContainer = document.getElementById('mediaPressContainer');
  if (pressContainer) {
    const pressItems = allMedia.filter(m => m.category === 'PRESS');
    pressContainer.innerHTML = '';
    pressItems.forEach(pr => {
      const block = document.createElement('div');
      block.style.cssText = 'background: var(--color-deep-navy); border: 1px solid var(--color-navy-border); padding: 2rem; border-radius: 2px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1.5rem;';
      block.innerHTML = `
        <div style="flex: 1; min-width: 260px;">
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:0.5rem;">
            <span class="badge-gold">${pr.type || 'Official Press Release'}</span>
            <span style="font-size:0.75rem; color:rgba(245,241,232,0.5);">${pr.date || ''}</span>
          </div>
          <h3 style="font-family: var(--font-heading); color: var(--color-ivory); font-size: 1.25rem; margin-bottom: 0.4rem;">
            ${pr.title}
          </h3>
          <p style="font-size: 0.88rem; color: var(--color-muted-text-dark); margin: 0; line-height: 1.6;">
            ${pr.snippet || ''}
          </p>
        </div>
        <button onclick="window.showToast('Official Press Statement PDF is available for download.')" class="btn btn-gold">
          Download Press Release
        </button>
      `;
      pressContainer.appendChild(block);
    });
  }
}
