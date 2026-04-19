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

// 3. Hamburger Menü Kontrolü
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
        if (icon) {
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        }
    });
});

// --- YENİ EKLENEN ÖZELLİK: ARKA PLANDA ÖZGEÇMİŞ İNDİRME ---
const downloadBtn = document.getElementById('direct-download-cv');

downloadBtn?.addEventListener('click', (e) => {
    e.preventDefault();

    // 1. Görünmez bir iframe oluşturup resume.html sayfasını içine yükle
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = 'resume.html'; 
    document.body.appendChild(iframe);

    // 2. Özgeçmiş sayfası iframe içinde yüklendiğinde çalışacak
    iframe.onload = function() {
        setTimeout(() => {
            // Iframe içeriğine odaklan ve yazdırma/pdf penceresini aç
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
            
            // 3. Pencere kapandıktan sonra iframe'i sistemden temizle
            setTimeout(() => {
                document.body.removeChild(iframe);
            }, 1000);
        }, 500); // Sayfa içeriğinin tam yüklenmesi için kısa bir bekleme
    };
});