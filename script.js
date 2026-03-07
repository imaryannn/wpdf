// Theme Switcher
function setupThemeSwitcher() {
    const themeToggle = document.getElementById('theme-checkbox');
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    // Set initial theme based on saved preference
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.checked = true;
    }
    
    // Add event listener for theme toggle
    themeToggle.addEventListener('change', function() {
        if (this.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    });
}

// Main initialization function
function initializeApp() {
    setupThemeSwitcher();
    initializeNavigation();
    initializePDFMerger();
    initializePDFSplitter();
    initializePDFCompressor();
    initializeImagesToPDF();
    initializePDFToImages();
}

// Call the initialization function when the DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);

// Navigation functionality
function initializeNavigation() {
    // DOM Elements - Navigation
    const navFeatures = document.querySelectorAll('.navbar-feature');
    
    // DOM Elements - Sections
    const pdfMergerSection = document.getElementById('pdf-merger-section');
    const pdfSplitterSection = document.getElementById('pdf-splitter-section');
    const pdfCompressorSection = document.getElementById('pdf-compressor-section');
    const imagesToPdfSection = document.getElementById('images-to-pdf-section');
    const pdfToImagesSection = document.getElementById('pdf-to-images-section');
    const previewSection = document.getElementById('preview-section');
    const downloadSection = document.getElementById('download-section');
    
    // DOM Elements - PDF Merger
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const fileList = document.getElementById('file-list');
    const submitBtn = document.getElementById('submit-btn');
    const backToUploadBtn = document.getElementById('back-to-upload-btn');
    const mergeBtn = document.getElementById('merge-btn');
    const startOverBtn = document.getElementById('start-over-btn');
    const downloadBtn = document.getElementById('download-btn');
    const alertContainer = document.getElementById('alert-container');

    // Store uploaded files
    let uploadedFiles = [];
    
    // Navigation between features
    navFeatures.forEach(feature => {
        feature.addEventListener('click', () => {
            // Update active class
            navFeatures.forEach(f => f.classList.remove('active'));
            feature.classList.add('active');
            
            // Hide all sections
            hideAllSections();
            
            // Show the appropriate section
            const featureText = feature.textContent.trim();
            switch(featureText) {
                case 'PDF Merger':
                    pdfMergerSection.style.display = 'block';
                    break;
                case 'PDF Splitter':
                    pdfSplitterSection.style.display = 'block';
                    break;
                case 'PDF Compressor':
                    pdfCompressorSection.style.display = 'block';
                    break;
                case 'Images to PDF':
                    imagesToPdfSection.style.display = 'block';
                    break;
                case 'PDF to Images':
                    pdfToImagesSection.style.display = 'block';
                    break;
            }
        });
    });
    
    function hideAllSections() {
        pdfMergerSection.style.display = 'none';
        pdfSplitterSection.style.display = 'none';
        pdfCompressorSection.style.display = 'none';
        imagesToPdfSection.style.display = 'none';
        pdfToImagesSection.style.display = 'none';
        previewSection.style.display = 'none';
        downloadSection.style.display = 'none';
    }

    // Section management for PDF merger workflow
    function showMergerSection(sectionId) {
        pdfMergerSection.style.display = sectionId === 'pdf-merger-section' ? 'block' : 'none';
        previewSection.style.display = sectionId === 'preview-section' ? 'block' : 'none';
        downloadSection.style.display = sectionId === 'download-section' ? 'block' : 'none';
    }

    // Alert system
    function showAlert(message, type = 'danger') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.textContent = message;
        alertContainer.appendChild(alertDiv);
        
        // Auto dismiss after 5 seconds
        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
    }

    // File Upload with drag and drop functionality
    if (dropZone) {
        // Prevent default drag behaviors
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, preventDefaults, false);
            document.body.addEventListener(eventName, preventDefaults, false);
        });
        
        // Highlight drop zone when item is dragged over it
        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, highlight, false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, unhighlight, false);
        });
        
        // Handle dropped files
        dropZone.addEventListener('drop', handleDrop, false);
        
        // Handle click to select files
        dropZone.addEventListener('click', () => {
            fileInput.click();
        });
        
        fileInput.addEventListener('change', handleFiles);
    }

    // Submit button - move to preview section
    if (submitBtn) {
        submitBtn.addEventListener('click', function() {
            populateFileList();
            showMergerSection('preview-section');
        });
    }

    // Back to upload button
    if (backToUploadBtn) {
        backToUploadBtn.addEventListener('click', function() {
            showMergerSection('pdf-merger-section');
        });
    }

    // Merge PDFs button
    if (mergeBtn) {
        mergeBtn.addEventListener('click', async function() {
            if (uploadedFiles.length === 0) {
                showAlert('No files to merge');
                return;
            }
            
            mergeBtn.disabled = true;
            mergeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Merging Files...';
            
            try {
                const mergedPdfBytes = await mergePDFs();
                
                // Create a blob from the PDF bytes
                const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
                
                // Create a URL for the blob
                const url = URL.createObjectURL(blob);
                
                // Set the download link href to the blob URL
                downloadBtn.href = url;
                
                showMergerSection('download-section');
            } catch (error) {
                showAlert('Error merging PDFs: ' + error.message);
                console.error('Error:', error);
            } finally {
                mergeBtn.disabled = false;
                mergeBtn.innerHTML = '<i class="fas fa-object-group"></i> Merge Files';
            }
        });
    }

    // Start over button
    if (startOverBtn) {
        startOverBtn.addEventListener('click', function() {
            resetApp();
            showMergerSection('pdf-merger-section');
        });
    }

    // Helper functions
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function highlight() {
        dropZone.classList.add('drop-zone-active');
    }

    function unhighlight() {
        dropZone.classList.remove('drop-zone-active');
    }

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        
        if (fileInput) {
            handleFiles({ target: { files: files } });
        }
    }

    function handleFiles(e) {
        const files = e ? e.target.files : fileInput.files;
        
        if (files.length > 0) {
            // Store the uploaded files
            uploadedFiles = Array.from(files).filter(file => file.type === 'application/pdf');
            
            if (uploadedFiles.length === 0) {
                showAlert('No valid PDF files selected');
                return;
            }
            
            // Visual feedback that files are selected
            const fileCount = uploadedFiles.length;
            let fileNames = '';
            
            for (let i = 0; i < Math.min(fileCount, 3); i++) {
                fileNames += uploadedFiles[i].name + (i < Math.min(fileCount, 3) - 1 ? ', ' : '');
            }
            
            if (fileCount > 3) {
                fileNames += ` and ${fileCount - 3} more`;
            }
            
            const prompt = dropZone.querySelector('.drop-zone-prompt');
            if (prompt) {
                prompt.textContent = `Selected ${fileCount} file${fileCount !== 1 ? 's' : ''}: ${fileNames}`;
            }
            
            // Enable submit button
            submitBtn.disabled = false;
        }
    }

    function populateFileList() {
        if (!fileList) return;
        
        fileList.innerHTML = '';
        
        uploadedFiles.forEach((file, index) => {
            const li = document.createElement('li');
            li.className = 'file-item';
            li.dataset.index = index;
            
            li.innerHTML = `
                <div class="file-name">
                    <i class="fas fa-file-pdf"></i>
                    ${file.name}
                </div>
                <div class="file-action">
                    <span class="drag-handle"><i class="fas fa-grip-lines"></i></span>
                </div>
            `;
            
            fileList.appendChild(li);
        });
        
        // Initialize sorting
        initSortable();
    }

    function initSortable() {
        if (typeof Sortable !== 'undefined' && fileList) {
            Sortable.create(fileList, {
                animation: 150,
                handle: '.drag-handle'
            });
        }
    }

    async function mergePDFs() {
        // Get the sorted file order
        const items = fileList.querySelectorAll('li');
        const sortedFiles = Array.from(items).map(item => {
            const index = parseInt(item.dataset.index);
            return uploadedFiles[index];
        });
        
        // Create a new PDF document
        const { PDFDocument } = PDFLib;
        const mergedPdf = await PDFDocument.create();
        
        // Load and copy pages from each PDF
        for (const file of sortedFiles) {
            try {
                // Read the file
                const arrayBuffer = await readFileAsArrayBuffer(file);
                
                // Load the PDF document
                const pdfDoc = await PDFDocument.load(arrayBuffer);
                
                // Copy pages from the source document to the merged document
                const pages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
                pages.forEach(page => {
                    mergedPdf.addPage(page);
                });
            } catch (error) {
                console.error(`Error processing ${file.name}:`, error);
                throw new Error(`Failed to process ${file.name}`);
            }
        }
        
        // Save the merged PDF
        const mergedPdfBytes = await mergedPdf.save();
        return mergedPdfBytes;
    }

    function readFileAsArrayBuffer(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    }

    function resetApp() {
        // Clear file input
        fileInput.value = '';
        
        // Reset drop zone prompt
        const prompt = dropZone.querySelector('.drop-zone-prompt');
        if (prompt) {
            prompt.textContent = 'Drag & drop PDF files here or click to browse';
        }
        
        // Clear uploaded files array
        uploadedFiles = [];
        
        // Disable submit button
        submitBtn.disabled = true;
        
        // Reset the download URL to prevent using stale data
        if (downloadBtn.href !== '#') {
            URL.revokeObjectURL(downloadBtn.href);
            downloadBtn.href = '#';
        }
    }

    // Initialize the application
    showMergerSection('pdf-merger-section');

    // Initialize PDF Splitter
    const splitDropZone = document.getElementById('split-drop-zone');
    const splitFileInput = document.getElementById('split-file-input');
    const splitOptions = document.getElementById('split-options');
    const splitMethods = document.querySelectorAll('.split-method');
    const splitBtn = document.getElementById('split-btn');
    let splitPdfFile = null;
    let splitMethod = 'range';
    
    if (splitDropZone && splitFileInput) {
        // Prevent default drag behaviors
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            splitDropZone.addEventListener(eventName, preventDefaults, false);
        });
        
        // Highlight drop zone when item is dragged over it
        ['dragenter', 'dragover'].forEach(eventName => {
            splitDropZone.addEventListener(eventName, () => {
                splitDropZone.classList.add('drop-zone-active');
            }, false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            splitDropZone.addEventListener(eventName, () => {
                splitDropZone.classList.remove('drop-zone-active');
            }, false);
        });
        
        // Handle dropped files
        splitDropZone.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;
            
            if (files.length > 0 && files[0].type === 'application/pdf') {
                // Store the file
                splitPdfFile = files[0];
                
                // Show split options
                splitOptions.style.display = 'block';
                splitDropZone.querySelector('.drop-zone-prompt').textContent = 
                    `Selected: ${files[0].name}`;
            } else {
                showAlert('Please select a valid PDF file', 'danger');
            }
        }, false);
        
        // Handle click to select files
        splitDropZone.addEventListener('click', () => {
            splitFileInput.click();
        });
        
        splitFileInput.addEventListener('change', (e) => {
            const files = e.target.files;
            
            if (files.length > 0 && files[0].type === 'application/pdf') {
                // Store the file
                splitPdfFile = files[0];
                
                // Show split options
                splitOptions.style.display = 'block';
                splitDropZone.querySelector('.drop-zone-prompt').textContent = 
                    `Selected: ${files[0].name}`;
            } else {
                showAlert('Please select a valid PDF file', 'danger');
            }
        });
    }
    
    // Split method selection
    if (splitMethods) {
        splitMethods.forEach(method => {
            method.addEventListener('click', () => {
                // Update active class
                splitMethods.forEach(m => m.classList.remove('active'));
                method.classList.add('active');
                
                // Store the selected method
                splitMethod = method.dataset.method;
                
                // Show/hide range options based on selected method
                const rangeOptions = document.getElementById('range-options');
                if (splitMethod === 'range') {
                    rangeOptions.style.display = 'block';
                } else {
                    rangeOptions.style.display = 'none';
                }
            });
        });
    }
    
    // Handle Split PDF button click
    if (splitBtn) {
        splitBtn.addEventListener('click', async () => {
            if (!splitPdfFile) {
                showAlert('Please select a PDF file to split', 'danger');
                return;
            }
            
            splitBtn.disabled = true;
            splitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            
            try {
                if (splitMethod === 'range') {
                    // Get page ranges from input
                    const rangeInput = document.getElementById('page-ranges').value.trim();
                    if (!rangeInput) {
                        showAlert('Please enter page ranges', 'danger');
                        return;
                    }
                    
                    await splitPDFByRange(splitPdfFile, rangeInput);
                } else {
                    // Extract each page
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
    
    // Function to split PDF by page ranges
    async function splitPDFByRange(file, rangeInput) {
        // Parse range input (e.g., "1-3,5,7-10")
        const ranges = [];
        const parts = rangeInput.split(',');
        
        for (const part of parts) {
            if (part.includes('-')) {
                const [start, end] = part.split('-').map(num => parseInt(num.trim(), 10));
                if (isNaN(start) || isNaN(end) || start < 1 || end < start) {
                    throw new Error('Invalid page range: ' + part);
                }
                ranges.push({ start: start - 1, end: end - 1 }); // Convert to 0-based index
            } else {
                const page = parseInt(part.trim(), 10);
                if (isNaN(page) || page < 1) {
                    throw new Error('Invalid page number: ' + part);
                }
                ranges.push({ start: page - 1, end: page - 1 }); // Convert to 0-based index
            }
        }
        
        // Load the PDF
        const arrayBuffer = await readFileAsArrayBuffer(file);
        const { PDFDocument } = PDFLib;
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const totalPages = pdfDoc.getPageCount();
        
        // Validate ranges against total pages
        for (const range of ranges) {
            if (range.end >= totalPages) {
                throw new Error(`Page range ${range.start + 1}-${range.end + 1} exceeds the document's page count (${totalPages})`);
            }
        }
        
        // Create a new PDF for each range
        for (let i = 0; i < ranges.length; i++) {
            const range = ranges[i];
            
            // Create a new document
            const newPdfDoc = await PDFDocument.create();
            
            // Copy pages from the source document to the new document
            const pageIndexes = [];
            for (let j = range.start; j <= range.end; j++) {
                pageIndexes.push(j);
            }
            
            const pages = await newPdfDoc.copyPages(pdfDoc, pageIndexes);
            pages.forEach(page => {
                newPdfDoc.addPage(page);
            });
            
            // Save the new document
            const newPdfBytes = await newPdfDoc.save();
            
            // Create a blob and download it
            const blob = new Blob([newPdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const rangeText = range.start === range.end 
                ? `page${range.start + 1}` 
                : `pages${range.start + 1}-${range.end + 1}`;
            const filename = `${file.name.replace('.pdf', '')}_${rangeText}.pdf`;
            
            // Create a temporary link and click it to trigger download
            download(blob, filename, 'application/pdf');
        }
    }
    
    // Function to split PDF into individual pages
    async function splitPDFEachPage(file) {
        // Load the PDF
        const arrayBuffer = await readFileAsArrayBuffer(file);
        const { PDFDocument } = PDFLib;
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const totalPages = pdfDoc.getPageCount();
        
        // Create a zip file if there are many pages
        let zip = null;
        if (totalPages > 5) {
            zip = new JSZip();
        }
        
        // Extract each page
        for (let i = 0; i < totalPages; i++) {
            // Create a new document
            const newPdfDoc = await PDFDocument.create();
            
            // Copy the page
            const [page] = await newPdfDoc.copyPages(pdfDoc, [i]);
            newPdfDoc.addPage(page);
            
            // Save the new document
            const newPdfBytes = await newPdfDoc.save();
            
            // Create a blob
            const blob = new Blob([newPdfBytes], { type: 'application/pdf' });
            const filename = `${file.name.replace('.pdf', '')}_page${i + 1}.pdf`;
            
            if (zip) {
                // Add to zip file
                zip.file(filename, blob);
            } else {
                // Download directly
                download(blob, filename, 'application/pdf');
            }
        }
        
        // If we're using a zip file, generate and download it
        if (zip) {
            zip.generateAsync({ type: 'blob' }).then(content => {
                const zipFilename = `${file.name.replace('.pdf', '')}_all_pages.zip`;
                download(content, zipFilename, 'application/zip');
            });
        }
    }
    
    // Initialize PDF Compressor
    const compressDropZone = document.getElementById('compress-drop-zone');
    const compressFileInput = document.getElementById('compress-file-input');
    const compressOptions = document.getElementById('compress-options');
    const compressionOptions = document.querySelectorAll('.compression-option');
    const compressBtn = document.getElementById('compress-btn');
    let compressPdfFile = null;
    let compressionLevel = 'medium';
    
    if (compressDropZone && compressFileInput) {
        // Prevent default drag behaviors
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            compressDropZone.addEventListener(eventName, preventDefaults, false);
        });
        
        // Highlight drop zone
        ['dragenter', 'dragover'].forEach(eventName => {
            compressDropZone.addEventListener(eventName, () => {
                compressDropZone.classList.add('drop-zone-active');
            }, false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            compressDropZone.addEventListener(eventName, () => {
                compressDropZone.classList.remove('drop-zone-active');
            }, false);
        });
        
        // Handle dropped files
        compressDropZone.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;
            
            if (files.length > 0 && files[0].type === 'application/pdf') {
                // Store the file
                compressPdfFile = files[0];
                
                // Show compress options
                compressOptions.style.display = 'block';
                compressDropZone.querySelector('.drop-zone-prompt').textContent = 
                    `Selected: ${files[0].name}`;
            } else {
                showAlert('Please select a valid PDF file', 'danger');
            }
        }, false);
        
        // Handle click to select files
        compressDropZone.addEventListener('click', () => {
            compressFileInput.click();
        });
        
        compressFileInput.addEventListener('change', (e) => {
            const files = e.target.files;
            
            if (files.length > 0 && files[0].type === 'application/pdf') {
                // Store the file
                compressPdfFile = files[0];
                
                // Show compress options
                compressOptions.style.display = 'block';
                compressDropZone.querySelector('.drop-zone-prompt').textContent = 
                    `Selected: ${files[0].name}`;
            } else {
                showAlert('Please select a valid PDF file', 'danger');
            }
        });
    }
    
    // Compression level selection
    if (compressionOptions) {
        compressionOptions.forEach(option => {
            option.addEventListener('click', () => {
                // Update active class
                compressionOptions.forEach(o => o.classList.remove('active'));
                option.classList.add('active');
                
                // Store the selected compression level
                compressionLevel = option.dataset.level;
            });
        });
    }
    
    // Handle Compress PDF button click
    if (compressBtn) {
        compressBtn.addEventListener('click', async () => {
            if (!compressPdfFile) {
                showAlert('Please select a PDF file to compress', 'danger');
                return;
            }
            
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
    
    // Function to compress PDF
    async function compressPDF(file, level) {
        // Load the PDF
        const arrayBuffer = await readFileAsArrayBuffer(file);
        const { PDFDocument } = PDFLib;
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        
        // Define compression settings based on level
        let qualityFactor;
        switch (level) {
            case 'low':
                qualityFactor = 0.9; // Higher quality
                break;
            case 'medium':
                qualityFactor = 0.6; // Medium quality
                break;
            case 'high':
                qualityFactor = 0.3; // Lower quality, higher compression
                break;
            default:
                qualityFactor = 0.6;
        }
        
        // Compress by creating a new document and copying pages with reduced quality
        const newPdfDoc = await PDFDocument.create();
        
        // Copy pages from the source document to the new document
        const pages = await newPdfDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
        pages.forEach(page => {
            newPdfDoc.addPage(page);
        });
        
        // Save with compression settings
        const compressedPdfBytes = await newPdfDoc.save({
            useObjectStreams: true,
            addDefaultPage: false,
            // For PDF-lib, we can't directly set the compression quality
            // This is a limitation of the library, but we can still get some compression
        });
        
        // Create a blob and download it
        const blob = new Blob([compressedPdfBytes], { type: 'application/pdf' });
        const filename = `${file.name.replace('.pdf', '')}_compressed.pdf`;
        download(blob, filename, 'application/pdf');
    }
    
    // Initialize Images to PDF
    const imageDropZone = document.getElementById('image-drop-zone');
    const imageFileInput = document.getElementById('image-file-input');
    const imageOptions = document.getElementById('image-options');
    const pageSizeSelect = document.getElementById('page-size');
    const orientationOptions = document.querySelectorAll('.orientation-option');
    const createPdfBtn = document.getElementById('create-pdf-btn');
    let uploadedImages = [];
    let pageSize = 'a4';
    let orientation = 'portrait';
    
    if (imageDropZone && imageFileInput) {
        // Prevent default drag behaviors
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            imageDropZone.addEventListener(eventName, preventDefaults, false);
        });
        
        // Highlight drop zone
        ['dragenter', 'dragover'].forEach(eventName => {
            imageDropZone.addEventListener(eventName, () => {
                imageDropZone.classList.add('drop-zone-active');
            }, false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            imageDropZone.addEventListener(eventName, () => {
                imageDropZone.classList.remove('drop-zone-active');
            }, false);
        });
        
        // Handle dropped files
        imageDropZone.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;
            
            handleImageFiles(files);
        }, false);
        
        // Handle click to select files
        imageDropZone.addEventListener('click', () => {
            imageFileInput.click();
        });
        
        imageFileInput.addEventListener('change', (e) => {
            handleImageFiles(e.target.files);
        });
        
        function handleImageFiles(files) {
            if (files.length > 0) {
                // Store the image files
                uploadedImages = Array.from(files).filter(file => file.type.startsWith('image/'));
                
                if (uploadedImages.length === 0) {
                    showAlert('No valid image files selected', 'danger');
                    return;
                }
                
                // Show image options
                imageOptions.style.display = 'block';
                imageDropZone.querySelector('.drop-zone-prompt').textContent = 
                    `Selected ${uploadedImages.length} image(s)`;
            }
        }
    }
    
    // Page size selection
    if (pageSizeSelect) {
        pageSizeSelect.addEventListener('change', () => {
            pageSize = pageSizeSelect.value;
        });
    }
    
    // Orientation selection
    if (orientationOptions) {
        orientationOptions.forEach(option => {
            option.addEventListener('click', () => {
                // Update active class
                orientationOptions.forEach(o => o.classList.remove('active'));
                option.classList.add('active');
                
                // Store the selected orientation
                orientation = option.dataset.orientation;
            });
        });
    }
    
    // Handle Create PDF button click
    if (createPdfBtn) {
        createPdfBtn.addEventListener('click', async () => {
            if (uploadedImages.length === 0) {
                showAlert('Please select image files', 'danger');
                return;
            }
            
            createPdfBtn.disabled = true;
            createPdfBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating PDF...';
            
            try {
                await createPDFFromImages(uploadedImages, pageSize, orientation);
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
    
    // Function to create PDF from images
    async function createPDFFromImages(images, size, orientation) {
        // Create a new PDF document
        const { PDFDocument, PageSizes } = PDFLib;
        const pdfDoc = await PDFDocument.create();
        
        // Define page dimensions based on selected size and orientation
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
        
        // Swap dimensions if landscape orientation
        if (orientation === 'landscape') {
            [pageWidth, pageHeight] = [pageHeight, pageWidth];
        }
        
        // Process each image
        for (const image of images) {
            // Read the image file
            const imageArrayBuffer = await readFileAsArrayBuffer(image);
            
            // Determine image format
            let embeddedImage;
            if (image.type === 'image/jpeg' || image.type === 'image/jpg') {
                embeddedImage = await pdfDoc.embedJpg(imageArrayBuffer);
            } else if (image.type === 'image/png') {
                embeddedImage = await pdfDoc.embedPng(imageArrayBuffer);
            } else {
                // Skip unsupported image types
                console.warn(`Unsupported image format: ${image.type}`);
                continue;
            }
            
            // Get image dimensions
            const imgWidth = embeddedImage.width;
            const imgHeight = embeddedImage.height;
            
            // Calculate scaling factor to fit the image within the page
            const scale = Math.min(
                pageWidth / imgWidth,
                pageHeight / imgHeight
            ) * 0.9; // Leave some margin
            
            // Calculate dimensions for the scaled image
            const scaledWidth = imgWidth * scale;
            const scaledHeight = imgHeight * scale;
            
            // Calculate position to center the image on the page
            const x = (pageWidth - scaledWidth) / 2;
            const y = (pageHeight - scaledHeight) / 2;
            
            // Create a new page
            const page = pdfDoc.addPage([pageWidth, pageHeight]);
            
            // Draw the image on the page
            page.drawImage(embeddedImage, {
                x: x,
                y: y,
                width: scaledWidth,
                height: scaledHeight,
            });
        }
        
        // Save the PDF
        const pdfBytes = await pdfDoc.save();
        
        // Create a blob and download it
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const filename = `images_to_pdf_${new Date().getTime()}.pdf`;
        download(blob, filename, 'application/pdf');
    }
    
    // Initialize PDF to Images
    const extractDropZone = document.getElementById('extract-drop-zone');
    const extractFileInput = document.getElementById('extract-file-input');
    const extractOptions = document.getElementById('extract-options');
    const formatOptions = document.querySelectorAll('.format-option');
    const qualitySlider = document.getElementById('quality-slider');
    const qualityLabel = document.querySelector('.quality-label');
    const extractBtn = document.getElementById('extract-btn');
    let extractPdfFile = null;
    let imageFormat = 'png';
    let imageQuality = 8;
    
    if (extractDropZone && extractFileInput) {
        // Prevent default drag behaviors
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            extractDropZone.addEventListener(eventName, preventDefaults, false);
        });
        
        // Highlight drop zone
        ['dragenter', 'dragover'].forEach(eventName => {
            extractDropZone.addEventListener(eventName, () => {
                extractDropZone.classList.add('drop-zone-active');
            }, false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            extractDropZone.addEventListener(eventName, () => {
                extractDropZone.classList.remove('drop-zone-active');
            }, false);
        });
        
        // Handle dropped files
        extractDropZone.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;
            
            if (files.length > 0 && files[0].type === 'application/pdf') {
                // Store the file
                extractPdfFile = files[0];
                
                // Show extract options
                extractOptions.style.display = 'block';
                extractDropZone.querySelector('.drop-zone-prompt').textContent = 
                    `Selected: ${files[0].name}`;
            } else {
                showAlert('Please select a valid PDF file', 'danger');
            }
        }, false);
        
        // Handle click to select files
        extractDropZone.addEventListener('click', () => {
            extractFileInput.click();
        });
        
        extractFileInput.addEventListener('change', (e) => {
            const files = e.target.files;
            
            if (files.length > 0 && files[0].type === 'application/pdf') {
                // Store the file
                extractPdfFile = files[0];
                
                // Show extract options
                extractOptions.style.display = 'block';
                extractDropZone.querySelector('.drop-zone-prompt').textContent = 
                    `Selected: ${files[0].name}`;
            } else {
                showAlert('Please select a valid PDF file', 'danger');
            }
        });
    }
    
    // Format selection
    if (formatOptions) {
        formatOptions.forEach(option => {
            option.addEventListener('click', () => {
                // Update active class
                formatOptions.forEach(o => o.classList.remove('active'));
                option.classList.add('active');
                
                // Store the selected format
                imageFormat = option.dataset.format;
            });
        });
    }
    
    // Quality slider
    if (qualitySlider && qualityLabel) {
        qualitySlider.addEventListener('input', () => {
            imageQuality = parseInt(qualitySlider.value, 10);
            
            // Update the label
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
    
    // Handle Extract Images button click
    if (extractBtn) {
        extractBtn.addEventListener('click', async () => {
            if (!extractPdfFile) {
                showAlert('Please select a PDF file to extract images from', 'danger');
                return;
            }
            
            extractBtn.disabled = true;
            extractBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Extracting Images...';
            
            try {
                await extractImagesFromPDF(extractPdfFile, imageFormat, imageQuality);
                showAlert('Images successfully extracted! Check your downloads.', 'success');
            } catch (error) {
                showAlert('Error extracting images: ' + error.message, 'danger');
                console.error('Error:', error);
            } finally {
                extractBtn.disabled = false;
                extractBtn.innerHTML = '<i class="fas fa-images"></i> Extract Images';
            }
        });
    }
    
    // Function to extract images from PDF
    async function extractImagesFromPDF(file, format, quality) {
        // Load the PDF using pdf.js
        const arrayBuffer = await readFileAsArrayBuffer(file);
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        
        const numPages = pdf.numPages;
        let imageCount = 0;
        
        // Create a canvas element for rendering
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        // Create a zip file if there are multiple pages
        const zip = new JSZip();
        
        // Process each page
        for (let i = 1; i <= numPages; i++) {
            const page = await pdf.getPage(i);
            
            // Get viewport
            const viewport = page.getViewport({ scale: 2.0 }); // Higher scale for better quality
            
            // Set canvas dimensions
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            
            // Render the page to canvas
            await page.render({
                canvasContext: context,
                viewport: viewport
            }).promise;
            
            // Convert to image
            let imageData;
            if (format === 'png') {
                imageData = canvas.toDataURL('image/png');
            } else {
                // For JPEG, apply quality setting
                const qualityValue = quality / 10; // Convert 1-10 to 0.1-1.0
                imageData = canvas.toDataURL('image/jpeg', qualityValue);
            }
            
            // Convert data URL to Blob
            const byteString = atob(imageData.split(',')[1]);
            const mimeString = imageData.split(',')[0].split(':')[1].split(';')[0];
            
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            
            for (let j = 0; j < byteString.length; j++) {
                ia[j] = byteString.charCodeAt(j);
            }
            
            const blob = new Blob([ab], { type: mimeString });
            
            // Add to zip
            const filename = `page_${i}.${format}`;
            zip.file(filename, blob);
            
            imageCount++;
        }
        
        // Generate and download the zip file
        if (imageCount > 0) {
            const content = await zip.generateAsync({ type: 'blob' });
            const zipFilename = `${file.name.replace('.pdf', '')}_images.zip`;
            download(content, zipFilename, 'application/zip');
        } else {
            throw new Error('No images extracted from the PDF');
        }
    }
} 