// Constants for DOM selectors and configuration
const CONFIG = {
    SCROLL_THRESHOLD: 300,
    WEATHER_API: 'https://api.open-meteo.com/v1/forecast',
    WEATHER_COORDS: {
        latitude: 24.9928,
        longitude: 121.5431
    },
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

// Enhanced weather service with error handling and caching
class WeatherService {
    constructor() {
        this.cache = new Map();
        this.cacheTimeout = 1800000; // 30 minutes
    }

    async getWeather() {
        const weatherDataElement = document.getElementById('weather-data');
        if (!weatherDataElement) return;

        try {
            const cachedData = this.cache.get('weather');
            if (cachedData && Date.now() - cachedData.timestamp < this.cacheTimeout) {
                this.updateUI(cachedData.data, weatherDataElement);
                return;
            }

            const url = new URL(CONFIG.WEATHER_API);
            url.searchParams.append('latitude', CONFIG.WEATHER_COORDS.latitude);
            url.searchParams.append('longitude', CONFIG.WEATHER_COORDS.longitude);
            url.searchParams.append('current_weather', 'true');

            const response = await fetch(url);
            if (!response.ok) throw new Error('Weather API request failed');

            const data = await response.json();
            this.cache.set('weather', {
                data,
                timestamp: Date.now()
            });

            this.updateUI(data, weatherDataElement);
        } catch (error) {
            console.error('Weather fetch error:', error);
            weatherDataElement.innerText = '無法獲取天氣數據，請稍後再試。';
        }
    }

    updateUI(data, element) {
        const { temperature, windspeed } = data.current_weather;
        element.innerHTML = `
            <div class="weather-info">
                <span class="temperature">🌡️ 溫度: ${temperature}°C</span>
                <span class="wind">🌬️ 風速: ${windspeed} km/h</span>
            </div>
        `;
    }
}

// Form validation and submission handler
class FormHandler {
    constructor() {
        this.form = document.querySelector('form');
        this.emailInput = document.getElementById('email');
        this.feedbackElement = document.getElementById('email-feedback');
        
        if (this.form && this.emailInput) {
            this.init();
        }
    }

    init() {
        this.emailInput.addEventListener('input', (e) => this.validateEmail(e.target.value));
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    validateEmail(email) {
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        if (this.feedbackElement) {
            this.feedbackElement.innerText = isValid ? 
                '有效的電子郵件地址' : 
                '請輸入有效的電子郵件地址';
            this.feedbackElement.style.color = isValid ? 'green' : 'red';
        }
        return isValid;
    }

    async handleSubmit(e) {
        e.preventDefault();
        const email = this.emailInput.value;
        
        if (!this.validateEmail(email)) return;

        try {
            // Here you would typically send the email to your backend
            // For now, we'll just simulate a success response
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            alert('感謝您的訂閱！');
            this.form.reset();
        } catch (error) {
            console.error('Form submission error:', error);
            alert('提交失敗，請稍後再試。');
        }
    }
}

// Initialize all components when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize core components
    const carousel = new Carousel();
    carousel.initTechDetails(); // Initialize technical details functionality
    new ThemeManager();
    new FormHandler();
    
    // Initialize weather service and fetch initial data
    const weatherService = new WeatherService();
    weatherService.getWeather();
    
    // Set up periodic weather updates
    setInterval(() => weatherService.getWeather(), 900000); // Update every 15 minutes
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
