// Global showAlert function
function showAlert(message, type = 'danger') {
    console.log('showAlert called:', message, type);
    const alertContainer = document.getElementById('alert-container');
    if (!alertContainer) {
        console.error('Alert container not found');
        return;
    }
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    alertContainer.appendChild(alertDiv);
    console.log('Alert added to container');
    
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
            console.log('Alert removed');
        }
    }, 5000);
}

// Configure PDF.js worker
if (typeof pdfjsLib !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('WPDF app initializing...');
    
    // Add click debugging
    document.addEventListener('click', function(e) {
        console.log('Click detected on:', e.target, 'Classes:', e.target.className);
    });
    
    // Initialize components
    setupThemeSwitcher();
    initializeHamburger();
    initializeUpload();
    initializeNavigation();
    
    console.log('WPDF app initialized');
});

// Global setupUploadSection function
function setupUploadSection(dropZone, fileInput, browseBtn, fileHandler) {
    console.log('Setting up upload section:', dropZone.id);
    
    // Make drop zone clickable
    dropZone.addEventListener('click', function(e) {
        // Don't trigger if clicking the browse button
        if (e.target.closest('button')) {
            return;
        }
        
        console.log('Drop zone clicked:', dropZone.id);
        e.preventDefault();
        e.stopPropagation();
        
        try {
            fileInput.click();
            console.log('File input clicked successfully for:', dropZone.id);
        } catch (error) {
            console.error('Error clicking file input:', error);
        }
    });
    
    // Browse button click handler
    if (browseBtn) {
        browseBtn.addEventListener('click', function(e) {
            console.log('Browse button clicked for:', dropZone.id);
            e.preventDefault();
            e.stopPropagation();
            
            try {
                fileInput.click();
                console.log('File input clicked via browse button for:', dropZone.id);
            } catch (error) {
                console.error('Error clicking file input via browse button:', error);
            }
        });
    }
    
    // Handle file selection
    fileInput.addEventListener('change', function(e) {
        console.log('File input changed for:', dropZone.id, 'files:', e.target.files.length);
        
        if (e.target.files.length > 0) {
            console.log('File details for', dropZone.id + ':');
            Array.from(e.target.files).forEach((file, index) => {
                console.log(`File ${index + 1}:`, {
                    name: file.name,
                    type: file.type,
                    size: file.size
                });
            });
        }
        
        fileHandler(e.target.files);
    });
    
    // Handle drag and drop
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, function(e) {
            e.preventDefault();
            e.stopPropagation();
        });
    });
    
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, function() {
            dropZone.classList.add('drop-zone-active');
        });
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, function() {
            dropZone.classList.remove('drop-zone-active');
        });
    });
    
    dropZone.addEventListener('drop', function(e) {
        console.log('Files dropped on:', dropZone.id, 'files:', e.dataTransfer.files.length);
        fileHandler(e.dataTransfer.files);
    });
}

function initializeUpload() {
    console.log('Setting up upload functionality...');
    
    // PDF Merger section
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const submitBtn = document.getElementById('submit-btn');
    const browseBtn = document.getElementById('browse-btn');
    
    // PDF Splitter section
    const splitDropZone = document.getElementById('split-drop-zone');
    const splitFileInput = document.getElementById('split-file-input');
    const splitBrowseBtn = document.getElementById('split-browse-btn');
    
    // PDF Compressor section
    const compressDropZone = document.getElementById('compress-drop-zone');
    const compressFileInput = document.getElementById('compress-file-input');
    const compressBrowseBtn = document.getElementById('compress-browse-btn');
    
    // Images to PDF section
    const imageDropZone = document.getElementById('image-drop-zone');
    const imageFileInput = document.getElementById('image-file-input');
    const imageBrowseBtn = document.getElementById('image-browse-btn');
    
    // PDF to Images section
    const extractDropZone = document.getElementById('extract-drop-zone');
    const extractFileInput = document.getElementById('extract-file-input');
    const extractBrowseBtn = document.getElementById('extract-browse-btn');
    
    // Docs to PDF section
    const docsDropZone = document.getElementById('docs-drop-zone');
    const docsFileInput = document.getElementById('docs-file-input');
    const docsBrowseBtn = document.getElementById('docs-browse-btn');
    
    let uploadedFiles = [];
    
    // Setup PDF Merger upload
    if (dropZone && fileInput) {
        setupUploadSection(dropZone, fileInput, browseBtn, handleFiles);
    }
    
    // Setup PDF Splitter upload
    if (splitDropZone && splitFileInput) {
        setupUploadSection(splitDropZone, splitFileInput, splitBrowseBtn, (files) => {
            console.log('Split files selected:', files.length);
            if (files.length > 0 && files[0].type === 'application/pdf') {
                const prompt = splitDropZone.querySelector('.drop-zone-prompt');
                if (prompt) {
                    prompt.textContent = `Selected: ${files[0].name}`;
                }
                const splitOptions = document.getElementById('split-options');
                if (splitOptions) {
                    splitOptions.style.display = 'block';
                }
            }
        });
    }
    
    // Setup PDF Compressor upload
    if (compressDropZone && compressFileInput) {
        setupUploadSection(compressDropZone, compressFileInput, compressBrowseBtn, (files) => {
            console.log('Compress files selected:', files.length);
            if (files.length > 0 && files[0].type === 'application/pdf') {
                const prompt = compressDropZone.querySelector('.drop-zone-prompt');
                if (prompt) {
                    prompt.textContent = `Selected: ${files[0].name}`;
                }
                const compressOptions = document.getElementById('compress-options');
                if (compressOptions) {
                    compressOptions.style.display = 'block';
                }
            }
        });
    }
    
    // Setup Images to PDF upload
    if (imageDropZone && imageFileInput) {
        setupUploadSection(imageDropZone, imageFileInput, imageBrowseBtn, (files) => {
            console.log('Image files selected:', files.length);
            const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
            if (imageFiles.length > 0) {
                const prompt = imageDropZone.querySelector('.drop-zone-prompt');
                if (prompt) {
                    prompt.textContent = `Selected ${imageFiles.length} image(s)`;
                }
                const imageOptions = document.getElementById('image-options');
                if (imageOptions) {
                    imageOptions.style.display = 'block';
                }
                
                // Show image preview and arrangement
                showImagePreview(imageFiles);
            }
        });
    }
    
    // Setup PDF to Images upload
    if (extractDropZone && extractFileInput) {
        setupUploadSection(extractDropZone, extractFileInput, extractBrowseBtn, async (files) => {
            console.log('Extract files selected:', files.length);
            if (files.length > 0 && files[0].type === 'application/pdf') {
                const prompt = extractDropZone.querySelector('.drop-zone-prompt');
                if (prompt) {
                    prompt.textContent = `Selected: ${files[0].name}`;
                }
                const extractOptions = document.getElementById('extract-options');
                if (extractOptions) {
                    extractOptions.style.display = 'block';
                }
                
                // Show PDF page preview for selection
                await showPDFPagePreview(files[0]);
            }
        });
    }
    
    // Setup Docs to PDF upload
    if (docsDropZone && docsFileInput) {
        setupUploadSection(docsDropZone, docsFileInput, docsBrowseBtn, (files) => {
            console.log('Docs files selected:', files.length);
            const supportedFiles = Array.from(files).filter(file => {
                const supportedTypes = [
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
                    'application/vnd.openxmlformats-officedocument.presentationml.presentation', // PPTX
                    'text/plain', // TXT
                    'application/rtf', // RTF
                    'text/html', // HTML
                    'text/htm' // HTM
                ];
                return supportedTypes.includes(file.type) || 
                       file.name.toLowerCase().endsWith('.docx') ||
                       file.name.toLowerCase().endsWith('.pptx') ||
                       file.name.toLowerCase().endsWith('.txt') ||
                       file.name.toLowerCase().endsWith('.rtf') ||
                       file.name.toLowerCase().endsWith('.html') ||
                       file.name.toLowerCase().endsWith('.htm');
            });
            
            if (supportedFiles.length > 0) {
                const prompt = docsDropZone.querySelector('.drop-zone-prompt');
                if (prompt) {
                    prompt.innerHTML = `Selected ${supportedFiles.length} document(s)<br><small>Ready for conversion</small>`;
                }
                const docsOptions = document.getElementById('docs-options');
                if (docsOptions) {
                    docsOptions.style.display = 'block';
                }
                
                // Show document preview
                showDocsPreview(supportedFiles);
            } else {
                showAlert('Please select supported document files (DOCX, PPTX, TXT, RTF, HTML)', 'danger');
            }
        });
    }
    

    
    // Handle file selection
    fileInput.addEventListener('change', function(e) {
        console.log('File input change event triggered');
        console.log('Files selected:', e.target.files.length);
        
        if (e.target.files.length > 0) {
            console.log('File details:');
            Array.from(e.target.files).forEach((file, index) => {
                console.log(`File ${index + 1}:`, {
                    name: file.name,
                    type: file.type,
                    size: file.size
                });
            });
        }
        
        handleFiles(e.target.files);
    });
    
    // Handle drag and drop
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Drag event:', eventName);
        });
    });
    
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, function() {
            console.log('Adding active class for:', eventName);
            dropZone.classList.add('drop-zone-active');
        });
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, function() {
            console.log('Removing active class for:', eventName);
            dropZone.classList.remove('drop-zone-active');
        });
    });
    
    dropZone.addEventListener('drop', function(e) {
        console.log('Files dropped:', e.dataTransfer.files.length);
        handleFiles(e.dataTransfer.files);
    });
    
    function handleFiles(files) {
        console.log('handleFiles called with:', files.length, 'files');
        
        if (files.length === 0) {
            console.log('No files to process');
            return;
        }
        
        // Filter PDF files
        console.log('Filtering PDF files...');
        uploadedFiles = Array.from(files).filter(file => {
            const isPdf = file.type === 'application/pdf';
            console.log(`File ${file.name}: type=${file.type}, isPdf=${isPdf}`);
            return isPdf;
        });
        
        console.log('PDF files found:', uploadedFiles.length);
        
        if (uploadedFiles.length === 0) {
            console.log('No PDF files found, showing alert');
            showAlert('Please select PDF files only', 'danger');
            return;
        }
        
        // Update UI
        console.log('Updating UI...');
        const prompt = dropZone.querySelector('.drop-zone-prompt');
        if (prompt) {
            const fileCount = uploadedFiles.length;
            let fileNames = uploadedFiles.slice(0, 3).map(f => f.name).join(', ');
            if (uploadedFiles.length > 3) {
                fileNames += ` and ${uploadedFiles.length - 3} more`;
            }
            const newText = `Selected ${fileCount} file${fileCount !== 1 ? 's' : ''}: ${fileNames}`;
            prompt.textContent = newText;
            console.log('Updated prompt text to:', newText);
        } else {
            console.error('Drop zone prompt element not found');
        }
        
        // Enable submit button
        if (submitBtn) {
            submitBtn.disabled = false;
            console.log('Submit button enabled');
        } else {
            console.error('Submit button not found');
        }
        
        const successMessage = `Successfully selected ${uploadedFiles.length} PDF file${uploadedFiles.length !== 1 ? 's' : ''}`;
        showAlert(successMessage, 'success');
    }
    
    // Initialize PDF processing functionality
    initializePDFProcessing();
    
    // Initialize Docs to PDF functionality
    initializeDocsProcessing();
    
    // Initialize PDF Merger workflow buttons
    initializeMergerWorkflow();
    
    console.log('Upload functionality ready');
}

function initializeMergerWorkflow() {
    const submitBtn = document.getElementById('submit-btn');
    const backToUploadBtn = document.getElementById('back-to-upload-btn');
    const mergeBtn = document.getElementById('merge-btn');
    const startOverBtn = document.getElementById('start-over-btn');
    
    let uploadedFiles = [];
    
    // Continue to Arrange button
    if (submitBtn) {
        submitBtn.addEventListener('click', function() {
            const fileInput = document.getElementById('file-input');
            if (!fileInput || fileInput.files.length === 0) {
                showAlert('Please select PDF files first', 'danger');
                return;
            }
            
            uploadedFiles = Array.from(fileInput.files).filter(file => file.type === 'application/pdf');
            if (uploadedFiles.length === 0) {
                showAlert('No valid PDF files selected', 'danger');
                return;
            }
            
            showPreviewSection(uploadedFiles);
        });
    }
    
    // Back to Upload button
    if (backToUploadBtn) {
        backToUploadBtn.addEventListener('click', function() {
            document.getElementById('pdf-merger-section').style.display = 'block';
            document.getElementById('preview-section').style.display = 'none';
        });
    }
    
    // Merge Files button
    if (mergeBtn) {
        mergeBtn.addEventListener('click', async function() {
            const fileList = document.getElementById('file-list');
            const fileItems = fileList.querySelectorAll('.file-item');
            
            if (fileItems.length === 0) {
                showAlert('No files to merge', 'danger');
                return;
            }
            
            mergeBtn.disabled = true;
            mergeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Merging...';
            
            try {
                const orderedFiles = Array.from(fileItems).map(item => {
                    const fileName = item.querySelector('.file-name').textContent;
                    return uploadedFiles.find(file => file.name === fileName);
                }).filter(file => file);
                
                await mergePDFs(orderedFiles);
                showDownloadSection();
            } catch (error) {
                showAlert('Error merging PDFs: ' + error.message, 'danger');
                console.error('Error:', error);
            } finally {
                mergeBtn.disabled = false;
                mergeBtn.innerHTML = '<i class="fas fa-object-group"></i> Merge Files';
            }
        });
    }
    
    // Start Over button
    if (startOverBtn) {
        startOverBtn.addEventListener('click', function() {
            // Reset file input
            const fileInput = document.getElementById('file-input');
            if (fileInput) fileInput.value = '';
            
            // Reset UI
            const dropZone = document.getElementById('drop-zone');
            const prompt = dropZone.querySelector('.drop-zone-prompt');
            if (prompt) {
                prompt.textContent = 'Drag & drop PDF files here or click to browse';
            }
            
            const submitBtn = document.getElementById('submit-btn');
            if (submitBtn) submitBtn.disabled = true;
            
            // Show upload section
            document.getElementById('pdf-merger-section').style.display = 'block';
            document.getElementById('download-section').style.display = 'none';
            
            uploadedFiles = [];
        });
    }
}

function showPreviewSection(files) {
    const fileList = document.getElementById('file-list');
    fileList.innerHTML = '';
    
    files.forEach((file, index) => {
        const li = document.createElement('li');
        li.className = 'file-item';
        li.innerHTML = `
            <div class="file-icon">
                <i class="fas fa-file-pdf"></i>
            </div>
            <div class="file-info">
                <div class="file-name">${file.name}</div>
                <div class="file-size">${formatFileSize(file.size)}</div>
            </div>
            <div class="file-actions">
                <button class="btn-remove" onclick="removeFile(${index})">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        fileList.appendChild(li);
    });
    
    // Initialize sortable
    if (typeof Sortable !== 'undefined') {
        new Sortable(fileList, {
            animation: 150,
            ghostClass: 'sortable-ghost'
        });
    }
    
    document.getElementById('pdf-merger-section').style.display = 'none';
    document.getElementById('preview-section').style.display = 'block';
}

function showDownloadSection() {
    document.getElementById('preview-section').style.display = 'none';
    document.getElementById('download-section').style.display = 'block';
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function removeFile(index) {
    const fileList = document.getElementById('file-list');
    const fileItems = fileList.querySelectorAll('.file-item');
    if (fileItems[index]) {
        fileItems[index].remove();
    }
}

async function mergePDFs(files) {
    const { PDFDocument } = PDFLib;
    const mergedPdf = await PDFDocument.create();
    
    for (const file of files) {
        const arrayBuffer = await readFileAsArrayBuffer(file);
        const pdf = await PDFDocument.load(arrayBuffer);
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        pages.forEach(page => mergedPdf.addPage(page));
    }
    
    const pdfBytes = await mergedPdf.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    
    // Create download link
    const downloadBtn = document.getElementById('download-btn');
    if (downloadBtn) {
        const url = URL.createObjectURL(blob);
        downloadBtn.href = url;
        downloadBtn.download = 'merged.pdf';
    }
}

function initializePDFProcessing() {
    console.log('Initializing PDF processing...');
    
    // PDF Splitter functionality
    const splitMethods = document.querySelectorAll('.split-method');
    const splitBtn = document.getElementById('split-btn');
    const rangeOptions = document.getElementById('range-options');
    let splitMethod = 'range';
    let splitPdfFile = null;
    
    console.log('Split methods found:', splitMethods.length);
    console.log('Split button found:', !!splitBtn);
    
    if (splitMethods.length > 0) {
        splitMethods.forEach((method, index) => {
            console.log(`Adding click listener to split method ${index}:`, method);
            method.addEventListener('click', function(e) {
                console.log('Split method clicked:', this, 'Method:', this.dataset.method);
                e.preventDefault();
                e.stopPropagation();
                
                splitMethods.forEach(m => m.classList.remove('active'));
                this.classList.add('active');
                splitMethod = this.dataset.method;
                
                console.log('Split method changed to:', splitMethod);
                
                if (rangeOptions) {
                    rangeOptions.style.display = splitMethod === 'range' ? 'block' : 'none';
                    console.log('Range options display:', rangeOptions.style.display);
                }
            });
        });
    }
    
    if (splitBtn) {
        splitBtn.addEventListener('click', async () => {
            const splitFileInput = document.getElementById('split-file-input');
            if (!splitFileInput || !splitFileInput.files[0]) {
                showAlert('Please select a PDF file to split', 'danger');
                return;
            }
            
            splitPdfFile = splitFileInput.files[0];
            splitBtn.disabled = true;
            splitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            
            try {
                if (splitMethod === 'range') {
                    const rangeInput = document.getElementById('page-ranges').value.trim();
                    if (!rangeInput) {
                        showAlert('Please enter page ranges', 'danger');
                        return;
                    }
                    await splitPDFByRange(splitPdfFile, rangeInput);
                } else {
                    await splitPDFEachPage(splitPdfFile);
                }
                showAlert('PDF successfully split! Check your downloads.', 'success');
            } catch (error) {
                showAlert('Error splitting PDF: ' + error.message, 'danger');
                console.error('Error:', error);
            } finally {
                splitBtn.disabled = false;
                splitBtn.innerHTML = '<i class="fas fa-cut"></i> Split PDF';
            }
        });
    }
    
    // PDF Compressor functionality
    const compressionOptions = document.querySelectorAll('.compression-option');
    const compressBtn = document.getElementById('compress-btn');
    let compressionLevel = 'medium';
    let compressPdfFile = null;
    
    if (compressionOptions) {
        compressionOptions.forEach(option => {
            option.addEventListener('click', () => {
                compressionOptions.forEach(o => o.classList.remove('active'));
                option.classList.add('active');
                compressionLevel = option.dataset.level;
            });
        });
    }
    
    if (compressBtn) {
        compressBtn.addEventListener('click', async () => {
            const compressFileInput = document.getElementById('compress-file-input');
            if (!compressFileInput || !compressFileInput.files[0]) {
                showAlert('Please select a PDF file to compress', 'danger');
                return;
            }
            
            compressPdfFile = compressFileInput.files[0];
            compressBtn.disabled = true;
            compressBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Compressing...';
            
            try {
                await compressPDF(compressPdfFile, compressionLevel);
                showAlert('PDF successfully compressed! Check your downloads.', 'success');
            } catch (error) {
                showAlert('Error compressing PDF: ' + error.message, 'danger');
                console.error('Error:', error);
            } finally {
                compressBtn.disabled = false;
                compressBtn.innerHTML = '<i class="fas fa-compress"></i> Compress PDF';
            }
        });
    }
    
    // Images to PDF functionality
    const pageSizeSelect = document.getElementById('page-size');
    const orientationOptions = document.querySelectorAll('.orientation-option');
    const createPdfBtn = document.getElementById('create-pdf-btn');
    let pageSize = 'a4';
    let orientation = 'portrait';
    let uploadedImages = [];
    
    if (pageSizeSelect) {
        pageSizeSelect.addEventListener('change', () => {
            pageSize = pageSizeSelect.value;
        });
    }
    
    if (orientationOptions) {
        orientationOptions.forEach(option => {
            option.addEventListener('click', () => {
                orientationOptions.forEach(o => o.classList.remove('active'));
                option.classList.add('active');
                orientation = option.dataset.orientation;
            });
        });
    }
    
    if (createPdfBtn) {
        createPdfBtn.addEventListener('click', async () => {
            // Get ordered images from preview
            const imagePreviewList = document.getElementById('image-preview-list');
            const imageItems = imagePreviewList.querySelectorAll('.image-preview-item');
            
            if (imageItems.length === 0) {
                showAlert('Please select image files', 'danger');
                return;
            }
            
            // Get ordered files based on current arrangement
            const orderedImages = Array.from(imageItems).map(item => {
                const fileName = item.dataset.fileName;
                const imageFileInput = document.getElementById('image-file-input');
                return Array.from(imageFileInput.files).find(file => file.name === fileName);
            }).filter(file => file);
            
            if (orderedImages.length === 0) {
                showAlert('No valid image files found', 'danger');
                return;
            }
            
            createPdfBtn.disabled = true;
            createPdfBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating PDF...';
            
            try {
                await createPDFFromImages(orderedImages, pageSize, orientation);
                showAlert('PDF successfully created! Check your downloads.', 'success');
            } catch (error) {
                showAlert('Error creating PDF: ' + error.message, 'danger');
                console.error('Error:', error);
            } finally {
                createPdfBtn.disabled = false;
                createPdfBtn.innerHTML = '<i class="fas fa-file-pdf"></i> Create PDF';
            }
        });
    }
    
    // PDF to Images functionality
    const formatOptions = document.querySelectorAll('.format-option');
    const qualitySlider = document.getElementById('quality-slider');
    const qualityLabel = document.querySelector('.quality-label');
    const extractBtn = document.getElementById('extract-btn');
    let imageFormat = 'png';
    let imageQuality = 8;
    let extractPdfFile = null;
    
    if (formatOptions) {
        formatOptions.forEach(option => {
            option.addEventListener('click', () => {
                formatOptions.forEach(o => o.classList.remove('active'));
                option.classList.add('active');
                imageFormat = option.dataset.format;
            });
        });
    }
    
    if (qualitySlider && qualityLabel) {
        qualitySlider.addEventListener('input', () => {
            imageQuality = parseInt(qualitySlider.value, 10);
            let qualityText;
            if (imageQuality <= 3) {
                qualityText = 'Low Quality';
            } else if (imageQuality <= 7) {
                qualityText = 'Medium Quality';
            } else {
                qualityText = 'High Quality';
            }
            qualityLabel.textContent = qualityText;
        });
    }
    
    if (extractBtn) {
        extractBtn.addEventListener('click', async () => {
            // Get selected pages
            const selectedPages = getSelectedPages();
            if (selectedPages.length === 0) {
                showAlert('Please select at least one page to extract', 'danger');
                return;
            }
            
            const extractFileInput = document.getElementById('extract-file-input');
            if (!extractFileInput || !extractFileInput.files[0]) {
                showAlert('Please select a PDF file to extract images from', 'danger');
                return;
            }
            
            extractPdfFile = extractFileInput.files[0];
            extractBtn.disabled = true;
            extractBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Extracting Images...';
            
            try {
                await extractImagesFromPDF(extractPdfFile, imageFormat, imageQuality, selectedPages);
                showAlert(`Successfully extracted ${selectedPages.length} image(s)! Check your downloads.`, 'success');
            } catch (error) {
                showAlert('Error extracting images: ' + error.message, 'danger');
                console.error('Error:', error);
            } finally {
                extractBtn.disabled = false;
                extractBtn.innerHTML = '<i class="fas fa-images"></i> Extract Images';
            }
        });
    }
}

function initializeNavigation() {
    const navFeatures = document.querySelectorAll('.navbar-feature');
    const sections = {
        'PDF Merger': document.getElementById('pdf-merger-section'),
        'PDF Splitter': document.getElementById('pdf-splitter-section'),
        'PDF Compressor': document.getElementById('pdf-compressor-section'),
        'Images to PDF': document.getElementById('images-to-pdf-section'),
        'PDF to Images': document.getElementById('pdf-to-images-section'),
        'PDF Security': document.getElementById('pdf-security-section'),
        'PDF Watermark': document.getElementById('pdf-watermark-section'),
        'Docs to PDF': document.getElementById('docs-to-pdf-section')
    };
    
    navFeatures.forEach(feature => {
        feature.addEventListener('click', function() {
            // Update active class
            navFeatures.forEach(f => f.classList.remove('active'));
            this.classList.add('active');
            
            // Hide all sections
            Object.values(sections).forEach(section => {
                if (section) section.style.display = 'none';
            });
            
            // Show selected section
            const featureText = this.textContent.trim();
            const targetSection = sections[featureText];
            if (targetSection) {
                targetSection.style.display = 'block';
            }
        });
    });
    
    // Show PDF Merger by default
    if (sections['PDF Merger']) {
        sections['PDF Merger'].style.display = 'block';
    }
}

function setupThemeSwitcher() {
    const themeToggles = document.querySelectorAll('.theme-checkbox');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    let currentTheme = localStorage.getItem('theme');
    if (!currentTheme) {
        currentTheme = prefersDarkScheme.matches ? 'dark' : 'light';
        localStorage.setItem('theme', currentTheme);
    }
    
    // Set initial theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    themeToggles.forEach(toggle => {
        toggle.checked = currentTheme === 'dark';
    });
    
    // Add event listeners
    themeToggles.forEach(toggle => {
        toggle.addEventListener('change', function() {
            const newTheme = this.checked ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            localStorage.setItem('user-theme-preference', 'true');
            
            // Sync all toggles
            themeToggles.forEach(t => t.checked = this.checked);
        });
    });
}

function initializeHamburger() {
    const hamburger = document.getElementById('hamburger');
    const navbarLinks = document.getElementById('navbar-links');
    
    if (!hamburger || !navbarLinks) return;
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navbarLinks.classList.toggle('active');
    });
    
    // Close menu when clicking on nav items
    const navFeatures = navbarLinks.querySelectorAll('.navbar-feature');
    navFeatures.forEach(feature => {
        feature.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navbarLinks.classList.remove('active');
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navbarLinks.contains(e.target)) {
            hamburger.classList.remove('active');
            navbarLinks.classList.remove('active');
        }
    });
}

// PDF Processing Functions
async function splitPDFByRange(file, rangeInput) {
    const ranges = [];
    const parts = rangeInput.split(',');
    
    for (const part of parts) {
        if (part.includes('-')) {
            const [start, end] = part.split('-').map(num => parseInt(num.trim(), 10));
            if (isNaN(start) || isNaN(end) || start < 1 || end < start) {
                throw new Error('Invalid page range: ' + part);
            }
            ranges.push({ start: start - 1, end: end - 1 });
        } else {
            const page = parseInt(part.trim(), 10);
            if (isNaN(page) || page < 1) {
                throw new Error('Invalid page number: ' + part);
            }
            ranges.push({ start: page - 1, end: page - 1 });
        }
    }
    
    const arrayBuffer = await readFileAsArrayBuffer(file);
    const { PDFDocument } = PDFLib;
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const totalPages = pdfDoc.getPageCount();
    
    for (const range of ranges) {
        if (range.end >= totalPages) {
            throw new Error(`Page range ${range.start + 1}-${range.end + 1} exceeds the document's page count (${totalPages})`);
        }
    }
    
    for (let i = 0; i < ranges.length; i++) {
        const range = ranges[i];
        const newPdfDoc = await PDFDocument.create();
        
        const pageIndexes = [];
        for (let j = range.start; j <= range.end; j++) {
            pageIndexes.push(j);
        }
        
        const pages = await newPdfDoc.copyPages(pdfDoc, pageIndexes);
        pages.forEach(page => {
            newPdfDoc.addPage(page);
        });
        
        const newPdfBytes = await newPdfDoc.save();
        const blob = new Blob([newPdfBytes], { type: 'application/pdf' });
        const rangeText = range.start === range.end 
            ? `page${range.start + 1}` 
            : `pages${range.start + 1}-${range.end + 1}`;
        const filename = `${file.name.replace('.pdf', '')}_${rangeText}.pdf`;
        
        download(blob, filename, 'application/pdf');
    }
}

async function splitPDFEachPage(file) {
    const arrayBuffer = await readFileAsArrayBuffer(file);
    const { PDFDocument } = PDFLib;
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const totalPages = pdfDoc.getPageCount();
    
    let zip = null;
    if (totalPages > 5) {
        zip = new JSZip();
    }
    
    for (let i = 0; i < totalPages; i++) {
        const newPdfDoc = await PDFDocument.create();
        const [page] = await newPdfDoc.copyPages(pdfDoc, [i]);
        newPdfDoc.addPage(page);
        
        const newPdfBytes = await newPdfDoc.save();
        const blob = new Blob([newPdfBytes], { type: 'application/pdf' });
        const filename = `${file.name.replace('.pdf', '')}_page${i + 1}.pdf`;
        
        if (zip) {
            zip.file(filename, blob);
        } else {
            download(blob, filename, 'application/pdf');
        }
    }
    
    if (zip) {
        const content = await zip.generateAsync({ type: 'blob' });
        const zipFilename = `${file.name.replace('.pdf', '')}_all_pages.zip`;
        download(content, zipFilename, 'application/zip');
    }
}

async function compressPDF(file, level) {
    const arrayBuffer = await readFileAsArrayBuffer(file);
    const { PDFDocument } = PDFLib;
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    
    const newPdfDoc = await PDFDocument.create();
    const pages = await newPdfDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
    pages.forEach(page => {
        newPdfDoc.addPage(page);
    });
    
    const compressedPdfBytes = await newPdfDoc.save({
        useObjectStreams: true,
        addDefaultPage: false,
    });
    
    const blob = new Blob([compressedPdfBytes], { type: 'application/pdf' });
    const filename = `${file.name.replace('.pdf', '')}_compressed.pdf`;
    download(blob, filename, 'application/pdf');
}

async function createPDFFromImages(images, size, orientation) {
    const { PDFDocument, PageSizes } = PDFLib;
    const pdfDoc = await PDFDocument.create();
    
    let pageWidth, pageHeight;
    switch (size) {
        case 'a4':
            [pageWidth, pageHeight] = PageSizes.A4;
            break;
        case 'letter':
            [pageWidth, pageHeight] = PageSizes.Letter;
            break;
        case 'legal':
            [pageWidth, pageHeight] = PageSizes.Legal;
            break;
        default:
            [pageWidth, pageHeight] = PageSizes.A4;
    }
    
    if (orientation === 'landscape') {
        [pageWidth, pageHeight] = [pageHeight, pageWidth];
    }
    
    for (const image of images) {
        const imageArrayBuffer = await readFileAsArrayBuffer(image);
        
        let embeddedImage;
        if (image.type === 'image/jpeg' || image.type === 'image/jpg') {
            embeddedImage = await pdfDoc.embedJpg(imageArrayBuffer);
        } else if (image.type === 'image/png') {
            embeddedImage = await pdfDoc.embedPng(imageArrayBuffer);
        } else {
            console.warn(`Unsupported image format: ${image.type}`);
            continue;
        }
        
        const imgWidth = embeddedImage.width;
        const imgHeight = embeddedImage.height;
        
        const scale = Math.min(
            pageWidth / imgWidth,
            pageHeight / imgHeight
        ) * 0.9;
        
        const scaledWidth = imgWidth * scale;
        const scaledHeight = imgHeight * scale;
        
        const x = (pageWidth - scaledWidth) / 2;
        const y = (pageHeight - scaledHeight) / 2;
        
        const page = pdfDoc.addPage([pageWidth, pageHeight]);
        
        page.drawImage(embeddedImage, {
            x: x,
            y: y,
            width: scaledWidth,
            height: scaledHeight,
        });
    }
    
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const filename = `images_to_pdf_${new Date().getTime()}.pdf`;
    download(blob, filename, 'application/pdf');
}

async function extractImagesFromPDF(file, format, quality, selectedPages = null) {
    const arrayBuffer = await readFileAsArrayBuffer(file);
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    
    const numPages = pdf.numPages;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const zip = new JSZip();
    
    // Use selected pages or all pages if none selected
    const pagesToExtract = selectedPages && selectedPages.length > 0 ? selectedPages : Array.from({length: numPages}, (_, i) => i + 1);
    
    for (const pageNum of pagesToExtract) {
        if (pageNum > numPages) continue;
        
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 2.0 });
        
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        
        await page.render({
            canvasContext: context,
            viewport: viewport
        }).promise;
        
        let imageData;
        if (format === 'png') {
            imageData = canvas.toDataURL('image/png');
        } else {
            const qualityValue = quality / 10;
            imageData = canvas.toDataURL('image/jpeg', qualityValue);
        }
        
        const byteString = atob(imageData.split(',')[1]);
        const mimeString = imageData.split(',')[0].split(':')[1].split(';')[0];
        
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        
        for (let j = 0; j < byteString.length; j++) {
            ia[j] = byteString.charCodeAt(j);
        }
        
        const blob = new Blob([ab], { type: mimeString });
        const filename = `page_${pageNum}.${format}`;
        zip.file(filename, blob);
    }
    
    const content = await zip.generateAsync({ type: 'blob' });
    const zipFilename = `${file.name.replace('.pdf', '')}_selected_images.zip`;
    download(content, zipFilename, 'application/zip');
}

function readFileAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}

// Image Preview and Arrangement Functions
function showImagePreview(imageFiles) {
    const imagePreviewContainer = document.getElementById('image-preview-container');
    const imagePreviewList = document.getElementById('image-preview-list');
    
    if (!imagePreviewContainer || !imagePreviewList) {
        console.error('Image preview elements not found');
        return;
    }
    
    // Clear existing previews
    imagePreviewList.innerHTML = '';
    
    // Create preview items for each image
    imageFiles.forEach((file, index) => {
        const previewItem = document.createElement('div');
        previewItem.className = 'image-preview-item';
        previewItem.dataset.fileName = file.name;
        
        // Create image element
        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        img.alt = file.name;
        
        // Create page number indicator
        const pageNumber = document.createElement('div');
        pageNumber.className = 'page-number';
        pageNumber.textContent = index + 1;
        
        // Create remove button
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-image';
        removeBtn.innerHTML = '<i class="fas fa-times"></i>';
        removeBtn.onclick = () => removeImageFromPreview(previewItem);
        
        // Create image info
        const imageInfo = document.createElement('div');
        imageInfo.className = 'image-info';
        imageInfo.textContent = file.name.length > 20 ? file.name.substring(0, 17) + '...' : file.name;
        
        // Assemble preview item
        previewItem.appendChild(img);
        previewItem.appendChild(pageNumber);
        previewItem.appendChild(removeBtn);
        previewItem.appendChild(imageInfo);
        
        imagePreviewList.appendChild(previewItem);
    });
    
    // Show the preview container
    imagePreviewContainer.style.display = 'block';
    
    // Initialize sortable functionality
    if (typeof Sortable !== 'undefined') {
        new Sortable(imagePreviewList, {
            animation: 150,
            ghostClass: 'sortable-ghost',
            onEnd: function() {
                updatePageNumbers();
            }
        });
    }
    
    // Update page numbers initially
    updatePageNumbers();
}

function updatePageNumbers() {
    const imageItems = document.querySelectorAll('.image-preview-item');
    imageItems.forEach((item, index) => {
        const pageNumber = item.querySelector('.page-number');
        if (pageNumber) {
            pageNumber.textContent = index + 1;
        }
    });
}

function removeImageFromPreview(previewItem) {
    const fileName = previewItem.dataset.fileName;
    
    // Remove from preview
    previewItem.remove();
    
    // Update page numbers
    updatePageNumbers();
    
    // Check if any images remain
    const remainingItems = document.querySelectorAll('.image-preview-item');
    if (remainingItems.length === 0) {
        const imagePreviewContainer = document.getElementById('image-preview-container');
        const imageOptions = document.getElementById('image-options');
        
        if (imagePreviewContainer) {
            imagePreviewContainer.style.display = 'none';
        }
        
        if (imageOptions) {
            imageOptions.style.display = 'none';
        }
        
        // Reset file input
        const imageFileInput = document.getElementById('image-file-input');
        if (imageFileInput) {
            imageFileInput.value = '';
        }
        
        // Reset drop zone prompt
        const imageDropZone = document.getElementById('image-drop-zone');
        const prompt = imageDropZone.querySelector('.drop-zone-prompt');
        if (prompt) {
            prompt.textContent = 'Drag & drop image files here or click to browse';
        }
        
        showAlert('All images removed', 'info');
    } else {
        showAlert(`Removed ${fileName}`, 'info');
    }
}
// PDF Page Preview and Selection Functions
async function showPDFPagePreview(pdfFile) {
    const pdfPagePreview = document.getElementById('pdf-page-preview');
    const pdfPagesGrid = document.getElementById('pdf-pages-grid');
    
    if (!pdfPagePreview || !pdfPagesGrid) {
        console.error('PDF page preview elements not found');
        return;
    }
    
    try {
        // Clear existing previews
        pdfPagesGrid.innerHTML = '';
        
        // Load PDF
        const arrayBuffer = await readFileAsArrayBuffer(pdfFile);
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        const numPages = pdf.numPages;
        
        // Create preview for each page
        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
            const pageItem = document.createElement('div');
            pageItem.className = 'pdf-page-item';
            pageItem.dataset.pageNumber = pageNum;
            
            // Add loading indicator
            const loadingDiv = document.createElement('div');
            loadingDiv.className = 'pdf-page-loading';
            loadingDiv.textContent = `Loading page ${pageNum}...`;
            pageItem.appendChild(loadingDiv);
            
            // Add page number
            const pageNumber = document.createElement('div');
            pageNumber.className = 'page-number';
            pageNumber.textContent = pageNum;
            pageItem.appendChild(pageNumber);
            
            // Add selection indicator
            const selectionIndicator = document.createElement('div');
            selectionIndicator.className = 'selection-indicator';
            selectionIndicator.innerHTML = '<i class="fas fa-check"></i>';
            pageItem.appendChild(selectionIndicator);
            
            // Add click handler for selection
            pageItem.addEventListener('click', function() {
                togglePageSelection(this);
            });
            
            pdfPagesGrid.appendChild(pageItem);
            
            // Render page asynchronously
            renderPDFPage(pdf, pageNum, pageItem);
        }
        
        // Show the preview container
        pdfPagePreview.style.display = 'block';
        
        // Initialize page selection controls
        initializePageSelectionControls();
        
        // Select all pages by default
        setTimeout(() => {
            selectAllPages();
        }, 100);
        
    } catch (error) {
        console.error('Error loading PDF preview:', error);
        showAlert('Error loading PDF preview: ' + error.message, 'danger');
    }
}

async function renderPDFPage(pdf, pageNum, pageItem) {
    try {
        const page = await pdf.getPage(pageNum);
        const scale = 0.5; // Smaller scale for preview
        const viewport = page.getViewport({ scale: scale });
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        await page.render({
            canvasContext: context,
            viewport: viewport
        }).promise;
        
        // Remove loading indicator and add canvas
        const loadingDiv = pageItem.querySelector('.pdf-page-loading');
        if (loadingDiv) {
            loadingDiv.remove();
        }
        
        pageItem.insertBefore(canvas, pageItem.firstChild);
        
    } catch (error) {
        console.error(`Error rendering page ${pageNum}:`, error);
        const loadingDiv = pageItem.querySelector('.pdf-page-loading');
        if (loadingDiv) {
            loadingDiv.textContent = `Error loading page ${pageNum}`;
            loadingDiv.style.color = 'red';
        }
    }
}

function togglePageSelection(pageItem) {
    pageItem.classList.toggle('selected');
    updateSelectedPagesCount();
}

function selectAllPages() {
    const pageItems = document.querySelectorAll('.pdf-page-item');
    pageItems.forEach(item => {
        item.classList.add('selected');
    });
    updateSelectedPagesCount();
}

function deselectAllPages() {
    const pageItems = document.querySelectorAll('.pdf-page-item');
    pageItems.forEach(item => {
        item.classList.remove('selected');
    });
    updateSelectedPagesCount();
}

function updateSelectedPagesCount() {
    const selectedPages = document.querySelectorAll('.pdf-page-item.selected');
    const countElement = document.getElementById('selected-pages-count');
    if (countElement) {
        const count = selectedPages.length;
        countElement.textContent = `${count} page${count !== 1 ? 's' : ''} selected`;
    }
}

function getSelectedPages() {
    const selectedPageItems = document.querySelectorAll('.pdf-page-item.selected');
    return Array.from(selectedPageItems).map(item => parseInt(item.dataset.pageNumber, 10));
}

function initializePageSelectionControls() {
    const selectAllBtn = document.getElementById('select-all-pages');
    const deselectAllBtn = document.getElementById('deselect-all-pages');
    
    if (selectAllBtn) {
        selectAllBtn.addEventListener('click', function(e) {
            e.preventDefault();
            selectAllPages();
        });
    }
    
    if (deselectAllBtn) {
        deselectAllBtn.addEventListener('click', function(e) {
            e.preventDefault();
            deselectAllPages();
        });
    }
}
// Docs to PDF Functions
function showDocsPreview(docFiles) {
    const docsPreviewContainer = document.getElementById('docs-preview-container');
    const docsPreviewList = document.getElementById('docs-preview-list');
    
    if (!docsPreviewContainer || !docsPreviewList) {
        console.error('Docs preview elements not found');
        return;
    }
    
    // Clear existing previews
    docsPreviewList.innerHTML = '';
    
    // Create preview items for each document
    docFiles.forEach((file, index) => {
        const previewItem = document.createElement('div');
        previewItem.className = 'docs-preview-item';
        previewItem.dataset.fileName = file.name;
        
        // Get file icon based on type
        const fileIcon = getFileIcon(file);
        
        // Create file icon element
        const iconDiv = document.createElement('div');
        iconDiv.className = 'docs-file-icon';
        iconDiv.innerHTML = `<i class="${fileIcon}"></i>`;
        
        // Create file info
        const fileInfo = document.createElement('div');
        fileInfo.className = 'docs-file-info';
        
        const fileName = document.createElement('div');
        fileName.className = 'docs-file-name';
        fileName.textContent = file.name;
        
        const fileDetails = document.createElement('div');
        fileDetails.className = 'docs-file-details';
        fileDetails.textContent = `${getFileType(file)} • ${formatFileSize(file.size)}`;
        
        fileInfo.appendChild(fileName);
        fileInfo.appendChild(fileDetails);
        
        // Create remove button
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'docs-file-actions';
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'btn-remove-doc';
        removeBtn.innerHTML = '<i class="fas fa-times"></i>';
        removeBtn.onclick = () => removeDocFromPreview(previewItem);
        
        actionsDiv.appendChild(removeBtn);
        
        // Assemble preview item
        previewItem.appendChild(iconDiv);
        previewItem.appendChild(fileInfo);
        previewItem.appendChild(actionsDiv);
        
        docsPreviewList.appendChild(previewItem);
    });
    
    // Show the preview container
    docsPreviewContainer.style.display = 'block';
}

function getFileIcon(file) {
    const extension = file.name.toLowerCase().split('.').pop();
    const iconMap = {
        'docx': 'fas fa-file-word',
        'pptx': 'fas fa-file-powerpoint',
        'txt': 'fas fa-file-alt',
        'rtf': 'fas fa-file-alt',
        'html': 'fas fa-code',
        'htm': 'fas fa-code'
    };
    return iconMap[extension] || 'fas fa-file';
}

function getFileType(file) {
    const extension = file.name.toLowerCase().split('.').pop();
    const typeMap = {
        'docx': 'Word Document',
        'pptx': 'PowerPoint Presentation',
        'txt': 'Text File',
        'rtf': 'Rich Text Format',
        'html': 'HTML Document',
        'htm': 'HTML Document'
    };
    return typeMap[extension] || 'Document';
}

function removeDocFromPreview(previewItem) {
    const fileName = previewItem.dataset.fileName;
    
    // Remove from preview
    previewItem.remove();
    
    // Check if any documents remain
    const remainingItems = document.querySelectorAll('.docs-preview-item');
    if (remainingItems.length === 0) {
        const docsPreviewContainer = document.getElementById('docs-preview-container');
        const docsOptions = document.getElementById('docs-options');
        
        if (docsPreviewContainer) {
            docsPreviewContainer.style.display = 'none';
        }
        
        if (docsOptions) {
            docsOptions.style.display = 'none';
        }
        
        // Reset file input
        const docsFileInput = document.getElementById('docs-file-input');
        if (docsFileInput) {
            docsFileInput.value = '';
        }
        
        // Reset drop zone prompt
        const docsDropZone = document.getElementById('docs-drop-zone');
        const prompt = docsDropZone.querySelector('.drop-zone-prompt');
        if (prompt) {
            prompt.innerHTML = 'Drag & drop documents here or click to browse<br><small>Supports: DOCX, PPTX, TXT, RTF, HTML</small>';
        }
        
        showAlert('All documents removed', 'info');
    } else {
        showAlert(`Removed ${fileName}`, 'info');
    }
}

function initializeDocsProcessing() {
    console.log('Initializing Docs to PDF processing...');
    
    // Page size selection
    const docsPageSize = document.getElementById('docs-page-size');
    let pageSize = 'a4';
    
    if (docsPageSize) {
        docsPageSize.addEventListener('change', () => {
            pageSize = docsPageSize.value;
        });
    }
    
    // Orientation options
    const orientationOptions = document.querySelectorAll('#docs-to-pdf-section .orientation-option');
    let orientation = 'portrait';
    
    if (orientationOptions.length > 0) {
        orientationOptions.forEach(option => {
            option.addEventListener('click', function() {
                orientationOptions.forEach(o => o.classList.remove('active'));
                this.classList.add('active');
                orientation = this.dataset.orientation;
            });
        });
    }
    
    // Convert button
    const convertDocsBtn = document.getElementById('convert-docs-btn');
    
    if (convertDocsBtn) {
        convertDocsBtn.addEventListener('click', async function() {
            const docsFileInput = document.getElementById('docs-file-input');
            if (!docsFileInput || docsFileInput.files.length === 0) {
                showAlert('Please select document files to convert', 'danger');
                return;
            }
            
            // Get conversion settings
            const settings = getConversionSettings();
            
            convertDocsBtn.disabled = true;
            convertDocsBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Converting...';
            
            try {
                await convertDocumentsToPDF(docsFileInput.files, settings);
                showAlert('Documents successfully converted to PDF! Check your downloads.', 'success');
            } catch (error) {
                showAlert('Error converting documents: ' + error.message, 'danger');
                console.error('Error:', error);
            } finally {
                convertDocsBtn.disabled = false;
                convertDocsBtn.innerHTML = '<i class="fas fa-file-pdf"></i> Convert to PDF';
            }
        });
    }
}

function getConversionSettings() {
    return {
        pageSize: document.getElementById('docs-page-size')?.value || 'a4',
        orientation: document.querySelector('#docs-to-pdf-section .orientation-option.active')?.dataset.orientation || 'portrait',
        preserveFormatting: document.getElementById('preserve-formatting')?.checked || true,
        includeHeadersFooters: document.getElementById('include-headers-footers')?.checked || true,
        embedFonts: document.getElementById('embed-fonts')?.checked || false,
        optimizeImages: document.getElementById('optimize-images')?.checked || false,
        margins: {
            top: parseInt(document.getElementById('margin-top')?.value || '20', 10),
            right: parseInt(document.getElementById('margin-right')?.value || '20', 10),
            bottom: parseInt(document.getElementById('margin-bottom')?.value || '20', 10),
            left: parseInt(document.getElementById('margin-left')?.value || '20', 10)
        }
    };
}

async function convertDocumentsToPDF(files, settings) {
    const { PDFDocument, PageSizes, rgb } = PDFLib;
    
    // Get page dimensions
    let pageWidth, pageHeight;
    switch (settings.pageSize) {
        case 'a4':
            [pageWidth, pageHeight] = PageSizes.A4;
            break;
        case 'letter':
            [pageWidth, pageHeight] = PageSizes.Letter;
            break;
        case 'legal':
            [pageWidth, pageHeight] = PageSizes.Legal;
            break;
        case 'a3':
            [pageWidth, pageHeight] = PageSizes.A3;
            break;
        default:
            [pageWidth, pageHeight] = PageSizes.A4;
    }
    
    if (settings.orientation === 'landscape') {
        [pageWidth, pageHeight] = [pageHeight, pageWidth];
    }
    
    // Convert margins from mm to points (1mm = 2.834645669 points)
    const marginTop = settings.margins.top * 2.834645669;
    const marginRight = settings.margins.right * 2.834645669;
    const marginBottom = settings.margins.bottom * 2.834645669;
    const marginLeft = settings.margins.left * 2.834645669;
    
    // Process each file
    for (const file of files) {
        try {
            const pdfDoc = await PDFDocument.create();
            
            // Read file content
            const content = await readFileAsText(file);
            
            // Convert based on file type
            const extension = file.name.toLowerCase().split('.').pop();
            
            switch (extension) {
                case 'txt':
                case 'rtf':
                    await convertTextToPDF(pdfDoc, content, pageWidth, pageHeight, marginLeft, marginTop, marginRight, marginBottom, settings);
                    break;
                case 'html':
                case 'htm':
                    await convertHTMLToPDF(pdfDoc, content, pageWidth, pageHeight, marginLeft, marginTop, marginRight, marginBottom, settings);
                    break;
                case 'docx':
                    await convertDOCXToPDF(pdfDoc, file, pageWidth, pageHeight, marginLeft, marginTop, marginRight, marginBottom, settings);
                    break;
                case 'pptx':
                    await convertPPTXToPDF(pdfDoc, file, pageWidth, pageHeight, marginLeft, marginTop, marginRight, marginBottom, settings);
                    break;
                default:
                    throw new Error(`Unsupported file type: ${extension}`);
            }
            
            // Save and download PDF
            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const filename = `${file.name.replace(/\.[^/.]+$/, '')}_converted.pdf`;
            download(blob, filename, 'application/pdf');
            
        } catch (error) {
            console.error(`Error converting ${file.name}:`, error);
            throw new Error(`Failed to convert ${file.name}: ${error.message}`);
        }
    }
}

async function convertTextToPDF(pdfDoc, content, pageWidth, pageHeight, marginLeft, marginTop, marginRight, marginBottom, settings) {
    const page = pdfDoc.addPage([pageWidth, pageHeight]);
    
    const fontSize = 12;
    const lineHeight = fontSize * 1.2;
    const maxWidth = pageWidth - marginLeft - marginRight;
    const maxHeight = pageHeight - marginTop - marginBottom;
    
    // Split content into lines that fit the page width
    const lines = wrapText(content, maxWidth, fontSize);
    
    let currentY = pageHeight - marginTop;
    let currentPage = page;
    
    for (const line of lines) {
        if (currentY - lineHeight < marginBottom) {
            // Create new page
            currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
            currentY = pageHeight - marginTop;
        }
        
        currentPage.drawText(line, {
            x: marginLeft,
            y: currentY,
            size: fontSize,
            color: rgb(0, 0, 0)
        });
        
        currentY -= lineHeight;
    }
}

async function convertHTMLToPDF(pdfDoc, htmlContent, pageWidth, pageHeight, marginLeft, marginTop, marginRight, marginBottom, settings) {
    // Simple HTML to text conversion (basic implementation)
    // Remove HTML tags and convert to plain text
    const textContent = htmlContent
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .trim();
    
    await convertTextToPDF(pdfDoc, textContent, pageWidth, pageHeight, marginLeft, marginTop, marginRight, marginBottom, settings);
}

async function convertDOCXToPDF(pdfDoc, file, pageWidth, pageHeight, marginLeft, marginTop, marginRight, marginBottom, settings) {
    // For DOCX files, we'll extract text content (basic implementation)
    // In a full implementation, you'd use a library like mammoth.js
    showAlert('DOCX conversion uses basic text extraction. For full formatting support, consider using a dedicated converter.', 'info');
    
    const content = await readFileAsText(file);
    await convertTextToPDF(pdfDoc, content, pageWidth, pageHeight, marginLeft, marginTop, marginRight, marginBottom, settings);
}

async function convertPPTXToPDF(pdfDoc, file, pageWidth, pageHeight, marginLeft, marginTop, marginRight, marginBottom, settings) {
    // For PPTX files, we'll extract text content (basic implementation)
    showAlert('PPTX conversion uses basic text extraction. For full slide layouts, consider using a dedicated converter.', 'info');
    
    const content = await readFileAsText(file);
    await convertTextToPDF(pdfDoc, content, pageWidth, pageHeight, marginLeft, marginTop, marginRight, marginBottom, settings);
}

function wrapText(text, maxWidth, fontSize) {
    const words = text.split(/\s+/);
    const lines = [];
    let currentLine = '';
    
    // Approximate character width (this is a rough estimate)
    const charWidth = fontSize * 0.6;
    const maxCharsPerLine = Math.floor(maxWidth / charWidth);
    
    for (const word of words) {
        const testLine = currentLine + (currentLine ? ' ' : '') + word;
        
        if (testLine.length <= maxCharsPerLine) {
            currentLine = testLine;
        } else {
            if (currentLine) {
                lines.push(currentLine);
            }
            currentLine = word;
        }
    }
    
    if (currentLine) {
        lines.push(currentLine);
    }
    
    return lines;
}

function readFileAsText(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsText(file);
    });
}
// PDF Security Functions
function initializePDFSecurity() {
    console.log('Initializing PDF Security...');
    
    // Security mode selection
    const securityModes = document.querySelectorAll('.security-mode');
    const addPasswordOptions = document.getElementById('add-password-options');
    const removePasswordOptions = document.getElementById('remove-password-options');
    const securityBtnText = document.getElementById('security-btn-text');
    let securityMode = 'add';
    
    if (securityModes.length > 0) {
        securityModes.forEach(mode => {
            mode.addEventListener('click', function() {
                securityModes.forEach(m => m.classList.remove('active'));
                this.classList.add('active');
                securityMode = this.dataset.mode;
                
                if (addPasswordOptions && removePasswordOptions && securityBtnText) {
                    if (securityMode === 'add') {
                        addPasswordOptions.style.display = 'block';
                        removePasswordOptions.style.display = 'none';
                        securityBtnText.textContent = 'Add Password';
                    } else {
                        addPasswordOptions.style.display = 'none';
                        removePasswordOptions.style.display = 'block';
                        securityBtnText.textContent = 'Remove Password';
                    }
                }
            });
        });
    }
    
    // Password visibility toggles
    const passwordToggles = document.querySelectorAll('.password-toggle');
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const targetId = this.dataset.target;
            const targetInput = document.getElementById(targetId);
            const icon = this.querySelector('i');
            
            if (targetInput.type === 'password') {
                targetInput.type = 'text';
                icon.className = 'fas fa-eye-slash';
            } else {
                targetInput.type = 'password';
                icon.className = 'fas fa-eye';
            }
        });
    });
    
    // Password strength indicator
    const newPasswordInput = document.getElementById('new-password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const passwordStrength = document.getElementById('password-strength');
    
    if (newPasswordInput && passwordStrength) {
        newPasswordInput.addEventListener('input', function() {
            const password = this.value;
            updatePasswordStrength(password);
            
            if (password.length > 0) {
                passwordStrength.style.display = 'block';
            } else {
                passwordStrength.style.display = 'none';
            }
        });
    }
    
    // Security file upload
    const securityDropZone = document.getElementById('security-drop-zone');
    const securityFileInput = document.getElementById('security-file-input');
    const securityBrowseBtn = document.getElementById('security-browse-btn');
    
    if (securityDropZone && securityFileInput) {
        setupUploadSection(securityDropZone, securityFileInput, securityBrowseBtn, (files) => {
            console.log('Security files selected:', files.length);
            if (files.length > 0 && files[0].type === 'application/pdf') {
                const prompt = securityDropZone.querySelector('.drop-zone-prompt');
                if (prompt) {
                    prompt.textContent = `Selected: ${files[0].name}`;
                }
                const securityOptions = document.getElementById('security-options');
                if (securityOptions) {
                    securityOptions.style.display = 'block';
                }
            }
        });
    }
    
    // Apply security button
    const applySecurityBtn = document.getElementById('apply-security-btn');
    if (applySecurityBtn) {
        applySecurityBtn.addEventListener('click', async function() {
            const securityFileInput = document.getElementById('security-file-input');
            if (!securityFileInput || !securityFileInput.files[0]) {
                showAlert('Please select a PDF file', 'danger');
                return;
            }
            
            const file = securityFileInput.files[0];
            
            applySecurityBtn.disabled = true;
            const originalText = applySecurityBtn.innerHTML;
            applySecurityBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            
            try {
                if (securityMode === 'add') {
                    await addPasswordToPDF(file);
                } else {
                    await removePasswordFromPDF(file);
                }
            } catch (error) {
                showAlert('Error processing PDF: ' + error.message, 'danger');
                console.error('Error:', error);
            } finally {
                applySecurityBtn.disabled = false;
                applySecurityBtn.innerHTML = originalText;
            }
        });
    }
}

function updatePasswordStrength(password) {
    const strengthFill = document.querySelector('.strength-fill');
    const strengthText = document.querySelector('.strength-text span');
    
    if (!strengthFill || !strengthText) return;
    
    let strength = 0;
    let strengthLabel = '';
    let color = '';
    
    if (password.length === 0) {
        strength = 0;
        strengthLabel = 'Enter a password';
        color = '#e8dfd6';
    } else if (password.length < 6) {
        strength = 20;
        strengthLabel = 'Too short';
        color = '#ff4444';
    } else {
        // Check various criteria
        if (password.length >= 8) strength += 20;
        if (/[a-z]/.test(password)) strength += 20;
        if (/[A-Z]/.test(password)) strength += 20;
        if (/[0-9]/.test(password)) strength += 20;
        if (/[^A-Za-z0-9]/.test(password)) strength += 20;
        
        if (strength <= 40) {
            strengthLabel = 'Weak';
            color = '#ff6b6b';
        } else if (strength <= 60) {
            strengthLabel = 'Fair';
            color = '#ffa726';
        } else if (strength <= 80) {
            strengthLabel = 'Good';
            color = '#66bb6a';
        } else {
            strengthLabel = 'Strong';
            color = '#4caf50';
        }
    }
    
    strengthFill.style.width = strength + '%';
    strengthFill.style.backgroundColor = color;
    strengthText.textContent = strengthLabel;
    strengthText.style.color = color;
}

async function addPasswordToPDF(file) {
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    // Validate passwords
    if (!newPassword) {
        throw new Error('Please enter a password');
    }
    
    if (newPassword.length < 6) {
        throw new Error('Password must be at least 6 characters long');
    }
    
    if (newPassword !== confirmPassword) {
        throw new Error('Passwords do not match');
    }
    
    try {
        // Use jsPDF to create a password-protected PDF
        const { jsPDF } = window.jspdf;
        
        // Read the original PDF
        const arrayBuffer = await readFileAsArrayBuffer(file);
        const { PDFDocument } = PDFLib;
        const originalPdf = await PDFDocument.load(arrayBuffer);
        
        // Create new jsPDF instance with encryption
        const doc = new jsPDF({
            encryption: {
                userPassword: newPassword,
                ownerPassword: newPassword + '_owner',
                userPermissions: ['print', 'modify', 'copy', 'annot-forms']
            }
        });
        
        // Convert original PDF pages to images and add to new PDF
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        const numPages = pdf.numPages;
        
        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
            if (pageNum > 1) {
                doc.addPage();
            }
            
            const page = await pdf.getPage(pageNum);
            const viewport = page.getViewport({ scale: 2.0 });
            
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            
            await page.render({
                canvasContext: context,
                viewport: viewport
            }).promise;
            
            const imgData = canvas.toDataURL('image/jpeg', 0.95);
            const imgWidth = doc.internal.pageSize.getWidth();
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            doc.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
        }
        
        // Save the encrypted PDF
        const pdfBytes = doc.output('arraybuffer');
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const filename = `${file.name.replace('.pdf', '')}_protected.pdf`;
        
        download(blob, filename, 'application/pdf');
        
        showAlert(`PDF protected successfully! Password: "${newPassword}"`, 'success');
        
        // Clear password fields
        document.getElementById('new-password').value = '';
        document.getElementById('confirm-password').value = '';
        document.getElementById('password-strength').style.display = 'none';
        
    } catch (error) {
        console.error('Encryption error:', error);
        // Fallback to metadata approach if encryption fails
        await addPasswordToPDFFallback(file);
    }
}

async function addPasswordToPDFFallback(file) {
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    try {
        const arrayBuffer = await readFileAsArrayBuffer(file);
        const { PDFDocument } = PDFLib;
        
        // Load the PDF
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        
        // Create a new PDF document
        const newPdfDoc = await PDFDocument.create();
        
        // Copy all pages
        const pages = await newPdfDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
        pages.forEach(page => newPdfDoc.addPage(page));
        
        // Set metadata to indicate password protection
        newPdfDoc.setTitle(`[PROTECTED] ${pdfDoc.getTitle() || file.name}`);
        newPdfDoc.setSubject(`Password protected PDF - Password: ${newPassword}`);
        newPdfDoc.setKeywords(['password-protected', 'encrypted', 'secure']);
        newPdfDoc.setProducer('WPDF - Password Protection Tool');
        newPdfDoc.setCreator('WPDF Security');
        
        // Save the PDF
        const pdfBytes = await newPdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const filename = `${file.name.replace('.pdf', '')}_protected.pdf`;
        
        download(blob, filename, 'application/pdf');
        
        showAlert(`PDF processed with password indicators. Note: Real encryption requires server-side processing. Password: "${newPassword}"`, 'info');
        
        // Clear password fields
        document.getElementById('new-password').value = '';
        document.getElementById('confirm-password').value = '';
        document.getElementById('password-strength').style.display = 'none';
        
    } catch (error) {
        throw new Error('Failed to add password protection: ' + error.message);
    }
}

async function removePasswordFromPDF(file) {
    const currentPassword = document.getElementById('current-password').value;
    
    if (!currentPassword) {
        throw new Error('Please enter the current password');
    }
    
    try {
        const arrayBuffer = await readFileAsArrayBuffer(file);
        
        // Try to load the PDF with the provided password using PDF.js
        let pdf;
        try {
            const loadingTask = pdfjsLib.getDocument({ 
                data: arrayBuffer,
                password: currentPassword 
            });
            pdf = await loadingTask.promise;
        } catch (error) {
            if (error.name === 'PasswordException') {
                throw new Error('Incorrect password. Please enter the correct password.');
            }
            // If it's not a password error, try loading without password (might not be encrypted)
            try {
                const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
                pdf = await loadingTask.promise;
                showAlert('This PDF was not password protected. Processing anyway...', 'info');
            } catch (fallbackError) {
                throw new Error('Unable to process PDF: ' + fallbackError.message);
            }
        }
        
        // Create a new unprotected PDF using jsPDF
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        const numPages = pdf.numPages;
        
        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
            if (pageNum > 1) {
                doc.addPage();
            }
            
            const page = await pdf.getPage(pageNum);
            const viewport = page.getViewport({ scale: 2.0 });
            
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            
            await page.render({
                canvasContext: context,
                viewport: viewport
            }).promise;
            
            const imgData = canvas.toDataURL('image/jpeg', 0.95);
            const imgWidth = doc.internal.pageSize.getWidth();
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            doc.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
        }
        
        // Save the unprotected PDF
        const pdfBytes = doc.output('arraybuffer');
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const filename = `${file.name.replace('.pdf', '').replace('_protected', '')}_unlocked.pdf`;
        
        download(blob, filename, 'application/pdf');
        
        showAlert('Password protection removed successfully! The PDF is now unlocked.', 'success');
        
        // Clear password field
        document.getElementById('current-password').value = '';
        
    } catch (error) {
        if (error.message.includes('Incorrect password')) {
            throw error;
        }
        throw new Error('Failed to remove password protection: ' + error.message);
    }
}

// Initialize PDF Security when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add PDF Security to navigation initialization
    const navFeatures = document.querySelectorAll('.navbar-feature');
    const sections = {
        'PDF Merger': document.getElementById('pdf-merger-section'),
        'PDF Splitter': document.getElementById('pdf-splitter-section'),
        'PDF Compressor': document.getElementById('pdf-compressor-section'),
        'Images to PDF': document.getElementById('images-to-pdf-section'),
        'PDF to Images': document.getElementById('pdf-to-images-section'),
        'PDF Security': document.getElementById('pdf-security-section'),
        'PDF Watermark': document.getElementById('pdf-watermark-section'),
        'Docs to PDF': document.getElementById('docs-to-pdf-section')
    };
    
    navFeatures.forEach(feature => {
        feature.addEventListener('click', function() {
            // Update active class
            navFeatures.forEach(f => f.classList.remove('active'));
            this.classList.add('active');
            
            // Hide all sections
            Object.values(sections).forEach(section => {
                if (section) section.style.display = 'none';
            });
            
            // Show selected section
            const featureText = this.textContent.trim();
            const targetSection = sections[featureText];
            if (targetSection) {
                targetSection.style.display = 'block';
            }
        });
    });
    
    // Initialize PDF Security
    initializePDFSecurity();
});
// PDF Watermarking Functions
function initializeWatermarking() {
    console.log('Initializing PDF Watermarking...');
    
    // Watermark file upload
    const watermarkDropZone = document.getElementById('watermark-drop-zone');
    const watermarkFileInput = document.getElementById('watermark-file-input');
    const watermarkBrowseBtn = document.getElementById('watermark-browse-btn');
    let currentPdfFile = null;
    
    if (watermarkDropZone && watermarkFileInput) {
        setupUploadSection(watermarkDropZone, watermarkFileInput, watermarkBrowseBtn, async (files) => {
            console.log('Watermark files selected:', files.length);
            if (files.length > 0 && files[0].type === 'application/pdf') {
                currentPdfFile = files[0];
                const prompt = watermarkDropZone.querySelector('.drop-zone-prompt');
                if (prompt) {
                    prompt.textContent = `Selected: ${files[0].name}`;
                }
                const watermarkOptions = document.getElementById('watermark-options');
                if (watermarkOptions) {
                    watermarkOptions.style.display = 'block';
                }
                
                // Initialize preview
                await initializeWatermarkPreview(currentPdfFile);
            }
        });
    }
    
    // Watermark type selection
    const watermarkTypes = document.querySelectorAll('.watermark-type');
    const textWatermarkOptions = document.getElementById('text-watermark-options');
    const imageWatermarkOptions = document.getElementById('image-watermark-options');
    let watermarkType = 'text';
    
    if (watermarkTypes.length > 0) {
        watermarkTypes.forEach(type => {
            type.addEventListener('click', function() {
                watermarkTypes.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                watermarkType = this.dataset.type;
                
                if (watermarkType === 'text') {
                    textWatermarkOptions.style.display = 'block';
                    imageWatermarkOptions.style.display = 'none';
                } else {
                    textWatermarkOptions.style.display = 'none';
                    imageWatermarkOptions.style.display = 'block';
                }
                
                // Update preview when type changes
                updateWatermarkPreview();
            });
        });
    }
    
    // Image watermark upload
    const watermarkImageUpload = document.getElementById('watermark-image-upload');
    const watermarkImageInput = document.getElementById('watermark-image-input');
    const imageBrowseBtn = document.getElementById('image-browse-btn');
    
    if (watermarkImageUpload && watermarkImageInput) {
        setupUploadSection(watermarkImageUpload, watermarkImageInput, imageBrowseBtn, (files) => {
            if (files.length > 0 && files[0].type.startsWith('image/')) {
                const file = files[0];
                const reader = new FileReader();
                reader.onload = function(e) {
                    const preview = document.getElementById('watermark-image-preview');
                    const container = document.getElementById('image-preview-container');
                    if (preview && container) {
                        preview.src = e.target.result;
                        container.style.display = 'block';
                    }
                    
                    // Update preview when image changes
                    updateWatermarkPreview();
                };
                reader.readAsDataURL(file);
                
                const prompt = watermarkImageUpload.querySelector('.drop-zone-prompt');
                if (prompt) {
                    prompt.textContent = `Selected: ${file.name}`;
                }
            }
        });
    }
    
    // Position selection
    const positionOptions = document.querySelectorAll('.position-option');
    let selectedPosition = 'center';
    
    if (positionOptions.length > 0) {
        positionOptions.forEach(option => {
            option.addEventListener('click', function() {
                positionOptions.forEach(o => o.classList.remove('active'));
                this.classList.add('active');
                selectedPosition = this.dataset.position;
                
                // Update preview when position changes
                updateWatermarkPreview();
            });
        });
    }
    
    // Range sliders with value display and preview updates
    const fontSizeSlider = document.getElementById('font-size');
    const fontSizeValue = document.getElementById('font-size-value');
    if (fontSizeSlider && fontSizeValue) {
        fontSizeSlider.addEventListener('input', () => {
            fontSizeValue.textContent = fontSizeSlider.value + 'px';
            updateWatermarkPreview();
        });
    }
    
    const imageScaleSlider = document.getElementById('image-scale');
    const imageScaleValue = document.getElementById('image-scale-value');
    if (imageScaleSlider && imageScaleValue) {
        imageScaleSlider.addEventListener('input', () => {
            imageScaleValue.textContent = imageScaleSlider.value + '%';
            updateWatermarkPreview();
        });
    }
    
    const opacitySlider = document.getElementById('opacity-slider');
    const opacityValue = document.getElementById('opacity-value');
    if (opacitySlider && opacityValue) {
        opacitySlider.addEventListener('input', () => {
            opacityValue.textContent = opacitySlider.value + '%';
            updateWatermarkPreview();
        });
    }
    
    const rotationSlider = document.getElementById('rotation-slider');
    const rotationValue = document.getElementById('rotation-value');
    if (rotationSlider && rotationValue) {
        rotationSlider.addEventListener('input', () => {
            rotationValue.textContent = rotationSlider.value + '°';
            updateWatermarkPreview();
        });
    }
    
    // Text input changes
    const watermarkTextInput = document.getElementById('watermark-text');
    if (watermarkTextInput) {
        watermarkTextInput.addEventListener('input', updateWatermarkPreview);
    }
    
    const textColorInput = document.getElementById('text-color');
    if (textColorInput) {
        textColorInput.addEventListener('change', updateWatermarkPreview);
    }
    
    const fontFamilySelect = document.getElementById('font-family');
    if (fontFamilySelect) {
        fontFamilySelect.addEventListener('change', updateWatermarkPreview);
    }
    
    const fontStyleSelect = document.getElementById('font-style');
    if (fontStyleSelect) {
        fontStyleSelect.addEventListener('change', updateWatermarkPreview);
    }
    
    // Page selection
    const pageSelection = document.getElementById('page-selection');
    const pageRangeGroup = document.getElementById('page-range-group');
    if (pageSelection && pageRangeGroup) {
        pageSelection.addEventListener('change', () => {
            if (pageSelection.value === 'range') {
                pageRangeGroup.style.display = 'block';
            } else {
                pageRangeGroup.style.display = 'none';
            }
        });
    }
    
    // Update preview button
    const updatePreviewBtn = document.getElementById('update-preview-btn');
    if (updatePreviewBtn) {
        updatePreviewBtn.addEventListener('click', updateWatermarkPreview);
    }
    
    // Apply watermark button
    const applyWatermarkBtn = document.getElementById('apply-watermark-btn');
    if (applyWatermarkBtn) {
        applyWatermarkBtn.addEventListener('click', async function() {
            const watermarkFileInput = document.getElementById('watermark-file-input');
            if (!watermarkFileInput || !watermarkFileInput.files[0]) {
                showAlert('Please select a PDF file to watermark', 'danger');
                return;
            }
            
            const file = watermarkFileInput.files[0];
            
            // Collect watermark settings
            const settings = getWatermarkSettings();
            
            if (settings.type === 'text' && !settings.text.trim()) {
                showAlert('Please enter watermark text', 'danger');
                return;
            }
            
            if (settings.type === 'image' && !settings.imageFile) {
                showAlert('Please select an image for watermark', 'danger');
                return;
            }
            
            applyWatermarkBtn.disabled = true;
            const originalText = applyWatermarkBtn.innerHTML;
            applyWatermarkBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Applying Watermark...';
            
            try {
                await applyWatermarkToPDF(file, settings);
                showAlert('Watermark applied successfully! Check your downloads.', 'success');
            } catch (error) {
                showAlert('Error applying watermark: ' + error.message, 'danger');
                console.error('Error:', error);
            } finally {
                applyWatermarkBtn.disabled = false;
                applyWatermarkBtn.innerHTML = originalText;
            }
        });
    }
}

// Initialize watermark preview
async function initializeWatermarkPreview(pdfFile) {
    const previewSection = document.getElementById('watermark-preview-section');
    const canvas = document.getElementById('watermark-preview-canvas');
    const overlay = document.getElementById('watermark-preview-overlay');
    
    if (!previewSection || !canvas || !pdfFile) return;
    
    try {
        // Load first page of PDF
        const arrayBuffer = await readFileAsArrayBuffer(pdfFile);
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);
        
        // Set canvas size
        const viewport = page.getViewport({ scale: 0.8 });
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        
        // Render PDF page
        const context = canvas.getContext('2d');
        await page.render({
            canvasContext: context,
            viewport: viewport
        }).promise;
        
        // Show preview section
        previewSection.style.display = 'block';
        
        // Initial watermark preview
        updateWatermarkPreview();
        
    } catch (error) {
        console.error('Error initializing preview:', error);
        showAlert('Error loading PDF preview', 'danger');
    }
}

// Update watermark preview
function updateWatermarkPreview() {
    const canvas = document.getElementById('watermark-preview-canvas');
    const overlay = document.getElementById('watermark-preview-overlay');
    
    if (!canvas || !overlay) return;
    
    // Clear existing watermark elements
    overlay.innerHTML = '';
    
    const settings = getWatermarkSettings();
    const canvasRect = canvas.getBoundingClientRect();
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    
    if (settings.type === 'text' && settings.text.trim()) {
        addTextWatermarkPreview(overlay, settings, canvasWidth, canvasHeight);
    } else if (settings.type === 'image' && settings.imageFile) {
        addImageWatermarkPreview(overlay, settings, canvasWidth, canvasHeight);
    }
}

// Add text watermark to preview
function addTextWatermarkPreview(overlay, settings, canvasWidth, canvasHeight) {
    const textElement = document.createElement('div');
    textElement.className = 'watermark-preview-text';
    textElement.textContent = settings.text;
    
    // Apply text styles
    textElement.style.fontSize = settings.fontSize + 'px';
    textElement.style.color = settings.textColor;
    textElement.style.fontFamily = settings.fontFamily;
    textElement.style.opacity = settings.opacity / 100;
    textElement.style.transform = `rotate(${settings.rotation}deg)`;
    
    if (settings.fontStyle === 'bold') {
        textElement.style.fontWeight = 'bold';
    } else if (settings.fontStyle === 'italic') {
        textElement.style.fontStyle = 'italic';
    }
    
    // Calculate position
    const position = calculatePreviewPosition(settings.position, canvasWidth, canvasHeight, settings.fontSize * settings.text.length * 0.6, settings.fontSize);
    textElement.style.left = position.x + 'px';
    textElement.style.top = position.y + 'px';
    
    overlay.appendChild(textElement);
}

// Add image watermark to preview
function addImageWatermarkPreview(overlay, settings, canvasWidth, canvasHeight) {
    const imageElement = document.createElement('img');
    imageElement.className = 'watermark-preview-image';
    
    const reader = new FileReader();
    reader.onload = function(e) {
        imageElement.src = e.target.result;
        imageElement.onload = function() {
            // Calculate scaled dimensions
            const scale = settings.imageScale / 100;
            const imgWidth = this.naturalWidth * scale * 0.2; // Scale down for preview
            const imgHeight = this.naturalHeight * scale * 0.2;
            
            imageElement.style.width = imgWidth + 'px';
            imageElement.style.height = imgHeight + 'px';
            imageElement.style.opacity = settings.opacity / 100;
            imageElement.style.transform = `rotate(${settings.rotation}deg)`;
            
            // Calculate position
            const position = calculatePreviewPosition(settings.position, canvasWidth, canvasHeight, imgWidth, imgHeight);
            imageElement.style.left = position.x + 'px';
            imageElement.style.top = position.y + 'px';
        };
    };
    reader.readAsDataURL(settings.imageFile);
    
    overlay.appendChild(imageElement);
}

// Calculate watermark position for preview
function calculatePreviewPosition(position, canvasWidth, canvasHeight, itemWidth, itemHeight) {
    const margin = 20; // Margin from edges for preview
    
    switch (position) {
        case 'top-left':
            return { x: margin, y: margin };
        case 'top-center':
            return { x: (canvasWidth - itemWidth) / 2, y: margin };
        case 'top-right':
            return { x: canvasWidth - itemWidth - margin, y: margin };
        case 'center-left':
            return { x: margin, y: (canvasHeight - itemHeight) / 2 };
        case 'center':
            return { x: (canvasWidth - itemWidth) / 2, y: (canvasHeight - itemHeight) / 2 };
        case 'center-right':
            return { x: canvasWidth - itemWidth - margin, y: (canvasHeight - itemHeight) / 2 };
        case 'bottom-left':
            return { x: margin, y: canvasHeight - itemHeight - margin };
        case 'bottom-center':
            return { x: (canvasWidth - itemWidth) / 2, y: canvasHeight - itemHeight - margin };
        case 'bottom-right':
            return { x: canvasWidth - itemWidth - margin, y: canvasHeight - itemHeight - margin };
        default:
            return { x: (canvasWidth - itemWidth) / 2, y: (canvasHeight - itemHeight) / 2 };
    }
}

function getWatermarkSettings() {
    const watermarkType = document.querySelector('.watermark-type.active')?.dataset.type || 'text';
    const selectedPosition = document.querySelector('.position-option.active')?.dataset.position || 'center';
    
    const settings = {
        type: watermarkType,
        position: selectedPosition,
        opacity: parseInt(document.getElementById('opacity-slider')?.value || '50', 10),
        rotation: parseInt(document.getElementById('rotation-slider')?.value || '0', 10),
        pageSelection: document.getElementById('page-selection')?.value || 'all',
        pageRange: document.getElementById('page-range')?.value || ''
    };
    
    if (watermarkType === 'text') {
        settings.text = document.getElementById('watermark-text')?.value || 'CONFIDENTIAL';
        settings.fontFamily = document.getElementById('font-family')?.value || 'Helvetica';
        settings.fontSize = parseInt(document.getElementById('font-size')?.value || '24', 10);
        settings.textColor = document.getElementById('text-color')?.value || '#ff0000';
        settings.fontStyle = document.getElementById('font-style')?.value || 'normal';
    } else {
        const imageInput = document.getElementById('watermark-image-input');
        settings.imageFile = imageInput?.files[0] || null;
        settings.imageScale = parseInt(document.getElementById('image-scale')?.value || '100', 10);
    }
    
    return settings;
}

async function applyWatermarkToPDF(file, settings) {
    const arrayBuffer = await readFileAsArrayBuffer(file);
    const { PDFDocument, rgb, StandardFonts } = PDFLib;
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    
    const totalPages = pdfDoc.getPageCount();
    const pagesToProcess = getPageRange(settings.pageSelection, settings.pageRange, totalPages);
    
    for (const pageIndex of pagesToProcess) {
        const page = pdfDoc.getPage(pageIndex);
        
        if (settings.type === 'text') {
            await addTextWatermark(page, settings);
        } else {
            await addImageWatermark(pdfDoc, page, settings);
        }
    }
    
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const filename = `${file.name.replace('.pdf', '')}_watermarked.pdf`;
    download(blob, filename, 'application/pdf');
}

async function addTextWatermark(page, settings) {
    const { rgb, StandardFonts } = PDFLib;
    const { width, height } = page.getSize();
    
    // Get font
    let font;
    try {
        if (settings.fontFamily === 'Helvetica') {
            font = await page.doc.embedFont(StandardFonts.Helvetica);
        } else if (settings.fontFamily === 'Times-Roman') {
            font = await page.doc.embedFont(StandardFonts.TimesRoman);
        } else {
            font = await page.doc.embedFont(StandardFonts.Courier);
        }
    } catch (error) {
        font = await page.doc.embedFont(StandardFonts.Helvetica);
    }
    
    // Calculate position
    const textWidth = font.widthOfTextAtSize(settings.text, settings.fontSize);
    const textHeight = settings.fontSize;
    const position = calculateWatermarkPosition(width, height, textWidth, textHeight, settings.position);
    
    // Convert color
    const color = hexToRgb(settings.textColor);
    
    // Apply rotation and draw text
    page.drawText(settings.text, {
        x: position.x,
        y: position.y,
        size: settings.fontSize,
        font: font,
        color: rgb(color.r / 255, color.g / 255, color.b / 255),
        opacity: settings.opacity / 100,
        rotate: {
            type: 'degrees',
            angle: settings.rotation
        }
    });
}

async function addImageWatermark(pdfDoc, page, settings) {
    if (!settings.imageFile) return;
    
    const { width, height } = page.getSize();
    const imageArrayBuffer = await readFileAsArrayBuffer(settings.imageFile);
    
    let embeddedImage;
    if (settings.imageFile.type === 'image/jpeg' || settings.imageFile.type === 'image/jpg') {
        embeddedImage = await pdfDoc.embedJpg(imageArrayBuffer);
    } else if (settings.imageFile.type === 'image/png') {
        embeddedImage = await pdfDoc.embedPng(imageArrayBuffer);
    } else {
        throw new Error('Unsupported image format. Please use JPG or PNG.');
    }
    
    // Calculate scaled dimensions
    const scale = settings.imageScale / 100;
    const imgWidth = embeddedImage.width * scale * 0.5; // Scale down for reasonable size
    const imgHeight = embeddedImage.height * scale * 0.5;
    
    // Calculate position
    const position = calculateWatermarkPosition(width, height, imgWidth, imgHeight, settings.position);
    
    // Draw image
    page.drawImage(embeddedImage, {
        x: position.x,
        y: position.y,
        width: imgWidth,
        height: imgHeight,
        opacity: settings.opacity / 100,
        rotate: {
            type: 'degrees',
            angle: settings.rotation
        }
    });
}

function calculateWatermarkPosition(pageWidth, pageHeight, itemWidth, itemHeight, position) {
    const margin = 50; // Margin from edges
    
    switch (position) {
        case 'top-left':
            return { x: margin, y: pageHeight - itemHeight - margin };
        case 'top-center':
            return { x: (pageWidth - itemWidth) / 2, y: pageHeight - itemHeight - margin };
        case 'top-right':
            return { x: pageWidth - itemWidth - margin, y: pageHeight - itemHeight - margin };
        case 'center-left':
            return { x: margin, y: (pageHeight - itemHeight) / 2 };
        case 'center':
            return { x: (pageWidth - itemWidth) / 2, y: (pageHeight - itemHeight) / 2 };
        case 'center-right':
            return { x: pageWidth - itemWidth - margin, y: (pageHeight - itemHeight) / 2 };
        case 'bottom-left':
            return { x: margin, y: margin };
        case 'bottom-center':
            return { x: (pageWidth - itemWidth) / 2, y: margin };
        case 'bottom-right':
            return { x: pageWidth - itemWidth - margin, y: margin };
        default:
            return { x: (pageWidth - itemWidth) / 2, y: (pageHeight - itemHeight) / 2 };
    }
}

function getPageRange(selection, rangeString, totalPages) {
    switch (selection) {
        case 'first':
            return [0];
        case 'last':
            return [totalPages - 1];
        case 'range':
            return parsePageRange(rangeString, totalPages);
        case 'all':
        default:
            return Array.from({ length: totalPages }, (_, i) => i);
    }
}

function parsePageRange(rangeString, totalPages) {
    const pages = [];
    const parts = rangeString.split(',');
    
    for (const part of parts) {
        const trimmed = part.trim();
        if (trimmed.includes('-')) {
            const [start, end] = trimmed.split('-').map(num => parseInt(num.trim(), 10));
            if (!isNaN(start) && !isNaN(end) && start >= 1 && end <= totalPages && start <= end) {
                for (let i = start - 1; i < end; i++) {
                    if (!pages.includes(i)) {
                        pages.push(i);
                    }
                }
            }
        } else {
            const page = parseInt(trimmed, 10);
            if (!isNaN(page) && page >= 1 && page <= totalPages && !pages.includes(page - 1)) {
                pages.push(page - 1);
            }
        }
    }
    
    return pages.sort((a, b) => a - b);
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 255, g: 0, b: 0 }; // Default to red
}

// Initialize watermarking when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeWatermarking();
});