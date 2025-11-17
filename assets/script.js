(function () {
    const config = window.APP_CONFIG;

    const LOGIN_USERNAME = 'admin';
    const LOGIN_PASSWORD = '1234';

    function setTextContent(id, text) {
        const el = document.getElementById(id);
        if (el && text) {
            el.textContent = text;
        }
    }

    function setLinkAttributes(id, label, url, target) {
        const el = document.getElementById(id);
        if (!el) return;
        if (label) el.textContent = label;
        if (url) el.setAttribute('href', url);
        if (target) el.setAttribute('href', target);
    }

    function renderBranding() {
        const { branding } = config;
        setTextContent('siteTitle', branding.siteTitle);
        setTextContent('siteTagline', branding.siteTagline);

        const logoEl = document.querySelector('.logo');
        if (logoEl && branding.logoEmoji) {
            logoEl.textContent = branding.logoEmoji;
        }

        const footerNote = branding.footerNote.replace('{year}', new Date().getFullYear());
        const footerEl = document.getElementById('footerNote');
        if (footerEl) {
            footerEl.innerHTML = footerNote;
        }
    }

    function renderHero() {
        const { hero, heroCard } = config;
        setTextContent('heroEyebrow', hero.eyebrow);
        setTextContent('heroTitle', hero.title);
        setTextContent('heroSubtitle', hero.subtitle);

        const primaryCta = document.getElementById('heroPrimaryCta');
        if (primaryCta) {
            if (hero.primaryCtaLabel) primaryCta.textContent = hero.primaryCtaLabel;
            if (hero.primaryCtaUrl) primaryCta.href = hero.primaryCtaUrl;
        }

        const secondaryCta = document.getElementById('heroSecondaryCta');
        if (secondaryCta) {
            if (hero.secondaryCtaLabel) secondaryCta.textContent = hero.secondaryCtaLabel;
            if (hero.secondaryCtaTarget) secondaryCta.href = hero.secondaryCtaTarget;
        }

        const cardEl = document.querySelector('.hero__card');
        const iconEl = document.getElementById('heroCardIcon');
        const imageEl = document.getElementById('heroCardImage');
        const titleEl = document.getElementById('heroCardTitle');
        const subtitleEl = document.getElementById('heroCardSubtitle');
        const descriptionEl = document.getElementById('heroCardDescription');

        if (heroCard?.imageUrl && imageEl) {
            imageEl.src = heroCard.imageUrl;
            imageEl.alt = heroCard.imageAlt || '';
            imageEl.hidden = false;
            if (iconEl) {
                iconEl.hidden = true;
            }
        } else {
            if (imageEl) {
                imageEl.hidden = true;
                imageEl.removeAttribute('src');
            }
            if (iconEl) {
                iconEl.hidden = false;
                if (heroCard?.icon) {
                    iconEl.textContent = heroCard.icon;
                }
            }
        }

        if (titleEl) {
            if (heroCard?.title) {
                titleEl.textContent = heroCard.title;
                titleEl.hidden = false;
            } else {
                titleEl.textContent = '';
                titleEl.hidden = true;
            }
        }

        if (subtitleEl) {
            if (heroCard?.subtitle) {
                subtitleEl.textContent = heroCard.subtitle;
                subtitleEl.hidden = false;
            } else {
                subtitleEl.textContent = '';
                subtitleEl.hidden = true;
            }
        }

        if (descriptionEl) {
            if (heroCard?.description) {
                descriptionEl.textContent = heroCard.description;
                descriptionEl.hidden = false;
            } else {
                descriptionEl.textContent = '';
                descriptionEl.hidden = true;
            }
        }

        const hasText = [titleEl, subtitleEl, descriptionEl].some((el) => el && !el.hidden);
        if (cardEl) {
            if (hasText) {
                cardEl.classList.remove('hero__card--image-only');
            } else {
                cardEl.classList.add('hero__card--image-only');
            }
        }
    }

    function renderInventory() {
        const { inventory } = config;
        setTextContent('inventoryTitle', inventory.title);
        setTextContent('inventoryDescription', inventory.description);
        setTextContent('inventoryHint', inventory.hint);

        const button = document.getElementById('inventoryButton');
        if (button) {
            if (inventory.buttonLabel) button.textContent = inventory.buttonLabel;
            if (inventory.sheetUrl) button.href = inventory.sheetUrl;
        }
    }

    function createAssetItem(asset) {
        const wrapper = document.createElement('div');
        wrapper.className = 'asset-item';

        const info = document.createElement('div');
        info.className = 'asset-item__info';

        const title = document.createElement('p');
        title.className = 'asset-item__title';
        title.textContent = asset.title;

        const desc = document.createElement('p');
        desc.className = 'asset-item__desc';
        desc.textContent = asset.description;

        info.appendChild(title);
        if (asset.description) {
            info.appendChild(desc);
        }

        const link = document.createElement('a');
        link.className = 'asset-item__cta';
        link.href = asset.url || '#';
        link.target = '_blank';
        link.rel = 'noopener';

        let label = 'فتح';
        switch (asset.type) {
            case 'pdf':
                label = 'فتح الملف';
                break;
            case 'sheet':
                label = 'عرض الشيت';
                break;
            case 'drive':
                label = 'فتح المجلد';
                break;
            case 'image':
                label = 'عرض الصورة';
                break;
        }

        link.textContent = label;

        wrapper.appendChild(info);
        wrapper.appendChild(link);
        return wrapper;
    }

    function createStageCard(stage) {
        const card = document.createElement('article');
        card.className = 'stage-card';

        const header = document.createElement('header');
        header.className = 'stage-card__header';

        const icon = document.createElement('div');
        icon.className = 'stage-card__icon';
        icon.textContent = stage.icon || '📁';

        const textWrapper = document.createElement('div');

        const title = document.createElement('h4');
        title.className = 'stage-card__title';
        title.textContent = `${stage.grade} – ${stage.year}`;

        const meta = document.createElement('p');
        meta.className = 'stage-card__meta';
        meta.textContent = stage.term;

        textWrapper.appendChild(title);
        textWrapper.appendChild(meta);

        header.appendChild(icon);
        header.appendChild(textWrapper);

        card.appendChild(header);

        if (Array.isArray(stage.assets) && stage.assets.length > 0) {
            const list = document.createElement('div');
            list.className = 'assets-list';
            stage.assets.forEach(asset => {
                list.appendChild(createAssetItem(asset));
            });
            card.appendChild(list);
        } else {
            const empty = document.createElement('p');
            empty.className = 'asset-item__desc';
            empty.textContent = 'لا توجد ملفات مضافة حالياً. يمكن إضافتها من الإعدادات.';
            card.appendChild(empty);
        }

        return card;
    }

    function renderStages() {
        const container = document.getElementById('stagesContainer');
        if (!container) return;

        container.innerHTML = '';
        config.academicStages.forEach(stage => {
            container.appendChild(createStageCard(stage));
        });
    }

    function initMenuToggle() {
        const toggle = document.querySelector('.menu-toggle');
        const nav = document.querySelector('.main-nav');
        if (!toggle || !nav) return;

        toggle.addEventListener('click', () => {
            nav.classList.toggle('is-open');
        });
    }

    function initLogin() {
        const overlay = document.getElementById('loginOverlay');
        const appContent = document.getElementById('appContent');
        const form = document.getElementById('loginForm');
        const usernameInput = document.getElementById('loginUsername');
        const passwordInput = document.getElementById('loginPassword');
        const errorEl = document.getElementById('loginError');

        if (!overlay || !appContent || !form || !usernameInput || !passwordInput) {
            return;
        }

        form.addEventListener('submit', function (event) {
            event.preventDefault();

            const enteredUser = usernameInput.value.trim();
            const enteredPass = passwordInput.value;

            if (enteredUser === LOGIN_USERNAME && enteredPass === LOGIN_PASSWORD) {
                if (errorEl) {
                    errorEl.hidden = true;
                }
                overlay.style.display = 'none';
                appContent.hidden = false;
            } else {
                if (errorEl) {
                    errorEl.hidden = false;
                }
            }
        });
    }

    renderBranding();
    renderHero();
    renderInventory();
    renderStages();
    initMenuToggle();
    initLogin();
})();
