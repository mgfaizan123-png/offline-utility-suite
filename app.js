// Initialize PWA
let deferredPrompt;

// Register Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then(reg => console.log('✅ Service Worker registered'))
    .catch(err => console.log('❌ SW registration failed:', err));
}

// PWA Install Prompt
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  document.getElementById('installPrompt').classList.add('show');
});

function installApp() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(choiceResult => {
      if (choiceResult.outcome === 'accepted') {
        console.log('✅ App installed');
        document.getElementById('installPrompt').classList.remove('show');
      }
      deferredPrompt = null;
    });
  }
}

function dismissInstallPrompt() {
  document.getElementById('installPrompt').classList.remove('show');
}

// Tab Switching
function switchTab(tabId, e) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
  e.target.classList.add('active');
  localStorage.setItem('activeTab', tabId);
}

// Restore last active tab
window.addEventListener('load', () => {
  const lastTab = localStorage.getItem('activeTab') || 'pdf-merge';
  const tabBtn = document.querySelector(`[onclick="switchTab('${lastTab}', event)"]`);
  if (tabBtn) {
    tabBtn.click();
  }
});

// ============ PDF MERGE ============
let mergeFiles = [];

const mergeDragArea = document.getElementById('mergeDragArea');
const mergeInput = document.getElementById('mergeInput');

if (mergeDragArea) {
  mergeDragArea.addEventListener('click', () => mergeInput.click());
  mergeDragArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    mergeDragArea.classList.add('dragover');
  });
  mergeDragArea.addEventListener('dragleave', () => {
    mergeDragArea.classList.remove('dragover');
  });
  mergeDragArea.addEventListener('drop', (e) => {
    e.preventDefault();
    mergeDragArea.classList.remove('dragover');
    handleMergeFiles(e.dataTransfer.files);
  });
  mergeInput.addEventListener('change', (e) => handleMergeFiles(e.target.files));
}

function handleMergeFiles(files) {
  mergeFiles = Array.from(files).filter(f => f.type === 'application/pdf');
  updateMergeList();
}

function updateMergeList() {
  const list = document.getElementById('mergeFiles');
  const container = document.getElementById('mergeFileList');
  list.innerHTML = '';
  
  if (mergeFiles.length > 0) {
    container.style.display = 'block';
    mergeFiles.forEach((file, idx) => {
      const li = document.createElement('li');
      li.className = 'file-item';
      li.innerHTML = `
        <span>${idx + 1}. ${file.name} (${(file.size / 1024).toFixed(2)} KB)</span>
        <button onclick="removeMergeFile(${idx})">Remove</button>
      `;
      list.appendChild(li);
    });
  } else {
    container.style.display = 'none';
  }
}

function removeMergeFile(idx) {
  mergeFiles.splice(idx, 1);
  updateMergeList();
}

function clearMergeList() {
  mergeFiles = [];
  updateMergeList();
  document.getElementById('mergeInput').value = '';
}

async function mergePdfs() {
  if (mergeFiles.length < 2) {
    alert('❌ Select at least 2 PDFs to merge');
    return;
  }

  const btn = document.querySelector('[onclick="mergePdfs()"]');
  const progressDiv = document.getElementById('mergeProgress');
  const progressFill = document.getElementById('mergeProgressFill');
  
  btn.disabled = true;
  progressDiv.style.display = 'block';

  try {
    const { PDFDocument } = PDFLib;
    const mergedPdf = await PDFDocument.create();

    for (let i = 0; i < mergeFiles.length; i++) {
      const arrayBuffer = await mergeFiles[i].arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      pages.forEach(page => mergedPdf.addPage(page));
      
      progressFill.style.width = ((i + 1) / mergeFiles.length * 100) + '%';
    }

    const pdfBytes = await mergedPdf.save();
    downloadFile(pdfBytes, 'merged.pdf', 'application/pdf');
    alert('✅ PDFs merged successfully!');
    clearMergeList();
  } catch (err) {
    alert('❌ Error: ' + err.message);
  } finally {
    btn.disabled = false;
    progressDiv.style.display = 'none';
    progressFill.style.width = '0%';
  }
}

// ============ IMAGE TO PDF ============
let imageFiles = [];

const imgDragArea = document.getElementById('imgDragArea');
const imageToPdfInput = document.getElementById('imageToPdfInput');

if (imgDragArea) {
  imgDragArea.addEventListener('click', () => imageToPdfInput.click());
  imgDragArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    imgDragArea.classList.add('dragover');
  });
  imgDragArea.addEventListener('dragleave', () => {
    imgDragArea.classList.remove('dragover');
  });
  imgDragArea.addEventListener('drop', (e) => {
    e.preventDefault();
    imgDragArea.classList.remove('dragover');
    handleImageFiles(e.dataTransfer.files);
  });
  imageToPdfInput.addEventListener('change', (e) => handleImageFiles(e.target.files));
}

function handleImageFiles(files) {
  imageFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
  updateImageList();
}

function updateImageList() {
  const list = document.getElementById('imgFiles');
  const container = document.getElementById('imgFileList');
  list.innerHTML = '';
  
  if (imageFiles.length > 0) {
    container.style.display = 'block';
    imageFiles.forEach((file, idx) => {
      const li = document.createElement('li');
      li.className = 'file-item';
      li.innerHTML = `
        <span>${idx + 1}. ${file.name} (${(file.size / 1024).toFixed(2)} KB)</span>
        <button onclick="removeImageFile(${idx})">Remove</button>
      `;
      list.appendChild(li);
    });
  } else {
    container.style.display = 'none';
  }
}

function removeImageFile(idx) {
  imageFiles.splice(idx, 1);
  updateImageList();
}

function clearImageList() {
  imageFiles = [];
  updateImageList();
  document.getElementById('imageToPdfInput').value = '';
}

async function convertImagesToPdf() {
  if (imageFiles.length === 0) {
    alert('❌ Select at least 1 image');
    return;
  }

  const btn = document.querySelector('[onclick="convertImagesToPdf()"]');
  const progressDiv = document.getElementById('imgProgress');
  const progressFill = document.getElementById('imgProgressFill');
  const pageSize = document.getElementById('pageSize').value;
  
  btn.disabled = true;
  progressDiv.style.display = 'block';

  try {
    const { PDFDocument } = PDFLib;
    const pdfDoc = await PDFDocument.create();

    for (let i = 0; i < imageFiles.length; i++) {
      const arrayBuffer = await imageFiles[i].arrayBuffer();
      const mimeType = imageFiles[i].type;
      
      let image;
      if (mimeType === 'image/png') {
        image = await pdfDoc.embedPng(arrayBuffer);
      } else {
        image = await pdfDoc.embedJpg(arrayBuffer);
      }

      let width = image.width;
      let height = image.height;

      if (pageSize === 'a4') {
        const a4Width = 595;
        const a4Height = 842;
        const ratio = Math.min(a4Width / width, a4Height / height);
        width = width * ratio;
        height = height * ratio;
      } else if (pageSize === 'letter') {
        const letterWidth = 612;
        const letterHeight = 792;
        const ratio = Math.min(letterWidth / width, letterHeight / height);
        width = width * ratio;
        height = height * ratio;
      }

      const page = pdfDoc.addPage([width, height]);
      page.drawImage(image, { x: 0, y: 0, width, height });
      
      progressFill.style.width = ((i + 1) / imageFiles.length * 100) + '%';
    }

    const pdfBytes = await pdfDoc.save();
    downloadFile(pdfBytes, 'images.pdf', 'application/pdf');
    alert('✅ PDF created successfully!');
    clearImageList();
  } catch (err) {
    alert('❌ Error: ' + err.message);
  } finally {
    btn.disabled = false;
    progressDiv.style.display = 'none';
    progressFill.style.width = '0%';
  }
}

// ============ IMAGE EDITOR ============
let currentImage = new Image();
let imageEdits = {
  rotation: 0,
  brightness: 100,
  contrast: 100,
  saturation: 100
};

function loadImage(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    currentImage.onload = () => {
      document.getElementById('imageControlsPanel').style.display = 'block';
      document.getElementById('imageEditPanel').style.display = 'block';
      resetImageEdits();
      updateImagePreview();
    };
    currentImage.src = event.target.result;
  };
  reader.readAsDataURL(file);
}

function updateImagePreview() {
  const canvas = document.getElementById('imageCanvas');
  const ctx = canvas.getContext('2d');
  
  imageEdits.rotation = parseInt(document.getElementById('rotationSlider').value);
  imageEdits.brightness = parseInt(document.getElementById('brightnessSlider').value);
  imageEdits.contrast = parseInt(document.getElementById('contrastSlider').value);
  imageEdits.saturation = parseInt(document.getElementById('saturationSlider').value);
  
  document.getElementById('rotationValue').textContent = imageEdits.rotation + '°';
  document.getElementById('brightnessValue').textContent = imageEdits.brightness + '%';
  document.getElementById('contrastValue').textContent = imageEdits.contrast + '%';
  document.getElementById('saturationValue').textContent = imageEdits.saturation + '%';

  canvas.width = currentImage.width;
  canvas.height = currentImage.height;

  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((imageEdits.rotation * Math.PI) / 180);
  ctx.translate(-canvas.width / 2, -canvas.height / 2);
  ctx.filter = `brightness(${imageEdits.brightness}%) contrast(${imageEdits.contrast}%) saturate(${imageEdits.saturation}%)`;
  ctx.drawImage(currentImage, 0, 0);
  ctx.restore();
}

function resetImageEdits() {
  imageEdits = { rotation: 0, brightness: 100, contrast: 100, saturation: 100 };
  document.getElementById('rotationSlider').value = 0;
  document.getElementById('brightnessSlider').value = 100;
  document.getElementById('contrastSlider').value = 100;
  document.getElementById('saturationSlider').value = 100;
  updateImagePreview();
}

function downloadEditedImage() {
  const canvas = document.getElementById('imageCanvas');
  const link = document.createElement('a');
  link.download = 'edited-image.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}

// ============ PDF REORDER ============
let pdfForReorder = null;
let pdfPagesData = [];

async function loadPdfForReorder(e) {
  const file = e.target.files[0];
  if (!file) return;

  try {
    const arrayBuffer = await file.arrayBuffer();
    pdfForReorder = await PDFLib.PDFDocument.load(arrayBuffer);
    pdfPagesData = [];
    displayPdfPages();
  } catch (err) {
    alert('❌ Error loading PDF: ' + err.message);
  }
}

function displayPdfPages() {
  const container = document.getElementById('reorderPages');
  const preview = document.getElementById('reorderPreview');
  
  container.innerHTML = '';
  const pages = pdfForReorder.getPages();
  
  pages.forEach((page, idx) => {
    const pageDiv = document.createElement('div');
    pageDiv.className = 'pdf-page-item';
    pageDiv.draggable = true;
    pageDiv.dataset.index = idx;
    pageDiv.innerHTML = `
      <span>📄 Page ${idx + 1}</span>
      <div class="pdf-controls">
        <button onclick="movePdfPageUp(${idx})">↑</button>
        <button onclick="movePdfPageDown(${idx})">↓</button>
        <button onclick="deletePdfPage(${idx})">🗑️</button>
      </div>
    `;
    pageDiv.addEventListener('dragstart', dragStartPage);
    pageDiv.addEventListener('dragover', dragOverPage);
    pageDiv.addEventListener('drop', dropPage);
    container.appendChild(pageDiv);
  });
  
  preview.style.display = 'block';
}

let draggedPageIndex = null;

function dragStartPage(e) {
  draggedPageIndex = parseInt(e.target.closest('.pdf-page-item').dataset.index);
  e.dataTransfer.effectAllowed = 'move';
}

function dragOverPage(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
}

function dropPage(e) {
  e.preventDefault();
  const targetIndex = parseInt(e.target.closest('.pdf-page-item').dataset.index);
  if (draggedPageIndex !== null && draggedPageIndex !== targetIndex) {
    const pages = pdfForReorder.getPages();
    const draggedPage = pages[draggedPageIndex];
    pages.splice(draggedPageIndex, 1);
    if (targetIndex < draggedPageIndex) {
      pages.splice(targetIndex, 0, draggedPage);
    } else {
      pages.splice(targetIndex - 1, 0, draggedPage);
    }
    displayPdfPages();
  }
}

function movePdfPageUp(idx) {
  if (idx > 0) {
    const pages = pdfForReorder.getPages();
    [pages[idx - 1], pages[idx]] = [pages[idx], pages[idx - 1]];
    displayPdfPages();
  }
}

function movePdfPageDown(idx) {
  const pages = pdfForReorder.getPages();
  if (idx < pages.length - 1) {
    [pages[idx], pages[idx + 1]] = [pages[idx + 1], pages[idx]];
    displayPdfPages();
  }
}

function deletePdfPage(idx) {
  if (confirm('Delete this page?')) {
    pdfForReorder.removePage(idx);
    displayPdfPages();
  }
}

function clearReorderList() {
  pdfForReorder = null;
  document.getElementById('reorderPages').innerHTML = '';
  document.getElementById('reorderPreview').style.display = 'none';
  document.getElementById('reorderInput').value = '';
}

async function savePdfReorder() {
  if (!pdfForReorder) {
    alert('❌ No PDF loaded');
    return;
  }

  try {
    const pdfBytes = await pdfForReorder.save();
    downloadFile(pdfBytes, 'reordered.pdf', 'application/pdf');
    alert('✅ PDF reordered successfully!');
  } catch (err) {
    alert('❌ Error: ' + err.message);
  }
}

// ============ PDF TOOLS ============
let pdfForTools = null;

async function loadPdfForTools(e) {
  const file = e.target.files[0];
  if (!file) return;

  try {
    const arrayBuffer = await file.arrayBuffer();
    pdfForTools = await PDFLib.PDFDocument.load(arrayBuffer);
    document.getElementById('pdfToolsPreview').style.display = 'block';
  } catch (err) {
    alert('❌ Error: ' + err.message);
  }
}

async function deleteAndRotatePdf() {
  if (!pdfForTools) {
    alert('❌ No PDF loaded');
    return;
  }

  try {
    const deleteInput = document.getElementById('deletePages').value.trim();
    const rotateInput = document.getElementById('rotatePages').value.trim();
    const rotateAngle = parseInt(document.getElementById('rotateAngle').value);

    // Parse delete pages
    let deletePages = [];
    if (deleteInput) {
      const parts = deleteInput.split(',');
      parts.forEach(part => {
        if (part.includes('-')) {
          const [start, end] = part.split('-').map(x => parseInt(x.trim()));
          for (let i = start; i <= end; i++) deletePages.push(i - 1);
        } else {
          deletePages.push(parseInt(part.trim()) - 1);
        }
      });
    }

    // Sort in descending order to avoid index issues
    deletePages.sort((a, b) => b - a);
    deletePages.forEach(idx => {
      if (idx >= 0 && idx < pdfForTools.getPageCount()) {
        pdfForTools.removePage(idx);
      }
    });

    // Parse rotate pages
    if (rotateInput) {
      const rotatePage = rotateInput.split(',');
      rotatePage.forEach(page => {
        const idx = parseInt(page.trim()) - 1;
        if (idx >= 0 && idx < pdfForTools.getPageCount()) {
          const pg = pdfForTools.getPage(idx);
          const currentRotation = pg.getRotation().angle || 0;
          pg.setRotation(currentRotation + rotateAngle);
        }
      });
    }

    const pdfBytes = await pdfForTools.save();
    downloadFile(pdfBytes, 'modified.pdf', 'application/pdf');
    alert('✅ PDF modified successfully!');
    clearPdfTools();
  } catch (err) {
    alert('❌ Error: ' + err.message);
  }
}

function clearPdfTools() {
  pdfForTools = null;
  document.getElementById('pdfToolsInput').value = '';
  document.getElementById('deletePages').value = '';
  document.getElementById('rotatePages').value = '';
  document.getElementById('pdfToolsPreview').style.display = 'none';
}

// ============ UTILITY FUNCTIONS ============
function downloadFile(bytes, filename, contentType) {
  const blob = new Blob([bytes], { type: contentType });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

// Handle browser offline/online events
window.addEventListener('online', () => {
  console.log('✅ Back online');
});

window.addEventListener('offline', () => {
  console.log('❌ Now offline');
});

console.log('✅ Offline Utility Suite loaded successfully!');
