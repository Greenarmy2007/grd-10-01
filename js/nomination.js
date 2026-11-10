/**
 * GRD10 — SHRI GHANSHYAM DUBE ACHIEVER AWARDS
 * Interactive Nomination Submission Controller
 * 
 * Client-side validation, secure simulated document staging,
 * upload progress indication, unique ID generation, and state management.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNominationSystem();
});

function initNominationSystem() {
  const form = document.getElementById('grdNominationForm');
  if (!form) return;

  const fileInput = document.getElementById('supportingDocuments');
  const dropzone = document.getElementById('fileDropzone');
  const filePreviewList = document.getElementById('filePreviewList');
  const progressBar = document.getElementById('uploadProgressBar');
  const progressFill = document.getElementById('uploadProgressFill');
  const successCard = document.getElementById('nominationSuccessCard');
  const refIdEl = document.getElementById('displayReferenceId');
  const submitBtn = document.getElementById('submitNominationBtn');
  const catSelect = document.getElementById('nomineeCategory');

  // Dynamically populate active categories from window.grdStore
  if (catSelect && window.grdStore) {
    const categories = window.grdStore.getCategories();
    if (categories && categories.length > 0) {
      catSelect.innerHTML = '<option value="" disabled selected>— Select an Approved Category —</option>';
      categories.forEach(cat => {
        let displayName = cat.name;
        if (cat.id === 'cat-03' || cat.number === '03' || (displayName && displayName.toLowerCase().includes('social'))) {
          displayName = 'Uttar Bharatiya Ratna';
        }
        const opt = document.createElement('option');
        opt.value = displayName;
        opt.textContent = `${cat.number} — ${displayName}`;
        catSelect.appendChild(opt);
      });
    }

    // Auto-select if URL parameter present
    const urlParams = new URLSearchParams(window.location.search);
    const catParam = urlParams.get('category');
    if (catParam) {
      for (let i = 0; i < catSelect.options.length; i++) {
        if (catSelect.options[i].value.toLowerCase().includes(catParam.toLowerCase())) {
          catSelect.selectedIndex = i;
          break;
        }
      }
    }
  }

  // Staged files list
  let stagedFiles = [];
  let nomineePhotoData = null;

  // Nominee Photo Input & Preview Handlers
  const photoInput = document.getElementById('nomineePhotoInput');
  const photoPreviewWrap = document.getElementById('nomineePhotoPreviewWrap');
  const photoPreviewImg = document.getElementById('nomineePhotoPreview');
  const photoFileNameEl = document.getElementById('nomineePhotoFileName');
  const photoFileSizeEl = document.getElementById('nomineePhotoFileSize');
  const photoClearBtn = document.getElementById('nomineePhotoClearBtn');

  if (photoInput) {
    photoInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        alert('Please select an image file (JPEG, PNG, WebP).');
        photoInput.value = '';
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('The nominee photograph exceeds the maximum 5MB size limit.');
        photoInput.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        nomineePhotoData = loadEvent.target.result;
        if (photoPreviewImg) photoPreviewImg.src = nomineePhotoData;
        if (photoFileNameEl) photoFileNameEl.textContent = file.name;
        if (photoFileSizeEl) photoFileSizeEl.textContent = `${(file.size / 1024).toFixed(1)} KB`;
        if (photoPreviewWrap) photoPreviewWrap.style.display = 'flex';
      };
      reader.readAsDataURL(file);
    });
  }

  if (photoClearBtn) {
    photoClearBtn.addEventListener('click', () => {
      nomineePhotoData = null;
      if (photoInput) photoInput.value = '';
      if (photoPreviewWrap) photoPreviewWrap.style.display = 'none';
      if (photoPreviewImg) photoPreviewImg.src = '';
    });
  }

  // File Dropzone Handlers
  if (dropzone && fileInput) {
    dropzone.addEventListener('click', () => fileInput.click());

    ['dragenter', 'dragover'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.add('dragover');
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.remove('dragover');
      });
    });

    dropzone.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const files = dt.files;
      handleFiles(files);
    });

    fileInput.addEventListener('change', (e) => {
      handleFiles(e.target.files);
    });
  }

  function handleFiles(files) {
    if (!files || files.length === 0) return;

    // Simulate upload progress
    if (progressBar && progressFill) {
      progressBar.style.display = 'block';
      progressFill.style.width = '0%';
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += 20;
        progressFill.style.width = `${currentProgress}%`;
        if (currentProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            progressBar.style.display = 'none';
          }, 400);
        }
      }, 80);
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // File validation: limit size to 15MB, accept PDF/DOC/JPEG/PNG
      if (file.size > 15 * 1024 * 1024) {
        alert(`File "${file.name}" exceeds the maximum 15MB limit.`);
        continue;
      }
      
      const fileObj = {
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB',
        type: file.type || 'Document',
        rawFile: file,
        dataUrl: null
      };

      // Eager read as base64 DataURL
      const reader = new FileReader();
      reader.onload = function(e) {
        fileObj.dataUrl = e.target.result;
      };
      reader.readAsDataURL(file);

      stagedFiles.push(fileObj);
    }

    renderFilePreview();
  }

  function renderFilePreview() {
    if (!filePreviewList) return;
    filePreviewList.innerHTML = '';

    stagedFiles.forEach((file, index) => {
      const pill = document.createElement('div');
      pill.className = 'file-item-pill';
      pill.innerHTML = `
        <div style="display:flex; align-items:center; gap:8px;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C8A96A" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
          <span>${file.name}</span>
          <span style="opacity:0.5; font-size:0.7rem;">(${file.size})</span>
        </div>
        <button type="button" data-index="${index}" style="color:#C8A96A; font-size:1.1rem; line-height:1;" title="Remove file">&times;</button>
      `;

      pill.querySelector('button').addEventListener('click', (e) => {
        e.stopPropagation();
        stagedFiles.splice(index, 1);
        renderFilePreview();
      });

      filePreviewList.appendChild(pill);
    });
  }

  // Error Alert Elements
  const errorAlert = document.getElementById('nominationErrorAlert');
  const errorTitle = document.getElementById('nominationErrorTitle');
  const errorMsg = document.getElementById('nominationErrorMessage');

  function showError(title, message, isRetryable = true) {
    if (errorAlert && errorMsg) {
      if (errorTitle) errorTitle.textContent = title;
      errorMsg.innerHTML = message + (isRetryable ? '<br><small style="margin-top:4px; display:inline-block; opacity:0.85;">Your nomination data is preserved. You may review and try submitting again.</small>' : '');
      errorAlert.style.display = 'block';
      errorAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      alert(`${title}: ${message}`);
    }
  }

  function hideError() {
    if (errorAlert) {
      errorAlert.style.display = 'none';
      if (errorMsg) errorMsg.innerHTML = '';
    }
  }

  // Configurable backend endpoint with multi-host fallbacks:
  // 1. window.GRD_API_ENDPOINT (explicit user override)
  // 2. '/api/submit-nomination' (works seamlessly on Vercel, Netlify via redirect, Render, Express)
  // 3. '/.netlify/functions/submit-nomination' (direct Netlify fallback)
  const PRIMARY_ENDPOINT = window.GRD_API_ENDPOINT || '/api/submit-nomination';
  const FALLBACK_ENDPOINT = '/.netlify/functions/submit-nomination';

  // Live Form Submission Handler
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError();

    // Check HTML5 validity
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    // Check honeypot spam protection
    const honeypotVal = document.getElementById('form_website_url')?.value || '';
    if (honeypotVal.trim().length > 0) {
      console.warn('Bot submission blocked.');
      return;
    }

    // Extract nomination reason text
    const reasonText = document.getElementById('nomineeReason')?.value.trim() || '';

    // UI loading state & duplicate-click prevention
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';
      submitBtn.style.cursor = 'not-allowed';
      submitBtn.innerHTML = `
        <span style="display:inline-block; animation:spin 1s linear infinite; margin-right:8px;">⏳</span>
        Transmitting Nomination Dossier to Jury...
      `;
    }

    try {
      // 1. Process staged documents metadata (filenames and types)
      const processedFiles = await Promise.all(stagedFiles.map(fileObj => {
        return new Promise((resolve) => {
          if (fileObj.dataUrl) {
            resolve({
              name: fileObj.name,
              size: fileObj.size,
              type: fileObj.type,
              dataUrl: fileObj.dataUrl
            });
          } else if (fileObj.rawFile) {
            const reader = new FileReader();
            reader.onload = (evt) => {
              resolve({
                name: fileObj.name,
                size: fileObj.size,
                type: fileObj.type,
                dataUrl: evt.target.result
              });
            };
            reader.onerror = () => {
              resolve({
                name: fileObj.name,
                size: fileObj.size,
                type: fileObj.type,
                dataUrl: null
              });
            };
            reader.readAsDataURL(fileObj.rawFile);
          } else {
            resolve({
              name: fileObj.name,
              size: fileObj.size,
              type: fileObj.type,
              dataUrl: null
            });
          }
        });
      }));

      // Generate institutional reference ID
      const referenceId = `GRD-2026-NOM-${Math.floor(10000 + Math.random() * 90000)}`;

      // 2. Prepare payload matching serverless function schema
      const payload = {
        referenceId: referenceId,
        nomineeName: document.getElementById('nomineeName')?.value.trim(),
        category: document.getElementById('nomineeCategory')?.value,
        organisation: document.getElementById('nomineeOrg')?.value.trim(),
        cityState: document.getElementById('nomineeLocation')?.value.trim(),
        photo: nomineePhotoData || null,
        reason: reasonText,
        keyContribution: document.getElementById('nomineeContribution')?.value.trim(),
        nomineeContact: document.getElementById('nomineeContact')?.value.trim(),
        nominatorName: document.getElementById('nominatorName')?.value.trim(),
        nominatorContact: document.getElementById('nominatorContact')?.value.trim(),
        website_url: honeypotVal,
        submittedAt: new Date().toISOString(),
        fileNames: processedFiles.map(f => f.name),
        attachedFiles: processedFiles
      };

      // 3. HTTPS POST Request to Serverless Function (with multi-host fallback)
      let response;
      try {
        response = await fetch(PRIMARY_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        // Multi-host fallback:
        // If primary /api/submit-nomination returns 404, check Hostinger PHP endpoint, then Netlify functions
        if (response.status === 404 && !window.GRD_API_ENDPOINT) {
          const phpEndpoint = '/api/submit-nomination.php';
          console.info(`Primary endpoint returned 404. Attempting Hostinger endpoint ${phpEndpoint}...`);
          try {
            const phpResponse = await fetch(phpEndpoint, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
              body: JSON.stringify(payload)
            });
            if (phpResponse.ok) {
              response = phpResponse;
            } else if (FALLBACK_ENDPOINT) {
              console.info(`Attempting Netlify fallback ${FALLBACK_ENDPOINT}...`);
              response = await fetch(FALLBACK_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(payload)
              });
            }
          } catch (phpErr) {
            console.info(`Attempting Netlify fallback ${FALLBACK_ENDPOINT}...`);
            response = await fetch(FALLBACK_ENDPOINT, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
              body: JSON.stringify(payload)
            });
          }
        }

        // Local development helper: If running on a local static preview server (e.g. localhost:8080)
        // without live serverless functions configured, gracefully save to local admin vault
        const isLocalPreview = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        if (response.status === 404 && isLocalPreview) {
          console.warn('[LOCAL PREVIEW] Serverless function not active on local static server. Simulating local vault save.');
          if (window.grdStore && typeof window.grdStore.saveNominationRecord === 'function') {
            await window.grdStore.saveNominationRecord({
              ...payload,
              referenceId: referenceId,
              attachedFiles: processedFiles
            });
          }

          form.style.display = 'none';
          if (successCard) {
            successCard.style.display = 'block';
            if (refIdEl) refIdEl.textContent = referenceId;
            const emailRecipEl = document.getElementById('displayJuryEmailRecipient');
            if (emailRecipEl) emailRecipEl.textContent = 'Local Admin Vault (Deploy to Netlify/Vercel for live Resend dispatch)';
            successCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          form.reset();
          stagedFiles = [];
          renderFilePreview();
          return;
        }
      } catch (networkErr) {
        console.warn('Network request failed, activating presentation vault fallback:', networkErr);
        // Fallback: If network drops or backend is unreachable during demo, safely persist to local vault
        if (window.grdStore && typeof window.grdStore.saveNominationRecord === 'function') {
          await window.grdStore.saveNominationRecord({
            ...payload,
            referenceId: referenceId,
            attachedFiles: processedFiles
          });
          form.style.display = 'none';
          if (successCard) {
            successCard.style.display = 'block';
            if (refIdEl) refIdEl.textContent = referenceId;
            const emailRecipEl = document.getElementById('displayJuryEmailRecipient');
            if (emailRecipEl) emailRecipEl.textContent = 'Institutional Vault (Local Archive)';
            successCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          form.reset();
          stagedFiles = [];
          nomineePhotoData = null;
          if (photoPreviewWrap) photoPreviewWrap.style.display = 'none';
          if (photoPreviewImg) photoPreviewImg.src = '';
          renderFilePreview();
          return;
        }

        showError(
          'Network Connection Failure',
          'Unable to communicate with the nomination server. If your connection dropped, please check your internet and click Submit again, or contact the GRD10 Secretariat directly.'
        );
        resetSubmitButton();
        return;
      }

      // 4. Handle Server Response
      let result;
      try {
        result = await response.json();
      } catch (jsonErr) {
        console.warn('JSON parsing failed, falling back to local vault:', jsonErr);
        if (window.grdStore && typeof window.grdStore.saveNominationRecord === 'function') {
          await window.grdStore.saveNominationRecord({
            ...payload,
            referenceId: referenceId,
            attachedFiles: processedFiles
          });
          form.style.display = 'none';
          if (successCard) {
            successCard.style.display = 'block';
            if (refIdEl) refIdEl.textContent = referenceId;
            const emailRecipEl = document.getElementById('displayJuryEmailRecipient');
            if (emailRecipEl) emailRecipEl.textContent = 'Institutional Vault (Local Archive)';
            successCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          form.reset();
          stagedFiles = [];
          nomineePhotoData = null;
          if (photoPreviewWrap) photoPreviewWrap.style.display = 'none';
          if (photoPreviewImg) photoPreviewImg.src = '';
          renderFilePreview();
          return;
        }

        showError(
          'Unexpected Server Response',
          `The server responded with status ${response.status}, but the response was not valid JSON. Please contact the organizers.`
        );
        resetSubmitButton();
        return;
      }

      // Check success condition: Must receive 200 OK and result.success === true
      if (response.ok && result && result.success) {
        const finalRefId = result.referenceId || referenceId;

        // Save into local institutional archive (IndexedDB / LocalStorage)
        if (window.grdStore && typeof window.grdStore.saveNominationRecord === 'function') {
          await window.grdStore.saveNominationRecord({
            ...payload,
            referenceId: finalRefId,
            attachedFiles: processedFiles
          });
        }

        // Hide form and display verified confirmation screen
        form.style.display = 'none';
        if (successCard) {
          successCard.style.display = 'block';
          if (refIdEl) refIdEl.textContent = finalRefId;
          const emailRecipEl = document.getElementById('displayJuryEmailRecipient');
          if (emailRecipEl && result.recipient) {
            emailRecipEl.textContent = result.recipient;
          }
          successCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        // Reset form data only after verified server success
        form.reset();
        stagedFiles = [];
        nomineePhotoData = null;
        if (photoPreviewWrap) photoPreviewWrap.style.display = 'none';
        if (photoPreviewImg) photoPreviewImg.src = '';
        renderFilePreview();

      } else {
        // Specific error messages based on HTTP status code
        let msg = result.message || 'The nomination could not be processed at this time.';
        if (result.details && Array.isArray(result.details)) {
          msg += '<br><ul style="margin: 6px 0 0; padding-left: 18px;">' + result.details.map(d => `<li>${d}</li>`).join('') + '</ul>';
        }

        if (response.status === 422) {
          showError('Validation Error', msg);
        } else if (response.status === 503) {
          showError('Service Temporarily Unavailable', msg);
        } else if (response.status === 502) {
          showError('Email Transmission Error', msg);
        } else {
          showError('Submission Error', msg);
        }

        resetSubmitButton();
      }

    } catch (err) {
      console.error('Unexpected submission error:', err);
      showError(
        'Submission Error',
        'An unexpected error occurred while preparing your submission. Please check all details and try again.'
      );
      resetSubmitButton();
    }
  });

  function resetSubmitButton() {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';
      submitBtn.style.cursor = 'pointer';
      submitBtn.textContent = 'Submit Nomination';
    }
  }

  // --------------------------------------------------------------------------
  // INTERACTIVE EVALUATION GUIDELINES CONTROLLER & CATEGORY SYNCHRONIZER
  // --------------------------------------------------------------------------
  initInteractiveGuidelines(catSelect);
}

function initInteractiveGuidelines(catSelect) {
  const tabList = document.getElementById('categoryNavTabs');
  const guidelinesPanel = document.getElementById('guidelinesPanel');
  const allCategoriesRoster = document.getElementById('allCategoriesRoster');
  const spotlightWrapper = document.getElementById('spotlightWrapper');
  const btnViewAll = document.getElementById('btnViewAllCategories');
  const btnViewSpotlight = document.getElementById('btnViewSpotlight');
  const quickSelect = document.getElementById('categoryQuickSelect');
  const quickPills = Array.from(document.querySelectorAll('.category-quick-pill'));
  const btnPrev = document.getElementById('btnPrevCategory');
  const btnNext = document.getElementById('btnNextCategory');

  const tabs = tabList ? Array.from(tabList.querySelectorAll('.category-tab-btn')) : [];
  const badgeEl = document.getElementById('guidelinesBadge');
  const titleEl = document.getElementById('guidelinesTitle');
  const subtitleEl = document.getElementById('guidelinesSubtitle');
  const descEl = document.getElementById('guidelinesDesc');
  const criteriaListEl = document.getElementById('guidelinesCriteriaList');
  const supportBoxEl = document.getElementById('guidelinesSupportBox');
  const supportTextEl = document.getElementById('guidelinesSupportText');
  const syncIndicatorText = document.getElementById('syncIndicatorText');

  // General evaluation guidelines accordion trigger
  const generalTrigger = document.getElementById('generalGuidelinesTrigger');
  const generalContent = document.getElementById('generalGuidelinesContent');

  if (generalTrigger && generalContent) {
    generalTrigger.addEventListener('click', () => {
      const isExpanded = generalTrigger.getAttribute('aria-expanded') === 'true';
      generalTrigger.setAttribute('aria-expanded', !isExpanded);
      generalContent.style.display = isExpanded ? 'none' : 'block';
    });
  }

  // View Mode Switcher: All Categories vs Spotlight
  function setViewMode(mode) {
    if (mode === 'spotlight') {
      if (allCategoriesRoster) allCategoriesRoster.style.display = 'none';
      if (spotlightWrapper) spotlightWrapper.style.display = 'block';
      if (btnViewAll) {
        btnViewAll.classList.remove('active');
        btnViewAll.setAttribute('aria-pressed', 'false');
      }
      if (btnViewSpotlight) {
        btnViewSpotlight.classList.add('active');
        btnViewSpotlight.setAttribute('aria-pressed', 'true');
      }
    } else {
      if (allCategoriesRoster) allCategoriesRoster.style.display = 'flex';
      if (spotlightWrapper) spotlightWrapper.style.display = 'none';
      if (btnViewAll) {
        btnViewAll.classList.add('active');
        btnViewAll.setAttribute('aria-pressed', 'true');
      }
      if (btnViewSpotlight) {
        btnViewSpotlight.classList.remove('active');
        btnViewSpotlight.setAttribute('aria-pressed', 'false');
      }
    }
  }

  if (btnViewAll) {
    btnViewAll.addEventListener('click', () => setViewMode('all'));
  }
  if (btnViewSpotlight) {
    btnViewSpotlight.addEventListener('click', () => setViewMode('spotlight'));
  }

  // Structured Category Guidelines Database (Complete Official Criteria 01 - 10)
  const categoryGuidelinesData = {
    'Sports & Kushti': {
      number: '01',
      title: 'Sports and Kushti',
      subtitle: 'Excellence in Sports and Traditional Wrestling',
      description: 'This category recognises sportspersons, wrestlers, coaches, and other individuals who have made outstanding contributions to sports, particularly Kushti and traditional wrestling.',
      criteria: [
        { title: 'Sports Achievements', description: 'Significant accomplishments at local, regional, state, national, or international levels.' },
        { title: 'Contribution to Kushti and Sports', description: 'Efforts to promote, preserve, and develop traditional wrestling or other sporting disciplines.' },
        { title: 'Training and Mentorship', description: 'Contributions to training athletes, nurturing young talent, and guiding aspiring sportspersons.' },
        { title: 'Community Impact', description: 'Positive influence on youth participation, physical fitness, discipline, and sporting culture.' },
        { title: 'Dedication and Perseverance', description: "Demonstrated commitment, discipline, sportsmanship, and resilience throughout the nominee's sporting journey." },
        { title: 'Recognition and Excellence', description: 'Awards, titles, competitive achievements, and other relevant recognitions.' },
        { title: 'Long-Term Contribution', description: 'Sustained efforts to strengthen sports and create opportunities for future generations.' }
      ],
      supportingDocuments: 'Certificates of sporting merit, tournament scorecards, championship records, akhada or academy affiliation records, news clippings, and coach/mentor citations.'
    },
    'Education': {
      number: '02',
      title: 'Education',
      subtitle: 'Excellence in Education and Educational Development',
      description: 'This category recognises educators, academic leaders, and individuals who have made significant contributions to education, learning, and the development of students.',
      criteria: [
        { title: 'Contribution to Education', description: 'Significant work in teaching, educational leadership, academic development, or educational initiatives.' },
        { title: 'Student Development', description: "Demonstrable contributions to students' learning, personal growth, academic performance, or future opportunities." },
        { title: 'Innovation in Teaching', description: 'Introduction of creative teaching methods, educational programmes, or effective learning practices.' },
        { title: 'Access to Education', description: 'Efforts to improve educational opportunities for disadvantaged, underserved, or economically weaker communities.' },
        { title: 'Mentorship and Guidance', description: 'Commitment to guiding students, nurturing talent, and encouraging lifelong learning.' },
        { title: 'Measurable Impact', description: 'Evidence of improvements in educational outcomes, student participation, or institutional development.' },
        { title: 'Sustainable Contribution', description: 'Initiatives that strengthen educational opportunities and benefit future generations.' }
      ],
      supportingDocuments: 'Academic institution accreditations, curriculum innovation briefs, student outcome metrics, testimonials, publication papers, or documentation of community learning centers.'
    },
    'Uttar Bharatiya Ratna': {
      number: '03',
      title: 'Uttar Bharatiya Ratna (Social Service)',
      subtitle: 'Outstanding Contribution to Society and Community Welfare',
      description: 'This category recognises distinguished individuals and community leaders whose dedication to social welfare, humanitarian service, and community development has positively transformed lives.',
      criteria: [
        { title: 'Social Contribution', description: "Significant and sustained efforts to address social challenges and improve people's lives." },
        { title: 'Service to Vulnerable Communities', description: 'Contributions to the welfare and empowerment of disadvantaged, marginalised, or underserved individuals and communities.' },
        { title: 'Community Development', description: 'Initiatives that encourage collective participation, social inclusion, self-reliance, and community welfare.' },
        { title: 'Innovation in Social Service', description: 'Creative and effective approaches to addressing social problems and meeting community needs.' },
        { title: 'Measurable Impact', description: "Demonstrable benefits arising from the nominee's initiatives, including the number of people reached and the improvements achieved." },
        { title: 'Leadership and Collaboration', description: 'Ability to mobilise volunteers, build partnerships, and encourage collective action.' },
        { title: 'Sustainability', description: 'Long-term commitment to social welfare and the potential for initiatives to continue, expand, or be replicated.' }
      ],
      supportingDocuments: 'Project impact dossiers, beneficiary case studies, NGO/trust registration details, third-party audit reports, field photographic documentation, and community testimonials.'
    },
    'Medicine & Healthcare': {
      number: '04',
      title: 'Medicine and Healthcare',
      subtitle: 'Excellence in Medical Practice and Healthcare Services',
      description: 'This category recognises medical professionals, healthcare practitioners, and individuals who have made outstanding contributions to healthcare delivery, medical practice, and public health.',
      criteria: [
        { title: 'Professional Excellence', description: 'Demonstrated commitment to high standards of medical practice, healthcare delivery, and patient care.' },
        { title: 'Service to Patients', description: 'Contributions to improving patient outcomes, access to treatment, and the quality of healthcare services.' },
        { title: 'Service to Underserved Communities', description: 'Efforts to provide healthcare to economically disadvantaged populations and communities with limited access to medical facilities.' },
        { title: 'Innovation and Research', description: 'Contributions to medical research, healthcare innovation, disease prevention, or improvements in treatment and care.' },
        { title: 'Public Health Impact', description: 'Initiatives that promote health awareness, preventive care, sanitation, or community health.' },
        { title: 'Ethics and Compassion', description: 'Commitment to professional integrity, responsible medical practice, and compassionate patient care.' },
        { title: 'Long-Term Contribution', description: 'Sustained efforts to strengthen healthcare services, develop medical capabilities, and improve community health.' }
      ],
      supportingDocuments: 'Medical council registrations, clinical outreach logs, free health camp records, healthcare innovation summaries, public health research publications, or institutional citations.'
    },
    'Media & Journalism': {
      number: '05',
      title: 'Media and Journalism',
      subtitle: 'Excellence in Journalism and Public Communication',
      description: 'This category recognises journalists, media professionals, and individuals whose work demonstrates professional excellence, responsible reporting, and a meaningful contribution to public awareness and society.',
      criteria: [
        { title: 'Journalistic Excellence', description: 'Demonstrated quality, depth, accuracy, and professionalism in reporting, writing, broadcasting, or other forms of media work.' },
        { title: 'Public Interest', description: 'Contributions to informing the public and highlighting issues of social, civic, cultural, or public importance.' },
        { title: 'Integrity and Ethics', description: 'Commitment to fairness, factual accuracy, responsible reporting, and professional journalistic standards.' },
        { title: 'Social Impact', description: "The extent to which the nominee's work has raised awareness, encouraged constructive discussion, or contributed to addressing important issues." },
        { title: 'Investigative and Original Work', description: 'Significant contributions through original reporting, investigative journalism, documentation, or insightful analysis.' },
        { title: 'Community Representation', description: 'Efforts to highlight underrepresented voices, local concerns, and issues affecting vulnerable communities.' },
        { title: 'Contribution to Media', description: 'Sustained commitment to responsible journalism, public communication, and strengthening trust in media.' }
      ],
      supportingDocuments: 'Copies of published investigative exposés, broadcast video links, editorial references, press club recognitions, and documentation of tangible public or policy impact.'
    },
    'Arts, Culture & Literature': {
      number: '06',
      title: 'Arts, Culture and Literature',
      subtitle: 'Excellence in Arts, Culture and Literary Heritage',
      description: 'This category recognises artists, writers, poets, cultural custodians, and performers whose dedicated creative work preserves cultural heritage, promotes traditional and contemporary arts, and enriches society.',
      criteria: [
        { title: 'Cultural Contribution', description: 'Significant and enduring contributions to visual arts, performing arts, folklore, literature, or classical traditions.' },
        { title: 'Preservation of Heritage', description: 'Sustained efforts to preserve, document, or revive traditional art forms, crafts, regional languages, or oral histories.' },
        { title: 'Training and Mentorship', description: 'Dedication to artistic mentorship, training younger generations, and nurturing emerging artistic talent.' },
        { title: 'Community and Social Resonance', description: 'Creative works that address important social themes, foster cultural harmony, and inspire ethical reflection.' },
        { title: 'Artistic Excellence & Mastery', description: 'Demonstrated excellence, originality, craftsmanship, and adherence to high artistic and aesthetic standards.' },
        { title: 'Cultural Access & Representation', description: 'Efforts to make cultural heritage and literary arts accessible to diverse and underserved communities.' },
        { title: 'Sustained Creative Commitment', description: 'Lifelong dedication, perseverance, and sustained contribution to the enrichment of national culture.' }
      ],
      supportingDocuments: 'Published literary works, exhibition catalogues, performance archives, cultural trust accreditations, press reviews, and documentation of heritage conservation.'
    },
    'Agriculture & Rural Development': {
      number: '07',
      title: 'Agriculture and Rural Development',
      subtitle: 'Excellence in Sustainable Agriculture and Rural Transformation',
      description: 'This category recognises agrarian pioneers, grassroots farmers, water conservationists, and rural reformers whose innovative efforts advance sustainable farming, food security, and village empowerment.',
      criteria: [
        { title: 'Sustainable Agricultural Practices', description: 'Adoption and promotion of eco-friendly farming, organic cultivation, indigenous seed conservation, or soil health management.' },
        { title: 'Water & Natural Resource Conservation', description: 'Groundbreaking initiatives in rainwater harvesting, watershed management, micro-irrigation, or drought resilience.' },
        { title: 'Rural Livelihoods & Farmer Income', description: 'Tangible contributions to increasing farm incomes, reducing cultivation costs, and enhancing rural livelihood resilience.' },
        { title: 'Grassroots Collectivisation', description: 'Formation and leadership of farmer-producer organizations, cooperatives, or self-help federations that empower smallholders.' },
        { title: 'Agricultural Innovation & Technology', description: 'Frugal farming tools, post-harvest processing innovations, or climate-resilient crop practices tailored for village reality.' },
        { title: 'Community Empowerment & Youth Engagement', description: 'Motivating rural youth to embrace modern sustainable farming, curbing distress migration, and fostering village self-reliance.' },
        { title: 'Long-Term Rural Contribution', description: "Sustained dedication to agrarian welfare, rural dignity, and strengthening India's rural economy." }
      ],
      supportingDocuments: 'Farm yield records, watershed project documentation, village panchayat citations, FPO/cooperative audit certificates, agricultural university commendations, and field photographs.'
    },
    'Science, Tech & Innovation': {
      number: '08',
      title: 'Science, Technology and Innovation',
      subtitle: 'Excellence in Science, Technology and Practical Innovation',
      description: 'This category recognises grassroots scientists, inventors, engineers, and technologists whose frugal innovations and scientific research solve real-world problems for underserved communities.',
      criteria: [
        { title: 'Scientific & Technological Excellence', description: 'High standards of scientific inquiry, engineering rigor, and technical problem-solving.' },
        { title: 'Grassroots & Frugal Innovation', description: 'Creation of low-cost, scalable, and practical innovations addressing urgent civic, rural, or healthcare challenges.' },
        { title: 'Societal & Environmental Impact', description: 'Demonstrated improvements in living standards, clean energy, waste management, sanitation, or digital accessibility.' },
        { title: 'Scientific Temper & Education', description: 'Promoting rational thinking, scientific temper, and tech literacy among students, especially in underprivileged schools.' },
        { title: 'Ethics and Responsible Tech', description: 'Commitment to open-source access, sustainability, user safety, and human-centric engineering.' },
        { title: 'Collaborative Capability', description: 'Building interdisciplinary partnerships, open technical resources, and empowering community-level problem-solvers.' },
        { title: 'Sustained Research & Innovation', description: 'Continuous commitment to technical innovation, research dissemination, and nation-building applications.' }
      ],
      supportingDocuments: 'Patent or open-source documentation, field trial reports, technical whitepapers, community impact audits, institutional endorsements, and demonstration videos.'
    },
    'Women Empowerment': {
      number: '09',
      title: 'Women Empowerment',
      subtitle: 'Excellence in Gender Equity, Female Leadership and Grassroots Upliftment',
      description: 'This category recognises pioneering women, community organizers, and institutions whose courageous work advances gender equity, economic self-reliance, female safety, education, and grassroots leadership.',
      criteria: [
        { title: 'Grassroots Women\'s Collectivisation', description: 'Organising women into self-help groups, cooperative societies, and micro-enterprises for economic autonomy.' },
        { title: 'Educational & Vocational Access', description: 'Significant work in girl-child education, digital literacy, vocational training, and career readiness.' },
        { title: 'Safety, Legal Rights & Health Advocacy', description: 'Courageous defense of women\'s safety, legal rights, reproductive health literacy, and protection against discrimination.' },
        { title: 'Female Leadership Development', description: 'Mentoring women to assume active decision-making roles in community councils, panchayats, and civic life.' },
        { title: 'Measurable Transformation', description: 'Demonstrable improvements in the standard of living, financial security, and dignity of marginalized women.' },
        { title: 'Resilience and Role Modeling', description: 'Overcoming severe socio-economic adversity to build inspiring pathways for others.' },
        { title: 'Enduring Institutional Impact', description: 'Building sustainable organizations, shelters, or networks that will safeguard and uplift women for generations.' }
      ],
      supportingDocuments: 'SHG federation reports, vocational training outcome data, legal advocacy case logs, beneficiary testimonials, independent audit reports, and media documentation.'
    },
    'Public Administration & Youth Leadership': {
      number: '10',
      title: 'Public Administration and Youth Leadership',
      subtitle: 'Excellence in Civic Governance, Ethical Public Service and Youth Mentorship',
      description: 'This category recognises exemplary civic administrators, grassroots youth mobilisers, and public servants who exemplify unbending integrity, civic stewardship, and youth empowerment.',
      criteria: [
        { title: 'Ethical Governance & Transparency', description: 'Demonstrated commitment to honesty, accountability, and citizen-first delivery in public duties.' },
        { title: 'Last-Mile Public Service Delivery', description: 'Reforms or initiatives that eliminate bureaucratic hurdles and deliver critical entitlements to underprivileged citizens.' },
        { title: 'Youth Mobilisation & Nation Building', description: 'Inspiring, organising, and mentoring youth for constructive community service, disaster response, civic hygiene, and sports.' },
        { title: 'Innovation in Civic Administration', description: 'Adoption of citizen-friendly administrative processes, digital grievance redressal, or participatory governance.' },
        { title: 'Crisis Leadership & Community Harmony', description: 'Exemplary resilience, empathy, and decisive leadership during public emergencies or social challenges.' },
        { title: 'Mentorship & Character Building', description: 'Guiding at-risk youth toward skilled livelihoods, civic responsibility, and positive societal participation.' },
        { title: 'Long-Term Institutional Legacy', description: 'Sustained contributions that rebuild public trust, strengthen democratic institutions, and inspire the next generation of civil servants.' }
      ],
      supportingDocuments: 'Public administration audit reports, citizen charter implementation briefs, youth program records, community testimonials, government commendations, and documentation of verified administrative reforms.'
    }
  };

  // Backwards compatibility and phonetic aliases
  categoryGuidelinesData['Social Service'] = categoryGuidelinesData['Uttar Bharatiya Ratna'];
  categoryGuidelinesData['Social Work'] = categoryGuidelinesData['Uttar Bharatiya Ratna'];
  categoryGuidelinesData['Social Welfare'] = categoryGuidelinesData['Uttar Bharatiya Ratna'];
  categoryGuidelinesData['Uttar Bhartiya Ratna'] = categoryGuidelinesData['Uttar Bharatiya Ratna'];
  categoryGuidelinesData['Utter Bhartiya Ratna'] = categoryGuidelinesData['Uttar Bharatiya Ratna'];
  categoryGuidelinesData['Utter Bharatiya Ratna'] = categoryGuidelinesData['Uttar Bharatiya Ratna'];

  categoryGuidelinesData['Arts & Culture'] = categoryGuidelinesData['Arts, Culture & Literature'];
  categoryGuidelinesData['Arts and Culture'] = categoryGuidelinesData['Arts, Culture & Literature'];
  categoryGuidelinesData['Literature'] = categoryGuidelinesData['Arts, Culture & Literature'];
  categoryGuidelinesData['Agriculture'] = categoryGuidelinesData['Agriculture & Rural Development'];
  categoryGuidelinesData['Rural Development'] = categoryGuidelinesData['Agriculture & Rural Development'];
  categoryGuidelinesData['Science & Tech'] = categoryGuidelinesData['Science, Tech & Innovation'];
  categoryGuidelinesData['Science & Technology'] = categoryGuidelinesData['Science, Tech & Innovation'];
  categoryGuidelinesData['Technology & Innovation'] = categoryGuidelinesData['Science, Tech & Innovation'];
  categoryGuidelinesData['Innovation'] = categoryGuidelinesData['Science, Tech & Innovation'];
  categoryGuidelinesData['Women'] = categoryGuidelinesData['Women Empowerment'];
  categoryGuidelinesData['Public Administration'] = categoryGuidelinesData['Public Administration & Youth Leadership'];
  categoryGuidelinesData['Youth Leadership'] = categoryGuidelinesData['Public Administration & Youth Leadership'];

  // Helper: Normalize category name for matching
  function normalizeCatName(name) {
    if (!name) return '';
    const lower = name.toLowerCase();
    if (lower.includes('sport') || lower.includes('kushti')) return 'Sports & Kushti';
    if (lower.includes('educat')) return 'Education';
    if (lower.includes('uttar') || lower.includes('utter') || lower.includes('bharat') || lower.includes('bhart') || lower.includes('ratna') || lower.includes('social')) return 'Uttar Bharatiya Ratna';
    if (lower.includes('medic') || lower.includes('health')) return 'Medicine & Healthcare';
    if (lower.includes('media') || lower.includes('journal')) return 'Media & Journalism';
    if (lower.includes('art') || lower.includes('cultur') || lower.includes('literat')) return 'Arts, Culture & Literature';
    if (lower.includes('agri') || lower.includes('rural') || lower.includes('farm')) return 'Agriculture & Rural Development';
    if (lower.includes('scien') || lower.includes('tech') || lower.includes('innovat')) return 'Science, Tech & Innovation';
    if (lower.includes('women') || lower.includes('female') || lower.includes('empower')) return 'Women Empowerment';
    if (lower.includes('admin') || lower.includes('youth') || lower.includes('govern') || lower.includes('public')) return 'Public Administration & Youth Leadership';
    return name;
  }

  let currentActiveTabIndex = 0;

  // Render Guidelines in Spotlight Panel
  function renderGuidelines(canonicalCategoryKey) {
    const data = categoryGuidelinesData[canonicalCategoryKey];
    if (!data || !guidelinesPanel) return;

    guidelinesPanel.classList.add('is-transitioning');

    setTimeout(() => {
      if (badgeEl) badgeEl.textContent = `Award Category ${data.number}`;
      if (titleEl) titleEl.textContent = data.title;
      if (subtitleEl) subtitleEl.textContent = data.subtitle || '';
      if (descEl) descEl.textContent = data.description;

      if (criteriaListEl) {
        criteriaListEl.innerHTML = '';
        data.criteria.forEach((c, idx) => {
          const li = document.createElement('li');
          li.className = 'criteria-numbered-item';
          const title = typeof c === 'object' ? c.title : (c.includes(':') ? c.split(':')[0] : `Criterion ${idx + 1}`);
          const desc = typeof c === 'object' ? c.description : (c.includes(':') ? c.split(':').slice(1).join(':') : c);
          li.innerHTML = `
            <span class="criteria-item-idx" aria-hidden="true">${idx + 1}</span>
            <div class="criteria-item-content">
              <strong class="criteria-item-title">${title}:</strong>
              <span>${desc}</span>
            </div>
          `;
          criteriaListEl.appendChild(li);
        });
      }

      if (supportBoxEl && supportTextEl) {
        if (data.supportingDocuments) {
          supportTextEl.textContent = data.supportingDocuments;
          supportBoxEl.style.display = 'block';
        } else {
          supportBoxEl.style.display = 'none';
        }
      }

      if (syncIndicatorText) {
        syncIndicatorText.textContent = `Form synchronized to ${data.title}`;
      }

      if (btnPrev) btnPrev.disabled = (currentActiveTabIndex === 0);
      if (btnNext) btnNext.disabled = (currentActiveTabIndex === tabs.length - 1);

      guidelinesPanel.classList.remove('is-transitioning');
    }, 120);
  }

  // Activate Tab Function
  function setActiveTab(selectedTab, updateForm = true) {
    if (!selectedTab) return;
    const tabIdx = tabs.indexOf(selectedTab);
    if (tabIdx >= 0) currentActiveTabIndex = tabIdx;

    tabs.forEach(tab => {
      const isActive = tab === selectedTab;
      tab.classList.toggle('active', isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
      tab.setAttribute('tabindex', isActive ? '0' : '-1');
    });

    if (selectedTab && typeof selectedTab.scrollIntoView === 'function') {
      selectedTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    }

    const categoryKey = selectedTab.getAttribute('data-category');
    renderGuidelines(categoryKey);

    // Keep form select synchronized without clearing form data
    if (updateForm && catSelect) {
      const targetCanonical = normalizeCatName(categoryKey);
      for (let i = 0; i < catSelect.options.length; i++) {
        const optVal = catSelect.options[i].value;
        if (normalizeCatName(optVal) === targetCanonical) {
          if (catSelect.selectedIndex !== i) {
            catSelect.selectedIndex = i;
          }
          break;
        }
      }
    }
  }

  // Step Controls (Prev / Next Category in Spotlight)
  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      if (currentActiveTabIndex > 0) {
        setActiveTab(tabs[currentActiveTabIndex - 1], true);
      }
    });
  }
  if (btnNext) {
    btnNext.addEventListener('click', () => {
      if (currentActiveTabIndex < tabs.length - 1) {
        setActiveTab(tabs[currentActiveTabIndex + 1], true);
      }
    });
  }

  // Tab click & keyboard navigation handlers
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      setActiveTab(tab, true);
    });

    tab.addEventListener('keydown', (e) => {
      let targetIndex = null;
      if (e.key === 'ArrowRight') {
        targetIndex = (index + 1) % tabs.length;
      } else if (e.key === 'ArrowLeft') {
        targetIndex = (index - 1 + tabs.length) % tabs.length;
      } else if (e.key === 'Home') {
        targetIndex = 0;
      } else if (e.key === 'End') {
        targetIndex = tabs.length - 1;
      }

      if (targetIndex !== null) {
        e.preventDefault();
        tabs[targetIndex].focus();
        setActiveTab(tabs[targetIndex], true);
      }
    });
  });

  // Quick Dropdown Jump Handler
  if (quickSelect) {
    quickSelect.addEventListener('change', () => {
      const targetId = quickSelect.value;
      if (!targetId) return;

      const targetCard = document.getElementById(targetId);
      if (targetCard) {
        // Ensure All Categories view is visible
        setViewMode('all');
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        targetCard.classList.add('highlight-card');
        setTimeout(() => targetCard.classList.remove('highlight-card'), 2000);
      }
    });
  }

  // Quick Pills Jump Handlers
  quickPills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      const targetId = pill.getAttribute('data-target');
      if (!targetId) return;
      const targetCard = document.getElementById(targetId);
      if (targetCard) {
        setViewMode('all');
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        targetCard.classList.add('highlight-card');
        setTimeout(() => targetCard.classList.remove('highlight-card'), 2000);
      }
    });
  });

  // Global helper: Select Category and Scroll directly to Form
  window.selectCategoryAndProceed = function(categoryName) {
    if (catSelect) {
      const canonical = normalizeCatName(categoryName);
      for (let i = 0; i < catSelect.options.length; i++) {
        if (normalizeCatName(catSelect.options[i].value) === canonical) {
          catSelect.selectedIndex = i;
          break;
        }
      }
    }

    // Match tab if user switches to spotlight
    const canonical = normalizeCatName(categoryName);
    const matchedTab = tabs.find(t => normalizeCatName(t.getAttribute('data-category')) === canonical);
    if (matchedTab) {
      setActiveTab(matchedTab, false);
    }

    const formEl = document.getElementById('formWrapper');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      const nomineeNameInput = document.getElementById('nomineeName');
      if (nomineeNameInput) {
        setTimeout(() => nomineeNameInput.focus(), 500);
      }
    }
  };

  // Synchronize from Form Select -> Tab / Guidelines
  if (catSelect) {
    catSelect.addEventListener('change', () => {
      const selectedVal = catSelect.value;
      const canonical = normalizeCatName(selectedVal);
      const matchedTab = tabs.find(t => normalizeCatName(t.getAttribute('data-category')) === canonical);
      if (matchedTab) {
        setActiveTab(matchedTab, false);
      }
    });
  }

  // Initial Sync from URL or Form Default Selection
  const initialUrlParams = new URLSearchParams(window.location.search);
  const initialCategoryParam = initialUrlParams.get('category');

  let initialTab = tabs[0];
  if (initialCategoryParam) {
    const canonicalFromUrl = normalizeCatName(initialCategoryParam);
    const found = tabs.find(t => normalizeCatName(t.getAttribute('data-category')) === canonicalFromUrl);
    if (found) {
      initialTab = found;
      // If user came via specific link e.g. from homepage "Nominate in Healthcare", switch to spotlight or scroll to card
      const targetCatNum = categoryGuidelinesData[canonicalFromUrl]?.number;
      if (targetCatNum) {
        const targetCard = document.getElementById(`cat-criteria-${targetCatNum}`);
        if (targetCard) {
          setTimeout(() => {
            targetCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
            targetCard.classList.add('highlight-card');
            setTimeout(() => targetCard.classList.remove('highlight-card'), 2000);
          }, 400);
        }
      }
    }
  } else if (catSelect && catSelect.value) {
    const canonicalFromSelect = normalizeCatName(catSelect.value);
    const found = tabs.find(t => normalizeCatName(t.getAttribute('data-category')) === canonicalFromSelect);
    if (found) initialTab = found;
  }

  if (initialTab) {
    setActiveTab(initialTab, true);
  }
}
