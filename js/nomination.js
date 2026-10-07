/**
 * GRD-10 — SHRI GHANSHYAM DUBE ACHIEVER AWARDS
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

  // Staged files list
  let stagedFiles = [];

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
      stagedFiles.push({
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB',
        type: file.type || 'Document'
      });
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

  // Live Form Submission Handler
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Check validity
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    // Collect Data
    const formData = {
      nomineeName: document.getElementById('nomineeName')?.value.trim(),
      category: document.getElementById('nomineeCategory')?.value,
      organisation: document.getElementById('nomineeOrg')?.value.trim(),
      cityState: document.getElementById('nomineeLocation')?.value.trim(),
      reason: document.getElementById('nomineeReason')?.value.trim(),
      keyContribution: document.getElementById('nomineeContribution')?.value.trim(),
      nomineeContact: document.getElementById('nomineeContact')?.value.trim(),
      nominatorName: document.getElementById('nominatorName')?.value.trim(),
      nominatorContact: document.getElementById('nominatorContact')?.value.trim(),
      stagedDocumentsCount: stagedFiles.length,
      fileNames: stagedFiles.map(f => f.name)
    };

    // UI loading state
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span style="display:inline-block; animation:spin 1s linear infinite;">⏳</span>
        Submitting to Secure Jury Vault...
      `;
    }

    setTimeout(() => {
      const result = window.grdStore.submitNomination(formData);

      if (result.success) {
        // Hide form & Show confirmation
        form.style.display = 'none';
        if (successCard) {
          successCard.style.display = 'block';
          if (refIdEl) refIdEl.textContent = result.referenceId;
          successCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } else {
        alert('Submission could not be completed. Please try again.');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Submit Nomination';
        }
      }
    }, 700);
  });
}
