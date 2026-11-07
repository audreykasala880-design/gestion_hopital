/**
 * ====================================================================
 * SCRIPT JAVASCRIPT PRINCIPAL : Centre Médical Hope v2.0
 * ====================================================================
 * Fonctionnalités :
 * - Gestion fluide du menu responsive mobile (burger)
 * - Effet 3D dynamique et interactif au survol des cartes
 * - Boîtes de dialogue de confirmation d'action destructive
 * - Calcul dynamique en direct de l'heure de fin des rendez-vous
 * - Auto-dismiss optionnel pour les messages flash
 */

document.addEventListener('DOMContentLoaded', function () {
    // ----------------------------------------------------------------
    // 1. MENU MOBILE RESPONSIVE / SIDEBAR DASHBOARD
    // ----------------------------------------------------------------
    const topbarMenuToggle = document.getElementById('topbarMenuToggle');
    const appSidebar = document.getElementById('appSidebar');
    const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');
    const sidebarBackdrop = document.getElementById('sidebarBackdrop');

    function openSidebar() {
        if (appSidebar) appSidebar.classList.add('open');
        if (sidebarBackdrop) sidebarBackdrop.classList.add('active');
        document.body.style.overflow = window.innerWidth <= 1024 ? 'hidden' : '';
    }

    function closeSidebar() {
        if (appSidebar) appSidebar.classList.remove('open');
        if (sidebarBackdrop) sidebarBackdrop.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (topbarMenuToggle) {
        topbarMenuToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            if (appSidebar && appSidebar.classList.contains('open')) {
                closeSidebar();
            } else {
                openSidebar();
            }
        });
    }

    if (sidebarCloseBtn) {
        sidebarCloseBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            closeSidebar();
        });
    }

    if (sidebarBackdrop) {
        sidebarBackdrop.addEventListener('click', closeSidebar);
    }

    // Fermer la sidebar sur mobile si clic en dehors
    document.addEventListener('click', function (e) {
        if (window.innerWidth <= 1024 && appSidebar && appSidebar.classList.contains('open')) {
            if (!appSidebar.contains(e.target) && (!topbarMenuToggle || !topbarMenuToggle.contains(e.target))) {
                closeSidebar();
            }
        }
    });

    // Support rétrocompatible pour navToggle / navMenu si existant
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            const isOpen = navMenu.classList.toggle('open');
            navMenu.classList.toggle('active', isOpen);
            navToggle.classList.toggle('open', isOpen);
            navToggle.setAttribute('aria-expanded', isOpen);
        });

        document.addEventListener('click', function (e) {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                navMenu.classList.remove('open', 'active');
                navToggle.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // ----------------------------------------------------------------
    // 2. EFFET 3D INTERACTIF SUR LES CARTES (.card-3d)
    // ----------------------------------------------------------------
    const cards3d = document.querySelectorAll('.card-3d');
    cards3d.forEach(card => {
        card.addEventListener('mousemove', function (e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -6; // max 6 deg
            const rotateY = ((x - centerX) / centerX) * 6;
            
            card.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-3px)`;
        });

        card.addEventListener('mouseleave', function () {
            card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)';
        });
    });

    // ----------------------------------------------------------------
    // 3. CONFIRMATION DES ACTIONS DE DESTRUCTION / SUPPRESSION
    // ----------------------------------------------------------------
    const deleteButtons = document.querySelectorAll('.btn-confirm-delete');
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', function (e) {
            const message = btn.getAttribute('data-confirm') || "Êtes-vous certain de vouloir effectuer cette suppression ? Cette action est irréversible.";
            if (!confirm(message)) {
                e.preventDefault();
            }
        });
    });

    // ----------------------------------------------------------------
    // 4. CALCUL AUTOMATIQUE DE L'HEURE DE FIN ESTIMÉE (RDV)
    // ----------------------------------------------------------------
    const inputDateHeure = document.getElementById('date_heure');
    const selectDuree = document.getElementById('duree_minutes');
    const displayFin = document.getElementById('apercu_heure_fin');

    function actualiserApercuFin() {
        if (!inputDateHeure || !selectDuree || !displayFin) return;
        const valDate = inputDateHeure.value;
        const duree = parseInt(selectDuree.value, 10);

        if (valDate && !isNaN(duree)) {
            const dateObj = new Date(valDate);
            if (!isNaN(dateObj.getTime())) {
                dateObj.setMinutes(dateObj.getMinutes() + duree);
                const heures = String(dateObj.getHours()).padStart(2, '0');
                const minutes = String(dateObj.getMinutes()).padStart(2, '0');
                displayFin.textContent = `⏰ Fin estimée : ${heures}h${minutes}`;
                displayFin.style.display = 'inline-block';
                return;
            }
        }
        displayFin.style.display = 'none';
    }

    // Export global pour être appelé par les boutons de suggestions
    window.actualiserApercuFin = actualiserApercuFin;

    if (inputDateHeure && selectDuree) {
        inputDateHeure.addEventListener('input', actualiserApercuFin);
        inputDateHeure.addEventListener('change', actualiserApercuFin);
        selectDuree.addEventListener('change', actualiserApercuFin);
        actualiserApercuFin();
    }

    // ----------------------------------------------------------------
    // 5. CARROUSEL HERO DE SENSIBILISATION (Ébola, Cancer, Paludisme, etc.)
    // ----------------------------------------------------------------
    const carouselWrapper = document.getElementById('awarenessCarousel');
    const carouselTrack = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('carouselPrevBtn');
    const nextBtn = document.getElementById('carouselNextBtn');
    const dots = document.querySelectorAll('.carousel-dot');
    const progressFill = document.getElementById('carouselProgressFill');

    if (carouselWrapper && carouselTrack) {
        const slides = carouselTrack.querySelectorAll('.awareness-slide');
        const totalSlides = slides.length;
        let currentIndex = 0;
        let autoplayTimer = null;
        const slideDuration = 6500; // 6.5 secondes par diapositive

        function updateCarousel(index) {
            if (index < 0) {
                currentIndex = totalSlides - 1;
            } else if (index >= totalSlides) {
                currentIndex = 0;
            } else {
                currentIndex = index;
            }

            carouselTrack.style.transform = `translateX(-${currentIndex * 100}%)`;

            // Mettre à jour les indicateurs
            dots.forEach((dot, idx) => {
                dot.classList.toggle('active', idx === currentIndex);
            });

            // Réinitialiser la barre de progression
            startProgress();
        }

        function startProgress() {
            if (!progressFill) return;
            progressFill.style.transition = 'none';
            progressFill.style.width = '0%';

            setTimeout(() => {
                progressFill.style.transition = `width ${slideDuration}ms linear`;
                progressFill.style.width = '100%';
            }, 50);
        }

        function startAutoplay() {
            stopAutoplay();
            startProgress();
            autoplayTimer = setInterval(() => {
                updateCarousel(currentIndex + 1);
            }, slideDuration);
        }

        function stopAutoplay() {
            if (autoplayTimer) {
                clearInterval(autoplayTimer);
                autoplayTimer = null;
            }
            if (progressFill) {
                progressFill.style.transition = 'none';
                progressFill.style.width = '0%';
            }
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                updateCarousel(currentIndex + 1);
                startAutoplay();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                updateCarousel(currentIndex - 1);
                startAutoplay();
            });
        }

        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                const targetIndex = parseInt(dot.getAttribute('data-slide-index'), 10);
                if (!isNaN(targetIndex)) {
                    updateCarousel(targetIndex);
                    startAutoplay();
                }
            });
        });

        // Pause au survol de la souris
        carouselWrapper.addEventListener('mouseenter', stopAutoplay);
        carouselWrapper.addEventListener('mouseleave', startAutoplay);

        // Support Swipe tactile pour smartphones et tablettes
        let touchStartX = 0;
        let touchEndX = 0;

        carouselWrapper.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoplay();
        }, { passive: true });

        carouselWrapper.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diffX = touchStartX - touchEndX;
            if (Math.abs(diffX) > 40) {
                if (diffX > 0) {
                    updateCarousel(currentIndex + 1);
                } else {
                    updateCarousel(currentIndex - 1);
                }
            }
            startAutoplay();
        }, { passive: true });

        // Lancement initial
        updateCarousel(0);
        startAutoplay();
    }

    // ----------------------------------------------------------------
    // 6. MODE DÉMONSTRATION STATIQUE (aucun serveur, compte ou stockage)
    // ----------------------------------------------------------------
    const demoState = { appointments: [], actions: [] };
    window.demoState = demoState;

    let demoToastTimer;
    function showDemoNotice(message) {
        let toast = document.getElementById('demoNotice');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'demoNotice';
            toast.setAttribute('role', 'status');
            toast.setAttribute('aria-live', 'polite');
            toast.style.cssText = 'position:fixed;right:20px;bottom:20px;z-index:9999;max-width:min(420px,calc(100vw - 40px));padding:14px 18px;border-radius:12px;background:#095c3b;color:#fff;box-shadow:0 12px 32px rgba(0,0,0,.2);font:500 14px/1.5 Inter,Arial,sans-serif;';
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.hidden = false;
        clearTimeout(demoToastTimer);
        demoToastTimer = setTimeout(() => { toast.hidden = true; }, 5000);
    }

    function filterDemoResults(form) {
        const terms = Array.from(form.querySelectorAll('input:not([type="hidden"]), select, textarea'))
            .map(field => (field.value || '').trim().toLocaleLowerCase())
            .filter(Boolean);
        const rows = Array.from(document.querySelectorAll('.table tbody tr'))
            .filter(row => !row.classList.contains('table-empty'));
        const cards = rows.length ? [] : Array.from(document.querySelectorAll('.card-3d'));
        const candidates = rows.length ? rows : cards;

        if (!candidates.length || !terms.length) {
            candidates.forEach(item => { item.hidden = false; });
            showDemoNotice(terms.length ? 'Aucun résultat à filtrer sur cette page.' : 'Filtres réinitialisés. Aucune donnée n’est sauvegardée.');
            return;
        }

        let visible = 0;
        candidates.forEach(item => {
            const text = item.textContent.toLocaleLowerCase();
            const matches = terms.every(term => text.includes(term));
            item.hidden = !matches;
            if (matches) visible++;
        });
        showDemoNotice(`${visible} résultat${visible > 1 ? 's' : ''} affiché${visible > 1 ? 's' : ''} — filtre temporaire, non sauvegardé.`);
    }

    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', event => {
            event.preventDefault();

            const hasPassword = form.querySelector('input[type="password"]');
            const hasConfirmation = form.querySelector('input[name="confirmation"]');
            if (form.id === 'loginForm' || (hasPassword && !hasConfirmation)) {
                showDemoNotice('La connexion est désactivée en mode statique : aucun compte ni mot de passe n’est vérifié.');
                return;
            }

            if (hasConfirmation) {
                showDemoNotice('Inscription simulée uniquement. Aucun compte n’est créé ni conservé.');
                return;
            }

            const data = new FormData(form);
            const values = Object.fromEntries(data.entries());
            const passwordFields = form.querySelectorAll('input[type="password"]');
            passwordFields.forEach(field => { delete values[field.name]; });

            if (Object.prototype.hasOwnProperty.call(values, 'date_heure')) {
                const appointment = {
                    date_heure: values.date_heure,
                    duree_minutes: values.duree_minutes,
                    motif: values.motif,
                    medecin: values.id_medecin,
                    salle: values.id_salle
                };
                demoState.appointments.push(appointment);
                showDemoNotice('Rendez-vous simulé pour cette session seulement. Il ne sera pas conservé après rechargement.');
                return;
            }

            if (form.method.toUpperCase() === 'GET') {
                filterDemoResults(form);
                return;
            }

            demoState.actions.push({ page: location.pathname, at: Date.now() });
            showDemoNotice('Action simulée. Aucune donnée n’a été envoyée ni enregistrée.');
        });
    });

    document.addEventListener('click', event => {
        const actionLink = event.target.closest('[data-demo-action]');
        if (!actionLink) return;

        // The existing delete confirmation listener runs first. If it canceled
        // the click, leave the page and the demo state untouched.
        if (event.defaultPrevented) return;
        event.preventDefault();

        const action = actionLink.dataset.demoAction;
        if (action === 'logout') {
            showDemoNotice('Aucune session réelle n’est ouverte en mode démonstration.');
            return;
        }

        if (action === 'status') {
            const status = actionLink.dataset.demoStatus || 'confirme';
            const row = actionLink.closest('tr');
            const badge = row && row.querySelector('.status-pill, .badge');
            if (badge) badge.textContent = status === 'termine' ? 'Terminé' : status === 'annule' ? 'Annulé' : 'Confirmé';
            demoState.actions.push({ action, status, at: Date.now() });
            showDemoNotice('Statut modifié uniquement dans cette démonstration. Le changement sera perdu au rechargement.');
            return;
        }

        if (action === 'delete') {
            if (!actionLink.classList.contains('btn-confirm-delete')) {
                const message = actionLink.dataset.confirm || 'Retirer cet élément de la vue de démonstration ?';
                if (!window.confirm(message)) return;
            }
            const item = actionLink.closest('tr, .card-3d');
            if (item) item.remove();
            demoState.actions.push({ action, at: Date.now() });
            showDemoNotice('Élément retiré de cette vue seulement. Les données de démonstration seront réinitialisées au rechargement.');
            return;
        }

        if (action === 'tests') {
            showDemoNotice('Les tests SQL d’origine ne s’exécutent plus dans cette version statique.');
        }
    });
});
