/**
 * GRD-10 — SHRI GHANSHYAM DUBE ACHIEVER AWARDS
 * Interactive Renderers for Categories, Voices & Media
 */

document.addEventListener('DOMContentLoaded', () => {
  renderDynamicCategories();
  renderDynamicVoices();
  renderDynamicAwardees();
  renderDynamicMedia();
});

/* 1. RENDER APPROVED CATEGORIES */
function renderDynamicCategories() {
  const container = document.getElementById('categoriesGridContainer');
  if (!container || !window.grdStore) return;

  const categories = window.grdStore.getCategories();
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
          Nominate <span>&rarr;</span>
        </a>
        <span class="badge-gold">Edition 2026</span>
      </div>
    `;
    container.appendChild(card);
  });
}

/* 2. RENDER VOICES OF THE LEGACY WITH FILTERING */
function renderDynamicVoices() {
  const container = document.getElementById('voicesGridContainer');
  const tabsContainer = document.getElementById('voicesTabsContainer');
  if (!container || !window.grdStore) return;

  const renderList = (filterKey) => {
    const voices = window.grdStore.getVoices("2026", filterKey);
    container.innerHTML = '';

    voices.forEach(voice => {
      const card = document.createElement('div');
      card.className = 'voice-card';
      card.innerHTML = `
        <div class="voice-thumb-wrap" onclick="openVideoModal('${voice.videoUrl}', '${voice.name.replace(/'/g, "\\'")}', '${voice.role.replace(/'/g, "\\'")}')">
          <img src="${voice.photo}" alt="${voice.name}" loading="lazy">
          <div class="voice-play-badge" aria-label="Play Video Message">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          </div>
          <span class="voice-duration-badge">${voice.duration}</span>
        </div>
        <div class="voice-card-body">
          <h4 class="voice-speaker-name">${voice.name}</h4>
          <div class="voice-speaker-role">${voice.role}</div>
          <p class="voice-excerpt">${voice.excerpt}</p>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:auto; padding-top:0.75rem;">
            <div class="voice-group-tag">${voice.group}</div>
            <span class="link-editorial" style="font-size:0.75rem;">Watch the Message &rarr;</span>
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

/* 3. RENDER AWARDEES ARCHITECTURE ("THE 10") */
function renderDynamicAwardees() {
  const container = document.getElementById('awardeesGridContainer');
  if (!container || !window.grdStore) return;

  const awardees = window.grdStore.getAwardees();
  container.innerHTML = '';

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
        <div class="awardee-category-title">${awardee.categoryName}</div>
        <h4 class="awardee-name">${awardee.name}</h4>
        <p class="awardee-short-bio">${awardee.shortBio}</p>
        <span class="link-editorial" style="margin-top:auto;">View Full Dossier &rarr;</span>
      </div>
    `;
    container.appendChild(card);
  });
}

/* 4. RENDER MEDIA & ARCHIVE */
function renderDynamicMedia() {
  const container = document.getElementById('mediaGridContainer');
  const tabsContainer = document.getElementById('mediaTabsContainer');
  if (!container || !window.grdStore) return;

  const renderMediaList = (catFilter) => {
    const items = window.grdStore.getMedia("2026", catFilter);
    container.innerHTML = '';

    items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'media-card';
      card.innerHTML = `
        <div class="media-thumb">
          <img src="${item.image}" alt="${item.title}" loading="lazy">
          <span class="media-type-tag">${item.category}</span>
        </div>
        <div class="media-content">
          <div class="media-date">${item.date}</div>
          <h4 class="media-title">${item.title}</h4>
          <p class="media-snippet">${item.snippet}</p>
          <span class="link-editorial" style="margin-top:1rem;">Access Record &rarr;</span>
        </div>
      `;
      container.appendChild(card);
    });
  };

  // Initial render
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
