// script principal pour le portfolio
// gère les anims et la navigation

document.addEventListener('DOMContentLoaded', () => {

    // --- LE NOUVEAU ECRAN DE CHARGEMENT QUI CLAQUE ---
    const loader = document.getElementById('loading-screen');
    const loaderBar = document.querySelector('.loader-bar');
    const loaderText = document.getElementById('loader-text');
    const loaderPercentage = document.getElementById('loader-percentage');

    const statuses = ["INITIALIZING", "LOADING ASSETS", "CONNECTING...", "CONFIGURING", "READY"];
    let progress = 0;
    let statusIndex = 0;

    const updateLoader = () => {
        progress += Math.random() * 2; // On avance un peu au pif
        if (progress > 100) progress = 100;

        // On met a jour l'interface
        loaderBar.style.width = `${progress}%`;
        loaderPercentage.innerText = `${Math.floor(progress)}%`;

        // On change le texte selon ou on en est
        if (progress < 30) statusIndex = 0;
        else if (progress < 50) statusIndex = 1;
        else if (progress < 70) statusIndex = 2;
        else if (progress < 90) statusIndex = 3;
        else statusIndex = 4;

        loaderText.innerText = statuses[statusIndex];

        if (progress < 100) {
            requestAnimationFrame(updateLoader);
        } else {
            // C'est fini, on lance la machine
            setTimeout(() => {
                loader.classList.add('fade-out');
                document.body.classList.remove('loading');
                document.body.classList.add('loaded');
                setTimeout(() => loader.style.display = 'none', 800);
            }, 500);
        }
    };

    // ca commence
    requestAnimationFrame(updateLoader);


    // --- LES COMPETENCES DU CHEF ---
    const skills = {
        c1: {
            title: "C1 - REALIZE",
            level: "Level 3: Adapt",
            icon: '<i class="fa-solid fa-code"></i>',
            desc: "Develop complex IT apps, choosing data structures & patterns.",
            proof: `<div class="proof-content"><p><strong>Projects:</strong> M-Play, Password Manager & Questionary.</p><p>Built Desktop App with <strong>Electron/Node.js</strong>. Built secure Web App with <strong>Python/Flask</strong>.</p></div>`
        },
        c2: {
            title: "C2 - OPTIMIZE",
            level: "Level 2: Apply",
            icon: '<i class="fa-solid fa-microchip"></i>',
            desc: "Analyze and optimize apps for perf.",
            proof: `<div class="proof-content"><p><strong>Projects:</strong> M-Play, Game of Life & Latice.</p><p>Optimized <em>M-Play</em> streaming engine (FFmpeg). Optimized <em>Game of Life</em> (Lua) grid rendering.</p></div>`
        },
        c3: {
            title: "C3 - ADMINISTER",
            level: "Level 3: Adapt",
            icon: '<i class="fa-brands fa-linux"></i>',
            desc: "Install, config & secure OS/networks.",
            proof: `<div class="proof-content"><p><strong>Project:</strong> Virtual Network.</p><p>Simulated network with <strong>2000+ machines</strong>. Configured <strong>DHCP/DNS</strong> & routing.</p></div>`
        },
        c4: {
            title: "C4 - MANAGE",
            level: "Level 2: Apply",
            icon: '<i class="fa-solid fa-database"></i>',
            desc: "Design & manage corporate data.",
            proof: `<div class="proof-content"><p><strong>Projects:</strong> Cooking Site & Questionary.</p><p>Designed <strong>MySQL</strong> DB for recipes/users. Wrote complex SQL queries.</p></div>`
        },
        c5: {
            title: "C5 - LEAD",
            level: "Level 2: Apply",
            icon: '<i class="fa-solid fa-users-gear"></i>',
            desc: "Satisfy user needs in project.",
            proof: `<div class="proof-content"><p><strong>Project:</strong> Latice (Java Board Game).</p><p>Led team of <strong>4 devs</strong>. Managed Git & code reviews.</p></div>`
        },
        c6: {
            title: "C6 - SECURE",
            level: "Level 2: Apply",
            icon: '<i class="fa-solid fa-shield-virus"></i>',
            desc: "Protect data/apps from attacks.",
            proof: `<div class="proof-content"><p><strong>Projects:</strong> Hashing Algo & Password Manager.</p><p>Implemented custom <em>Hashing Algo</em> in Java. Applied to secure credentials.</p></div>`
        }
    };


    // --- LA NAVIGATION (LES ONGLETS) ---
    const navBtns = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.page-section');
    const seeProjectsBtn = document.getElementById('btn-see-projects');
    const contentArea = document.querySelector('.content-area');

    function switchTab(id) {
        // on change les boutons
        navBtns.forEach(btn => {
            btn.classList.remove('active');
            if (id === 'skill-detail-view' && btn.dataset.target === 'skills') btn.classList.add('active');
            else if (btn.dataset.target === id) btn.classList.add('active');
        });

        // on affiche la section
        sections.forEach(sec => {
            sec.classList.remove('active');
            if (sec.id === id) sec.classList.add('active');
        });

        // retour en haut
        if (contentArea) contentArea.scrollTop = 0;
    }

    navBtns.forEach(btn => btn.addEventListener('click', () => switchTab(btn.dataset.target)));

    if (seeProjectsBtn) {
        seeProjectsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            switchTab('projects');
        });
    }


    // --- LE DETAIL DES SKILLS ---
    const skillCards = document.querySelectorAll('.comp-card');
    const backBtn = document.getElementById('back-to-skills');

    // on chope les elements
    const dIcon = document.getElementById('detail-icon');
    const dTitle = document.getElementById('detail-title');
    const dLevel = document.getElementById('detail-level');
    const dDesc = document.getElementById('detail-desc');
    const dProof = document.getElementById('detail-proof');

    skillCards.forEach(card => {
        card.addEventListener('click', () => {
            const data = skills[card.dataset.skill];
            if (data) {
                dIcon.innerHTML = data.icon;
                dTitle.innerText = data.title;
                dLevel.innerText = data.level;
                dDesc.innerText = data.desc;
                dProof.innerHTML = data.proof;
                switchTab('skill-detail-view');
            }
        });
    });

    if (backBtn) backBtn.addEventListener('click', () => switchTab('skills'));


    // --- LE BOUTON DARK MODE ---
    const themeBtn = document.getElementById('theme-toggle');
    const themeIcon = themeBtn ? themeBtn.querySelector('i') : null;
    const body = document.body;

    // mode clair par defaut (mal aux yeu
    body.classList.add('light-mode');
    if (themeIcon) themeIcon.classList.replace('fa-moon', 'fa-moon');

    if (themeBtn && themeIcon) {
        // on regarde si le gars a deja choisi
        if (localStorage.getItem('selected-theme') === 'dark') {
            body.classList.remove('light-mode');
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        }

        themeBtn.addEventListener('click', () => {
            body.classList.toggle('light-mode');
            const isLight = body.classList.contains('light-mode');
            themeIcon.classList.replace(isLight ? 'fa-sun' : 'fa-moon', isLight ? 'fa-moon' : 'fa-sun');
            localStorage.setItem('selected-theme', isLight ? 'light' : 'dark');
        });
    }

    console.log("%c SYSTEM ONLINE ", "background: #5b7cfa; color: white; padding: 5px; border-radius: 3px;");
    console.log("Welcome to Milan's portfolio.");


    // --- LES PROJETS & SEE MORE ---
    const projectCards = document.querySelectorAll('.project-card');
    const showMoreBtn = document.getElementById('btn-show-more');
    const showMoreContainer = document.querySelector('.show-more-container');

    // Etat actuel
    let showAll = false;

    // Fonction pour mettre a jour l'affichage
    const updateProjectsVisibility = () => {
        projectCards.forEach(card => {
            const isFeatured = card.getAttribute('data-featured') === 'true';

            if (showAll || isFeatured) {
                card.classList.remove('hide');
                card.classList.add('show');
            } else {
                card.classList.add('hide');
                card.classList.remove('show');
            }
        });

        // Gestion du bouton "Show More"
        // Il ne doit apparaitre que si on n'a pas encore tout montré
        if (!showAll) {
            showMoreContainer.style.display = 'block';
        } else {
            showMoreContainer.style.display = 'none';
        }
    };

    if (showMoreBtn) {
        showMoreBtn.addEventListener('click', () => {
            showAll = true;
            updateProjectsVisibility();
        });
    }

    // Init
    updateProjectsVisibility();


    // --- LES CARTES QUI S'OUVRENT ---
    const expandCards = document.querySelectorAll('.expandable-card');

    expandCards.forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('a')) return; // on s'en fout des liens

            // on ferme les autres
            expandCards.forEach(c => {
                if (c !== card) {
                    c.classList.remove('expanded');
                    const img = c.querySelector('.project-image-expanded');
                    const full = c.querySelector('.card-description-full');
                    const short = c.querySelector('.card-description');
                    if (img) img.style.display = 'none';
                    if (full) full.style.display = 'none';
                    if (short) short.style.display = 'block';
                }
            });

            // on ouvre/ferme celle la
            card.classList.toggle('expanded');
            const img = card.querySelector('.project-image-expanded');
            const full = card.querySelector('.card-description-full');
            const short = card.querySelector('.card-description');
            const isExp = card.classList.contains('expanded');

            if (isExp) {
                if (img && img.querySelector('img')) img.style.display = 'block';
                if (full) full.style.display = 'block';
                if (short) short.style.display = 'none';
                setTimeout(() => card.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
            } else {
                if (img) img.style.display = 'none';
                if (full) full.style.display = 'none';
                if (short) short.style.display = 'block';
            }
        });
    });


    // --- LES EFFETS VISUELS QUI CLAQUENT ---

    // Les boules qui bougent
    document.addEventListener('mousemove', (e) => {
        document.querySelectorAll('.bg-orb').forEach((orb, i) => {
            const speed = (i + 1) * 20;
            orb.style.transform = `translate(${(window.innerWidth / 2 - e.clientX) / speed}px, ${(window.innerHeight / 2 - e.clientY) / speed}px)`;
        });
    });

    // L'effet 3D stylé
    const tiltCards = [...document.querySelectorAll('.comp-card'), ...document.querySelectorAll('.project-card')];
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            if (card.classList.contains('expanded')) return;
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const cx = rect.width / 2;
            const cy = rect.height / 2;

            // on tourne pas trop non plus
            card.style.transform = `perspective(1000px) rotateX(${((y - cy) / cy) * -10}deg) rotateY(${((x - cx) / cx) * 10}deg) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            if (!card.classList.contains('expanded')) card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });

    // L'effet machine a ecrire
    const greeting = document.querySelector('.greeting');
    if (greeting) {
        const text = greeting.textContent;
        greeting.textContent = '';
        let i = 0;
        const type = () => {
            if (i < text.length) {
                greeting.textContent += text.charAt(i++);
                setTimeout(type, 50);
            }
        };
        setTimeout(type, 500);
    }

    // Le curseur custom
    const cursor = document.getElementById('custom-cursor');
    document.addEventListener('mousemove', e => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
    });

    // Les etats du curseur
    document.querySelectorAll('.comp-card').forEach(c => {
        c.addEventListener('mouseenter', () => cursor.classList.add('cursor-view'));
        c.addEventListener('mouseleave', () => cursor.classList.remove('cursor-view'));
    });

    document.querySelectorAll('a[target="_blank"]').forEach(l => {
        l.addEventListener('mouseenter', () => cursor.classList.add('cursor-link'));
        l.addEventListener('mouseleave', () => cursor.classList.remove('cursor-link'));
    });

    document.querySelectorAll('button, .nav-btn, a:not([target="_blank"])').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
    });
});