// script principal pour le portfolio
// gère les anims et la navigation

document.addEventListener('DOMContentLoaded', () => {

    // --- MATRIX LOADING ---
    const loader = document.getElementById('loading-screen');
    const canvas = document.getElementById('matrix-canvas');
    const ctx = canvas.getContext('2d');

    // full screen canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // charactères pour la pluie (katakana + latin)
    const chars = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const fontSize = 16;
    const cols = canvas.width / fontSize;

    // positions des gouttes
    const drops = Array(Math.floor(cols)).fill(1);

    const drawMatrix = () => {
        // petit fade out pour l'effet de traînée
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = fontSize + 'px monospace';

        drops.forEach((y, i) => {
            const text = chars.charAt(Math.floor(Math.random() * chars.length));

            // random colors (bleu foncé ou clair)
            ctx.fillStyle = Math.random() > 0.95 ? '#0f172a' : '#38bdf8';
            ctx.fillText(text, i * fontSize, y * fontSize);

            // reset random en haut
            if (y * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        });
    };

    // lance l'anim (15ms)
    const interval = setInterval(drawMatrix, 15);

    // stop loading après 2s
    setTimeout(() => {
        loader.classList.add('fade-out');

        // lance les anims d'entrée (fly-in)
        document.body.classList.remove('loading');
        document.body.classList.add('loaded');

        clearInterval(interval); // stop pour perf

        setTimeout(() => loader.style.display = 'none', 800);
    }, 2000);

    // resize canvas si besoin
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });


    // --- SKILLS DATA ---
    const skills = {
        c1: {
            title: "C1 - REALIZE",
            level: "Level 3: Adapt",
            icon: '<i class="fa-solid fa-code"></i>',
            desc: "Develop complex IT apps, choosing data structures & patterns.",
            proof: `<div class="proof-content"><p><strong>Projects:</strong> Password Manager & Questionary.</p><p>Built secure Web App with <strong>Python/Flask</strong>. Handled Frontend with <strong>Vue.js</strong>.</p></div>`
        },
        c2: {
            title: "C2 - OPTIMIZE",
            level: "Level 2: Apply",
            icon: '<i class="fa-solid fa-microchip"></i>',
            desc: "Analyze and optimize apps for perf.",
            proof: `<div class="proof-content"><p><strong>Projects:</strong> Game of Life & Latice.</p><p>Optimized <em>Game of Life</em> (Lua) grid rendering. Optimized JavaFX Drag & Drop for <em>Latice</em>.</p></div>`
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


    // --- NAVIGATION (TABS) ---
    const navBtns = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.page-section');
    const seeProjectsBtn = document.getElementById('btn-see-projects');
    const contentArea = document.querySelector('.content-area');

    function switchTab(id) {
        // update buttons
        navBtns.forEach(btn => {
            btn.classList.remove('active');
            if (id === 'skill-detail-view' && btn.dataset.target === 'skills') btn.classList.add('active');
            else if (btn.dataset.target === id) btn.classList.add('active');
        });

        // show section
        sections.forEach(sec => {
            sec.classList.remove('active');
            if (sec.id === id) sec.classList.add('active');
        });

        // scroll top
        if (contentArea) contentArea.scrollTop = 0;
    }

    navBtns.forEach(btn => btn.addEventListener('click', () => switchTab(btn.dataset.target)));

    if (seeProjectsBtn) {
        seeProjectsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            switchTab('projects');
        });
    }


    // --- SKILL DETAIL VIEW ---
    const skillCards = document.querySelectorAll('.comp-card');
    const backBtn = document.getElementById('back-to-skills');

    // elements du detail
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


    // --- THEME TOGGLE ---
    const themeBtn = document.getElementById('theme-toggle');
    const themeIcon = themeBtn ? themeBtn.querySelector('i') : null;
    const body = document.body;

    // default light
    body.classList.add('light-mode');
    if (themeIcon) themeIcon.classList.replace('fa-moon', 'fa-moon');

    if (themeBtn && themeIcon) {
        // check saved theme
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


    // --- PROJECT FILTERS ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const cat = card.getAttribute('data-category');
                if (filter === 'all' || filter === cat) {
                    card.classList.remove('hide');
                    card.classList.add('show');
                } else {
                    card.classList.add('hide');
                    card.classList.remove('show');
                }
            });
        });
    });


    // --- EXPANDABLE CARDS ---
    const expandCards = document.querySelectorAll('.expandable-card');

    expandCards.forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('a')) return; // ignore links

            // close others
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

            // toggle current
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


    // --- VISUAL EFFECTS ---

    // Parallax orbs
    document.addEventListener('mousemove', (e) => {
        document.querySelectorAll('.bg-orb').forEach((orb, i) => {
            const speed = (i + 1) * 20;
            orb.style.transform = `translate(${(window.innerWidth / 2 - e.clientX) / speed}px, ${(window.innerHeight / 2 - e.clientY) / speed}px)`;
        });
    });

    // 3D Tilt
    const tiltCards = [...document.querySelectorAll('.comp-card'), ...document.querySelectorAll('.project-card')];
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            if (card.classList.contains('expanded')) return;
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const cx = rect.width / 2;
            const cy = rect.height / 2;

            // rotate max 10deg
            card.style.transform = `perspective(1000px) rotateX(${((y - cy) / cy) * -10}deg) rotateY(${((x - cx) / cx) * 10}deg) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            if (!card.classList.contains('expanded')) card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });

    // Typing effect
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

    // Custom Cursor
    const cursor = document.getElementById('custom-cursor');
    document.addEventListener('mousemove', e => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
    });

    // Cursor states
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