// DOM Elements
const fileInput = document.getElementById('fileInput');
const uploadArea = document.getElementById('uploadArea');
const uploadBtn = document.getElementById('uploadBtn');
const uploadStatus = document.getElementById('uploadStatus');
const statusText = document.getElementById('statusText');
const progressFill = document.getElementById('progressFill');
const uploadResult = document.getElementById('uploadResult');
const resultCID = document.getElementById('resultCID');
const gatewayList = document.getElementById('gatewayList');
const cidInput = document.getElementById('cidInput');
const retrieveBtn = document.getElementById('retrieveBtn');
const retrieveResult = document.getElementById('retrieveResult');
const filePreview = document.getElementById('filePreview');
const recentList = document.getElementById('recentList');

let selectedFile = null;
let recentUploads = JSON.parse(localStorage.getItem('recentUploads') || '[]');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  updateRecentList();
});

// Upload Area Events
uploadArea.addEventListener('click', () => fileInput.click());

uploadArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadArea.classList.add('drag-over');
});

uploadArea.addEventListener('dragleave', () => {
  uploadArea.classList.remove('drag-over');
});

uploadArea.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadArea.classList.remove('drag-over');
  
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    handleFileSelect(files[0]);
  }
});

fileInput.addEventListener('change', (e) => {
  if (e.target.files.length > 0) {
    handleFileSelect(e.target.files[0]);
  }
});

function handleFileSelect(file) {
  if (file.size > CONFIG.MAX_FILE_SIZE) {
    alert('File too large! Maximum size is 100MB.');
    return;
  }

  selectedFile = file;
  uploadBtn.disabled = false;
  
  uploadArea.querySelector('p').textContent = `Selected: ${file.name}`;
  uploadArea.querySelector('small').textContent = `Size: ${formatBytes(file.size)}`;
}

uploadBtn.addEventListener('click', uploadFile);

async function uploadFile() {
  if (!selectedFile) return;

  uploadBtn.disabled = true;
  uploadResult.style.display = 'none';
  uploadStatus.style.display = 'block';
  
  statusText.textContent = 'Uploading to IPFS...';
  progressFill.style.width = '30%';

  const formData = new FormData();
  formData.append('file', selectedFile);

  try {
    const response = await fetch(`${CONFIG.API_BASE_URL}/storage/upload`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    progressFill.style.width = '100%';
    statusText.textContent = 'Pinning to NFT.Storage...';

    const data = await response.json();

    // Show results
    uploadStatus.style.display = 'none';
    uploadResult.style.display = 'block';
    
    resultCID.textContent = data.cid;
    
    gatewayList.innerHTML = data.gateways
      .map(url => `<li><a href="${url}" target="_blank">${url}</a></li>`)
      .join('');

    // Save to recent uploads
    addToRecent({
      cid: data.cid,
      filename: data.filename,
      size: data.size,
      timestamp: new Date().toISOString()
    });

    // Reset
    selectedFile = null;
    fileInput.value = '';
    uploadArea.querySelector('p').textContent = 'Click or drag file to upload';
    uploadArea.querySelector('small').textContent = 'Max size: 100MB';

  } catch (error) {
    uploadStatus.style.display = 'none';
    alert('Upload failed: ' + error.message);
  } finally {
    uploadBtn.disabled = false;
    progressFill.style.width = '0%';
  }
}

retrieveBtn.addEventListener('click', retrieveFile);

async function retrieveFile() {
  const cid = cidInput.value.trim();
  
  if (!cid) {
    alert('Please enter a CID');
    return;
  }

  retrieveResult.style.display = 'block';
  filePreview.innerHTML = '<p>Loading...</p>';

  try {
    const url = `${CONFIG.IPFS_GATEWAYS[0]}${cid}`;
    
    filePreview.innerHTML = `
      <img src="${url}" alt="File preview" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
      <div style="display:none;">
        <p>Preview not available for this file type</p>
        <a href="${url}" target="_blank" class="btn btn-secondary">Open in Gateway</a>
      </div>
    `;

  } catch (error) {
    filePreview.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
  }
}

function addToRecent(upload) {
  recentUploads.unshift(upload);
  recentUploads = recentUploads.slice(0, 10); // Keep only last 10
  localStorage.setItem('recentUploads', JSON.stringify(recentUploads));
  updateRecentList();
}

function updateRecentList() {
  if (recentUploads.length === 0) {
    recentList.innerHTML = '<p class="empty-state">No uploads yet</p>';
    return;
  }

  recentList.innerHTML = recentUploads
    .map(upload => `
      <div class="recent-item" onclick="cidInput.value='${upload.cid}'; retrieveFile();">
        <strong>${upload.filename}</strong>
        <small>CID: ${upload.cid.slice(0, 20)}...</small>
        <small>${formatBytes(upload.size)} • ${formatDate(upload.timestamp)}</small>
      </div>
    `)
    .join('');
}

function copyToClipboard(elementId) {
  const text = document.getElementById(elementId).textContent;
  navigator.clipboard.writeText(text).then(() => {
    alert('Copied to clipboard!');
  });
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours ago`;
  return date.toLocaleDateString();
}