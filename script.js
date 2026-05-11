document.addEventListener('DOMContentLoaded', () => {
 
    // =============================================
    // 1. TEMA YÖNETİMİ
    // =============================================
    const themeCheckbox = document.getElementById('theme-checkbox');
    const htmlElement = document.documentElement;
    const savedTheme = localStorage.getItem('theme') || 'light';
 
    htmlElement.setAttribute('data-theme', savedTheme);
    if (themeCheckbox) themeCheckbox.checked = (savedTheme === 'dark');
 
    themeCheckbox?.addEventListener('change', () => {
        const newTheme = themeCheckbox.checked ? 'dark' : 'light';
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
 
    // =============================================
    // 2. DİNAMİK PROJE VERİSİ (JSON formatında sabit veri)
    // =============================================
    // Not: Tarayıcılar file:// protokolüyle fetch() kullanımına izin vermez.
    // Bu nedenle proje verileri doğrudan burada tanımlanmıştır.
    // Yeni proje eklemek için bu diziye yeni bir obje ekleyin.
    const projectData = [
        {
            "id": 1,
            "baslik": "StreamAtlas",
            "badge": "StreamAtlas",
            "resim": "streamatlas.png",
            "tags": ["Web App", "UI Design", "Stream"]
        },
        {
            "id": 2,
            "baslik": "GSWEB",
            "badge": "GSWEB",
            "resim": "GSWEB_afiş.png",
            "tags": ["C#", "ASP.NET", "Taraftar"]
        }
    ];
 
    // =============================================
    // 3. DİNAMİK PROJE YÖNETİMİ
    // =============================================
    const projectContainer = document.getElementById('dynamic-projects');
 
    if (projectContainer) {
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.id = 'toast';
        document.body.appendChild(toast);
 
        renderFavoritesBanner(projectData);
        renderProjects(projectData);
    }
 
    function renderFavoritesBanner(projects) {
        const existing = document.getElementById('fav-banner');
        if (existing) existing.remove();
 
        const favorites = getFavorites();
        const favCount = favorites.filter(id => projects.some(p => p.id === id)).length;
 
        const banner = document.createElement('div');
        banner.className = 'favorites-banner';
        banner.id = 'fav-banner';
        banner.innerHTML = `
            <i class="fas fa-star"></i>
            <span>Favorilere eklediğin projeler tarayıcında saklanıyor</span>
            <span class="favorites-count">${favCount} Favori</span>
        `;
 
        projectContainer.parentElement.insertBefore(banner, projectContainer);
    }
 
    function renderProjects(projects) {
        projectContainer.innerHTML = '';
        const favorites = getFavorites();
 
        projects.forEach(proje => {
            const isFav = favorites.includes(proje.id);
            const frame = document.createElement('div');
            frame.className = 'project-frame' + (isFav ? ' is-favorite' : '');
            frame.setAttribute('data-id', proje.id);
 
            frame.innerHTML = `
                <div class="project-badge">${proje.badge}</div>
                <img src="${proje.resim}" alt="${proje.baslik}" class="project-image" loading="lazy">
                <div class="project-overlay">
                    <h3>${proje.baslik}</h3>
                    <div class="project-tags">
                        ${proje.tags.map(tag => `<span>${tag}</span>`).join('')}
                    </div>
                    <button
                        class="view-btn${isFav ? ' favorited' : ''}"
                        data-id="${proje.id}"
                        data-title="${proje.baslik}"
                        aria-label="${isFav ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}">
                        <i class="${isFav ? 'fas' : 'far'} fa-star"></i>
                        ${isFav ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
                    </button>
                </div>
            `;
 
            projectContainer.appendChild(frame);
        });
 
        projectContainer.addEventListener('click', (e) => {
            const btn = e.target.closest('.view-btn');
            if (!btn) return;
            const id = parseInt(btn.getAttribute('data-id'));
            const title = btn.getAttribute('data-title');
            toggleFavorite(id, title);
        });
    }
 
    // =============================================
    // 4. FAVORİ TOGGLE (localStorage)
    // =============================================
    function getFavorites() {
        return JSON.parse(localStorage.getItem('favoriProjeler')) || [];
    }
 
    function saveFavorites(favorites) {
        localStorage.setItem('favoriProjeler', JSON.stringify(favorites));
    }
 
    window.toggleFavorite = function(id, title) {
        let favorites = getFavorites();
        const index = favorites.indexOf(id);
        let added;
 
        if (index === -1) {
            favorites.push(id);
            added = true;
        } else {
            favorites.splice(index, 1);
            added = false;
        }
 
        saveFavorites(favorites);
        updateCard(id, added);
        updateBanner();
        showToast(added
            ? `⭐ "${title}" favorilere eklendi!`
            : `❌ "${title}" favorilerden çıkarıldı.`
        );
    };
 
    function updateCard(id, isFav) {
        const frame = projectContainer.querySelector(`.project-frame[data-id="${id}"]`);
        if (!frame) return;
 
        const btn = frame.querySelector('.view-btn');
        const icon = btn.querySelector('i');
        const textNode = btn.lastChild;
 
        if (isFav) {
            frame.classList.add('is-favorite');
            btn.classList.add('favorited');
            icon.className = 'fas fa-star';
            if (textNode) textNode.textContent = ' Favorilerden Çıkar';
            btn.setAttribute('aria-label', 'Favorilerden Çıkar');
        } else {
            frame.classList.remove('is-favorite');
            btn.classList.remove('favorited');
            icon.className = 'far fa-star';
            if (textNode) textNode.textContent = ' Favorilere Ekle';
            btn.setAttribute('aria-label', 'Favorilere Ekle');
        }
    }
 
    function updateBanner() {
        const countEl = document.querySelector('#fav-banner .favorites-count');
        if (!countEl) return;
        const count = getFavorites().length;
        countEl.textContent = `${count} Favori`;
    }
 
    // =============================================
    // 5. TOAST BİLDİRİMİ
    // =============================================
    let toastTimer;
    function showToast(message) {
        const toast = document.getElementById('toast');
        if (!toast) return;
 
        toast.textContent = message;
        toast.classList.add('show');
 
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
            toast.classList.remove('show');
        }, 2500);
    }
 
    // =============================================
    // 6. PROFİL FOTOĞRAFI BÜYÜTME
    // =============================================
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
        overlay?.classList.remove('active');
        document.body.style.overflow = '';
    };
 
    overlay?.addEventListener('click', (e) => {
        if (e.target === overlay) closeLightbox();
    });
 
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
    });
 
});