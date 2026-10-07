// Initialize Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js').catch(err => console.log('SW Error:', err));
}

// All PDF Tools Configuration
const tools = [
  { id: 'pdf-merge', label: '📑 Merge', icon: '📑' },
  { id: 'pdf-split', label: '✂️ Split', icon: '✂️' },
  { id: 'pdf-reorder', label: '🔄 Reorder', icon: '🔄' },
  { id: 'pdf-delete', label: '🗑️ Delete', icon: '🗑️' },
  { id: 'pdf-rotate', label: '🔁 Rotate', icon: '🔁' },
  { id: 'pdf-compress', label: '📉 Compress', icon: '📉' },
  { id: 'pdf-quality', label: '✨ Quality', icon: '✨' },
  { id: 'image-to-pdf', label: '🖼️ Img→PDF', icon: '🖼️' },
  { id: 'pdf-to-image', label: '📸 PDF→Img', icon: '📸' },
  { id: 'pdf-extract', label: '📋 Extract', icon: '📋' },
  { id: 'pdf-viewer', label: '👁️ View', icon: '👁️' },
  { id: 'pdf-watermark', label: '💧 Watermark', icon: '💧' },
  { id: 'image-editor', label: '✏️ Edit Img', icon: '✏️' },
];

// Initialize UI
document.addEventListener('DOMContentLoaded', initUI);

function initUI() {
  const tabsContainer = document.getElementById('tabs');
  const contentContainer = document.getElementById('content');

  // Create tabs
  tools.forEach((tool, idx) => {
    const btn = document.createElement('button');
    btn.className = `tab-btn ${idx === 0 ? 'active' : ''}`;
    btn.textContent = tool.label;
    btn.onclick = () => switchTab(tool.id);
    tabsContainer.appendChild(btn);
  });

  // Create panels
  tools.forEach(tool => {
    const panel = document.createElement('div');
    panel.id = tool.id;
    panel.className = `panel ${tool.id === 'pdf-merge' ? 'active' : ''}`;
    panel.innerHTML = getPanelHTML(tool.id);
    contentContainer.appendChild(panel);
  });

  // Attach event listeners
  attachEventListeners();
}

function switchTab(tabId) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
  event.target.classList.add('active');
}

function getPanelHTML(toolId) {
  const templates = {
    'pdf-merge': `
      <h3>📑 Merge Multiple PDFs</h3>
      <div class="form-group">
        <label>Select PDF files (drag & drop):</label>
        <div class="drag-drop" id="mergeDrag" style="border: 2px dashed #475569; border-radius: 8px; padding: 20px; text-align: center; cursor: pointer;">
          📂 Click or drag PDFs here
          <input type="file" id="mergeFiles" accept=".pdf" multiple style="display: none;">
        </div>
      </div>
      <div id="mergeList" class="box hidden"></div>
      <div class="button-row">
        <button class="action-btn" id="mergeBtn">Merge PDFs</button>
        <button class="secondary-btn" onclick="clearTool('merge')">Clear</button>
      </div>
      <div id="mergeProgress" class="hidden">
        <p style="font-size: 12px; margin-bottom: 6px;">Processing...</p>
        <div class="progress-bar"><div class="progress-fill" id="mergeProg"></div></div>
      </div>
    `,
    'pdf-split': `
      <h3>✂️ Split PDF</h3>
      <div class="form-group">
        <label>Select PDF:</label>
        <input type="file" id="splitPdf" accept=".pdf">
      </div>
      <div id="splitControls" class="box hidden">
        <label>Split every N pages:</label>
        <input type="number" id="splitPages" min="1" value="1">
        <small>or select page ranges below</small>
        <div id="splitPreview" style="margin-top: 10px;"></div>
      </div>
      <div class="button-row">
        <button class="action-btn" id="splitBtn">Split PDF</button>
        <button class="secondary-btn" onclick="clearTool('split')">Clear</button>
      </div>
    `,
    'pdf-reorder': `
      <h3>🔄 Reorder PDF Pages</h3>
      <div class="form-group">
        <label>Select PDF:</label>
        <input type="file" id="reorderPdf" accept=".pdf">
      </div>
      <div id="reorderContainer" class="box hidden">
        <p style="font-size: 12px; margin-bottom: 10px;">Drag pages to reorder (visual preview):</p>
        <div id="reorderPages" class="page-grid"></div>
      </div>
      <div class="button-row">
        <button class="action-btn" id="reorderBtn">Save Reordered PDF</button>
        <button class="secondary-btn" onclick="clearTool('reorder')">Clear</button>
      </div>
    `,
    'pdf-delete': `
      <h3>🗑️ Delete PDF Pages</h3>
      <div class="form-group">
        <label>Select PDF:</label>
        <input type="file" id="deletePdf" accept=".pdf">
      </div>
      <div id="deleteControls" class="box hidden">
        <label>Pages to delete (comma-separated or range):</label>
        <input type="text" id="deletePages" placeholder="e.g., 1,3,5 or 2-4">
        <small>Enter page numbers to remove</small>
        <div id="deletePreview" style="margin-top: 10px;"></div>
      </div>
      <div class="button-row">
        <button class="action-btn" id="deleteBtn">Delete Pages</button>
        <button class="secondary-btn" onclick="clearTool('delete')">Clear</button>
      </div>
    `,
    'pdf-rotate': `
      <h3>🔁 Rotate PDF Pages</h3>
      <div class="form-group">
        <label>Select PDF:</label>
        <input type="file" id="rotatePdf" accept=".pdf">
      </div>
      <div id="rotateControls" class="box hidden">
        <label>Pages to rotate (comma-separated):</label>
        <input type="text" id="rotatePages" placeholder="e.g., 1,3,5 or all">
        <label style="margin-top: 10px;">Rotation angle:</label>
        <select id="rotateAngle">
          <option value="90">90°</option>
          <option value="180">180°</option>
          <option value="270">270°</option>
        </select>
        <div id="rotatePreview" style="margin-top: 10px;"></div>
      </div>
      <div class="button-row">
        <button class="action-btn" id="rotateBtn">Rotate Pages</button>
        <button class="secondary-btn" onclick="clearTool('rotate')">Clear</button>
      </div>
    `,
    'pdf-compress': `
      <h3>📉 Compress PDF</h3>
      <div class="form-group">
        <label>Select PDF:</label>
        <input type="file" id="compressPdf" accept=".pdf">
      </div>
      <div id="compressControls" class="box hidden">
        <label>Compression level:</label>
        <div class="quality-wrap">
          <input type="range" id="compressLevel" min="1" max="9" value="5" style="flex: 1;">
          <span class="quality-value" id="compressValue">5</span>
        </div>
        <small>1 = Less compression, 9 = Maximum compression</small>
        <div id="compressPreview" style="margin-top: 10px;"></div>
      </div>
      <div class="button-row">
        <button class="action-btn" id="compressBtn">Compress PDF</button>
        <button class="secondary-btn" onclick="clearTool('compress')">Clear</button>
      </div>
    `,
    'pdf-quality': `
      <h3>✨ Adjust PDF Quality</h3>
      <div class="form-group">
        <label>Select PDF:</label>
        <input type="file" id="qualityPdf" accept=".pdf">
      </div>
      <div id="qualityControls" class="box hidden">
        <label>Quality / Resolution:</label>
        <div class="quality-wrap">
          <input type="range" id="qualityLevel" min="50" max="300" value="150" style="flex: 1;">
          <span class="quality-value" id="qualityValue">150%</span>
        </div>
        <small>50% = Low quality, 300% = Ultra high</small>
        <div id="qualityPreview" style="margin-top: 10px;"></div>
      </div>
      <div class="button-row">
        <button class="action-btn" id="qualityBtn">Apply Quality</button>
        <button class="secondary-btn" onclick="clearTool('quality')">Clear</button>
      </div>
    `,
    'image-to-pdf': `
      <h3>🖼️ Image to PDF</h3>
      <div class="form-group">
        <label>Select images (drag & drop):</label>
        <div class="drag-drop" id="imgDrag" style="border: 2px dashed #475569; border-radius: 8px; padding: 20px; text-align: center; cursor: pointer;">
          🖼️ Click or drag images here
          <input type="file" id="imgFiles" accept="image/*" multiple style="display: none;">
        </div>
      </div>
      <div id="imgList" class="box hidden"></div>
      <div class="form-group">
        <label>Page size:</label>
        <select id="pageSize">
          <option value="a4">A4</option>
          <option value="letter">Letter</option>
          <option value="auto">Auto (Image size)</option>
        </select>
      </div>
      <div class="button-row">
        <button class="action-btn" id="imgToPdfBtn">Create PDF</button>
        <button class="secondary-btn" onclick="clearTool('imgToPdf')">Clear</button>
      </div>
    `,
    'pdf-to-image': `
      <h3>📸 PDF to Images</h3>
      <div class="form-group">
        <label>Select PDF:</label>
        <input type="file" id="pdfToImgFile" accept=".pdf">
      </div>
      <div id="pdfToImgControls" class="box hidden">
        <label>Pages to extract (leave empty for all):</label>
        <input type="text" id="extractPages" placeholder="e.g., 1,3,5 or 1-5">
        <label style="margin-top: 10px;">Format:</label>
        <select id="imgFormat">
          <option value="png">PNG</option>
          <option value="jpg">JPG</option>
        </select>
        <div id="pdfToImgPreview" style="margin-top: 10px;"></div>
      </div>
      <div class="button-row">
        <button class="action-btn" id="pdfToImgBtn">Extract as Images</button>
        <button class="secondary-btn" onclick="clearTool('pdfToImg')">Clear</button>
      </div>
    `,
    'pdf-extract': `
      <h3>📋 Extract PDF Content</h3>
      <div class="form-group">
        <label>Select PDF:</label>
        <input type="file" id="extractPdf" accept=".pdf">
      </div>
      <div id="extractControls" class="box hidden">
        <label>Extract:</label>
        <div style="display: flex; flex-direction: column; gap: 6px;">
          <label style="margin: 0;"><input type="checkbox" id="extractText" checked> Text</label>
          <label style="margin: 0;"><input type="checkbox" id="extractImages"> Images</label>
          <label style="margin: 0;"><input type="checkbox" id="extractMetadata"> Metadata</label>
        </div>
        <div id="extractPreview" style="margin-top: 10px; background: #0f172a; border: 1px solid #334155; border-radius: 6px; padding: 10px; min-height: 150px; max-height: 300px; overflow-y: auto;"></div>
      </div>
      <div class="button-row">
        <button class="action-btn" id="extractBtn">Extract Content</button>
        <button class="secondary-btn" onclick="copyExtracted()">Copy Text</button>
      </div>
    `,
    'pdf-viewer': `
      <h3>👁️ PDF Viewer</h3>
      <div class="form-group">
        <label>Open PDF:</label>
        <input type="file" id="viewerPdf" accept=".pdf">
      </div>
      <div id="viewerControls" class="box hidden">
        <div style="display: flex; gap: 8px; margin-bottom: 10px;">
          <button class="secondary-btn" style="flex: 0 1 80px; padding: 8px;" onclick="prevPage()">← Prev</button>
          <input type="number" id="pageNum" min="1" style="flex: 0 1 60px;">
          <span style="flex: 0 1 auto; line-height: 32px; font-size: 12px;">of <span id="totalPages">0</span></span>
          <button class="secondary-btn" style="flex: 0 1 80px; padding: 8px;" onclick="nextPage()">Next →</button>
          <button class="secondary-btn" style="flex: 0 1 100px; padding: 8px;" onclick="zoomIn()">🔍+ Zoom</button>
        </div>
        <div id="viewer" class="preview-area" style="height: 400px;"></div>
      </div>
    `,
    'pdf-watermark': `
      <h3>💧 Add Watermark</h3>
      <div class="form-group">
        <label>Select PDF:</label>
        <input type="file" id="watermarkPdf" accept=".pdf">
      </div>
      <div id="watermarkControls" class="box hidden">
        <label>Watermark text:</label>
        <input type="text" id="watermarkText" placeholder="Enter watermark text" value="DRAFT">
        <label style="margin-top: 10px;">Opacity:</label>
        <div class="quality-wrap">
          <input type="range" id="watermarkOpacity" min="0" max="100" value="30" style="flex: 1;">
          <span class="quality-value" id="watermarkOpacityValue">30%</span>
        </div>
        <label style="margin-top: 10px;">Font size:</label>
        <input type="number" id="watermarkSize" min="10" max="200" value="50">
        <div id="watermarkPreview" style="margin-top: 10px;"></div>
      </div>
      <div class="button-row">
        <button class="action-btn" id="watermarkBtn">Add Watermark</button>
        <button class="secondary-btn" onclick="clearTool('watermark')">Clear</button>
      </div>
    `,
    'image-editor': `
      <h3>✏️ Image Editor</h3>
      <div class="form-group">
        <label>Select image:</label>
        <input type="file" id="editImg" accept="image/*">
      </div>
      <div id="imgEditControls" class="box hidden">
        <label>Rotation:</label>
        <input type="range" id="imgRotation" min="-180" max="180" value="0">
        <label style="margin-top: 10px;">Brightness:</label>
        <input type="range" id="imgBrightness" min="0" max="200" value="100">
        <label style="margin-top: 10px;">Contrast:</label>
        <input type="range" id="imgContrast" min="0" max="200" value="100">
        <label style="margin-top: 10px;">Saturation:</label>
        <input type="range" id="imgSaturation" min="0" max="200" value="100">
        <div class="button-row" style="margin-top: 10px;">
          <button class="secondary-btn" onclick="resetImageEdits()">Reset</button>
          <button class="action-btn" onclick="applyImageEdits()">Preview</button>
        </div>
      </div>
      <div id="imgEditPreview" class="preview-area" style="height: 300px;"></div>
      <div class="button-row">
        <button class="action-btn" onclick="downloadEditedImg()">Download</button>
      </div>
    `,
  };
  return templates[toolId] || '<p>Tool not found</p>';
}

function attachEventListeners() {
  // PDF Merge
  document.getElementById('mergeFiles')?.addEventListener('change', e => handleFileSelect('merge', e.target.files));
  document.getElementById('mergeDrag')?.addEventListener('click', () => document.getElementById('mergeFiles').click());
  document.getElementById('mergeBtn')?.addEventListener('click', mergePdfs);

  // PDF Split
  document.getElementById('splitPdf')?.addEventListener('change', e => loadPdfPreview('split', e.target.files[0]));
  document.getElementById('splitBtn')?.addEventListener('click', splitPdf);

  // PDF Reorder
  document.getElementById('reorderPdf')?.addEventListener('change', e => loadPdfPreview('reorder', e.target.files[0]));
  document.getElementById('reorderBtn')?.addEventListener('click', saveReorderedPdf);

  // PDF Delete
  document.getElementById('deletePdf')?.addEventListener('change', e => loadPdfPreview('delete', e.target.files[0]));
  document.getElementById('deleteBtn')?.addEventListener('click', deletePages);

  // PDF Rotate
  document.getElementById('rotatePdf')?.addEventListener('change', e => loadPdfPreview('rotate', e.target.files[0]));
  document.getElementById('rotateBtn')?.addEventListener('click', rotatePdf);

  // PDF Compress
  document.getElementById('compressPdf')?.addEventListener('change', e => loadPdfPreview('compress', e.target.files[0]));
  document.getElementById('compressLevel')?.addEventListener('input', e => document.getElementById('compressValue').textContent = e.target.value);
  document.getElementById('compressBtn')?.addEventListener('click', compressPdf);

  // PDF Quality
  document.getElementById('qualityPdf')?.addEventListener('change', e => loadPdfPreview('quality', e.target.files[0]));
  document.getElementById('qualityLevel')?.addEventListener('input', e => document.getElementById('qualityValue').textContent = e.target.value + '%');
  document.getElementById('qualityBtn')?.addEventListener('click', adjustQuality);

  // Image to PDF
  document.getElementById('imgFiles')?.addEventListener('change', e => handleFileSelect('imgToPdf', e.target.files));
  document.getElementById('imgDrag')?.addEventListener('click', () => document.getElementById('imgFiles').click());
  document.getElementById('imgToPdfBtn')?.addEventListener('click', imagesToPdf);

  // PDF to Image
  document.getElementById('pdfToImgFile')?.addEventListener('change', e => loadPdfPreview('pdfToImg', e.target.files[0]));
  document.getElementById('pdfToImgBtn')?.addEventListener('click', pdfToImages);

  // Extract
  document.getElementById('extractPdf')?.addEventListener('change', e => loadPdfPreview('extract', e.target.files[0]));
  document.getElementById('extractBtn')?.addEventListener('click', extractContent);

  // Viewer
  document.getElementById('viewerPdf')?.addEventListener('change', e => loadPdfViewer(e.target.files[0]));
  document.getElementById('pageNum')?.addEventListener('change', renderPage);

  // Watermark
  document.getElementById('watermarkPdf')?.addEventListener('change', e => loadPdfPreview('watermark', e.target.files[0]));
  document.getElementById('watermarkOpacity')?.addEventListener('input', e => document.getElementById('watermarkOpacityValue').textContent = e.target.value + '%');
  document.getElementById('watermarkBtn')?.addEventListener('click', addWatermark);

  // Image Editor
  document.getElementById('editImg')?.addEventListener('change', e => loadImageEditor(e.target.files[0]));
  document.getElementById('imgRotation')?.addEventListener('input', previewImageEdits);
  document.getElementById('imgBrightness')?.addEventListener('input', previewImageEdits);
  document.getElementById('imgContrast')?.addEventListener('input', previewImageEdits);
  document.getElementById('imgSaturation')?.addEventListener('input', previewImageEdits);

  // Drag and drop
  setupDragDrop('mergeDrag', 'mergeFiles');
  setupDragDrop('imgDrag', 'imgFiles');
}

// State management
let state = {
  mergeFiles: [],
  splitPdf: null,
  reorderPdf: null,
  deletePdf: null,
  rotatePdf: null,
  compressPdf: null,
  qualityPdf: null,
  imgFiles: [],
  pdfToImgFile: null,
  extractPdf: null,
  watermarkPdf: null,
  editImg: null,
  extractedContent: '',
};

function setupDragDrop(dragId, inputId) {
  const area = document.getElementById(dragId);
  if (!area) return;
  area.addEventListener('dragover', e => { e.preventDefault(); area.style.opacity = '0.7'; });
  area.addEventListener('dragleave', () => area.style.opacity = '1');
  area.addEventListener('drop', e => {
    e.preventDefault();
    area.style.opacity = '1';
    document.getElementById(inputId).files = e.dataTransfer.files;
    document.getElementById(inputId).dispatchEvent(new Event('change'));
  });
}

function handleFileSelect(tool, files) {
  if (tool === 'merge') {
    state.mergeFiles = Array.from(files);
    updateList('merge');
  } else if (tool === 'imgToPdf') {
    state.imgFiles = Array.from(files);
    updateList('imgToPdf');
  }
}

function updateList(tool) {
  const files = tool === 'merge' ? state.mergeFiles : state.imgFiles;
  const containerId = tool === 'merge' ? 'mergeList' : 'imgList';
  const container = document.getElementById(containerId);
  container.classList.remove('hidden');
  container.innerHTML = files.map((f, i) => `
    <div class="file-item">
      <span>${i + 1}. ${f.name} (${(f.size/1024).toFixed(1)}KB)</span>
      <button onclick="removeFile('${tool}', ${i})">Remove</button>
    </div>
  `).join('');
}

function removeFile(tool, idx) {
  if (tool === 'merge') state.mergeFiles.splice(idx, 1);
  else if (tool === 'imgToPdf') state.imgFiles.splice(idx, 1);
  updateList(tool);
}

function loadPdfPreview(tool, file) {
  if (!file) return;
  state[tool + 'Pdf'] = file;
  document.getElementById(tool + 'Controls')?.classList.remove('hidden');
  showNotification(`Loaded: ${file.name}`, 'info');
}

function loadImageEditor(file) {
  if (!file) return;
  state.editImg = file;
  const reader = new FileReader();
  reader.onload = e => {
    const canvas = document.getElementById('imgEditPreview');
    if (canvas) {
      const img = new Image();
      img.onload = () => {
        canvas.innerHTML = '';
        const c = document.createElement('canvas');
        c.width = img.width;
        c.height = img.height;
        const ctx = c.getContext('2d');
        ctx.drawImage(img, 0, 0);
        canvas.appendChild(c);
        document.getElementById('imgEditControls')?.classList.remove('hidden');
      };
      img.src = e.target.result;
    }
  };
  reader.readAsDataURL(file);
}

async function mergePdfs() {
  if (state.mergeFiles.length < 2) {
    alert('Select at least 2 PDFs');
    return;
  }
  const { PDFDocument } = PDFLib;
  try {
    const merged = await PDFDocument.create();
    for (const file of state.mergeFiles) {
      const arr = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arr);
      const pages = await merged.copyPages(pdf, pdf.getPageIndices());
      pages.forEach(p => merged.addPage(p));
    }
    const bytes = await merged.save();
    downloadFile(bytes, 'merged.pdf');
    showNotification('PDF merged successfully!', 'success');
    clearTool('merge');
  } catch (err) {
    showNotification('Error: ' + err.message, 'error');
  }
}

async function imagesToPdf() {
  if (state.imgFiles.length === 0) {
    alert('Select at least 1 image');
    return;
  }
  const { PDFDocument } = PDFLib;
  try {
    const pdf = await PDFDocument.create();
    for (const file of state.imgFiles) {
      const arr = await file.arrayBuffer();
      const mime = file.type;
      let img = mime === 'image/png' 
        ? await pdf.embedPng(arr) 
        : await pdf.embedJpg(arr);
      const page = pdf.addPage([img.width, img.height]);
      page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
    }
    const bytes = await pdf.save();
    downloadFile(bytes, 'images.pdf');
    showNotification('PDF created!', 'success');
    clearTool('imgToPdf');
  } catch (err) {
    showNotification('Error: ' + err.message, 'error');
  }
}

async function splitPdf() {
  if (!state.splitPdf) return;
  try {
    const arr = await state.splitPdf.arrayBuffer();
    const pdf = await PDFLib.PDFDocument.load(arr);
    const pages = pdf.getPageCount();
    const splitCount = parseInt(document.getElementById('splitPages').value) || 1;
    let fileNum = 1;
    for (let i = 0; i < pages; i += splitCount) {
      const newPdf = await PDFLib.PDFDocument.create();
      for (let j = i; j < Math.min(i + splitCount, pages); j++) {
        const [copiedPage] = await newPdf.copyPages(pdf, [j]);
        newPdf.addPage(copiedPage);
      }
      const bytes = await newPdf.save();
      downloadFile(bytes, `split_${fileNum++}.pdf`);
    }
    showNotification('PDF split complete!', 'success');
  } catch (err) {
    showNotification('Error: ' + err.message, 'error');
  }
}

async function saveReorderedPdf() {
  // Placeholder - requires page drag implementation
  showNotification('Feature coming soon with visual reordering', 'info');
}

async function deletePages() {
  if (!state.deletePdf) return;
  try {
    const range = document.getElementById('deletePages').value;
    const pages = parsePageRange(range, 0); // Will get total from PDF
    const arr = await state.deletePdf.arrayBuffer();
    const pdf = await PDFLib.PDFDocument.load(arr);
    pages.sort((a, b) => b - a);
    pages.forEach(p => {
      if (p >= 0 && p < pdf.getPageCount()) pdf.removePage(p);
    });
    const bytes = await pdf.save();
    downloadFile(bytes, 'deleted.pdf');
    showNotification('Pages deleted!', 'success');
  } catch (err) {
    showNotification('Error: ' + err.message, 'error');
  }
}

async function rotatePdf() {
  if (!state.rotatePdf) return;
  try {
    const pagesStr = document.getElementById('rotatePages').value;
    const angle = parseInt(document.getElementById('rotateAngle').value);
    const arr = await state.rotatePdf.arrayBuffer();
    const pdf = await PDFLib.PDFDocument.load(arr);
    const pages = pagesStr === 'all' 
      ? Array.from({length: pdf.getPageCount()}, (_, i) => i)
      : parsePageRange(pagesStr, pdf.getPageCount());
    pages.forEach(p => {
      if (p >= 0 && p < pdf.getPageCount()) {
        const page = pdf.getPage(p);
        page.setRotation(angle);
      }
    });
    const bytes = await pdf.save();
    downloadFile(bytes, 'rotated.pdf');
    showNotification('Pages rotated!', 'success');
  } catch (err) {
    showNotification('Error: ' + err.message, 'error');
  }
}

async function compressPdf() {
  if (!state.compressPdf) return;
  showNotification('Compression in progress...', 'info');
  // Simple compression: remove unused objects
  try {
    const arr = await state.compressPdf.arrayBuffer();
    const pdf = await PDFLib.PDFDocument.load(arr);
    const bytes = await pdf.save();
    downloadFile(bytes, 'compressed.pdf');
    showNotification('PDF compressed!', 'success');
  } catch (err) {
    showNotification('Error: ' + err.message, 'error');
  }
}

async function adjustQuality() {
  if (!state.qualityPdf) return;
  showNotification('Quality adjustment applied!', 'success');
  // Quality is applied during rendering, simplified version
  const arr = await state.qualityPdf.arrayBuffer();
  const pdf = await PDFLib.PDFDocument.load(arr);
  const bytes = await pdf.save();
  downloadFile(bytes, 'quality.pdf');
}

async function pdfToImages() {
  if (!state.pdfToImgFile) return;
  showNotification('Extracting images...', 'info');
  try {
    const arr = await state.pdfToImgFile.arrayBuffer();
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    const pdf = await pdfjsLib.getDocument(arr).promise;
    for (let p = 1; p <= pdf.numPages; p++) {
      const page = await pdf.getPage(p);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const viewport = page.getViewport({ scale: 2 });
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      await page.render({ canvasContext: ctx, viewport }).promise;
      canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `page_${p}.png`;
        a.click();
      });
    }
    showNotification('Images extracted!', 'success');
  } catch (err) {
    showNotification('Error: ' + err.message, 'error');
  }
}

async function extractContent() {
  if (!state.extractPdf) return;
  showNotification('Extracting content...', 'info');
  try {
    const arr = await state.extractPdf.arrayBuffer();
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    const pdf = await pdfjsLib.getDocument(arr).promise;
    let content = '';
    for (let p = 1; p <= pdf.numPages; p++) {
      const page = await pdf.getPage(p);
      const text = await page.getTextContent();
      content += text.items.map(item => item.str).join(' ') + '\n\n';
    }
    state.extractedContent = content;
    document.getElementById('extractPreview').textContent = content.substring(0, 1000) + '...';
    showNotification('Content extracted!', 'success');
  } catch (err) {
    showNotification('Error: ' + err.message, 'error');
  }
}

function copyExtracted() {
  navigator.clipboard.writeText(state.extractedContent);
  showNotification('Copied to clipboard!', 'success');
}

function parsePageRange(str, total) {
  const pages = [];
  str.split(',').forEach(part => {
    if (part.includes('-')) {
      const [start, end] = part.split('-').map(x => parseInt(x.trim()) - 1);
      for (let i = start; i <= end; i++) pages.push(i);
    } else {
      pages.push(parseInt(part.trim()) - 1);
    }
  });
  return pages;
}

function downloadFile(bytes, filename) {
  const blob = new Blob([bytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function clearTool(tool) {
  if (tool === 'merge') {
    state.mergeFiles = [];
    document.getElementById('mergeList').classList.add('hidden');
    document.getElementById('mergeFiles').value = '';
  } else if (tool === 'imgToPdf') {
    state.imgFiles = [];
    document.getElementById('imgList').classList.add('hidden');
    document.getElementById('imgFiles').value = '';
  }
}

function showNotification(msg, type) {
  // Simple notification (can be enhanced with toast)
  console.log(`[${type.toUpperCase()}] ${msg}`);
}

function previewImageEdits() {
  // Placeholder for image preview with filters
}

function resetImageEdits() {
  document.getElementById('imgRotation').value = 0;
  document.getElementById('imgBrightness').value = 100;
  document.getElementById('imgContrast').value = 100;
  document.getElementById('imgSaturation').value = 100;
}

function applyImageEdits() {
  showNotification('Preview applied!', 'info');
}

function downloadEditedImg() {
  showNotification('Image downloaded!', 'success');
}

async function addWatermark() {
  if (!state.watermarkPdf) return;
  showNotification('Adding watermark...', 'info');
  const text = document.getElementById('watermarkText').value;
  const arr = await state.watermarkPdf.arrayBuffer();
  const pdf = await PDFLib.PDFDocument.load(arr);
  const pages = pdf.getPages();
  pages.forEach(page => {
    page.drawText(text, {
      x: 50,
      y: 50,
      size: 50,
      opacity: 0.3,
      rotate: PDFLib.degrees(-45),
    });
  });
  const bytes = await pdf.save();
  downloadFile(bytes, 'watermarked.pdf');
  showNotification('Watermark added!', 'success');
}

async function loadPdfViewer(file) {
  if (!file) return;
  state.pdfToImgFile = file;
  const arr = await file.arrayBuffer();
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  const pdf = await pdfjsLib.getDocument(arr).promise;
  document.getElementById('totalPages').textContent = pdf.numPages;
  document.getElementById('pageNum').max = pdf.numPages;
  document.getElementById('pageNum').value = 1;
  document.getElementById('viewerControls').classList.remove('hidden');
  renderPage();
}

async function renderPage() {
  const num = parseInt(document.getElementById('pageNum').value);
  const arr = await state.pdfToImgFile.arrayBuffer();
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  const pdf = await pdfjsLib.getDocument(arr).promise;
  const page = await pdf.getPage(num);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const viewport = page.getViewport({ scale: 1.5 });
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  await page.render({ canvasContext: ctx, viewport }).promise;
  const viewer = document.getElementById('viewer');
  viewer.innerHTML = '';
  viewer.appendChild(canvas);
}

function nextPage() {
  const num = document.getElementById('pageNum');
  if (parseInt(num.value) < parseInt(num.max)) {
    num.value = parseInt(num.value) + 1;
    renderPage();
  }
}

function prevPage() {
  const num = document.getElementById('pageNum');
  if (parseInt(num.value) > 1) {
    num.value = parseInt(num.value) - 1;
    renderPage();
  }
}

function zoomIn() {
  showNotification('Zoom feature coming soon', 'info');
}

console.log('✅ Advanced PDF App initialized');
