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

// Sadece arkadaki boşluğa tıklayınca kapat
overlay?.addEventListener('click', (e) => {
    if (e.target === overlay) closeLightbox();
});

window.addEventListener('keydown', (e) => {
    if (e.key === "Escape") closeLightbox();
});
