const mergeDropzone = document.getElementById('mergeDropzone');
const mergeInput = document.getElementById('mergeInput');
const mergeList = document.getElementById('mergeList');
const mergeBtn = document.getElementById('mergeBtn');
const mergeProgress = document.getElementById('mergeProgress');
const mergeProgressBar = document.getElementById('mergeProgressBar');
const mergeStatus = document.getElementById('mergeStatus');
const clearMergeBtn = document.getElementById('clearMergeBtn');
let mergeFiles = [];

const imagePdfDropzone = document.getElementById('imagePdfDropzone');
const imagePdfInput = document.getElementById('imagePdfInput');
const imagePdfList = document.getElementById('imagePdfList');
const imagePdfBtn = document.getElementById('imagePdfBtn');
const imagePdfStatus = document.getElementById('imagePdfStatus');
const imagePdfProgress = document.getElementById('imagePdfProgress');
const imagePdfProgressBar = document.getElementById('imagePdfProgressBar');
const clearImagePdfBtn = document.getElementById('clearImagePdfBtn');
let imagePdfFiles = [];

const reorderInput = document.getElementById('reorderInput');
const reorderPreviewBox = document.getElementById('reorderPreviewBox');
const reorderPageList = document.getElementById('reorderPageList');
const reorderStatus = document.getElementById('reorderStatus');
let reorderPdfDoc = null;
let reorderDragIndex = null;

const splitInput = document.getElementById('splitInput');
const splitBtn = document.getElementById('splitBtn');
const splitStatus = document.getElementById('splitStatus');
const splitProgress = document.getElementById('splitProgress');
const splitProgressBar = document.getElementById('splitProgressBar');
let splitPdfDoc = null;

// PDF Reader Variables
const pdfReaderInput = document.getElementById('pdfReaderInput');
const pdfReaderCanvas = document.getElementById('pdfReaderCanvas');
const pdfThumbList = document.getElementById('pdfThumbList');
const pdfReaderStatus = document.getElementById('pdfReaderStatus');
const readerPageStatus = document.getElementById('readerPageStatus');
const readerPrevBtn = document.getElementById('readerPrevBtn');
const readerNextBtn = document.getElementById('readerNextBtn');
let pdfReaderDoc = null;
let currentReaderPage = 1;
let readerTotalPages = 0;
let readerRenderScale = 1.5;

// PDF Quality Variables
const pdfCompressInput = document.getElementById('pdfCompressInput');
const pdfCompressBtn = document.getElementById('compressPdfBtn');
const pdfCompressProgress = document.getElementById('pdfCompressProgress');
const pdfCompressProgressBar = document.getElementById('pdfCompressProgressBar');
const pdfCompressStatus = document.getElementById('pdfCompressStatus');
const pdfQualitySlider = document.getElementById('pdfQualitySlider');
const pdfScaleInput = document.getElementById('pdfScaleInput');

const pdfToImageInput = document.getElementById('pdfToImageInput');
const pdfToImageStatus = document.getElementById('pdfToImageStatus');
const pdfToImageProgress = document.getElementById('pdfToImageProgress');
const pdfToImageProgressBar = document.getElementById('pdfToImageProgressBar');

// Extract Images Variables
const extractImagesInput = document.getElementById('extractImagesInput');
const extractImagesBtn = document.getElementById('extractImagesBtn');
const extractImagesStatus = document.getElementById('extractImagesStatus');
const extractImagesProgress = document.getElementById('extractImagesProgress');
const extractImagesProgressBar = document.getElementById('extractImagesProgressBar');
const extractScaleInput = document.getElementById('extractScaleInput');

const imageEditorInput = document.getElementById('imageEditorInput');
const rotationSlider = document.getElementById('rotationSlider');
const brightnessSlider = document.getElementById('brightnessSlider');
const contrastSlider = document.getElementById('contrastSlider');
const saturationSlider = document.getElementById('saturationSlider');
const imageCanvas = document.getElementById('imageCanvas');
const imageEditorStatus = document.getElementById('imageEditorStatus');
let currentEditorImage = null;

const resizeImageInput = document.getElementById('resizeImageInput');
const imageWidthInput = document.getElementById('imageWidthInput');
const imageQualityInput = document.getElementById('imageQualityInput');
const resizeImageStatus = document.getElementById('resizeImageStatus');

// OCR Variables
const ocrInput = document.getElementById('ocrInput');
const ocrPreview = document.getElementById('ocrPreview');
const ocrOutput = document.getElementById('ocrOutput');
const ocrStatus = document.getElementById('ocrStatus');
const ocrProgress = document.getElementById('ocrProgress');
const ocrProgressBar = document.getElementById('ocrProgressBar');
const ocrBtn = document.getElementById('ocrBtn');
let ocrWorker = null;

const faviconTextInput = document.getElementById('faviconTextInput');
const faviconBgInput = document.getElementById('faviconBgInput');
const faviconCanvas = document.getElementById('faviconCanvas');
const faviconStatus = document.getElementById('faviconStatus');

const textToPdfInput = document.getElementById('textToPdfInput');
const textToPdfStatus = document.getElementById('textToPdfStatus');
const textToPdfBtn = document.getElementById('textToPdfBtn');

const installBtn = document.getElementById('installAppBtn');
let deferredPrompt = null;

const periodicGrid = document.getElementById('periodicGrid');
const periodicTableData = [
  { num: 1, sym: 'H', name: 'Hydrogen' }, { num: 2, sym: 'He', name: 'Helium' },
  { num: 3, sym: 'Li', name: 'Lithium' }, { num: 4, sym: 'Be', name: 'Beryllium' },
  { num: 5, sym: 'B', name: 'Boron' }, { num: 6, sym: 'C', name: 'Carbon' },
  { num: 7, sym: 'N', name: 'Nitrogen' }, { num: 8, sym: 'O', name: 'Oxygen' },
  { num: 9, sym: 'F', name: 'Fluorine' }, { num: 10, sym: 'Ne', name: 'Neon' },
  { num: 11, sym: 'Na', name: 'Sodium' }, { num: 12, sym: 'Mg', name: 'Magnesium' },
  { num: 13, sym: 'Al', name: 'Aluminium' }, { num: 14, sym: 'Si', name: 'Silicon' },
  { num: 15, sym: 'P', name: 'Phosphorus' }, { num: 16, sym: 'S', name: 'Sulfur' },
  { num: 17, sym: 'Cl', name: 'Chlorine' }, { num: 18, sym: 'Ar', name: 'Argon' },
  { num: 19, sym: 'K', name: 'Potassium' }, { num: 20, sym: 'Ca', name: 'Calcium' },
  { num: 21, sym: 'Sc', name: 'Scandium' }, { num: 22, sym: 'Ti', name: 'Titanium' },
  { num: 23, sym: 'V', name: 'Vanadium' }, { num: 24, sym: 'Cr', name: 'Chromium' },
  { num: 25, sym: 'Mn', name: 'Manganese' }, { num: 26, sym: 'Fe', name: 'Iron' },
  { num: 27, sym: 'Co', name: 'Cobalt' }, { num: 28, sym: 'Ni', name: 'Nickel' },
  { num: 29, sym: 'Cu', name: 'Copper' }, { num: 30, sym: 'Zn', name: 'Zinc' },
  { num: 31, sym: 'Ga', name: 'Gallium' }, { num: 32, sym: 'Ge', name: 'Germanium' },
  { num: 33, sym: 'As', name: 'Arsenic' }, { num: 34, sym: 'Se', name: 'Selenium' },
  { num: 35, sym: 'Br', name: 'Bromine' }, { num: 36, sym: 'Kr', name: 'Krypton' }
];

// ============ UTILITY FUNCTIONS ============
function setStatus(el, msg, color = '') {
  if (!el) return;
  el.textContent = msg;
  el.style.color = color || 'inherit';
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function initializeDropzone(dropzone, input, cb) {
  dropzone.addEventListener('click', () => input.click());
  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('dragover');
  });
  dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    if (cb) cb(e.dataTransfer.files);
  });
  input.addEventListener('change', (e) => {
    if (cb) cb(e.target.files);
  });
}

// ============ PDF MERGE ============
function updateMergeList() {
  mergeList.innerHTML = '';
  if (!mergeFiles.length) return;
  mergeFiles.forEach((file, idx) => {
    const li = document.createElement('li');
    li.className = 'file-item';
    li.innerHTML = `
      <span class="file-name">${idx + 1}. ${file.name}</span>
      <button class="mini-btn" data-index="${idx}">Remove</button>
    `;
    li.querySelector('button').addEventListener('click', () => {
      mergeFiles.splice(idx, 1);
      updateMergeList();
    });
    mergeList.appendChild(li);
  });
}

initializeDropzone(mergeDropzone, mergeInput, (files) => {
  const valid = Array.from(files).filter(f => f.type === 'application/pdf');
  mergeFiles.push(...valid);
  updateMergeList();
  setStatus(mergeStatus, `${mergeFiles.length} PDF file(s) selected`);
});

clearMergeBtn.addEventListener('click', () => {
  mergeFiles = [];
  mergeInput.value = '';
  updateMergeList();
  setStatus(mergeStatus, 'Cleared');
});

mergeBtn.addEventListener('click', async () => {
  if (mergeFiles.length < 2) {
    setStatus(mergeStatus, 'Please select at least 2 PDFs.', '#fbbf24');
    return;
  }
  mergeBtn.disabled = true;
  mergeProgress.style.display = 'block';
  mergeProgressBar.style.width = '10%';
  setStatus(mergeStatus, 'Merging PDFs...');

  try {
    const { PDFDocument } = PDFLib;
    const merged = await PDFDocument.create();
    for (let i = 0; i < mergeFiles.length; i++) {
      const bytes = await mergeFiles[i].arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const pages = await merged.copyPages(pdf, pdf.getPageIndices());
      pages.forEach(page => merged.addPage(page));
      mergeProgressBar.style.width = `${((i + 1) / mergeFiles.length) * 100}%`;
    }
    const mergedBytes = await merged.save();
    const blob = new Blob([mergedBytes], { type: 'application/pdf' });
    downloadBlob(blob, 'merged-pdf.pdf');
    setStatus(mergeStatus, 'Merged successfully!');
    mergeFiles = [];
    updateMergeList();
    mergeInput.value = '';
  } catch (error) {
    console.error(error);
    setStatus(mergeStatus, `Error: ${error.message}`, '#f87171');
  } finally {
    mergeBtn.disabled = false;
    mergeProgress.style.display = 'none';
    mergeProgressBar.style.width = '0%';
  }
});

// ============ PDF READER WITH THUMBNAILS ============
async function loadPdfReader(file) {
  if (!file) return;
  try {
    const arrayBuffer = await file.arrayBuffer();
    pdfReaderDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    readerTotalPages = pdfReaderDoc.numPages;
    currentReaderPage = 1;
    pdfThumbList.innerHTML = '';
    
    setStatus(pdfReaderStatus, `Loading ${readerTotalPages} page(s)...`);
    
    // Generate thumbnails
    for (let i = 1; i <= Math.min(readerTotalPages, 50); i++) {
      const page = await pdfReaderDoc.getPage(i);
      const viewport = page.getViewport({ scale: 0.8 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      canvas.style.cursor = 'pointer';
      
      const thumbBtn = document.createElement('button');
      thumbBtn.className = 'thumb-btn';
      if (i === 1) thumbBtn.classList.add('active');
      thumbBtn.appendChild(canvas);
      
      const pageNum = document.createElement('div');
      pageNum.style.fontSize = '0.75rem';
      pageNum.style.marginTop = '4px';
      pageNum.textContent = `Page ${i}`;
      thumbBtn.appendChild(pageNum);
      
      thumbBtn.addEventListener('click', () => renderReaderPage(i));
      pdfThumbList.appendChild(thumbBtn);
      
      await page.render({ canvasContext: context, viewport }).promise;
    }
    
    // Render first page
    await renderReaderPage(1);
    setStatus(pdfReaderStatus, `Loaded ${readerTotalPages} pages`);
  } catch (error) {
    console.error(error);
    setStatus(pdfReaderStatus, `Error: ${error.message}`, '#f87171');
  }
}

async function renderReaderPage(pageNum) {
  if (!pdfReaderDoc || pageNum < 1 || pageNum > readerTotalPages) return;
  
  try {
    currentReaderPage = pageNum;
    const page = await pdfReaderDoc.getPage(pageNum);
    const viewport = page.getViewport({ scale: readerRenderScale });
    pdfReaderCanvas.width = viewport.width;
    pdfReaderCanvas.height = viewport.height;
    
    const context = pdfReaderCanvas.getContext('2d');
    await page.render({ canvasContext: context, viewport }).promise;
    
    readerPageStatus.textContent = `${pageNum} / ${readerTotalPages}`;
    
    // Update active thumbnail
    document.querySelectorAll('.thumb-btn').forEach((btn, idx) => {
      btn.classList.toggle('active', idx + 1 === pageNum);
    });
  } catch (error) {
    console.error(error);
  }
}

pdfReaderInput.addEventListener('change', (e) => loadPdfReader(e.target.files[0]));
readerPrevBtn.addEventListener('click', () => {
  if (currentReaderPage > 1) renderReaderPage(currentReaderPage - 1);
});
readerNextBtn.addEventListener('click', () => {
  if (currentReaderPage < readerTotalPages) renderReaderPage(currentReaderPage + 1);
});

// ============ PDF QUALITY & COMPRESSION ============
pdfCompressInput.addEventListener('change', (e) => {
  setStatus(pdfCompressStatus, `Selected: ${e.target.files[0]?.name || ''}`);
});

pdfCompressBtn.addEventListener('click', async () => {
  const file = pdfCompressInput.files[0];
  if (!file) {
    setStatus(pdfCompressStatus, 'Please select a PDF.', '#fbbf24');
    return;
  }

  pdfCompressBtn.disabled = true;
  pdfCompressProgress.style.display = 'block';
  pdfCompressProgressBar.style.width = '10%';

  try {
    const quality = parseFloat(pdfQualitySlider.value);
    const scale = parseFloat(pdfScaleInput.value);
    
    const pdfData = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
    const zip = new JSZip();
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      await page.render({ canvasContext: context, viewport }).promise;
      
      canvas.toBlob((blob) => {
        zip.file(`page-${i}.jpg`, blob);
      }, 'image/jpeg', quality);
      
      pdfCompressProgressBar.style.width = `${(i / pdf.numPages) * 100}%`;
    }
    
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    downloadBlob(zipBlob, `compressed-${file.name.replace(/\.pdf$/, '')}.zip`);
    setStatus(pdfCompressStatus, 'PDF compressed and exported!');
  } catch (error) {
    console.error(error);
    setStatus(pdfCompressStatus, `Error: ${error.message}`, '#f87171');
  } finally {
    pdfCompressBtn.disabled = false;
    pdfCompressProgress.style.display = 'none';
    pdfCompressProgressBar.style.width = '0%';
  }
});

// ============ PDF TO IMAGE ============
pdfToImageInput.addEventListener('change', async (e) => {
  setStatus(pdfToImageStatus, `Selected: ${e.target.files[0]?.name || ''}`);
});

document.getElementById('pdfToImageBtn').addEventListener('click', async () => {
  const file = pdfToImageInput.files[0];
  if (!file) {
    setStatus(pdfToImageStatus, 'Please select a PDF.', '#fbbf24');
    return;
  }

  pdfToImageProgress.style.display = 'block';
  const scale = parseFloat(document.getElementById('pdfScaleInput2').value) || 1.5;

  try {
    const pdfData = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
    const zip = new JSZip();

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      await page.render({ canvasContext: context, viewport }).promise;
      const dataUrl = canvas.toDataURL('image/png');
      zip.file(`page-${i}.png`, dataUrl.split(',')[1], { base64: true });
      pdfToImageProgressBar.style.width = `${(i / pdf.numPages) * 100}%`;
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    downloadBlob(zipBlob, `${file.name.replace(/\.pdf$/i, '')}-pages.zip`);
    setStatus(pdfToImageStatus, 'PDF pages converted and downloaded.');
  } catch (error) {
    console.error(error);
    setStatus(pdfToImageStatus, `Error: ${error.message}`, '#f87171');
  } finally {
    pdfToImageProgress.style.display = 'none';
    pdfToImageProgressBar.style.width = '0%';
  }
});

// ============ EXTRACT IMAGES FROM PDF ============
extractImagesBtn.addEventListener('click', async () => {
  const file = extractImagesInput.files[0];
  if (!file) {
    setStatus(extractImagesStatus, 'Please select a PDF.', '#fbbf24');
    return;
  }

  extractImagesBtn.disabled = true;
  extractImagesProgress.style.display = 'block';
  extractImagesProgressBar.style.width = '10%';

  try {
    const scale = parseFloat(extractScaleInput.value) || 1.5;
    const pdfData = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
    const zip = new JSZip();

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      
      // High-quality rendering
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = 'high';
      
      await page.render({ canvasContext: context, viewport }).promise;
      const dataUrl = canvas.toDataURL('image/png', 1.0);
      zip.file(`page-${String(i).padStart(3, '0')}.png`, dataUrl.split(',')[1], { base64: true });
      
      extractImagesProgressBar.style.width = `${(i / pdf.numPages) * 100}%`;
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    downloadBlob(zipBlob, `${file.name.replace(/\.pdf$/, '')}-extracted.zip`);
    setStatus(extractImagesStatus, 'All pages extracted as high-quality PNG images!');
  } catch (error) {
    console.error(error);
    setStatus(extractImagesStatus, `Error: ${error.message}`, '#f87171');
  } finally {
    extractImagesBtn.disabled = false;
    extractImagesProgress.style.display = 'none';
    extractImagesProgressBar.style.width = '0%';
  }
});

// ============ ENHANCED OCR ============
async function initOCRWorker() {
  if (!ocrWorker) {
    try {
      ocrWorker = await Tesseract.createWorker();
      await ocrWorker.loadLanguage('eng');
      await ocrWorker.initialize('eng');
    } catch (error) {
      console.error('OCR Worker init error:', error);
      return null;
    }
  }
  return ocrWorker;
}

ocrInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  
  if (file.type.startsWith('image/')) {
    const url = URL.createObjectURL(file);
    ocrPreview.src = url;
    ocrPreview.style.display = 'block';
    setStatus(ocrStatus, 'Image ready for OCR.');
  } else {
    setStatus(ocrStatus, 'PDF OCR not yet supported. Please use an image.');
  }
});

ocrBtn.addEventListener('click', async () => {
  const file = ocrInput.files[0];
  if (!file) {
    setStatus(ocrStatus, 'Please upload an image.', '#fbbf24');
    return;
  }

  ocrBtn.disabled = true;
  ocrProgress.style.display = 'block';
  ocrProgressBar.style.width = '10%';

  try {
    setStatus(ocrStatus, 'Initializing OCR engine...');
    const worker = await initOCRWorker();
    if (!worker) throw new Error('OCR worker failed to initialize');

    ocrProgressBar.style.width = '30%';
    setStatus(ocrStatus, 'Reading image...');

    const { data } = await worker.recognize(file);
    ocrOutput.value = data.text.trim();
    
    ocrProgressBar.style.width = '100%';
    setStatus(ocrStatus, `OCR complete! Extracted ${data.text.length} characters.`);
  } catch (error) {
    console.error(error);
    setStatus(ocrStatus, `OCR Error: ${error.message}`, '#f87171');
  } finally {
    ocrBtn.disabled = false;
    ocrProgress.style.display = 'none';
    ocrProgressBar.style.width = '0%';
  }
});

// ============ REORDER PDF ============
async function loadReorderPDF(file) {
  if (!file) return;
  try {
    const bytes = await file.arrayBuffer();
    reorderPdfDoc = await PDFLib.PDFDocument.load(bytes);
    const reorderPreviewBox = document.getElementById('reorderPreviewBox');
    reorderPreviewBox.style.display = 'block';
    const reorderPageList = document.getElementById('reorderPageList');
    reorderPageList.innerHTML = '';
    const total = reorderPdfDoc.getPageCount();
    
    for (let i = 0; i < total; i++) {
      const pageRow = document.createElement('div');
      pageRow.className = 'file-item';
      pageRow.draggable = true;
      pageRow.dataset.index = i;
      pageRow.innerHTML = `
        <span class="file-name">Page ${i + 1}</span>
        <div style="display:flex; gap:6px;">
          <button class="mini-btn" data-direction="up">↑</button>
          <button class="mini-btn" data-direction="down">↓</button>
          <button class="mini-btn" data-direction="delete">Delete</button>
        </div>
      `;
      
      pageRow.addEventListener('dragstart', (e) => {
        reorderDragIndex = Number(e.currentTarget.dataset.index);
      });
      pageRow.addEventListener('dragover', (e) => e.preventDefault());
      pageRow.addEventListener('drop', (e) => {
        e.preventDefault();
        const targetIndex = Number(e.currentTarget.dataset.index);
        if (reorderPdfDoc && reorderDragIndex !== null && reorderDragIndex !== targetIndex) {
          const pages = reorderPdfDoc.getPages();
          const [page] = pages.splice(reorderDragIndex, 1);
          pages.splice(targetIndex, 0, page);
          buildReorderList();
        }
      });
      
      pageRow.querySelector('[data-direction="up"]').addEventListener('click', () => movePageInReorder(i, -1));
      pageRow.querySelector('[data-direction="down"]').addEventListener('click', () => movePageInReorder(i, 1));
      pageRow.querySelector('[data-direction="delete"]').addEventListener('click', () => deletePageFromReorder(i));
      reorderPageList.appendChild(pageRow);
    }
    setStatus(reorderStatus, `${total} page(s) loaded.`);
  } catch (error) {
    console.error(error);
    setStatus(reorderStatus, `Error: ${error.message}`, '#f87171');
  }
}

function buildReorderList() {
  if (!reorderPdfDoc) return;
  const reorderPageList = document.getElementById('reorderPageList');
  reorderPageList.innerHTML = '';
  const total = reorderPdfDoc.getPageCount();
  
  for (let i = 0; i < total; i++) {
    const pageRow = document.createElement('div');
    pageRow.className = 'file-item';
    pageRow.draggable = true;
    pageRow.dataset.index = i;
    pageRow.innerHTML = `
      <span class="file-name">Page ${i + 1}</span>
      <div style="display:flex; gap:6px;">
        <button class="mini-btn" data-direction="up">↑</button>
        <button class="mini-btn" data-direction="down">↓</button>
        <button class="mini-btn" data-direction="delete">Delete</button>
      </div>
    `;
    
    pageRow.addEventListener('dragstart', (e) => {
      reorderDragIndex = Number(e.currentTarget.dataset.index);
    });
    pageRow.addEventListener('dragover', (e) => e.preventDefault());
    pageRow.addEventListener('drop', (e) => {
      e.preventDefault();
      const targetIndex = Number(e.currentTarget.dataset.index);
      if (reorderPdfDoc && reorderDragIndex !== null && reorderDragIndex !== targetIndex) {
        const pages = reorderPdfDoc.getPages();
        const [page] = pages.splice(reorderDragIndex, 1);
        pages.splice(targetIndex, 0, page);
        buildReorderList();
      }
    });
    
    pageRow.querySelector('[data-direction="up"]').addEventListener('click', () => movePageInReorder(i, -1));
    pageRow.querySelector('[data-direction="down"]').addEventListener('click', () => movePageInReorder(i, 1));
    pageRow.querySelector('[data-direction="delete"]').addEventListener('click', () => deletePageFromReorder(i));
    reorderPageList.appendChild(pageRow);
  }
}

function movePageInReorder(index, direction) {
  if (!reorderPdfDoc) return;
  const pages = reorderPdfDoc.getPages();
  const target = index + direction;
  if (target < 0 || target >= pages.length) return;
  [pages[index], pages[target]] = [pages[target], pages[index]];
  buildReorderList();
}

function deletePageFromReorder(index) {
  if (!reorderPdfDoc) return;
  reorderPdfDoc.removePage(index);
  buildReorderList();
}

reorderInput.addEventListener('change', (e) => loadReorderPDF(e.target.files[0]));

document.getElementById('saveReorderBtn').addEventListener('click', async () => {
  if (!reorderPdfDoc) {
    setStatus(reorderStatus, 'Please upload a PDF first.', '#fbbf24');
    return;
  }
  const bytes = await reorderPdfDoc.save();
  downloadBlob(new Blob([bytes], { type: 'application/pdf' }), 'reordered-pdf.pdf');
  setStatus(reorderStatus, 'Reordered PDF downloaded.');
});

document.getElementById('clearReorderBtn').addEventListener('click', () => {
  reorderInput.value = '';
  reorderPdfDoc = null;
  document.getElementById('reorderPreviewBox').style.display = 'none';
  document.getElementById('reorderPageList').innerHTML = '';
  setStatus(reorderStatus, 'Cleared');
});

// ============ IMAGE EDITOR ============
function renderImageEditor(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      currentEditorImage = img;
      const ctx = imageCanvas.getContext('2d');
      imageCanvas.width = img.width;
      imageCanvas.height = img.height;
      ctx.filter = 'brightness(100%) contrast(100%) saturate(100%)';
      ctx.drawImage(img, 0, 0);
      setStatus(imageEditorStatus, 'Image loaded. Adjust settings and download.');
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function refreshEditorCanvas() {
  if (!currentEditorImage) return;
  const ctx = imageCanvas.getContext('2d');
  const angle = Number(rotationSlider.value);
  const brightness = Number(brightnessSlider.value);
  const contrast = Number(contrastSlider.value);
  const saturation = Number(saturationSlider.value);

  const rad = (angle * Math.PI) / 180;
  const maxDimension = Math.ceil(Math.hypot(currentEditorImage.width, currentEditorImage.height));
  imageCanvas.width = maxDimension;
  imageCanvas.height = maxDimension;
  ctx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
  ctx.translate(imageCanvas.width / 2, imageCanvas.height / 2);
  ctx.rotate(rad);
  ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
  ctx.drawImage(currentEditorImage, -currentEditorImage.width / 2, -currentEditorImage.height / 2);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

imageEditorInput.addEventListener('change', (e) => renderImageEditor(e.target.files[0]));
rotationSlider.addEventListener('input', refreshEditorCanvas);
brightnessSlider.addEventListener('input', refreshEditorCanvas);
contrastSlider.addEventListener('input', refreshEditorCanvas);
saturationSlider.addEventListener('input', refreshEditorCanvas);

document.getElementById('downloadEditedImageBtn').addEventListener('click', () => {
  if (!currentEditorImage) {
    setStatus(imageEditorStatus, 'Please upload an image first.', '#fbbf24');
    return;
  }
  imageCanvas.toBlob((blob) => {
    if (blob) downloadBlob(blob, 'edited-image.png');
    setStatus(imageEditorStatus, 'Image downloaded.');
  }, 'image/png');
});

document.getElementById('resetEditedImageBtn').addEventListener('click', () => {
  rotationSlider.value = 0;
  brightnessSlider.value = 100;
  contrastSlider.value = 100;
  saturationSlider.value = 100;
  refreshEditorCanvas();
  setStatus(imageEditorStatus, 'Reset.');
});

// ============ IMAGE RESIZE & COMPRESS ============
resizeImageInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const img = new Image();
  img.onload = () => {
    const maxWidth = Number(imageWidthInput.value) || 1200;
    const ratio = maxWidth / img.width;
    imageWidthInput.value = Math.round(maxWidth);
    setStatus(resizeImageStatus, `Loaded. Ready to optimize.`);
  };
  img.src = URL.createObjectURL(file);
});

document.getElementById('resizeImageBtn').addEventListener('click', () => {
  const file = resizeImageInput.files[0];
  if (!file) {
    setStatus(resizeImageStatus, 'Please upload an image.', '#fbbf24');
    return;
  }

  const img = new Image();
  img.onload = () => {
    const targetWidth = Number(imageWidthInput.value) || 1200;
    const quality = Number(imageQualityInput.value) || 0.8;
    const targetHeight = Math.round((img.height / img.width) * targetWidth);
    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
    canvas.toBlob((blob) => {
      if (blob) downloadBlob(blob, `optimized-${file.name}`);
      setStatus(resizeImageStatus, 'Image optimized!');
    }, file.type === 'image/png' ? 'image/png' : 'image/jpeg', quality);
  };
  img.src = URL.createObjectURL(file);
});

// ============ FAVICON GENERATOR ============
function drawFavicon(text, bg) {
  const ctx = faviconCanvas.getContext('2d');
  ctx.clearRect(0, 0, faviconCanvas.width, faviconCanvas.height);
  ctx.fillStyle = bg || '#2563eb';
  ctx.fillRect(0, 0, faviconCanvas.width, faviconCanvas.height);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 70px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText((text || 'U').slice(0, 2), faviconCanvas.width / 2, faviconCanvas.height / 2 + 5);
}

faviconTextInput.addEventListener('input', () => drawFavicon(faviconTextInput.value, faviconBgInput.value));
faviconBgInput.addEventListener('input', () => drawFavicon(faviconTextInput.value, faviconBgInput.value));

document.getElementById('generateFaviconBtn').addEventListener('click', () => {
  drawFavicon(faviconTextInput.value, faviconBgInput.value);
  setStatus(faviconStatus, 'Favicon generated.');
});

document.getElementById('downloadFaviconBtn').addEventListener('click', () => {
  faviconCanvas.toBlob((blob) => {
    if (blob) downloadBlob(blob, 'favicon.png');
    setStatus(faviconStatus, 'Downloaded.');
  }, 'image/png');
});

drawFavicon('U', '#2563eb');

// ============ TEXT TO PDF ============
textToPdfBtn.addEventListener('click', async () => {
  const text = textToPdfInput.value.trim();
  if (!text) {
    setStatus(textToPdfStatus, 'Please enter text.', '#fbbf24');
    return;
  }
  
  const title = document.getElementById('pdfTitleInput').value || 'Document';
  const { PDFDocument, rgb, StandardFonts } = PDFLib;
  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage([595, 842]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const lines = text.split(/\n/);
  let y = 780;
  
  page.drawText(title, { x: 50, y, size: 22, font, color: rgb(0.1, 0.2, 0.4) });
  y -= 30;

  for (const line of lines) {
    const wrap = line.match(/.{1,90}/g) || [line];
    for (const segment of wrap) {
      if (y < 50) {
        page = pdfDoc.addPage([595, 842]);
        y = 780;
      }
      page.drawText(segment, { x: 50, y, size: 12, font, color: rgb(0, 0, 0) });
      y -= 18;
    }
  }

  const bytes = await pdfDoc.save();
  downloadBlob(new Blob([bytes], { type: 'application/pdf' }), `${title.toLowerCase().replace(/\s+/g, '-') || 'document'}.pdf`);
  setStatus(textToPdfStatus, 'Text PDF generated!');
});

// ============ PERIODIC TABLE ============
function renderPeriodicTable() {
  periodicGrid.innerHTML = '';
  periodicTableData.forEach(item => {
    const div = document.createElement('div');
    div.className = 'element';
    div.innerHTML = `
      <div class="num">${item.num}</div>
      <div class="sym">${item.sym}</div>
      <div class="name">${item.name}</div>
    `;
    periodicGrid.appendChild(div);
  });
}

renderPeriodicTable();

// ============ PWA & THEME ============
window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferredPrompt = event;
  installBtn.style.display = 'inline-flex';
});

installBtn.addEventListener('click', async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const result = await deferredPrompt.userChoice;
  if (result.outcome === 'accepted') {
    installBtn.style.display = 'none';
  }
  deferredPrompt = null;
});

const toggleThemeBtn = document.getElementById('toggleTheme');
toggleThemeBtn.addEventListener('click', () => {
  document.body.classList.toggle('light');
  const isLight = document.body.classList.contains('light');
  toggleThemeBtn.textContent = isLight ? '☀️' : '🌙';
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
});

if (localStorage.getItem('theme') === 'light') {
  document.body.classList.add('light');
  document.getElementById('toggleTheme').textContent = '☀️';
}

// ============ TAB NAVIGATION ============
const tabButtons = document.querySelectorAll('.tab-btn');
for (const btn of tabButtons) {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.panel').forEach(panel => panel.classList.remove('active'));
    document.getElementById(btn.dataset.target).classList.add('active');
  });
}

// ============ SERVICE WORKER ============
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker.js').catch(() => {});
}

console.log('✅ Offline Utility Suite v2 ready with enhanced OCR and PDF viewer.');
