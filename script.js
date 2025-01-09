// dark-light mode
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const themeButton = document.getElementById('theme-toggle');
    if (document.body.classList.contains('dark-theme')) {
        themeButton.innerText = 'Change to light theme';
    } else {
        themeButton.innerText = 'Change to dark theme';
    }
}

// 初始化輪播功能
function initializeCarousel() {
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(document.querySelectorAll('.carousel-slide'));
    const nextButton = document.querySelector('.carousel-button.next');
    const prevButton = document.querySelector('.carousel-button.prev');
    const dotsContainer = document.querySelector('.carousel-dots');

    if (!track || !slides.length) return; // 確保元素存在

    let currentIndex = 0;

    // 創建導航圓點
    slides.forEach((_, idx) => {
        const dot = document.createElement('div');
        dot.className = `dot ${idx === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => goToSlide(idx));
        dotsContainer.appendChild(dot);
    });

    // 更新輪播狀態
    function updateCarousel() {
        if (!track) return; // 再次檢查元素是否存在
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        document.querySelectorAll('.dot').forEach((dot, idx) => {
            dot.classList.toggle('active', idx === currentIndex);
        });

        slides.forEach((slide, idx) => {
            slide.classList.toggle('active', idx === currentIndex);
        });
    }

    function goToSlide(index) {
        currentIndex = index;
        updateCarousel();
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        updateCarousel();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateCarousel();
    }

    // 綁定按鈕事件
    if (nextButton && prevButton) {
        nextButton.addEventListener('click', nextSlide);
        prevButton.addEventListener('click', prevSlide);
    }

    // 創建全屏模態框
    const modal = document.createElement('div');
    modal.className = 'fullscreen-modal';
    document.body.appendChild(modal);

    // 處理圖片點擊放大
    document.querySelectorAll('.portfolio-image').forEach(img => {
        img.addEventListener('click', () => {
            modal.innerHTML = `<img src="${img.src}" alt="${img.alt}" class="modal-img">`;
            modal.style.display = 'block';
        });
    });

    // 點擊模態框關閉
    modal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // 啟動第一個滑塊的動畫
    slides[0].classList.add('active');
    updateCarousel();

    // 添加鍵盤控制
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            nextSlide();
        } else if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
        }
    });
}

// 統一的 DOMContentLoaded 事件處理
document.addEventListener('DOMContentLoaded', () => {
    // 主題切換初始化
    const themeButton = document.getElementById('theme-toggle');
    if (themeButton) {
        themeButton.addEventListener('click', toggleTheme);
    }

    // 平滑滾動初始化
    document.querySelectorAll('.nav-links a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 郵件驗證初始化
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('input', (e) => {
            const email = e.target.value;
            const feedback = document.getElementById('email-feedback');
            if (feedback) {
                if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                    feedback.innerText = '有效的電子郵件地址';
                    feedback.style.color = 'green';
                } else {
                    feedback.innerText = '請輸入有效的電子郵件地址';
                    feedback.style.color = 'red';
                }
            }
        });
    }

    // 返回頂部按鈕初始化
    const backToTopButton = document.createElement('button');
    backToTopButton.innerText = '⬆ Back to top';
    backToTopButton.style.position = 'fixed';
    backToTopButton.style.bottom = '20px';
    backToTopButton.style.right = '20px';
    backToTopButton.style.display = 'none';
    backToTopButton.style.padding = '10px 15px';
    backToTopButton.style.backgroundColor = '#007BFF';
    backToTopButton.style.color = '#fff';
    backToTopButton.style.border = 'none';
    backToTopButton.style.borderRadius = '5px';
    backToTopButton.style.cursor = 'pointer';
    backToTopButton.style.zIndex = '1000';
    document.body.appendChild(backToTopButton);

    window.addEventListener('scroll', () => {
        backToTopButton.style.display = window.scrollY > 300 ? 'block' : 'none';
    });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // 技術細節展示切換初始化
    document.querySelectorAll('.tech-toggle').forEach(button => {
        button.addEventListener('click', function() {
            const details = this.previousElementSibling;
            if (!details) return;
            
            const isHidden = details.style.display === 'none';
            details.style.display = isHidden ? 'block' : 'none';
            this.textContent = isHidden ? 'Hide Technical Details' : 'Show Technical Details';
            
            if (isHidden) {
                details.style.maxHeight = details.scrollHeight + "px";
            } else {
                details.style.maxHeight = "0";
            }
        });
    });

    // 初始化輪播功能
    initializeCarousel();
});

/*weather part*/
// 獲取天氣數據的函數
async function fetchWeather() {
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=24.9928&longitude=121.5431&current_weather=true';
    const weatherDataElement = document.getElementById('weather-data');

    try {
        const response = await fetch(url);
        const data = await response.json();
        const temp = data.current_weather.temperature;
        const wind = data.current_weather.windspeed;

        weatherDataElement.innerText = `🌡️ 溫度: ${temp}°C, 🌬️ 風速: ${wind} km/h`;
    } catch (error) {
        weatherDataElement.innerText = '無法獲取天氣數據，請稍後再試。';
        console.error(error);
    }
}

// 加載時獲取數據
document.addEventListener('DOMContentLoaded', fetchWeather);
