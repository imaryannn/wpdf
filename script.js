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
        'PDF to Images': document.getElementById('pdf-to-images-section')
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