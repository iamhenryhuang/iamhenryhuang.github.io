// dark-light
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const themeButton = document.getElementById('theme-toggle');
    if (document.body.classList.contains('dark-theme')) {
        themeButton.innerText = 'Change to light theme';
    } else {
        themeButton.innerText = 'Change to dark theme';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const themeButton = document.getElementById('theme-toggle');
    themeButton.addEventListener('click', toggleTheme);
});

document.querySelectorAll('.nav-links a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        document.getElementById(targetId).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// email
document.getElementById('email').addEventListener('input', (e) => {
    const email = e.target.value;
    const feedback = document.getElementById('email-feedback');

    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        feedback.innerText = '有效的電子郵件地址';
        feedback.style.color = 'green';
    } else {
        feedback.innerText = '請輸入有效的電子郵件地址';
        feedback.style.color = 'red';
    }
});

// 回到頂部
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
    if (window.scrollY > 300) {
        backToTopButton.style.display = 'block';
    } else {
        backToTopButton.style.display = 'none';
    }
});

backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// 技術細節展示切換
document.querySelectorAll('.tech-toggle').forEach(button => {
    button.addEventListener('click', function() {
        const details = this.previousElementSibling;
        const isHidden = details.style.display === 'none';
        details.style.display = isHidden ? 'block' : 'none';
        this.textContent = isHidden ? 'Hide Technical Details' : 'Show Technical Details';
        
        // 添加平滑過渡效果
        if(isHidden) {
            details.style.maxHeight = details.scrollHeight + "px";
        } else {
            details.style.maxHeight = "0";
        }
    });
});

// portfolio圖片效果
document.addEventListener('DOMContentLoaded', () => {
    // 輪播相關元素
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(document.querySelectorAll('.carousel-slide'));
    const nextButton = document.querySelector('.carousel-button.next');
    const prevButton = document.querySelector('.carousel-button.prev');
    const dotsContainer = document.querySelector('.carousel-dots');
    
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
        // 更新輪播位置
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // 更新圓點狀態
        document.querySelectorAll('.dot').forEach((dot, idx) => {
            dot.classList.toggle('active', idx === currentIndex);
        });
        
        // 更新滑塊的活動狀態
        slides.forEach((slide, idx) => {
            slide.classList.toggle('active', idx === currentIndex);
        });
    }
    
    // 切換到指定滑塊
    function goToSlide(index) {
        currentIndex = index;
        updateCarousel();
    }
    
    // 下一張
    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        updateCarousel();
    }
    
    // 上一張
    function prevSlide() {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateCarousel();
    }
    
    // 綁定按鈕事件
    nextButton.addEventListener('click', nextSlide);
    prevButton.addEventListener('click', prevSlide);
    
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
});
