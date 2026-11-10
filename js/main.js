/**
 * GRD10 — SHRI GHANSHYAM DUBE ACHIEVER AWARDS
 * Core UI Logic, Sticky Nav, Modals, Drawer & Accessible Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initCurtainHero();
  initStickyHeader();
  initMobileNavigation();
  initVideoModal();
  initAwardeeModal();
  initSmoothScroll();
  initSocialCarousel();
  initLanguageSwitcher();
});

/* 0. CURTAIN HERO INTRO CONTROLLER */
function initCurtainHero() {
  const curtain = document.getElementById('curtainHero');
  const scrollBtn = document.getElementById('curtainScrollBtn');
  const targetSection = document.getElementById('legacyHeroSection');

  if (!curtain) return;

  // Mark body as on-curtain initially if at top
  const updateCurtainState = () => {
    const curtainBottom = curtain.getBoundingClientRect().bottom;
    if (curtainBottom > 120) {
      document.body.classList.add('on-curtain');
    } else {
      document.body.classList.remove('on-curtain');
    }
  };

  window.addEventListener('scroll', updateCurtainState, { passive: true });
  updateCurtainState();

  // Scroll button smooth navigation
  if (scrollBtn && targetSection) {
    scrollBtn.addEventListener('click', (e) => {
      e.preventDefault();
      targetSection.scrollIntoView({ behavior: 'smooth' });
    });
  }
}

/* 1. STICKY HEADER CONTROLLER */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  let ticking = false;
  const handleScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > 30) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* 2. MOBILE NAVIGATION DRAWER */
function initMobileNavigation() {
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const overlay = document.querySelector('.mobile-drawer-overlay');
  const closeBtn = document.querySelector('.mobile-drawer-close');

  if (!toggleBtn || !drawer) return;

  const openDrawer = () => {
    drawer.classList.add('open');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    toggleBtn.setAttribute('aria-expanded', 'true');
    toggleBtn.classList.add('active');
  };

  const closeDrawer = () => {
    drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.classList.remove('active');
  };

  toggleBtn.addEventListener('click', () => {
    const isOpen = drawer.classList.contains('open');
    if (isOpen) closeDrawer();
    else openDrawer();
  });

  if (overlay) overlay.addEventListener('click', closeDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

  // Close when clicking nav link inside drawer
  drawer.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // ESC key listener
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });

  // Touch swipe-to-close gesture on mobile drawer
  let touchStartX = 0;
  let touchCurrentX = 0;
  drawer.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  drawer.addEventListener('touchmove', (e) => {
    touchCurrentX = e.touches[0].clientX;
  }, { passive: true });

  drawer.addEventListener('touchend', () => {
    if (touchCurrentX - touchStartX > 50 && touchCurrentX > 0) {
      closeDrawer();
    }
    touchStartX = 0;
    touchCurrentX = 0;
  }, { passive: true });

  // Auto close on window resize above mobile breakpoint
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900 && drawer.classList.contains('open')) {
      closeDrawer();
    }
  }, { passive: true });
}

/* 3. VIDEO MODAL (Universal Embed Handler for YouTube, Shorts, Vimeo & Direct URLs) */
function convertToEmbedUrl(rawUrl) {
  if (!rawUrl) return '';
  let url = rawUrl.trim();

  // Match YouTube URLs (watch?v=, youtu.be/, shorts/, embed/, etc.)
  const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?.*v=|embed\/|shorts\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch) {
    return `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?rel=0&enablejsapi=1`;
  }

  // Match Vimeo URLs
  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  return url;
}

function initVideoModal() {
  function ensureVideoModal() {
    let modal = document.getElementById('videoModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.className = 'modal-backdrop';
      modal.id = 'videoModal';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-label', 'Video Player');
      modal.innerHTML = `
        <div class="modal-container">
          <button class="modal-close-btn" aria-label="Close Video">&times;</button>
          <div style="padding: 1.5rem 1.5rem 0.5rem;">
            <h4 class="modal-video-title" style="color: var(--color-ivory); font-family: var(--font-heading);">Video Player</h4>
            <div class="modal-video-speaker" style="color: var(--color-champagne-gold); font-size: 0.82rem; margin-bottom: 1rem;"></div>
          </div>
          <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; background: #000;">
            <iframe style="position: absolute; top:0; left: 0; width: 100%; height: 100%; border:0;" 
                    src="about:blank" title="Video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen>
            </iframe>
          </div>
          <div style="padding: 1rem 1.5rem; font-size: 0.78rem; color: rgba(245,241,232,0.5);">
            Archival Record • GRD Nationals Permanent Collection
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      const closeBtn = modal.querySelector('.modal-close-btn');
      if (closeBtn) closeBtn.addEventListener('click', () => window.closeVideoModal());
      modal.addEventListener('click', (e) => {
        if (e.target === modal) window.closeVideoModal();
      });
    }
    return modal;
  }

  window.closeVideoModal = function() {
    const modal = document.getElementById('videoModal');
    if (modal) {
      const iframe = modal.querySelector('iframe');
      if (iframe) iframe.src = 'about:blank';
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  window.openVideoModal = function(rawVideoUrl, title, speaker) {
    const modal = ensureVideoModal();
    const iframe = modal.querySelector('iframe');
    const modalTitle = modal.querySelector('.modal-video-title');
    const modalSpeaker = modal.querySelector('.modal-video-speaker');
    const container = modal.querySelector('.modal-container');
    let pendingNotice = modal.querySelector('.modal-pending-notice');

    if (modalTitle) modalTitle.textContent = title || 'Official Archival Dispatch';
    if (modalSpeaker) modalSpeaker.textContent = speaker || 'GRD Nationals Archive';

    // If no valid external video URL or empty string, show the dignified archival release announcement
    const isPending = !rawVideoUrl || rawVideoUrl.trim() === '' || rawVideoUrl.includes('dQw4w9WgXcQ');
    
    if (isPending) {
      if (iframe) iframe.parentElement.style.display = 'none';
      if (!pendingNotice) {
        pendingNotice = document.createElement('div');
        pendingNotice.className = 'modal-pending-notice';
        pendingNotice.style.cssText = 'padding: 2.5rem 2rem; text-align: center; background: radial-gradient(circle at center, #1b2838 0%, #0d1520 100%); border-top: 1px solid rgba(200,169,106,0.3); border-bottom: 1px solid rgba(200,169,106,0.3);';
        iframe.parentElement.insertAdjacentElement('afterend', pendingNotice);
      }
      pendingNotice.style.display = 'block';
      pendingNotice.innerHTML = `
        <div style="width: 58px; height: 58px; border-radius: 50%; border: 1.5px solid #C8A96A; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 1.25rem; background: rgba(200,169,106,0.08); color: #E4C97E;">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
            <line x1="7" y1="2" x2="7" y2="22"></line>
            <line x1="17" y1="2" x2="17" y2="22"></line>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <line x1="2" y1="7" x2="7" y2="7"></line>
            <line x1="2" y1="17" x2="7" y2="17"></line>
            <line x1="17" y1="17" x2="22" y2="17"></line>
            <line x1="17" y1="7" x2="22" y2="7"></line>
          </svg>
        </div>
        <h4 style="color: #F5F1E8; font-family: var(--font-heading); font-size: 1.35rem; margin-bottom: 0.75rem; letter-spacing: 0.5px;">
          Official Archival Release
        </h4>
        <p style="color: #C8A96A; font-size: 0.9rem; font-weight: 500; margin-bottom: 1rem; letter-spacing: 1px; text-transform: uppercase;">
          Premiere: 10 November 2026 • National Convocation, Mumbai
        </p>
        <p style="color: rgba(245,241,232,0.8); font-size: 0.9rem; line-height: 1.7; max-width: 520px; margin: 0 auto 1.75rem;">
          The full documentary reel, addresses by patrons, and recorded testimonies will be officially broadcast during the national convocation ceremony and archived on the official YouTube channel.
        </p>
        <div style="display: flex; gap: 0.85rem; justify-content: center; flex-wrap: wrap;">
          <a href="https://youtube.com/@thegrd10?si=VkLayzQnKvzS5kbu" target="_blank" rel="noopener noreferrer" class="btn btn-gold" style="font-size: 0.85rem; padding: 0.65rem 1.4rem;">
            Subscribe to Official YouTube Channel
          </a>
          <button onclick="window.closeVideoModal()" class="btn btn-outline-gold" style="font-size: 0.85rem; padding: 0.65rem 1.4rem;">
            Return to Archives
          </button>
        </div>
      `;
    } else {
      if (pendingNotice) pendingNotice.style.display = 'none';
      const embedUrl = convertToEmbedUrl(rawVideoUrl);
      if (iframe) {
        iframe.parentElement.style.display = 'block';
        iframe.src = embedUrl;
      }
    }

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const modal = document.getElementById('videoModal');
  if (modal) {
    const closeBtn = modal.querySelector('.modal-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', window.closeVideoModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) window.closeVideoModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      window.closeVideoModal();
    }
  });
}

/* 4. AWARDEE PROFILE MODAL CONTROLLER */
function initAwardeeModal() {
  const modal = document.getElementById('awardeeModal');
  if (!modal) return;

  const closeBtn = modal.querySelector('.modal-close-btn');

  window.openAwardeeModal = function(awardeeId) {
    const data = window.grdStore ? window.grdStore.getData() : null;
    if (!data) return;

    const awardee = data.awardees.find(a => a.id === awardeeId) || data.awardees[0];
    if (!awardee) return;

    // Populate modal fields
    const nameEl = modal.querySelector('.modal-awardee-name');
    const catEl = modal.querySelector('.modal-awardee-category');
    const numEl = modal.querySelector('.modal-awardee-num');
    const storyEl = modal.querySelector('.modal-awardee-story');
    const contribEl = modal.querySelector('.modal-awardee-contribution');
    const reasonEl = modal.querySelector('.modal-awardee-reason');
    const notesEl = modal.querySelector('.modal-awardee-notes');
    const imgEl = modal.querySelector('.modal-awardee-img');

    if (nameEl) nameEl.textContent = awardee.name;
    if (catEl) catEl.textContent = awardee.categoryName;
    if (numEl) numEl.textContent = awardee.number;
    if (storyEl) storyEl.textContent = awardee.theirStory;
    if (contribEl) contribEl.textContent = awardee.theirContribution;
    if (reasonEl) reasonEl.textContent = awardee.whyChosen;
    if (notesEl) notesEl.textContent = awardee.ceremonyNotes;
    if (imgEl && awardee.photo) imgEl.src = awardee.photo;

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeAwardeeModal = () => {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeAwardeeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeAwardeeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeAwardeeModal();
    }
  });
}

/* 5. SMOOTH SCROLL FOR HASH LINKS */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '#!') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerHeight = document.querySelector('.site-header')?.offsetHeight || 80;
        const targetPos = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* 6. TOAST NOTIFICATION UTILITY */
window.showToast = function(message, type = 'info') {
  let toastContainer = document.getElementById('toastContainer');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toastContainer';
    toastContainer.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
    `;
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.style.cssText = `
    background: #112735;
    color: #F5F1E8;
    border-left: 3px solid #C8A96A;
    padding: 12px 20px;
    font-size: 0.85rem;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    border-radius: 2px;
    transition: opacity 0.3s ease, transform 0.3s ease;
    opacity: 0;
    transform: translateY(10px);
  `;
  toast.textContent = message;
  toastContainer.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
};

/* 7. DYNAMIC CONTENT SYNCHRONIZATION */
function syncDynamicSiteContent() {
  if (!window.grdStore) return;
  const edition = window.grdStore.getActiveEditionDetails();
  const content = window.grdStore.getSiteContent ? window.grdStore.getSiteContent() : {};

  if (edition) {
    const yr = edition.year || '2026';

    document.querySelectorAll('[data-grd-bind="eventDate"]').forEach(el => {
      el.textContent = edition.date;
    });
    document.querySelectorAll('[data-grd-bind="eventDateHeading"]').forEach(el => {
      // Strip trailing year (e.g. "10 November 2026" -> "10 November")
      const trimmed = (edition.date || '').replace(/\s+\d{4}$/, '');
      el.textContent = trimmed || edition.date;
    });
    document.querySelectorAll('[data-grd-bind="eventLocation"]').forEach(el => {
      el.textContent = edition.location;
    });
    document.querySelectorAll('[data-grd-bind="eventYear"]').forEach(el => {
      el.textContent = yr;
    });
    document.querySelectorAll('[data-grd-bind="brandTheme"]').forEach(el => {
      el.textContent = edition.theme;
    });
    document.querySelectorAll('[data-grd-bind="eventStatus"]').forEach(el => {
      el.textContent = edition.status;
    });

    // 1. Dynamic Page Titles (e.g. "GRD10 National Awards 2028 | Official Categories...")
    if (document.title) {
      document.title = document.title.replace(/\b202\d\b/g, yr);
    }

    // 2. Dynamic Navigation Links ("Awards 2026" -> "Awards 2028", etc.)
    document.querySelectorAll('a.nav-link, a.footer-link, a.btn').forEach(link => {
      const href = (link.getAttribute('href') || '').toLowerCase();
      if (href.includes('awards.html')) {
        const text = link.textContent.trim();
        if (/awards\s*202\d/i.test(text)) {
          link.textContent = text.replace(/202\d/g, yr);
        } else if (/पुरस्कार\s*(?:202\d|२०२\d)/i.test(text)) {
          link.textContent = text.replace(/(?:202\d|२०२\d)/g, yr);
        }
      }
    });

    // 3. Dynamic Section Headings & Badges referencing awards year
    document.querySelectorAll('.current-selected-year').forEach(el => {
      el.textContent = yr;
    });
  }

  if (content) {
    if (content.heroTitle) {
      document.querySelectorAll('[data-grd-bind="heroTitle"]').forEach(el => el.textContent = content.heroTitle);
    }
    if (content.heroSubtitle) {
      document.querySelectorAll('[data-grd-bind="heroSubtitle"]').forEach(el => el.textContent = content.heroSubtitle);
    }
    if (content.heroBadge) {
      document.querySelectorAll('[data-grd-bind="heroBadge"]').forEach(el => el.textContent = content.heroBadge);
    }
    if (content.heroTagline) {
      document.querySelectorAll('[data-grd-bind="heroTagline"]').forEach(el => el.textContent = content.heroTagline);
    }
    if (content.kushtiTitle) {
      document.querySelectorAll('[data-grd-bind="kushtiTitle"]').forEach(el => el.textContent = content.kushtiTitle);
    }
    if (content.kushtiText) {
      document.querySelectorAll('[data-grd-bind="kushtiText"]').forEach(el => el.textContent = content.kushtiText);
    }
    if (content.publicServiceTitle) {
      document.querySelectorAll('[data-grd-bind="publicServiceTitle"]').forEach(el => el.textContent = content.publicServiceTitle);
    }
    if (content.publicServiceText) {
      document.querySelectorAll('[data-grd-bind="publicServiceText"]').forEach(el => el.textContent = content.publicServiceText);
    }
    if (content.legacyQuote) {
      document.querySelectorAll('[data-grd-bind="legacyQuote"]').forEach(el => el.textContent = content.legacyQuote);
    }
    if (content.featuredVideoTitle) {
      document.querySelectorAll('[data-grd-bind="featuredVideoTitle"]').forEach(el => el.textContent = content.featuredVideoTitle);
    }
    if (content.featuredVideoDesc) {
      document.querySelectorAll('[data-grd-bind="featuredVideoDesc"]').forEach(el => el.textContent = content.featuredVideoDesc);
    }
    if (content.featuredVideoDuration) {
      document.querySelectorAll('[data-grd-bind="featuredVideoDuration"]').forEach(el => el.textContent = content.featuredVideoDuration);
    }
    if (content.featuredVideoBadge) {
      document.querySelectorAll('[data-grd-bind="featuredVideoBadge"]').forEach(el => el.textContent = content.featuredVideoBadge);
    }
    if (content.featuredVideoImage) {
      document.querySelectorAll('[data-grd-bind-src="featuredVideoImage"]').forEach(el => el.src = content.featuredVideoImage);
    }

    // Dynamic click handler for Featured Documentary Reel
    window.openFeaturedDocuModal = function() {
      const c = (window.grdStore && window.grdStore.getSiteContent) ? window.grdStore.getSiteContent() : {};
      const vUrl = c.featuredVideoUrl || '';
      const vTitle = c.featuredVideoTitle || 'The Living Legacy of Shri Ghanshyam Raj Narayan Dube';
      const vSpeaker = c.featuredVideoBadge || 'Archival Film Preview';
      if (typeof window.openVideoModal === 'function') {
        window.openVideoModal(vUrl, vTitle, vSpeaker);
      }
    };

    // Social Media Links & Handles Dynamic Binding
    const fallbackSocial = (window.GRD10_DEFAULT_DATA && window.GRD10_DEFAULT_DATA.siteContent) ? window.GRD10_DEFAULT_DATA.siteContent : {};

    // 1. Instagram
    const igUrl = (content.socialInstagram !== undefined && content.socialInstagram !== '') ? content.socialInstagram : (fallbackSocial.socialInstagram || 'https://www.instagram.com/thegrd10');
    const igHandle = content.socialInstagramHandle || fallbackSocial.socialInstagramHandle || '@thegrd10';
    document.querySelectorAll('[data-grd-social="instagram"]').forEach(el => {
      if (igUrl && igUrl.trim()) {
        el.style.display = '';
        el.href = igUrl.trim();
        const handleEl = el.querySelector('[data-grd-social-handle="instagram"]');
        if (handleEl && igHandle) handleEl.textContent = igHandle.trim();
      } else {
        el.style.display = 'none';
      }
    });

    // 2. YouTube
    const ytUrl = (content.socialYoutube !== undefined && content.socialYoutube !== '') ? content.socialYoutube : (fallbackSocial.socialYoutube || 'https://youtube.com/@thegrd10');
    const ytHandle = content.socialYoutubeHandle || fallbackSocial.socialYoutubeHandle || '@thegrd10';
    document.querySelectorAll('[data-grd-social="youtube"]').forEach(el => {
      if (ytUrl && ytUrl.trim()) {
        el.style.display = '';
        el.href = ytUrl.trim();
        const handleEl = el.querySelector('[data-grd-social-handle="youtube"]');
        if (handleEl && ytHandle) handleEl.textContent = ytHandle.trim();
      } else {
        el.style.display = 'none';
      }
    });

    // 3. Facebook
    let fbUrl = (content.socialFacebook !== undefined && content.socialFacebook !== '' && content.socialFacebook !== 'https://facebook.com') 
      ? content.socialFacebook 
      : (fallbackSocial.socialFacebook || 'https://www.facebook.com/share/1CC8fVxv2g/');
    const fbHandle = (content.socialFacebookHandle && content.socialFacebookHandle !== 'Facebook') 
      ? content.socialFacebookHandle 
      : (fallbackSocial.socialFacebookHandle || '@thegrd10');
    document.querySelectorAll('[data-grd-social="facebook"]').forEach(el => {
      if (fbUrl && fbUrl.trim()) {
        el.style.display = '';
        el.href = fbUrl.trim();
        const handleEl = el.querySelector('[data-grd-social-handle="facebook"]');
        if (handleEl && fbHandle) handleEl.textContent = fbHandle.trim();
      } else {
        el.style.display = 'none';
      }
    });

    // 4. X (Twitter)
    let twUrl = (content.socialTwitter !== undefined && content.socialTwitter !== '' && content.socialTwitter !== 'https://x.com') 
      ? content.socialTwitter 
      : (fallbackSocial.socialTwitter || 'https://x.com/Thegrd10');
    const twHandle = (content.socialTwitterHandle && content.socialTwitterHandle !== 'X (Twitter)') 
      ? content.socialTwitterHandle 
      : (fallbackSocial.socialTwitterHandle || '@Thegrd10');
    document.querySelectorAll('[data-grd-social="twitter"]').forEach(el => {
      if (twUrl && twUrl.trim()) {
        el.style.display = '';
        el.href = twUrl.trim();
        const handleEl = el.querySelector('[data-grd-social-handle="twitter"]');
        if (handleEl && twHandle) handleEl.textContent = twHandle.trim();
      } else {
        el.style.display = 'none';
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', syncDynamicSiteContent);
window.addEventListener('grd10:datachanged', syncDynamicSiteContent);
window.addEventListener('storage', (e) => {
  if (e.key && e.key.includes('grd10')) {
    syncDynamicSiteContent();
  }
});

try {
  if (typeof BroadcastChannel !== 'undefined') {
    const syncChannel = new BroadcastChannel('grd10_sync_channel');
    syncChannel.onmessage = () => {
      syncDynamicSiteContent();
    };
  }
} catch (e) {}

/* 7. SOCIAL CAROUSEL SLIDER CONTROLS */
function initSocialCarousel() {
  const trackWrapper = document.getElementById('socialTrackWrapper');
  const prevBtn = document.getElementById('socialPrevBtn');
  const nextBtn = document.getElementById('socialNextBtn');

  if (!trackWrapper || !prevBtn || !nextBtn) return;

  const scrollAmount = 320;

  prevBtn.addEventListener('click', () => {
    trackWrapper.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  });

  nextBtn.addEventListener('click', () => {
    trackWrapper.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  });
}

/* ========================================================================
   8. MULTI-LANGUAGE TRANSLATOR CONTROLLER (EN | HI | MR)
   ======================================================================== */
function initLanguageSwitcher() {
  const currentLang = localStorage.getItem('grd10_lang') || 'en';

  // Apply curated custom translations directly to DOM elements
  function applyCuratedTranslations(lang) {
    if (!window.GRD10_TRANSLATIONS || !window.GRD10_TRANSLATIONS[lang]) return;
    const t = window.GRD10_TRANSLATIONS[lang];

    const activeEdYear = (window.grdStore && window.grdStore.getActiveEditionDetails && window.grdStore.getActiveEditionDetails()?.year) || '2026';

    // Navigation links
    document.querySelectorAll('.nav-menu, .mobile-menu-list').forEach(menu => {
      const links = menu.querySelectorAll('a.nav-link');
      links.forEach(link => {
        const href = (link.getAttribute('href') || '').toLowerCase();
        if (href.includes('index.html')) link.textContent = t.nav_home;
        else if (href.includes('about.html')) link.textContent = t.nav_about;
        else if (href.includes('legacy.html')) link.textContent = t.nav_legacy;
        else if (href.includes('awards.html')) {
          link.textContent = (t.nav_awards || 'Awards 2026').replace(/(?:202\d|२०२\d)/g, activeEdYear);
        }
        else if (href.includes('nominate.html')) link.textContent = t.nav_nominate;
        else if (href.includes('voices.html')) link.textContent = t.nav_circle;
        else if (href.includes('media.html')) link.textContent = t.nav_media;
      });
    });

    // Action buttons & tags
    document.querySelectorAll('#headerNominateBtn, a.btn-gold[href*="nominate.html"]').forEach(btn => {
      btn.textContent = t.cta_nominate;
    });

    // Mobile drawer headings
    document.querySelectorAll('.drawer-lang-section .lang-title').forEach(el => {
      el.textContent = t.lang_select_title;
    });

    // Curtain Hero elements
    const curtainEyebrow = document.querySelector('.curtain-eyebrow-pill span:last-child');
    if (curtainEyebrow) curtainEyebrow.textContent = t.curtain_eyebrow;

    const curtainMotto = document.querySelector('.curtain-motto');
    if (curtainMotto) curtainMotto.textContent = t.curtain_motto;

    const curtainScroll = document.querySelector('.curtain-scroll-label');
    if (curtainScroll) curtainScroll.textContent = t.curtain_scroll;

    const curtainTaglineHindi = document.querySelector('.curtain-tagline-hindi');
    if (curtainTaglineHindi && t.curtain_tagline_hindi) curtainTaglineHindi.textContent = t.curtain_tagline_hindi;

    const curtainTaglineEnglish = document.querySelector('.curtain-tagline-english');
    if (curtainTaglineEnglish && t.curtain_tagline_english) curtainTaglineEnglish.textContent = t.curtain_tagline_english;

    const curtainAttr = document.querySelector('.curtain-attribution');
    if (curtainAttr) curtainAttr.innerHTML = t.curtain_attr;

    const curtainTrust = document.querySelector('.curtain-institution');
    if (curtainTrust) curtainTrust.textContent = t.curtain_trust;

    // Hero Section
    const heroTitle = document.querySelector('.hero-title [data-grd-bind="heroTitle"]');
    if (heroTitle) heroTitle.textContent = t.hero_title;

    const heroSubtitle = document.querySelector('.hero-title [data-grd-bind="heroSubtitle"]');
    if (heroSubtitle) heroSubtitle.textContent = t.hero_subtitle;

    const heroTagline = document.querySelectorAll('.hero-tagline');
    heroTagline.forEach(el => el.textContent = t.hero_tagline);

    const heroExplore = document.querySelector('.hero-actions a.btn-outline-white');
    if (heroExplore) heroExplore.textContent = t.hero_explore;

    // Only fallback to translation location if dynamic store is uninitialized
    const activeLoc = window.grdStore && window.grdStore.getActiveEditionDetails && window.grdStore.getActiveEditionDetails()?.location;
    const heroLocation = document.querySelector('[data-grd-bind="eventLocation"]');
    if (heroLocation && !activeLoc) {
      heroLocation.textContent = t.hero_location;
    }

    // Social Media Strip
    const socialLabel = document.querySelector('.social-mission-pill');
    if (socialLabel) socialLabel.textContent = t.social_handles_label;

    const socialTitle = document.querySelector('.social-mission-title');
    if (socialTitle) socialTitle.textContent = t.social_join_title;

    // Archival Moments
    const momentsEyebrow = document.querySelector('#lifeMomentsHeading')?.previousElementSibling;
    if (momentsEyebrow) momentsEyebrow.textContent = t.moments_eyebrow;

    const momentsTitle = document.getElementById('lifeMomentsHeading');
    if (momentsTitle) momentsTitle.textContent = t.moments_title;

    const momentsSub = momentsTitle?.nextElementSibling;
    if (momentsSub) momentsSub.textContent = t.moments_subtitle;

    // Kushti & Public Service Cards
    const kushtiTitleEl = document.querySelector('[data-grd-bind="kushtiTitle"]');
    if (kushtiTitleEl) {
      kushtiTitleEl.textContent = t.kushti_title;
      const badge = kushtiTitleEl.previousElementSibling;
      if (badge) badge.textContent = t.kushti_badge;
    }
    const kushtiTextEl = document.querySelector('[data-grd-bind="kushtiText"]');
    if (kushtiTextEl) {
      kushtiTextEl.textContent = t.kushti_text;
      const quote = kushtiTextEl.nextElementSibling;
      if (quote) quote.textContent = t.kushti_quote;
    }

    const publicTitleEl = document.querySelector('[data-grd-bind="publicServiceTitle"]');
    if (publicTitleEl) {
      publicTitleEl.textContent = t.public_title;
      const badge = publicTitleEl.previousElementSibling;
      if (badge) badge.textContent = t.public_badge;
    }
    const publicTextEl = document.querySelector('[data-grd-bind="publicServiceText"]');
    if (publicTextEl) {
      publicTextEl.textContent = t.public_text;
      const cta = publicTextEl.nextElementSibling?.querySelector('a');
      if (cta) cta.textContent = t.public_cta;
    }

    // Pillar Principles
    const pillarsTitle = document.getElementById('livingLegacyHeading');
    if (pillarsTitle) {
      pillarsTitle.textContent = t.pillars_title;
      if (pillarsTitle.previousElementSibling) pillarsTitle.previousElementSibling.textContent = t.pillars_eyebrow;
      if (pillarsTitle.nextElementSibling) pillarsTitle.nextElementSibling.textContent = t.pillars_subtitle;
    }

    const valueCards = document.querySelectorAll('.values-grid .value-card');
    if (valueCards.length >= 4) {
      valueCards[0].querySelector('.value-title').textContent = t.pillar1_title;
      valueCards[0].querySelector('.value-desc').textContent = t.pillar1_desc;
      valueCards[1].querySelector('.value-title').textContent = t.pillar2_title;
      valueCards[1].querySelector('.value-desc').textContent = t.pillar2_desc;
      valueCards[2].querySelector('.value-title').textContent = t.pillar3_title;
      valueCards[2].querySelector('.value-desc').textContent = t.pillar3_desc;
      valueCards[3].querySelector('.value-title').textContent = t.pillar4_title;
      valueCards[3].querySelector('.value-desc').textContent = t.pillar4_desc;
    }

    // Founder Section
    const founderEyebrow = document.querySelector('.founder-title-row .eyebrow');
    if (founderEyebrow) founderEyebrow.textContent = t.founder_role;
    const founderName = document.getElementById('daughtersInitiativeHeading');
    if (founderName) founderName.textContent = t.founder_name;
    const founderSummary = document.querySelector('.founder-summary-text');
    if (founderSummary) founderSummary.textContent = t.founder_text;
    const founderCta = document.querySelector('.founder-cta-row a');
    if (founderCta) founderCta.textContent = t.founder_cta;

    // Achievers Section
    const the10Heading = document.getElementById('the10Heading');
    if (the10Heading) {
      the10Heading.textContent = t.achievers_title;
      if (the10Heading.previousElementSibling) the10Heading.previousElementSibling.textContent = t.achievers_eyebrow;
      if (the10Heading.nextElementSibling) the10Heading.nextElementSibling.textContent = t.achievers_subtitle;
      const dossierBtn = the10Heading.closest('section')?.querySelector('.btn-gold');
      if (dossierBtn) dossierBtn.textContent = t.achievers_cta;
    }

    // Categories Section
    const catHeading = document.getElementById('categoriesHeading');
    if (catHeading) {
      catHeading.textContent = t.categories_title;
      if (catHeading.previousElementSibling) catHeading.previousElementSibling.textContent = t.categories_eyebrow;
      if (catHeading.nextElementSibling) catHeading.nextElementSibling.textContent = t.categories_subtitle;
    }

    // ABOUT PAGE SPECIFIC TRANSLATIONS (about.html)
    const aboutHeroTitle = document.querySelector('.page-main section:first-of-type h1.section-title');
    const aboutHeroSub = document.querySelector('.page-main section:first-of-type p.section-subtitle');
    const aboutHeroEyebrow = document.querySelector('.page-main section:first-of-type span.eyebrow');
    if (window.location.pathname.includes('about.html') || aboutHeroTitle?.textContent.includes('Charter')) {
      if (aboutHeroTitle && t.about_hero_title) aboutHeroTitle.textContent = t.about_hero_title;
      if (aboutHeroSub && t.about_hero_sub) aboutHeroSub.textContent = t.about_hero_sub;
      if (aboutHeroEyebrow && t.about_hero_eyebrow) aboutHeroEyebrow.textContent = t.about_hero_eyebrow;
      const portraitSub = document.querySelector('.portrait-plate-sub');
      if (portraitSub && t.about_portrait_sub) portraitSub.textContent = t.about_portrait_sub;
      const leads = document.querySelectorAll('.section-light p');
      if (leads.length >= 2) {
        if (t.about_lead_1) leads[0].innerHTML = t.about_lead_1;
        if (t.about_lead_2) leads[1].textContent = t.about_lead_2;
      }
      const quote = document.querySelector('.editorial-quote');
      if (quote && t.about_motto) quote.textContent = t.about_motto;
      const triptychLabels = document.querySelectorAll('.triptych-label');
      if (triptychLabels.length >= 3) {
        if (t.about_trip_achievers) triptychLabels[0].textContent = t.about_trip_achievers;
        if (t.about_trip_stories) triptychLabels[1].textContent = t.about_trip_stories;
        if (t.about_trip_legacy) triptychLabels[2].textContent = t.about_trip_legacy;
      }
      const philTitle = document.getElementById('aboutPhilTitle') || document.querySelector('h2[style*="font-family"]');
      if (philTitle && t.about_phil_title) philTitle.textContent = t.about_phil_title;
      const philDesc = document.getElementById('aboutPhilDesc');
      if (philDesc && t.about_phil_p1) philDesc.textContent = t.about_phil_p1;
      const v1 = document.getElementById('aboutVirtue1');
      if (v1 && t.about_virtue1) v1.innerHTML = t.about_virtue1;
      const v2 = document.getElementById('aboutVirtue2');
      if (v2 && t.about_virtue2) v2.innerHTML = t.about_virtue2;
      const v3 = document.getElementById('aboutVirtue3');
      if (v3 && t.about_virtue3) v3.innerHTML = t.about_virtue3;
      const v4 = document.getElementById('aboutVirtue4');
      if (v4 && t.about_virtue4) v4.innerHTML = t.about_virtue4;
      const govTitle = document.getElementById('aboutGovTitle');
      if (govTitle && t.about_gov_title) govTitle.textContent = t.about_gov_title;
      const govBadge = document.getElementById('aboutGovBadge');
      if (govBadge && t.about_gov_badge) govBadge.textContent = t.about_gov_badge;
      const govDesc = document.getElementById('aboutGovDesc');
      if (govDesc && t.about_gov_desc) govDesc.innerHTML = t.about_gov_desc;
      const patronDesc = document.getElementById('aboutPatronDesc');
      if (patronDesc && t.about_patron_desc) patronDesc.innerHTML = t.about_patron_desc;
      const btnCat = document.getElementById('aboutBtnCategories');
      if (btnCat && t.about_btn_categories) btnCat.textContent = t.about_btn_categories;
      const btnNom = document.getElementById('aboutBtnNominate');
      if (btnNom && t.about_btn_nominate) btnNom.textContent = t.about_btn_nominate;
      const btnJoin = document.getElementById('aboutBtnJoin');
      if (btnJoin && t.about_btn_join) btnJoin.innerHTML = t.about_btn_join;
    }

    // LEGACY PAGE SPECIFIC TRANSLATIONS (legacy.html)
    if (window.location.pathname.includes('legacy.html') || document.getElementById('theBeginningHeading')) {
      const legHeroEyebrow = document.getElementById('legacyHeroEyebrow') || document.querySelector('.page-main section:first-of-type span.eyebrow');
      if (legHeroEyebrow && t.legacy_hero_eyebrow) legHeroEyebrow.textContent = t.legacy_hero_eyebrow;
      const legHeroTitle = document.getElementById('legacyHeroTitle') || document.querySelector('.page-main section:first-of-type h1.section-title');
      if (legHeroTitle && t.legacy_hero_title) legHeroTitle.textContent = t.legacy_hero_title;
      const legHeroSub = document.getElementById('legacyHeroSubtitle') || document.querySelector('.page-main section:first-of-type p.section-subtitle');
      if (legHeroSub && t.legacy_hero_sub) legHeroSub.textContent = t.legacy_hero_sub;
      const legHeroP = document.getElementById('legacyHeroDesc') || document.querySelector('.page-main section:first-of-type p[style*="color: var(--color-muted-text-dark)"]');
      if (legHeroP && t.legacy_hero_p) legHeroP.textContent = t.legacy_hero_p;

      // Section 1: The Beginning
      const begHeading = document.getElementById('theBeginningHeading');
      if (begHeading && t.legacy_sec1_title) begHeading.textContent = t.legacy_sec1_title;
      const begEyebrow = document.getElementById('legacySec1Eyebrow') || begHeading?.previousElementSibling;
      if (begEyebrow && t.legacy_sec1_eyebrow) begEyebrow.textContent = t.legacy_sec1_eyebrow;
      const begTag = document.getElementById('legacySec1Tag') || begHeading?.nextElementSibling;
      if (begTag && t.legacy_sec1_tag) begTag.textContent = t.legacy_sec1_tag;
      const p1 = document.getElementById('legacySec1P1');
      if (p1 && t.legacy_sec1_p1) p1.innerHTML = t.legacy_sec1_p1;
      const p2 = document.getElementById('legacySec1P2');
      if (p2 && t.legacy_sec1_p2) p2.innerHTML = t.legacy_sec1_p2;
      const quote = document.getElementById('legacySec1Quote');
      if (quote && t.legacy_sec1_quote) quote.textContent = t.legacy_sec1_quote;
      const plateSub1 = document.getElementById('legacyPlateSub1');
      if (plateSub1 && t.legacy_plate_sub1) plateSub1.textContent = t.legacy_plate_sub1;

      // Section 2: Kushti to Public Life
      const kushtiHead = document.getElementById('kushtiPublicLifeHeading');
      if (kushtiHead && t.legacy_sec2_title) kushtiHead.textContent = t.legacy_sec2_title;
      const kushtiEye = document.getElementById('legacySec2Eyebrow') || kushtiHead?.previousElementSibling;
      if (kushtiEye && t.legacy_sec2_eyebrow) kushtiEye.textContent = t.legacy_sec2_eyebrow;
      const kushtiTag = document.getElementById('legacySec2Tag') || kushtiHead?.nextElementSibling;
      if (kushtiTag && t.legacy_sec2_tag) kushtiTag.textContent = t.legacy_sec2_tag;
      const kp1 = document.getElementById('legacySec2P1');
      if (kp1 && t.legacy_sec2_p1) kp1.innerHTML = t.legacy_sec2_p1;
      const kp2 = document.getElementById('legacySec2P2');
      if (kp2 && t.legacy_sec2_p2) kp2.innerHTML = t.legacy_sec2_p2;
      const boxP = document.getElementById('legacySec2Box');
      if (boxP && t.legacy_sec2_box) boxP.innerHTML = t.legacy_sec2_box;
      const plateSub2 = document.getElementById('legacyPlateSub2');
      if (plateSub2 && t.legacy_plate_sub2) plateSub2.textContent = t.legacy_plate_sub2;

      // Section 3: The Thinker
      const thinkerHead = document.getElementById('theThinkerHeading');
      if (thinkerHead && t.legacy_sec3_title) thinkerHead.textContent = t.legacy_sec3_title;
      const thinkerEye = document.getElementById('legacySec3Eyebrow') || thinkerHead?.previousElementSibling;
      if (thinkerEye && t.legacy_sec3_eyebrow) thinkerEye.textContent = t.legacy_sec3_eyebrow;
      const thinkerTag = document.getElementById('legacySec3Tag') || thinkerHead?.nextElementSibling;
      if (thinkerTag && t.legacy_sec3_tag) thinkerTag.textContent = t.legacy_sec3_tag;
      const tp1 = document.getElementById('legacySec3P1');
      if (tp1 && t.legacy_sec3_p1) tp1.innerHTML = t.legacy_sec3_p1;
      const tp2 = document.getElementById('legacySec3P2');
      if (tp2 && t.legacy_sec3_p2) tp2.innerHTML = t.legacy_sec3_p2;
      const plateSub3 = document.getElementById('legacyPlateSub3');
      if (plateSub3 && t.legacy_plate_sub3) plateSub3.textContent = t.legacy_plate_sub3;

      // Section 4: Education as Legacy
      const eduHead = document.getElementById('educationLegacyHeading');
      if (eduHead && t.legacy_edu_title) eduHead.textContent = t.legacy_edu_title;
      const eduEye = document.getElementById('legacyEduEyebrow') || eduHead?.previousElementSibling;
      if (eduEye && t.legacy_edu_eyebrow) eduEye.textContent = t.legacy_edu_eyebrow;
      const eduSub = document.getElementById('legacyEduSubtitle') || eduHead?.nextElementSibling;
      if (eduSub && t.legacy_edu_sub) eduSub.textContent = t.legacy_edu_sub;
      const eduTag = document.getElementById('legacyEduTag');
      if (eduTag && t.legacy_edu_tag) eduTag.textContent = t.legacy_edu_tag;
      const collegeName = document.getElementById('legacyCollegeName');
      if (collegeName && t.legacy_edu_college_name) collegeName.textContent = t.legacy_edu_college_name;
      const eduBadge = document.getElementById('legacyEduBadge');
      if (eduBadge && t.legacy_edu_badge) eduBadge.textContent = t.legacy_edu_badge;
      const ep1 = document.getElementById('legacyEduP1');
      if (ep1 && t.legacy_edu_p1) ep1.innerHTML = t.legacy_edu_p1;
      const initP = document.getElementById('legacyEduInitiative');
      if (initP && t.legacy_edu_initiative) initP.innerHTML = t.legacy_edu_initiative;
      const empBadge = document.getElementById('legacyEduEmpower');
      if (empBadge && t.legacy_edu_empower) empBadge.textContent = t.legacy_edu_empower;

      // Maharashtra & UP Synthesis cards
      const mhTitle = document.getElementById('legacySynthMhTitle');
      if (mhTitle && t.legacy_synth_mh_title) mhTitle.textContent = t.legacy_synth_mh_title;
      const mhDesc = document.getElementById('legacySynthMhDesc');
      if (mhDesc && t.legacy_synth_mh_desc) mhDesc.textContent = t.legacy_synth_mh_desc;
      const upTitle = document.getElementById('legacySynthUpTitle');
      if (upTitle && t.legacy_synth_up_title) upTitle.textContent = t.legacy_synth_up_title;
      const upDesc = document.getElementById('legacySynthUpDesc');
      if (upDesc && t.legacy_synth_up_desc) upDesc.innerHTML = t.legacy_synth_up_desc;

      // Section 5: The Journey (Timeline Header)
      const journeyHead = document.getElementById('theJourneyHeading');
      if (journeyHead && t.legacy_journey_title) journeyHead.textContent = t.legacy_journey_title;
      const journeyEye = document.getElementById('legacyJourneyEyebrow') || journeyHead?.previousElementSibling;
      if (journeyEye && t.legacy_journey_eyebrow) journeyEye.textContent = t.legacy_journey_eyebrow;
      const journeySub = document.getElementById('legacyJourneySubtitle') || journeyHead?.nextElementSibling;
      if (journeySub && t.legacy_journey_sub) journeySub.textContent = t.legacy_journey_sub;

      // Section 6: Four Pillars
      const valHead = document.getElementById('theValuesHeading');
      if (valHead && t.legacy_pillars_title) valHead.textContent = t.legacy_pillars_title;
      const valEye = document.getElementById('legacyPillarsEyebrow') || valHead?.previousElementSibling;
      if (valEye && t.legacy_pillars_eyebrow) valEye.textContent = t.legacy_pillars_eyebrow;
      const valSub = document.getElementById('legacyPillarsSubtitle') || valHead?.nextElementSibling;
      if (valSub && t.legacy_pillars_sub) valSub.textContent = t.legacy_pillars_sub;
      const pTit1 = document.getElementById('legacyPillarTitle1');
      if (pTit1 && t.pillar1_title) pTit1.textContent = t.pillar1_title;
      const pDesc1 = document.getElementById('legacyPillarDesc1');
      if (pDesc1 && t.pillar1_desc) pDesc1.textContent = t.pillar1_desc;
      const pTit2 = document.getElementById('legacyPillarTitle2');
      if (pTit2 && t.pillar2_title) pTit2.textContent = t.pillar2_title;
      const pDesc2 = document.getElementById('legacyPillarDesc2');
      if (pDesc2 && t.pillar2_desc) pDesc2.textContent = t.pillar2_desc;
      const pTit3 = document.getElementById('legacyPillarTitle3');
      if (pTit3 && t.pillar3_title) pTit3.textContent = t.pillar3_title;
      const pDesc3 = document.getElementById('legacyPillarDesc3');
      if (pDesc3 && t.pillar3_desc) pDesc3.textContent = t.pillar3_desc;
      const pTit4 = document.getElementById('legacyPillarTitle4');
      if (pTit4 && t.pillar4_title) pTit4.textContent = t.pillar4_title;
      const pDesc4 = document.getElementById('legacyPillarDesc4');
      if (pDesc4 && t.pillar4_desc) pDesc4.textContent = t.pillar4_desc;

      // Section 7: Continuation
      const contHead = document.getElementById('continueHeading');
      if (contHead && t.legacy_continue_title) contHead.textContent = t.legacy_continue_title;
      const contEye = document.getElementById('legacyContinueEyebrow') || contHead?.previousElementSibling;
      if (contEye && t.legacy_continue_eyebrow) contEye.textContent = t.legacy_continue_eyebrow;
      const contSub = document.getElementById('legacyContinueSubtitle') || contHead?.nextElementSibling;
      if (contSub && t.legacy_continue_sub) contSub.textContent = t.legacy_continue_sub;
      const contP = document.getElementById('legacyContinueInitiative');
      if (contP && t.legacy_continue_initiative) contP.innerHTML = t.legacy_continue_initiative;
      const quoteBox = document.getElementById('legacyContinueQuote');
      if (quoteBox && t.legacy_continue_quote) quoteBox.textContent = t.legacy_continue_quote;
      const btnAwards = document.getElementById('legacyBtnAwards');
      if (btnAwards && t.legacy_btn_awards) btnAwards.textContent = t.legacy_btn_awards;
      const btnNom = document.getElementById('legacyBtnNominate');
      if (btnNom && t.legacy_btn_nominate) btnNom.textContent = t.legacy_btn_nominate;
    }

    // AWARDS PAGE SPECIFIC TRANSLATIONS (awards.html)
    if (window.location.pathname.includes('awards.html')) {
      const awHeroEyebrow = document.querySelector('.page-main section:first-of-type span.eyebrow');
      if (awHeroEyebrow && t.awards_hero_eyebrow) awHeroEyebrow.textContent = t.awards_hero_eyebrow;
      const awHeroSub = document.querySelector('.page-main section:first-of-type p.section-subtitle');
      if (awHeroSub && t.awards_hero_sub) awHeroSub.innerHTML = t.awards_hero_sub;

      const catSecEyebrow = document.getElementById('categoriesSectionEyebrow');
      if (catSecEyebrow && t.awards_sec_eyebrow) catSecEyebrow.textContent = t.awards_sec_eyebrow;
      const catSecSub = document.getElementById('categoriesSectionSubtitle');
      if (catSecSub && t.awards_sec_sub) catSecSub.textContent = t.awards_sec_sub;

      const fwEyebrow = document.querySelector('.text-center .eyebrow');
      if (fwEyebrow && t.awards_framework_eyebrow) fwEyebrow.textContent = t.awards_framework_eyebrow;
      const fwTitle = document.querySelector('.text-center h3[style*="font-family"]');
      if (fwTitle && t.awards_framework_title) fwTitle.textContent = t.awards_framework_title;
      const fwSub = fwTitle?.nextElementSibling;
      if (fwSub && t.awards_framework_sub) fwSub.textContent = t.awards_framework_sub;
    }

    // NOMINATE PAGE SPECIFIC TRANSLATIONS (nominate.html)
    if (window.location.pathname.includes('nominate.html')) {
      const nomEyebrow = document.querySelector('.page-main section:first-of-type span.eyebrow');
      if (nomEyebrow && t.nominate_hero_eyebrow) nomEyebrow.textContent = t.nominate_hero_eyebrow;
      const nomTitle = document.querySelector('.page-main section:first-of-type h1.section-title');
      if (nomTitle && t.nominate_hero_title) nomTitle.textContent = t.nominate_hero_title;
      const nomSub = document.querySelector('.page-main section:first-of-type p.section-subtitle');
      if (nomSub && t.nominate_hero_sub) nomSub.textContent = t.nominate_hero_sub;
      const nomP = document.querySelector('.page-main section:first-of-type p[style*="color: var(--color-muted-text-dark)"]');
      if (nomP && t.nominate_hero_p) nomP.textContent = t.nominate_hero_p;
    }

    // VOICES / CIRCLE PAGE SPECIFIC TRANSLATIONS (voices.html)
    if (window.location.pathname.includes('voices.html')) {
      const vEyebrow = document.querySelector('.page-main section:first-of-type span.eyebrow');
      if (vEyebrow && t.voices_hero_eyebrow) vEyebrow.textContent = t.voices_hero_eyebrow;
      const vTitle = document.querySelector('.page-main section:first-of-type h1.section-title');
      if (vTitle && t.voices_hero_title) vTitle.textContent = t.voices_hero_title;
      const vSub = document.querySelector('.page-main section:first-of-type p.section-subtitle');
      if (vSub && t.voices_hero_sub) vSub.textContent = t.voices_hero_sub;
      const vP = document.querySelector('.page-main section:first-of-type p[style*="max-width: 740px"]');
      if (vP && t.voices_hero_p) vP.textContent = t.voices_hero_p;
      const vBadge = document.querySelector('.page-main section:first-of-type span[style*="text-transform: uppercase"]');
      if (vBadge && t.voices_hero_badge) vBadge.textContent = t.voices_hero_badge;
      const vCta = document.querySelector('.page-main section:first-of-type a.btn-gold span');
      if (vCta && t.voices_hero_cta) vCta.textContent = t.voices_hero_cta;
      const vExplore = document.querySelector('.page-main section:first-of-type a.btn-outline-white');
      if (vExplore && t.voices_hero_explore) vExplore.textContent = t.voices_hero_explore;
    }

    // MEDIA PAGE SPECIFIC TRANSLATIONS (media.html)
    if (window.location.pathname.includes('media.html')) {
      const medEyebrow = document.querySelector('.page-main section:first-of-type span.eyebrow');
      if (medEyebrow && t.media_hero_eyebrow) medEyebrow.textContent = t.media_hero_eyebrow;
      const medTitle = document.querySelector('.page-main section:first-of-type h1.section-title');
      if (medTitle && t.media_hero_title) medTitle.textContent = t.media_hero_title;
      const medSub = document.querySelector('.page-main section:first-of-type p.section-subtitle');
      if (medSub && t.media_hero_sub) medSub.textContent = t.media_hero_sub;
      const medP = document.querySelector('.page-main section:first-of-type p[style*="max-width: 680px"]');
      if (medP && t.media_hero_p) medP.textContent = t.media_hero_p;

      const vidEyebrow = document.querySelector('#allVideosSection .eyebrow');
      if (vidEyebrow && t.media_sec1_eyebrow) vidEyebrow.textContent = t.media_sec1_eyebrow;
      const vidTitle = document.querySelector('#allVideosSection .section-title');
      if (vidTitle && t.media_sec1_title) vidTitle.textContent = t.media_sec1_title;
      const vidSub = document.querySelector('#allVideosSection .section-subtitle');
      if (vidSub && t.media_sec1_sub) vidSub.textContent = t.media_sec1_sub;

      const photoEyebrow = document.querySelector('#photoLibrariesSection .eyebrow');
      if (photoEyebrow && t.media_sec2_eyebrow) photoEyebrow.textContent = t.media_sec2_eyebrow;
      const photoTitle = document.querySelector('#photoLibrariesSection .section-title');
      if (photoTitle && t.media_sec2_title) photoTitle.textContent = t.media_sec2_title;
      const photoSub = document.querySelector('#photoLibrariesSection .section-subtitle');
      if (photoSub && t.media_sec2_sub) photoSub.textContent = t.media_sec2_sub;

      const artEyebrow = document.querySelector('#articlesSection .eyebrow');
      if (artEyebrow && t.media_sec3_eyebrow) artEyebrow.textContent = t.media_sec3_eyebrow;
      const artTitle = document.querySelector('#articlesSection .section-title');
      if (artTitle && t.media_sec3_title) artTitle.textContent = t.media_sec3_title;
      const artSub = document.querySelector('#articlesSection .section-subtitle');
      if (artSub && t.media_sec3_sub) artSub.textContent = t.media_sec3_sub;
    }

    // Footer
    document.querySelectorAll('footer a.nav-link').forEach(link => {
      const href = (link.getAttribute('href') || '').toLowerCase();
      if (href.includes('index.html')) link.textContent = t.nav_home;
      else if (href.includes('about.html')) link.textContent = t.nav_about;
      else if (href.includes('legacy.html')) link.textContent = t.nav_legacy;
      else if (href.includes('awards.html')) {
        link.textContent = (t.nav_awards || 'Awards 2026').replace(/(?:202\d|२०२\d)/g, activeEdYear);
      }
      else if (href.includes('nominate.html')) link.textContent = t.nav_nominate;
      else if (href.includes('voices.html')) link.textContent = t.nav_circle;
      else if (href.includes('media.html')) link.textContent = t.nav_media;
    });
  }

  function setLanguage(lang) {
    localStorage.setItem('grd10_lang', lang);
    updateActiveButtons(lang);
    applyCuratedTranslations(lang);
    window.dispatchEvent(new CustomEvent('grd10:langchanged', { detail: { lang } }));
  }

  function updateActiveButtons(lang) {
    document.querySelectorAll('.lang-switcher-wrap').forEach(wrap => {
      wrap.querySelectorAll('.lang-btn').forEach(btn => {
        if (btn.getAttribute('data-lang') === lang) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    });
  }

  // Bind click listeners on all language switcher buttons across header and drawer
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetLang = btn.getAttribute('data-lang');
      if (targetLang) {
        setLanguage(targetLang);
      }
    });
  });

  // Apply initially on page load
  updateActiveButtons(currentLang);
  if (currentLang !== 'en') {
    applyCuratedTranslations(currentLang);
  }
}

