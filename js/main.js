/**
 * GRD-10 — SHRI GHANSHYAM DUBE ACHIEVER AWARDS
 * Core UI Logic, Sticky Nav, Modals, Drawer & Accessible Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileNavigation();
  initVideoModal();
  initAwardeeModal();
  initSmoothScroll();
});

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

/* 3. VIDEO MODAL (Accessible, No-Autoplay per Guidelines) */
function initVideoModal() {
  const modal = document.getElementById('videoModal');
  if (!modal) return;

  const iframe = modal.querySelector('iframe');
  const modalTitle = modal.querySelector('.modal-video-title');
  const modalSpeaker = modal.querySelector('.modal-video-speaker');
  const closeBtn = modal.querySelector('.modal-close-btn');

  window.openVideoModal = function(videoUrl, title, speaker) {
    if (modalTitle) modalTitle.textContent = title || 'Voice of the Legacy';
    if (modalSpeaker) modalSpeaker.textContent = speaker || '';
    if (iframe) {
      // Clean embed, strictly no autoplay
      iframe.src = videoUrl;
    }
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeVideoModal = () => {
    modal.classList.remove('open');
    if (iframe) iframe.src = 'about:blank';
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeVideoModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeVideoModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeVideoModal();
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
  if (!edition) return;

  document.querySelectorAll('[data-grd-bind="eventDate"]').forEach(el => {
    el.textContent = edition.date;
  });
  document.querySelectorAll('[data-grd-bind="eventLocation"]').forEach(el => {
    el.textContent = edition.location;
  });
  document.querySelectorAll('[data-grd-bind="eventYear"]').forEach(el => {
    el.textContent = edition.year;
  });
  document.querySelectorAll('[data-grd-bind="brandTheme"]').forEach(el => {
    el.textContent = edition.theme;
  });
}

document.addEventListener('DOMContentLoaded', syncDynamicSiteContent);
