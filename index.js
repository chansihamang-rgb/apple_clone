// Apple Films Carousel Functionality
function initCarousel(containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const carousel = container.querySelector('.carousel');
    const slides = container.querySelectorAll('.carousel-slide');
    const prevBtn = container.querySelector('.carousel-prev');
    const nextBtn = container.querySelector('.carousel-next');
    const indicators = container.querySelectorAll('.indicator');

    if (!carousel || slides.length === 0) return;

    let currentSlide = 0;
    const totalSlides = slides.length;
    let autoSlideInterval;

    // Function to update slide using scroll
    function updateSlide(index) {
        if (index < 0 || index >= totalSlides) return;

        currentSlide = index;

        // Scroll to the slide
        const slideWidth = slides[0].offsetWidth;
        const containerWidth = carousel.offsetWidth;
        const gap = 20; // Updated to match CSS gap

        // Calculate centered position:
        // center of slide should align with center of container
        // slideCenter = (index * (slideWidth + gap)) + (slideWidth / 2)
        // containerCenter = containerWidth / 2
        // scrollPosition = slideCenter - containerCenter

        // Simplified: (slideWidth + gap) * currentIndex - (containerWidth - slideWidth) / 2
        let scrollPosition = (slideWidth + gap) * currentSlide - (containerWidth - slideWidth) / 2;

        // Ensure we don't scroll past bounds (though simplified view might allow it for centering)
        scrollPosition = Math.max(0, scrollPosition);
        // We might not need max limit on right side if we want it to center the last item correctly
        // but typically maxScroll = carousel.scrollWidth - containerWidth

        carousel.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });

        // Update indicators
        if (indicators.length > 0) {
            indicators.forEach((indicator, i) => {
                indicator.classList.toggle('active', i === currentSlide);
            });
        }

        // Update button states
        updateButtonStates();
    }

    // Function to update button states
    function updateButtonStates() {
        if (prevBtn) {
            prevBtn.disabled = currentSlide === 0;
            prevBtn.style.opacity = currentSlide === 0 ? '0.3' : '1';
        }

        if (nextBtn) {
            nextBtn.disabled = currentSlide === totalSlides - 1;
            nextBtn.style.opacity = currentSlide === totalSlides - 1 ? '0.3' : '1';
        }
    }

    // Function to go to next slide
    function nextSlide() {
        if (currentSlide < totalSlides - 1) {
            updateSlide(currentSlide + 1);
        } else {
            updateSlide(0); // Loop to first slide
        }
        resetAutoSlide();
    }

    // Function to go to previous slide
    function prevSlide() {
        if (currentSlide > 0) {
            updateSlide(currentSlide - 1);
        } else {
            updateSlide(totalSlides - 1); // Loop to last slide
        }
        resetAutoSlide();
    }

    // Function to go to specific slide
    function goToSlide(index) {
        if (index >= 0 && index < totalSlides) {
            updateSlide(index);
            resetAutoSlide();
        }
    }

    // Function to start auto slide
    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    }

    // Function to reset auto slide timer
    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    // Function to pause auto slide on hover
    function pauseAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    // Detect current slide from scroll position
    function handleScroll() {
        const slideWidth = slides[0].offsetWidth;
        const gap = 20;
        const scrollLeft = carousel.scrollLeft;

        // Improve detection for centered slides
        // We want the index where the center of the slide is closest to center of viewport

        const centerPoint = scrollLeft + (carousel.offsetWidth / 2);
        const slideTotalWidth = slideWidth + gap;

        // Calculate which slide center is closest to container center
        const newIndex = Math.round((centerPoint - (slideWidth / 2)) / slideTotalWidth);

        if (newIndex !== currentSlide && newIndex >= 0 && newIndex < totalSlides) {
            currentSlide = newIndex;

            // Update indicators
            if (indicators.length > 0) {
                indicators.forEach((indicator, i) => {
                    indicator.classList.toggle('active', i === currentSlide);
                });
            }

            updateButtonStates();
        }
    }

    // Event Listeners
    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
    }

    // Indicator click events
    if (indicators.length > 0) {
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => goToSlide(index));
        });
    }

    // Keyboard navigation (global listener, might need refinement if strict focus needed)
    // For now, keeping global but could check if element is in viewport
    document.addEventListener('keydown', (e) => {
        // Only if this specific carousel is being interacted with or visible? 
        // Keeping simple: arrows control both or last active?
        // Let's remove global keydown for now to avoid conflict or keep it simple
        // If we want key support, we should scope it to hover or focus.
    });

    // Pause auto slide on hover
    container.addEventListener('mouseenter', pauseAutoSlide);
    container.addEventListener('mouseleave', startAutoSlide);

    // Handle scroll events to update current slide
    let scrollTimeout;
    carousel.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(handleScroll, 150);
    });

    // Initialize
    updateSlide(0);
    startAutoSlide();

    // Cleanup function
    return () => {
        clearInterval(autoSlideInterval);
        container.removeEventListener('mouseenter', pauseAutoSlide);
        container.removeEventListener('mouseleave', startAutoSlide);
    };
}

// Initialize the carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Dropdown Overlay Logic
    const navItems = document.querySelectorAll('.nav-item');
    const mainNav = document.querySelector('.main-nav');
    const navList = document.querySelector('.nav-list');

    if (mainNav && navList) {
        navItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                if (item.querySelector('.nav-dropdown')) {
                    mainNav.classList.add('overlay-active');
                } else {
                    mainNav.classList.remove('overlay-active');
                }
            });
        });

        navList.addEventListener('mouseleave', () => {
            mainNav.classList.remove('overlay-active');
        });
    }

    // Mobile Menu Logic
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    if (mobileMenuClose && mobileMenu) {
        mobileMenuClose.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Initialize carousels
    // We target the entertainment section and the new more section
    const cleanupEntertainment = initCarousel('.entertainment-section');
    const cleanupMore = initCarousel('.more-section');

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        if (cleanupEntertainment) cleanupEntertainment();
        if (cleanupMore) cleanupMore();
    });
});