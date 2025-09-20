// Custom image data
const images = [
    // Nature images
    { src: 'images/nature1.jpg', category: 'nature', caption: 'Nature Image 1' },
    { src: 'images/nature2.jpg', category: 'nature', caption: 'Nature Image 2' },
    { src: 'images/nature3.jpg', category: 'nature', caption: 'Nature Image 3' },
    { src: 'images/nature4.jpg', category: 'nature', caption: 'Nature Image 4' },
    { src: 'images/nature5.jpg', category: 'nature', caption: 'Nature Image 5' },
    
    // Urban images
    { src: 'images/urban1.jpg', category: 'urban', caption: 'Urban Image 1' },
    { src: 'images/urban2.jpg', category: 'urban', caption: 'Urban Image 2' },
    { src: 'images/urban3.jpg', category: 'urban', caption: 'Urban Image 3' },
    { src: 'images/urban4.jpg', category: 'urban', caption: 'Urban Image 4' },
    { src: 'images/urban5.jpg', category: 'urban', caption: 'Urban Image 5' },
    
    // Portrait images
    { src: 'images/portrait1.jpg', category: 'portrait', caption: 'Portrait Image 1' },
    { src: 'images/portrait2.jpg', category: 'portrait', caption: 'Portrait Image 2' },
    { src: 'images/portrait3.jpg', category: 'portrait', caption: 'Portrait Image 3' },
    { src: 'images/portrait4.jpg', category: 'portrait', caption: 'Portrait Image 4' },
    { src: 'images/portrait5.jpg', category: 'portrait', caption: 'Portrait Image 5' }
];

// DOM Elements
const galleryContainer = document.querySelector('.gallery-container');
const filterButtons = document.querySelectorAll('.filter-btn');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.querySelector('.lightbox-image');
const lightboxCaption = document.querySelector('.lightbox-caption');
const closeBtn = document.querySelector('.close');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');

let currentImageIndex = 0;
let filteredImages = [];
let allGalleryItems = []; // Store references to all gallery items

// Initialize gallery
function initGallery() {
    createAllGalleryItems(); // Create all items once
    displayImages('all'); // Show all images initially
    
    // Add event listeners
    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const filter = e.target.getAttribute('data-filter');
            filterImages(filter);
        });
    });
    
    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', showPrevImage);
    nextBtn.addEventListener('click', showNextImage);
    
    // Close lightbox when clicking outside the image
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (lightbox.style.display === 'flex' || lightbox.classList.contains('show')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrevImage();
            if (e.key === 'ArrowRight') showNextImage();
        }
    });
}

// Create all gallery items once and store references
function createAllGalleryItems() {
    galleryContainer.innerHTML = '';
    allGalleryItems = [];
    
    images.forEach((image, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = `gallery-item ${image.category}`;
        galleryItem.innerHTML = `
            <img src="${image.src}" alt="${image.caption}" data-index="${index}" loading="lazy">
            <div class="image-caption">${image.caption}</div>
        `;
        
        // Store reference
        allGalleryItems.push({
            element: galleryItem,
            category: image.category
        });
        
        // Add click event to open lightbox
        galleryItem.addEventListener('click', () => {
            openLightbox(index, filteredImages.length > 0 ? filteredImages : images);
        });
        
        galleryContainer.appendChild(galleryItem);
    });
}

// Filter images by showing/hiding rather than recreating
function filterImages(filter) {
    // Update active button
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-filter') === filter) {
            btn.classList.add('active');
        }
    });
    
    // Show/hide items based on filter
    allGalleryItems.forEach(item => {
        if (filter === 'all' || item.category === filter) {
            item.element.style.display = 'block';
        } else {
            item.element.style.display = 'none';
        }
    });
    
    // Update filtered images array for lightbox navigation
    if (filter === 'all') {
        filteredImages = images;
    } else {
        filteredImages = images.filter(image => image.category === filter);
    }
}

// Open lightbox with selected image
function openLightbox(index, imagesArray) {
    currentImageIndex = index;
    filteredImages = imagesArray;
    
    // Preload adjacent images for smoother navigation
    preloadAdjacentImages();
    
    lightboxImage.src = filteredImages[currentImageIndex].src;
    lightboxCaption.textContent = filteredImages[currentImageIndex].caption;
    lightbox.style.display = 'flex';
    
    // Add smooth transition
    setTimeout(() => {
        lightbox.classList.add('show');
    }, 10);
    
    // Prevent body scrolling when lightbox is open
    document.body.style.overflow = 'hidden';
}

// Preload next and previous images for smoother lightbox navigation
function preloadAdjacentImages() {
    const preloadIndices = [
        (currentImageIndex - 1 + filteredImages.length) % filteredImages.length,
        (currentImageIndex + 1) % filteredImages.length
    ];
    
    preloadIndices.forEach(index => {
        const img = new Image();
        img.src = filteredImages[index].src;
    });
}

// Close lightbox
function closeLightbox() {
    lightbox.classList.remove('show');
    setTimeout(() => {
        lightbox.style.display = 'none';
        // Re-enable body scrolling
        document.body.style.overflow = 'auto';
    }, 300);
}

// Show previous image in lightbox
function showPrevImage() {
    currentImageIndex = (currentImageIndex - 1 + filteredImages.length) % filteredImages.length;
    lightboxImage.src = filteredImages[currentImageIndex].src;
    lightboxCaption.textContent = filteredImages[currentImageIndex].caption;
    preloadAdjacentImages();
}

// Show next image in lightbox
function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % filteredImages.length;
    lightboxImage.src = filteredImages[currentImageIndex].src;
    lightboxCaption.textContent = filteredImages[currentImageIndex].caption;
    preloadAdjacentImages();
}

// Initialize gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', initGallery);