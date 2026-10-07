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

const pdfToImageInput = document.getElementById('pdfToImageInput');
const pdfToImageStatus = document.getElementById('pdfToImageStatus');
const pdfToImageProgress = document.getElementById('pdfToImageProgress');
const pdfToImageProgressBar = document.getElementById('pdfToImageProgressBar');

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

const ocrInput = document.getElementById('ocrInput');
const ocrPreview = document.getElementById('ocrPreview');
const ocrOutput = document.getElementById('ocrOutput');
const ocrStatus = document.getElementById('ocrStatus');
const ocrProgress = document.getElementById('ocrProgress');
const ocrProgressBar = document.getElementById('ocrProgressBar');

const faviconTextInput = document.getElementById('faviconTextInput');
const faviconBgInput = document.getElementById('faviconBgInput');
const faviconCanvas = document.getElementById('faviconCanvas');
const faviconStatus = document.getElementById('faviconStatus');

const textToPdfInput = document.getElementById('textToPdfInput');
const textToPdfStatus = document.getElementById('textToPdfStatus');

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

function updateMergeList() {
  mergeList.innerHTML = '';
  if (!mergeFiles.length) {
    return;
  }
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

initializeDropzone(mergeDropzone, mergeInput, (files) => {
  const valid = Array.from(files).filter(f => f.type === 'application/pdf');
  mergeFiles.push(...valid);
  updateMergeList();
  mergeStatus.textContent = `${mergeFiles.length} PDF file(s) selected`;
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

async function loadReorderPDF(file) {
  if (!file) return;
  try {
    const bytes = await file.arrayBuffer();
    reorderPdfDoc = await PDFLib.PDFDocument.load(bytes);
    reorderPreviewBox.style.display = 'block';
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
    setStatus(reorderStatus, `Unable to load PDF: ${error.message}`, '#f87171');
  }
}

function buildReorderList() {
  if (!reorderPdfDoc) return;
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
  reorderPreviewBox.style.display = 'none';
  reorderPageList.innerHTML = '';
  setStatus(reorderStatus, 'Cleared');
});

splitInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const bytes = await file.arrayBuffer();
  splitPdfDoc = await PDFLib.PDFDocument.load(bytes);
  setStatus(splitStatus, `${splitPdfDoc.getPageCount()} pages loaded. Enter page numbers to keep.`);
});

splitBtn.addEventListener('click', async () => {
  if (!splitPdfDoc) {
    setStatus(splitStatus, 'Please select a PDF first.', '#fbbf24');
    return;
  }
  const inputText = document.getElementById('splitPagesInput').value.trim();
  if (!inputText) {
    setStatus(splitStatus, 'Please enter pages to keep, for example 1-3, 5.', '#fbbf24');
    return;
  }

  const selectedPages = [];
  const parts = inputText.split(',');
  for (const part of parts) {
    const value = part.trim();
    if (!value) continue;
    if (value.includes('-')) {
      const [start, end] = value.split('-').map(n => Number(n.trim()));
      for (let i = start; i <= end; i++) {
        if (i >= 1 && i <= splitPdfDoc.getPageCount()) selectedPages.push(i - 1);
      }
    } else {
      const num = Number(value);
      if (num >= 1 && num <= splitPdfDoc.getPageCount()) selectedPages.push(num - 1);
    }
  }

  if (!selectedPages.length) {
    setStatus(splitStatus, 'No valid pages found.', '#f87171');
    return;
  }

  try {
    splitProgress.style.display = 'block';
    const newPdf = await PDFLib.PDFDocument.create();
    for (let i = 0; i < selectedPages.length; i++) {
      const [page] = await newPdf.copyPages(splitPdfDoc, [selectedPages[i]]);
      newPdf.addPage(page);
      splitProgressBar.style.width = `${((i + 1) / selectedPages.length) * 100}%`;
    }
    const bytes = await newPdf.save();
    downloadBlob(new Blob([bytes], { type: 'application/pdf' }), `${document.getElementById('splitFileNameInput').value || 'split-pages'}.pdf`);
    setStatus(splitStatus, 'Split PDF created successfully!');
    splitProgress.style.display = 'none';
    splitProgressBar.style.width = '0%';
  } catch (error) {
    console.error(error);
    setStatus(splitStatus, `Error: ${error.message}`, '#f87171');
  }
});

document.getElementById('clearSplitBtn').addEventListener('click', () => {
  splitPdfDoc = null;
  splitInput.value = '';
  document.getElementById('splitPagesInput').value = '';
  setStatus(splitStatus, 'Cleared');
  splitProgress.style.display = 'none';
});

initializeDropzone(imagePdfDropzone, imagePdfInput, (files) => {
  imagePdfFiles.push(...Array.from(files).filter(file => file.type.startsWith('image/')));
  renderImagePdfList();
  setStatus(imagePdfStatus, `${imagePdfFiles.length} image(s) selected.`);
});

function renderImagePdfList() {
  imagePdfList.innerHTML = '';
  imagePdfFiles.forEach((file, idx) => {
    const li = document.createElement('li');
    li.className = 'file-item';
    li.innerHTML = `
      <span class="file-name">${idx + 1}. ${file.name}</span>
      <button class="mini-btn" data-index="${idx}">Remove</button>
    `;
    li.querySelector('button').addEventListener('click', () => {
      imagePdfFiles.splice(idx, 1);
      renderImagePdfList();
    });
    imagePdfList.appendChild(li);
  });
}

clearImagePdfBtn.addEventListener('click', () => {
  imagePdfFiles = [];
  imagePdfInput.value = '';
  renderImagePdfList();
  setStatus(imagePdfStatus, 'Cleared');
});

imagePdfBtn.addEventListener('click', async () => {
  if (imagePdfFiles.length === 0) {
    setStatus(imagePdfStatus, 'Please select at least one image.', '#fbbf24');
    return;
  }
  imagePdfBtn.disabled = true;
  imagePdfProgress.style.display = 'block';
  imagePdfProgressBar.style.width = '5%';
  try {
    const { PDFDocument } = PDFLib;
    const pdfDoc = await PDFDocument.create();
    for (let i = 0; i < imagePdfFiles.length; i++) {
      const file = imagePdfFiles[i];
      const bytes = await file.arrayBuffer();
      let image;
      if (file.type === 'image/png') image = await pdfDoc.embedPng(bytes);
      else image = await pdfDoc.embedJpg(bytes);
      const pageSize = document.getElementById('imagePdfPageSize').value;
      let { width, height } = image;
      if (pageSize === 'a4') {
        const ratio = Math.min(595 / width, 842 / height);
        width *= ratio;
        height *= ratio;
      } else if (pageSize === 'letter') {
        const ratio = Math.min(612 / width, 792 / height);
        width *= ratio;
        height *= ratio;
      }
      const page = pdfDoc.addPage([width || 595, height || 842]);
      page.drawImage(image, { x: 0, y: 0, width: page.getWidth(), height: page.getHeight() });
      imagePdfProgressBar.style.width = `${((i + 1) / imagePdfFiles.length) * 100}%`;
    }
    const pdfBytes = await pdfDoc.save();
    downloadBlob(new Blob([pdfBytes], { type: 'application/pdf' }), 'images-to-pdf.pdf');
    setStatus(imagePdfStatus, 'Images converted successfully!');
    imagePdfFiles = [];
    renderImagePdfList();
    imagePdfInput.value = '';
  } catch (error) {
    console.error(error);
    setStatus(imagePdfStatus, `Error: ${error.message}`, '#f87171');
  } finally {
    imagePdfBtn.disabled = false;
    imagePdfProgress.style.display = 'none';
    imagePdfProgressBar.style.width = '0%';
  }
});

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
  ctx.clearRect(0,0,imageCanvas.width,imageCanvas.height);
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
    setStatus(imageEditorStatus, 'Edited image downloaded.');
  }, 'image/png');
});

document.getElementById('resetEditedImageBtn').addEventListener('click', () => {
  rotationSlider.value = 0;
  brightnessSlider.value = 100;
  contrastSlider.value = 100;
  saturationSlider.value = 100;
  refreshEditorCanvas();
  setStatus(imageEditorStatus, 'Settings reset.');
});

resizeImageInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const img = new Image();
  img.onload = () => {
    const maxWidth = Number(imageWidthInput.value) || 1200;
    const ratio = maxWidth / img.width;
    imageWidthInput.value = Math.round(maxWidth);
    setStatus(resizeImageStatus, `Loaded ${file.name}. Ready for optimization.`);
  };
  img.src = URL.createObjectURL(file);
});

document.getElementById('resizeImageBtn').addEventListener('click', () => {
  const file = resizeImageInput.files[0];
  if (!file) {
    setStatus(resizeImageStatus, 'Please upload an image first.', '#fbbf24');
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
      setStatus(resizeImageStatus, 'Image optimized and downloaded.');
    }, file.type === 'image/png' ? 'image/png' : 'image/jpeg', quality);
  };
  img.src = URL.createObjectURL(file);
});

ocrInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  ocrPreview.src = url;
  ocrPreview.style.display = 'block';
  setStatus(ocrStatus, 'Image ready for OCR.');
});

document.getElementById('ocrBtn').addEventListener('click', async () => {
  const file = ocrInput.files[0];
  if (!file) {
    setStatus(ocrStatus, 'Please upload an image first.', '#fbbf24');
    return;
  }

  try {
    ocrProgress.style.display = 'block';
    ocrProgressBar.style.width = '10%';
    setStatus(ocrStatus, 'Running OCR...');

    const worker = await Tesseract.createWorker('eng');
    const { data } = await worker.recognize(file);
    ocrOutput.value = data.text.trim();
    setStatus(ocrStatus, 'OCR completed successfully.');
    await worker.terminate();
  } catch (error) {
    console.error(error);
    setStatus(ocrStatus, `OCR failed: ${error.message}`, '#f87171');
  } finally {
    ocrProgress.style.display = 'none';
    ocrProgressBar.style.width = '0%';
  }
});

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
    setStatus(faviconStatus, 'Favicon PNG downloaded.');
  }, 'image/png');
});

drawFavicon('U', '#2563eb');

pdfToImageInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  setStatus(pdfToImageStatus, `Selected: ${file.name}`);
});

document.getElementById('pdfToImageBtn').addEventListener('click', async () => {
  const file = pdfToImageInput.files[0];
  if (!file) {
    setStatus(pdfToImageStatus, 'Please select a PDF file first.', '#fbbf24');
    return;
  }

  try {
    const pdfData = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
    const zip = new JSZip();
    const scale = Number(document.getElementById('pdfScaleInput').value) || 1;
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

document.getElementById('textToPdfBtn').addEventListener('click', async () => {
  const text = textToPdfInput.value.trim();
  if (!text) {
    setStatus(textToPdfStatus, 'Please enter text to convert.', '#fbbf24');
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
  setStatus(textToPdfStatus, 'Text PDF generated successfully.');
});

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

const tabButtons = document.querySelectorAll('.tab-btn');
for (const btn of tabButtons) {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.panel').forEach(panel => panel.classList.remove('active'));
    document.getElementById(btn.dataset.target).classList.add('active');
  });
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker.js').catch(() => {});
}

console.log('Offline Utility Suite ready.');
