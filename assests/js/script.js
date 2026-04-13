// 1. Tema Yönetimi
const themeCheckbox = document.getElementById('theme-checkbox');
const htmlElement = document.documentElement;

const savedTheme = localStorage.getItem('theme') || 'light';
htmlElement.setAttribute('data-theme', savedTheme);
if(themeCheckbox) themeCheckbox.checked = (savedTheme === 'dark');

themeCheckbox?.addEventListener('change', () => {
    const newTheme = themeCheckbox.checked ? 'dark' : 'light';
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// 2. Profil Fotoğrafı Büyütme (Lightbox)
const profileBtn = document.getElementById('profile-trigger');
const overlay = document.getElementById('photo-overlay');
const expandedImg = document.getElementById('expanded-photo');

profileBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    const profileImg = profileBtn.querySelector('img');
    if (profileImg) {
        expandedImg.src = profileImg.src;
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden'; 
    }
});

const closeLightbox = () => {
    overlay.classList.remove('active');
    document.body.style.overflow = ''; 
};

overlay?.addEventListener('click', (e) => {
    if (e.target === overlay) closeLightbox();
});

window.addEventListener('keydown', (e) => {
    if (e.key === "Escape") closeLightbox();
});

// 3. Hamburger Menü Kontrolü (Yeni Eklendi)
const hamburgerBtn = document.getElementById('hamburger-btn');
const navMenu = document.getElementById('nav-menu');

hamburgerBtn?.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    // İkonu değiştir (Hamburger -> Kapat)
    const icon = hamburgerBtn.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
});

// Menü linklerine tıklandığında menüyü kapat
const navLinks = document.querySelectorAll('nav ul li a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const icon = hamburgerBtn.querySelector('i');
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-times');
    });
});