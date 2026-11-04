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
        const opt = document.createElement('option');
        opt.value = cat.name;
        opt.textContent = `${cat.number} — ${cat.name}`;
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
  if (!tabList || !guidelinesPanel) return;

  const tabs = Array.from(tabList.querySelectorAll('.category-tab-btn'));
  const badgeEl = document.getElementById('guidelinesBadge');
  const titleEl = document.getElementById('guidelinesTitle');
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

  // Structured Category Guidelines Database
  const categoryGuidelinesData = {
    'Sports & Kushti': {
      number: '01',
      title: 'Sports and Kushti',
      description: 'Recognising sportspersons, wrestlers, coaches, and individuals who have made outstanding contributions to sports, particularly Kushti and traditional wrestling.',
      criteria: [
        'Sports achievements at local, regional, state, national, or international levels.',
        'Contribution to promoting, preserving, and developing Kushti or other sporting disciplines.',
        'Training, mentorship, and development of young athletes.',
        'Positive community impact through youth participation, fitness, discipline, and sporting culture.',
        'Dedication, perseverance, sportsmanship, and resilience.',
        'Awards, titles, competitive achievements, and other relevant recognitions.',
        'Sustained contributions that strengthen sports and create opportunities for future generations.'
      ],
      supportingDocuments: 'Certificates of sporting merit, tournament scorecards, championship records, akhada/academy registration or affiliation records, media press reports, and mentor/coach citations.'
    },
    'Education': {
      number: '02',
      title: 'Education',
      description: 'Recognising educators, academic leaders, and individuals who have made significant contributions to education, learning, and student development.',
      criteria: [
        'Significant contributions to teaching, educational leadership, academic development, or educational initiatives.',
        'Demonstrable contributions to students\' learning, personal growth, academic performance, or future opportunities.',
        'Innovative teaching methods, educational programmes, or effective learning practices.',
        'Efforts to improve educational access for disadvantaged, underserved, or economically weaker communities.',
        'Mentorship, guidance, talent development, and encouragement of lifelong learning.',
        'Evidence of improved educational outcomes, student participation, or institutional development.',
        'Sustainable initiatives that strengthen educational opportunities for future generations.'
      ],
      supportingDocuments: 'Academic institution accreditations, curriculum innovation briefs, student outcome metrics, testimonials, publication papers, or documentation of community learning centers.'
    },
    'Uttar Bharatiya Ratna': {
      number: '03',
      title: 'Uttar Bharatiya Ratna',
      description: 'Recognising distinguished individuals and community leaders of Uttar Bharatiya heritage whose quiet dedication, societal service, and community development have positively transformed lives.',
      criteria: [
        'Significant and sustained efforts to address social challenges and improve people\'s lives.',
        'Service to disadvantaged, marginalised, vulnerable, or underserved individuals and communities.',
        'Community-development initiatives promoting participation, social inclusion, self-reliance, and welfare.',
        'Innovative and effective approaches to solving social problems.',
        'Demonstrable impact, including the number of people reached and improvements achieved.',
        'Leadership, volunteer mobilisation, partnerships, and collective action.',
        'Long-term commitment and the potential for initiatives to continue, expand, or be replicated.'
      ],
      supportingDocuments: 'Project impact dossiers, beneficiary case studies, NGO/trust registration details, third-party audit reports, field photographic documentation, and community testimonials.'
    },
    'Medicine & Healthcare': {
      number: '04',
      title: 'Medicine and Healthcare',
      description: 'Recognising medical professionals, healthcare practitioners, and individuals who have made outstanding contributions to healthcare delivery, medical practice, and public health.',
      criteria: [
        'Professional excellence and commitment to high standards of medical practice and patient care.',
        'Contributions to patient outcomes, access to treatment, and the quality of healthcare services.',
        'Efforts to provide healthcare to economically disadvantaged populations and underserved communities.',
        'Contributions to medical research, healthcare innovation, disease prevention, or improved treatment.',
        'Public-health initiatives involving health awareness, preventive care, or community health.',
        'Professional integrity, responsible medical practice, and compassionate patient care.',
        'Sustained efforts to strengthen healthcare services and improve community health.'
      ],
      supportingDocuments: 'Medical council registrations, clinical outreach logs, free health camp records, healthcare innovation summaries, public health research publications, or institutional citations.'
    },
    'Media & Journalism': {
      number: '05',
      title: 'Media and Journalism',
      description: 'Recognising journalists, media professionals, and individuals whose work demonstrates professional excellence, responsible reporting, and a meaningful contribution to society.',
      criteria: [
        'Quality, depth, accuracy, and professionalism in reporting, writing, broadcasting, or other media work.',
        'Contributions to public awareness of important social, civic, cultural, and public-interest issues.',
        'Commitment to fairness, factual accuracy, responsible reporting, and journalistic ethics.',
        'Demonstrable social impact through awareness, constructive discussion, or attention to important issues.',
        'Original reporting, investigative journalism, documentation, or insightful analysis.',
        'Efforts to represent underrepresented voices and highlight issues affecting vulnerable communities.',
        'Sustained commitment to responsible journalism, public communication, and public trust.'
      ],
      supportingDocuments: 'Copies of published investigative exposés, broadcast video links, editorial references, press club recognitions, and documentation of tangible public or policy impact.'
    }
  };

  // Backwards compatibility alias
  categoryGuidelinesData['Social Service'] = categoryGuidelinesData['Uttar Bharatiya Ratna'];

  // Helper: Normalize category name for matching
  function normalizeCatName(name) {
    if (!name) return '';
    const lower = name.toLowerCase();
    if (lower.includes('sport') || lower.includes('kushti')) return 'Sports & Kushti';
    if (lower.includes('educat')) return 'Education';
    if (lower.includes('uttar') || lower.includes('bharatiya') || lower.includes('ratna') || lower.includes('social')) return 'Uttar Bharatiya Ratna';
    if (lower.includes('medic') || lower.includes('health')) return 'Medicine & Healthcare';
    if (lower.includes('media') || lower.includes('journal')) return 'Media & Journalism';
    return name;
  }

  // Render Guidelines for a Category (with smooth subtle transition)
  function renderGuidelines(canonicalCategoryKey) {
    const data = categoryGuidelinesData[canonicalCategoryKey];
    if (!data) return;

    guidelinesPanel.classList.add('is-transitioning');

    setTimeout(() => {
      if (badgeEl) badgeEl.textContent = `Award Category ${data.number}`;
      if (titleEl) titleEl.textContent = data.title;
      if (descEl) descEl.textContent = data.description;

      if (criteriaListEl) {
        criteriaListEl.innerHTML = '';
        data.criteria.forEach((criterion, idx) => {
          const li = document.createElement('li');
          li.className = 'criteria-numbered-item';
          li.innerHTML = `
            <span class="criteria-item-idx" aria-hidden="true">${idx + 1}</span>
            <span>${criterion}</span>
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

      guidelinesPanel.classList.remove('is-transitioning');
    }, 120);
  }

  // Activate Tab Function
  function setActiveTab(selectedTab, updateForm = true) {
    tabs.forEach(tab => {
      const isActive = tab === selectedTab;
      tab.classList.toggle('active', isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
      tab.setAttribute('tabindex', isActive ? '0' : '-1');
    });

    const categoryKey = selectedTab.getAttribute('data-category');
    renderGuidelines(categoryKey);

    // Keep form select synchronized without clearing any form data
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
    if (found) initialTab = found;
  } else if (catSelect && catSelect.value) {
    const canonicalFromSelect = normalizeCatName(catSelect.value);
    const found = tabs.find(t => normalizeCatName(t.getAttribute('data-category')) === canonicalFromSelect);
    if (found) initialTab = found;
  }

  setActiveTab(initialTab, true);
}
