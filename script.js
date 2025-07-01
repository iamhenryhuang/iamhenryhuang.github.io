// Constants for DOM selectors and configuration
const CONFIG = {
    SCROLL_THRESHOLD: 300,
    CAROUSEL_INTERVAL: 5000 // 5 seconds for auto-slide
};

// Theme management with local storage persistence
class ThemeManager {
    constructor() {
        this.themeKey = 'preferred-theme';
        this.button = document.getElementById('theme-toggle');
        this.init();
    }

    init() {
        // 立即設置初始主題
        const savedTheme = localStorage.getItem(this.themeKey);
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
        
        // 檢查是否有保存的主題偏好，如果沒有則使用系統主題
        if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme.matches)) {
            document.body.classList.add('dark-theme');
        }
        
        // 立即更新按鈕圖標
        this.updateButtonIcon();
        
        // 監聽點擊事件
        this.button?.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            this.updateButtonIcon();
            this.savePreference();
        });
        
        // 監聽系統主題變化
        prefersDarkScheme.addEventListener('change', (e) => {
            if (!localStorage.getItem(this.themeKey)) {
                if (e.matches) {
                    document.body.classList.add('dark-theme');
                } else {
                    document.body.classList.remove('dark-theme');
                }
                this.updateButtonIcon();
            }
        });
    }

    updateButtonIcon() {
        if (this.button) {
            const isDark = document.body.classList.contains('dark-theme');
            // 太陽圖標用於深色模式（點擊後切換到亮色模式）
            // 月亮圖標用於亮色模式（點擊後切換到深色模式）
            this.button.innerHTML = isDark
                ? '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>'
                : '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
            this.button.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
        }
    }

    savePreference() {
        localStorage.setItem(
            this.themeKey, 
            document.body.classList.contains('dark-theme') ? 'dark' : 'light'
        );
    }
}

// Enhanced carousel with auto-play and touch support
class Carousel {
    constructor() {
        this.track = document.querySelector('.carousel-track');
        this.slides = Array.from(document.querySelectorAll('.carousel-slide'));
        this.nextButton = document.querySelector('.carousel-button.next');
        this.prevButton = document.querySelector('.carousel-button.prev');
        this.dotsContainer = document.querySelector('.carousel-dots');
        this.currentIndex = 0;
        this.touchStartX = 0;
        
        if (!this.track || !this.slides.length) return;
        
        this.init();
    }

    init() {
        this.createDots();
        this.bindEvents();
        this.setupTouchEvents();
        this.setupKeyboardEvents();
        this.updateCarousel();
    }

    createDots() {
        this.slides.forEach((_, idx) => {
            const dot = document.createElement('div');
            dot.className = `dot ${idx === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => this.goToSlide(idx));
            this.dotsContainer?.appendChild(dot);
        });
    }

    bindEvents() {
        this.nextButton?.addEventListener('click', () => this.nextSlide());
        this.prevButton?.addEventListener('click', () => this.prevSlide());
    }

    setupTouchEvents() {
        this.track?.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
            this.pauseAutoPlay();
        }, { passive: true });

        this.track?.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const diff = this.touchStartX - touchEndX;

            if (Math.abs(diff) > 50) { // Minimum swipe distance
                if (diff > 0) this.nextSlide();
                else this.prevSlide();
            }

            this.startAutoPlay();
        }, { passive: true });
    }

    setupKeyboardEvents() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') this.nextSlide();
            else if (e.key === 'ArrowLeft') this.prevSlide();
        });
    }

    // Add technical details toggle functionality
    initTechDetails() {
        document.querySelectorAll('.tech-toggle').forEach(button => {
            button.addEventListener('click', () => {
                const details = button.previousElementSibling;
                if (!details || !details.classList.contains('tech-details')) return;
                
                const isHidden = details.style.display === 'none';
                
                // First update the display style
                details.style.display = isHidden ? 'block' : 'none';
                
                // Then update the button text
                button.textContent = isHidden ? 'Hide Technical Details' : 'Show Technical Details';
                
                // Handle the transition
                if (isHidden) {
                    details.style.maxHeight = details.scrollHeight + "px";
                    details.style.opacity = "1";
                } else {
                    details.style.maxHeight = "0";
                    details.style.opacity = "0";
                }
            });
        });
    }
    
    updateCarousel() {
        if (!this.track) return;
        
        this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
        
        document.querySelectorAll('.dot').forEach((dot, idx) => {
            dot.classList.toggle('active', idx === this.currentIndex);
        });

        this.slides.forEach((slide, idx) => {
            slide.classList.toggle('active', idx === this.currentIndex);
            
            // Preload adjacent images for smoother transitions
            if (Math.abs(idx - this.currentIndex) <= 1) {
                const imgs = slide.querySelectorAll('img');
                imgs.forEach(img => {
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        delete img.dataset.src;
                    }
                });
            }
        });
    }

    goToSlide(index) {
        this.currentIndex = index;
        this.updateCarousel();
    }

    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.slides.length;
        this.updateCarousel();
    }

    prevSlide() {
        this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
        this.updateCarousel();
    }


}

// 逐字出現動畫類
class TypewriterAnimation {
    constructor() {
        this.init();
    }

    init() {
        // 只在 index.html 頁面中找到 content-card 裡的 h4 元素
        // 檢查是否在正確的頁面上
        if (!window.location.pathname.includes('index.html') && window.location.pathname !== '/') {
            return; // 如果不是 index.html，就不執行動畫
        }
        
        // 只選擇 index.html 中 #about section 內的 h4 元素
        const h4Element = document.querySelector('#about .content-card h4');
        
        if (h4Element) {
            this.setupIntersectionObserver(h4Element, 0);
        }
    }

    setupIntersectionObserver(element, delay = 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // 延遲執行動畫
                    setTimeout(() => {
                        this.animateText(entry.target);
                    }, delay);
                    observer.unobserve(entry.target); // 只執行一次
                }
            });
        }, {
            threshold: 0.3, // 當30%的元素可見時觸發
            rootMargin: '0px 0px -50px 0px' // 稍微提前觸發
        });

        observer.observe(element);
    }

    animateText(element) {
        const text = element.textContent;
        element.innerHTML = ''; // 清空原始內容
        
        // 將文字拆分成字符
        const chars = text.split('');
        
        chars.forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.className = 'typewriter-char';
            
            // 為空格添加特殊類
            if (char === ' ') {
                span.classList.add('space');
            }
            
            // 設置動畫延遲，讓字符逐一出現
            span.style.animationDelay = `${index * 0.08}s`;
            
            element.appendChild(span);
        });
    }
}

// Initialize all components when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize core components
    const carousel = new Carousel();
    carousel.initTechDetails(); // Initialize technical details functionality
    new ThemeManager();
    new TypewriterAnimation(); // 添加逐字動畫
});

document.addEventListener('DOMContentLoaded', () => {
    // Add home link scroll functionality
    const homeLink = document.getElementById('home-link');
    if (homeLink) {
        homeLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});
