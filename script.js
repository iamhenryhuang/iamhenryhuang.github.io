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
