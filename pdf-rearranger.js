const pdfInput = document.getElementById('pdfInput');
const emptyState = document.getElementById('emptyState');
const workspace = document.getElementById('workspace');
const pageGrid = document.getElementById('pageGrid');
const totalPagesStat = document.getElementById('totalPagesStat');
const totalFilesStat = document.getElementById('totalFilesStat');
const downloadBtn = document.getElementById('downloadBtn');
const clearAllBtn = document.getElementById('clearAllBtn');

const pageItems = [];
let draggedIndex = null;

function updateStats() {
  totalPagesStat.textContent = `Pages: ${pageItems.length}`;
  const fileCount = new Set(pageItems.map((item) => item.fileName)).size;
  totalFilesStat.textContent = `Files: ${fileCount}`;
  emptyState.style.display = pageItems.length ? 'none' : 'grid';
  workspace.classList.toggle('active', pageItems.length > 0);
}

async function renderPageThumbnail(item, canvas) {
  const pdf = await pdfjsLib.getDocument({ data: item.arrayBuffer }).promise;
  const page = await pdf.getPage(item.pageNumber);
  const viewport = page.getViewport({ scale: 0.7 });
  const context = canvas.getContext('2d');
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  await page.render({ canvasContext: context, viewport }).promise;
}

function createPageElement(item, index) {
  const card = document.createElement('div');
  card.className = 'page-card';
  card.draggable = true;
  card.dataset.index = String(index);

  const canvas = document.createElement('canvas');
  canvas.className = 'page-thumb';
  card.appendChild(canvas);

  const meta = document.createElement('div');
  meta.className = 'page-meta';
  meta.innerHTML = `<span>${item.fileName} · P${item.pageNumber}</span>`;

  const removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.className = 'remove-page';
  removeBtn.textContent = 'Remove';
  removeBtn.addEventListener('click', () => removePage(index));

  meta.appendChild(removeBtn);
  card.appendChild(meta);

  card.addEventListener('dragstart', (event) => {
    draggedIndex = index;
    card.classList.add('dragging');
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', String(index));
  });

  card.addEventListener('dragend', () => {
    draggedIndex = null;
    card.classList.remove('dragging');
    document.querySelectorAll('.page-card').forEach((el) => el.classList.remove('drag-over'));
  });

  card.addEventListener('dragover', (event) => {
    event.preventDefault();
    card.classList.add('drag-over');
  });

  card.addEventListener('dragleave', () => card.classList.remove('drag-over'));
  card.addEventListener('drop', (event) => {
    event.preventDefault();
    card.classList.remove('drag-over');
    if (draggedIndex === null || draggedIndex === index) return;
    const movedItem = pageItems.splice(draggedIndex, 1)[0];
    pageItems.splice(index, 0, movedItem);
    renderPages();
  });

  renderPageThumbnail(item, canvas).catch(() => {
    canvas.replaceWith(document.createTextNode('Preview unavailable'));
  });

  return card;
}

function renderPages() {
  pageGrid.innerHTML = '';
  pageItems.forEach((item, index) => {
    pageGrid.appendChild(createPageElement(item, index));
  });
  updateStats();
}

function removePage(index) {
  pageItems.splice(index, 1);
  renderPages();
}

function clearAllPages() {
  pageItems.length = 0;
  pdfInput.value = '';
  renderPages();
}

async function readPdfFile(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const totalPages = pdf.numPages;

  for (let pageNumber = 1; pageNumber <= totalPages; pageNumber += 1) {
    pageItems.push({
      fileName: file.name,
      pageNumber,
      arrayBuffer,
    });
  }
}

async function handleFiles(fileList) {
  if (!fileList || fileList.length === 0) return;
  const pdfFiles = Array.from(fileList).filter((file) => file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf'));

  if (pdfFiles.length === 0) {
    alert('Please select valid PDF files.');
    return;
  }

  for (const file of pdfFiles) {
    await readPdfFile(file);
  }

  renderPages();
}

pdfInput.addEventListener('change', async (event) => {
  await handleFiles(event.target.files);
});

clearAllBtn.addEventListener('click', clearAllPages);

downloadBtn.addEventListener('click', async () => {
  if (!pageItems.length) {
    alert('Upload at least one PDF first.');
    return;
  }

  const mergedPdf = await PDFLib.PDFDocument.create();

  for (const item of pageItems) {
    const sourcePdfBytes = item.arrayBuffer;
    const sourcePdf = await PDFLib.PDFDocument.load(sourcePdfBytes);
    const [copiedPage] = await mergedPdf.copyPages(sourcePdf, [item.pageNumber - 1]);
    mergedPdf.addPage(copiedPage);
  }

  const pdfBytes = await mergedPdf.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'reordered-pdf.pdf';
  anchor.click();
  URL.revokeObjectURL(url);
});
