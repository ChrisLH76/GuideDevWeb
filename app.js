// ========================================
// MODE SOMBRE / CLAIR
// ========================================

function initTheme() {
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeIcon(theme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('#theme-toggle-icon');
    if (icon) {
        icon.textContent = theme === 'light' ? '🌙' : '☀️';
    }
}

// ========================================
// BARRE DE PROGRESSION DE LECTURE
// ========================================

function updateProgressBar() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
        progressBar.style.width = scrolled + '%';
    }
}

// ========================================
// COPIE DE CODE EN UN CLIC
// ========================================

function initCodeCopy() {
    document.querySelectorAll('.tag-card code').forEach((codeBlock) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'code-wrapper';
        codeBlock.parentNode.insertBefore(wrapper, codeBlock);
        wrapper.appendChild(codeBlock);

        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-btn';
        copyBtn.innerHTML = '📋 Copier';
        copyBtn.onclick = () => copyCode(codeBlock, copyBtn);
        wrapper.appendChild(copyBtn);
    });
}

function copyCode(codeBlock, button) {
    const text = codeBlock.textContent;
    navigator.clipboard.writeText(text).then(() => {
        const originalText = button.innerHTML;
        button.innerHTML = '✓ Copié !';
        button.classList.add('copied');
        setTimeout(() => {
            button.innerHTML = originalText;
            button.classList.remove('copied');
        }, 2000);
    });
}

// ========================================
// ANCRES CLIQUABLES SUR LES TITRES
// ========================================

function initAnchorLinks() {
    document.querySelectorAll('.tag-card h3').forEach((heading) => {
        if (!heading.id) {
            heading.id = heading.textContent.trim().toLowerCase().replace(/[^\w]+/g, '-');
        }

        const anchor = document.createElement('a');
        anchor.className = 'anchor-link';
        anchor.href = '#' + heading.id;
        anchor.innerHTML = '🔗';
        anchor.title = 'Copier le lien';
        anchor.onclick = (e) => {
            e.preventDefault();
            const url = window.location.origin + window.location.pathname + '#' + heading.id;
            navigator.clipboard.writeText(url);
            const tooltip = document.createElement('span');
            tooltip.className = 'anchor-tooltip';
            tooltip.textContent = 'Lien copié !';
            anchor.appendChild(tooltip);
            setTimeout(() => tooltip.remove(), 2000);
        };
        heading.appendChild(anchor);
    });
}

// ========================================
// SYSTÈME DE FAVORIS
// ========================================

function initFavorites() {
    document.querySelectorAll('.tag-card').forEach((card) => {
        const title = card.querySelector('h3').textContent.trim();
        const favBtn = document.createElement('button');
        favBtn.className = 'fav-btn';
        favBtn.innerHTML = isFavorite(title) ? '⭐' : '☆';
        favBtn.onclick = () => toggleFavorite(title, favBtn, card);
        card.querySelector('h3').appendChild(favBtn);
    });
    updateFavCount();
}

function isFavorite(title) {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    return favorites.some(fav => fav.title === title);
}

function toggleFavorite(title, button, card) {
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const page = document.title;
    // Utiliser le nom du fichier actuel au lieu du pathname complet
    const currentFile = window.location.pathname.split('/').pop() || 'index.html';
    const url = currentFile + '#' + card.querySelector('h3').id;

    const index = favorites.findIndex(fav => fav.title === title);

    if (index > -1) {
        favorites.splice(index, 1);
        button.innerHTML = '☆';
        button.classList.remove('active');
    } else {
        favorites.push({ title, page, url });
        button.innerHTML = '⭐';
        button.classList.add('active');
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavCount();
}

function updateFavCount() {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const badge = document.getElementById('fav-count');
    if (badge) {
        badge.textContent = favorites.length;
        badge.style.display = favorites.length > 0 ? 'inline-block' : 'none';
    }
}

// ========================================
// RECHERCHE GLOBALE AMÉLIORÉE
// ========================================

function initGlobalSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    const suggestionsBox = document.createElement('div');
    suggestionsBox.className = 'search-suggestions';
    searchInput.parentNode.appendChild(suggestionsBox);

    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const cards = document.querySelectorAll('.tag-card');
        let suggestions = [];

        cards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const content = card.textContent.toLowerCase();

            if (title.includes(searchTerm) || content.includes(searchTerm)) {
                card.style.display = 'block';
                if (searchTerm.length >= 2 && title.includes(searchTerm)) {
                    suggestions.push({
                        title: card.querySelector('h3').textContent,
                        card: card
                    });
                }
            } else {
                card.style.display = 'none';
            }
        });

        // Afficher suggestions
        if (searchTerm.length >= 2 && suggestions.length > 0) {
            suggestionsBox.innerHTML = suggestions.slice(0, 5).map(s =>
                `<div class="suggestion-item" data-title="${s.title}">${s.title}</div>`
            ).join('');
            suggestionsBox.style.display = 'block';

            suggestionsBox.querySelectorAll('.suggestion-item').forEach(item => {
                item.onclick = () => {
                    const title = item.dataset.title;
                    const card = Array.from(cards).find(c =>
                        c.querySelector('h3').textContent === title
                    );
                    if (card) {
                        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        card.classList.add('highlight');
                        setTimeout(() => card.classList.remove('highlight'), 2000);
                    }
                    suggestionsBox.style.display = 'none';
                };
            });
        } else {
            suggestionsBox.style.display = 'none';
        }
    });

    // Raccourci clavier Ctrl+K
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            searchInput.focus();
        }
    });

    // Fermer suggestions au clic ailleurs
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !suggestionsBox.contains(e.target)) {
            suggestionsBox.style.display = 'none';
        }
    });
}

// ========================================
// FILTRES PAR NIVEAU
// ========================================

function initLevelFilters() {
    // Ajouter des badges de niveau (à personnaliser selon le contenu)
    const levelMap = {
        'echo': 'debutant',
        'var_dump': 'debutant',
        'SELECT *': 'debutant',
        'CREATE DATABASE': 'debutant',
        'preg_match': 'intermediaire',
        'password_hash': 'intermediaire',
        'INNER JOIN': 'intermediaire',
        'WINDOW FUNCTIONS': 'avance',
        'TRANSACTION': 'avance',
        'Attributes': 'avance',
        'Match expression': 'avance'
    };

    document.querySelectorAll('.tag-card h3').forEach(h3 => {
        const title = h3.textContent.trim();
        let level = 'intermediaire'; // défaut

        for (const [key, val] of Object.entries(levelMap)) {
            if (title.includes(key)) {
                level = val;
                break;
            }
        }

        const badge = document.createElement('span');
        badge.className = `level-badge ${level}`;
        badge.textContent = level === 'debutant' ? '🟢 Débutant' :
                           level === 'intermediaire' ? '🟡 Intermédiaire' :
                           '🔴 Avancé';
        h3.appendChild(badge);
    });

    // Ajouter filtres si on est dans une page de guide
    if (document.querySelector('.tag-card')) {
        const nav = document.querySelector('nav ul');
        if (nav) {
            const filterLi = document.createElement('li');
            filterLi.innerHTML = `
                <div class="level-filters">
                    <button class="filter-btn active" data-level="all">Tous</button>
                    <button class="filter-btn" data-level="debutant">🟢 Débutant</button>
                    <button class="filter-btn" data-level="intermediaire">🟡 Inter.</button>
                    <button class="filter-btn" data-level="avance">🔴 Avancé</button>
                </div>
            `;
            nav.appendChild(filterLi);

            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.onclick = () => filterByLevel(btn.dataset.level);
            });
        }
    }
}

function filterByLevel(level) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.level === level);
    });

    document.querySelectorAll('.tag-card').forEach(card => {
        const badge = card.querySelector('.level-badge');
        if (level === 'all' || !badge || badge.classList.contains(level)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// ========================================
// BREADCRUMB NAVIGATION
// ========================================

function initBreadcrumb() {
    const main = document.querySelector('main');
    if (!main) return;

    const breadcrumb = document.createElement('div');
    breadcrumb.className = 'breadcrumb';

    const pageName = document.title.replace(' - Guides Dev Web', '').replace('Guide ', '');
    breadcrumb.innerHTML = `
        <a href="index.html">🏠 Accueil</a>
        <span class="separator">›</span>
        <span class="current">${pageName}</span>
    `;

    main.insertBefore(breadcrumb, main.firstChild);
}

// ========================================
// STATISTIQUES PERSONNELLES
// ========================================

function trackPageVisit() {
    const stats = JSON.parse(localStorage.getItem('stats') || '{}');
    const page = document.title;

    if (!stats[page]) {
        stats[page] = { visits: 0, timeSpent: 0, lastVisit: null };
    }

    stats[page].visits++;
    stats[page].lastVisit = new Date().toISOString();

    localStorage.setItem('stats', JSON.stringify(stats));

    // Tracker le temps passé
    let startTime = Date.now();
    window.addEventListener('beforeunload', () => {
        const timeSpent = Math.round((Date.now() - startTime) / 1000);
        stats[page].timeSpent += timeSpent;
        localStorage.setItem('stats', JSON.stringify(stats));
    });
}

// ========================================
// PARTAGE SOCIAL
// ========================================

function initSocialShare() {
    const footer = document.querySelector('footer');
    if (footer && document.querySelector('.tag-card')) {
        const shareSection = document.createElement('div');
        shareSection.className = 'social-share';
        shareSection.innerHTML = `
            <p style="margin-bottom: 10px;">Partager ce guide :</p>
            <button class="share-btn twitter" onclick="shareTwitter()">🐦 Twitter</button>
            <button class="share-btn linkedin" onclick="shareLinkedIn()">💼 LinkedIn</button>
            <button class="share-btn link" onclick="copyPageLink()">🔗 Copier le lien</button>
        `;
        footer.insertBefore(shareSection, footer.firstChild);
    }
}

function shareTwitter() {
    const text = `Je viens d'apprendre ${document.title} ! 🚀`;
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${url}`, '_blank');
}

function shareLinkedIn() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
}

function copyPageLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
        alert('Lien copié dans le presse-papier !');
    });
}

// ========================================
// SMOOTH SCROLL POUR LES ANCRES
// ========================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// ========================================
// INITIALISATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initCodeCopy();
    initAnchorLinks();
    initFavorites();
    initGlobalSearch();
    initLevelFilters();
    initBreadcrumb();
    initSocialShare();
    initSmoothScroll();
    trackPageVisit();

    // Progress bar
    window.addEventListener('scroll', updateProgressBar);
    updateProgressBar();
});
