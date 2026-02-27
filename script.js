// script principal pour le portfolio
// gère les anims et la navigation

document.addEventListener('DOMContentLoaded', () => {

    // --- LE NOUVEAU ECRAN DE CHARGEMENT QUI CLAQUE ---
    const loader = document.getElementById('loading-screen');
    const loaderBar = document.querySelector('.loader-bar');
    const loaderText = document.getElementById('loader-text');
    const loaderPercentage = document.getElementById('loader-percentage');

    const statuses = ["INITIALISATION", "CHARGEMENT DES RESSOURCES", "CONNEXION...", "CONFIGURATION", "PRÊT"];
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
            title: "C1 - RÉALISER",
            level: "Niveau 3 : Adapter",
            icon: '<i class="fa-solid fa-code"></i>',
            desc: "Développer des applications informatiques complexes, choisir les structures de données et de conception.",
            proof: `<div class="proof-content"><p><strong>Projets :</strong> M-Play, Gestionnaire de Mots de Passe & Questionary.</p><p>Développement Desktop avec <strong>Electron/Node.js</strong>. Développement Web sécurisé avec <strong>Python/Flask</strong>.</p></div>`
        },
        c2: {
            title: "C2 - OPTIMISER",
            level: "Niveau 2 : Appliquer",
            icon: '<i class="fa-solid fa-microchip"></i>',
            desc: "Analyser et optimiser les applications pour la performance.",
            proof: `<div class="proof-content"><p><strong>Projets :</strong> M-Play, Jeu de la Vie & Latice.</p><p>Optimisation du moteur de streaming <em>M-Play</em> (FFmpeg). Optimisation du rendu de grille du <em>Jeu de la Vie</em> (Lua).</p></div>`
        },
        c3: {
            title: "C3 - ADMINISTRER",
            level: "Niveau 3 : Adapter",
            icon: '<i class="fa-brands fa-linux"></i>',
            desc: "Installer, configurer & sécuriser les OS et le réseau.",
            proof: `<div class="proof-content"><p><strong>Projet :</strong> Réseau Virtuel.</p><p>Simulation réseau de <strong>2000+ machines</strong>. Configuration <strong>DHCP/DNS</strong> & architecture de routage.</p></div>`
        },
        c4: {
            title: "C4 - GÉRER",
            level: "Niveau 2 : Appliquer",
            icon: '<i class="fa-solid fa-database"></i>',
            desc: "Concevoir et gérer les données de l'entreprise.",
            proof: `<div class="proof-content"><p><strong>Projets :</strong> Site de Cuisine & Questionary.</p><p>Conception de BDD <strong>MySQL</strong> pour des recettes/utilisateurs. Écriture de requêtes SQL complexes.</p></div>`
        },
        c5: {
            title: "C5 - CONDUIRE",
            level: "Niveau 2 : Appliquer",
            icon: '<i class="fa-solid fa-users-gear"></i>',
            desc: "Satisfaire les besoins des utilisateurs au sein d'un projet.",
            proof: `<div class="proof-content"><p><strong>Projet :</strong> Latice (Jeu de plateau Java).</p><p>Direction d'une équipe de <strong>4 développeurs</strong>. Gestion des flux de travail Git et des revues de code.</p></div>`
        },
        c6: {
            title: "C6 - SÉCURISER",
            level: "Niveau 2 : Appliquer",
            icon: '<i class="fa-solid fa-shield-virus"></i>',
            desc: "Protéger les données et les applications contre les attaques.",
            proof: `<div class="proof-content"><p><strong>Projets :</strong> Algorithme de Hachage & Gest. Mots de Passe.</p><p>Création d'un <em>Algorithme de Hachage</em> personnalisé en Java. Application pour sécuriser des identifiants (AES-256).</p></div>`
        }
    };


    // --- LA NAVIGATION CARTE 2D (EXPLORATEUR) ---
    const mapViewport = document.getElementById('map-viewport');
    const mapContent = document.getElementById('map-content');
    const sections = Array.from(document.querySelectorAll('.map-section'));
    const navBtns = document.querySelectorAll('.nav-link-btn');
    
    // Minimap elements
    const minimapNodes = Array.from(document.querySelectorAll('.minimap-node'));
    const minimapViewport = document.getElementById('minimap-viewport');

    // Etat de la carte
    let mapState = {
        x: 0,
        y: 0,
        targetX: 0,
        targetY: 0,
        scale: 1,
        targetScale: 1,
        isDragging: false,
        startX: 0,
        startY: 0,
        activeNode: 'home'
    };

    // Configuration de la minimap (Echelle par rapport à la vraie carte)
    const mapBounds = 4000; // Taille virtuelle totale
    const minimapScale = 100 / mapBounds; // % par pixel

    // Mettre en place les sections à leurs coordonnées exactes
    sections.forEach(sec => {
        const x = parseFloat(sec.getAttribute('data-x'));
        const y = parseFloat(sec.getAttribute('data-y'));
        sec.style.left = `calc(50% + ${x}px)`;
        sec.style.top = `calc(50% + ${y}px)`;
    });

    // Dessiner les lignes de connexion SVG
    const svgLines = document.getElementById('connection-lines');
    const drawConnections = () => {
        if (!svgLines) return;
        let svgHTML = '';
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        // Ordre de connexion logique
        const order = ['home', 'skills', 'timeline', 'projects'];
        for (let i = 0; i < order.length - 1; i++) {
            const startSec = document.getElementById(order[i]);
            const endSec = document.getElementById(order[i+1]);
            if (startSec && endSec) {
                const startX = centerX + parseFloat(startSec.getAttribute('data-x'));
                const startY = centerY + parseFloat(startSec.getAttribute('data-y'));
                const endX = centerX + parseFloat(endSec.getAttribute('data-x'));
                const endY = centerY + parseFloat(endSec.getAttribute('data-y'));
                
                // Dessiner une courbe de Bézier douce
                const cp1X = startX + (endX - startX) / 2;
                const cp1Y = startY;
                const cp2X = startX + (endX - startX) / 2;
                const cp2Y = endY;
                
                svgHTML += `<path class="connection-path" id="path-${order[i]}-${order[i+1]}" d="M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}" />`;
            }
        }
        svgLines.innerHTML = svgHTML;
    };
    
    // Faut redessiner si on redimensionne l'ecran
    window.addEventListener('resize', drawConnections);
    drawConnections(); // Init

    // Moteur d'animation fluide (Lerp)
    const updateMap = () => {
        // Interpole la position pour la fluidité
        mapState.x += (mapState.targetX - mapState.x) * 0.1;
        mapState.y += (mapState.targetY - mapState.y) * 0.1;
        mapState.scale += (mapState.targetScale - mapState.scale) * 0.1;

        // Applique la transfo
        if (mapContent) {
            mapContent.style.transform = `translate(${mapState.x}px, ${mapState.y}px) scale(${mapState.scale})`;
        }
        
        // Applique au SVG assi pour que les lignes bougent avec la map
        if (svgLines) {
             svgLines.style.transform = `translate(${mapState.x}px, ${mapState.y}px) scale(${mapState.scale})`;
        }

        // --- Logique du Radar / Node le plus proche ---
        let closestDist = Infinity;
        let closestId = 'home';
        
        // Le centre de l'écran par rapport à la carte
        const viewCenterX = -mapState.x / mapState.scale;
        const viewCenterY = -mapState.y / mapState.scale;

        sections.forEach(sec => {
            const sx = parseFloat(sec.getAttribute('data-x'));
            const sy = parseFloat(sec.getAttribute('data-y'));
            const dist = Math.hypot(viewCenterX - sx, viewCenterY - sy);
            
            if (dist < closestDist) {
                closestDist = dist;
                closestId = sec.id;
            }

            // Gérer l'opacité (Fade-out si on s'éloigne)
            const maxVisibleDist = window.innerWidth * 1.5;
            const opacity = Math.max(0.1, 1 - (dist / maxVisibleDist));
            sec.style.opacity = sec.id === closestId && dist < 500 ? '1' : Math.min(opacity, 0.5).toString();
            
            if (sec.id === closestId && dist < 500) sec.classList.add('active-node');
            else sec.classList.remove('active-node');
        });

        // Mettre à jour la minimap
        if (minimapViewport) {
            // Position du viewport dans la mini map
            const mw = (window.innerWidth / mapBounds) * 100 / mapState.scale;
            const mh = (window.innerHeight / mapBounds) * 100 / mapState.scale;
            const mx = 50 + (viewCenterX * minimapScale);
            const my = 50 + (viewCenterY * minimapScale);
            
            minimapViewport.style.width = `${mw}%`;
            minimapViewport.style.height = `${mh}%`;
            minimapViewport.style.left = `${mx}%`;
            minimapViewport.style.top = `${my}%`;
        }

        // Mettre à jour l'état actif dans la nav et minimap
        if (mapState.activeNode !== closestId && closestDist < 800) {
            mapState.activeNode = closestId;
            
            // UI Update (We don't have navLinks anymore, just minimap)
            minimapNodes.forEach(n => n.classList.remove('active-radar'));
            const activeM = document.querySelector(`.minimap-node[data-target="${closestId}"]`);
            if (activeM) activeM.classList.add('active-radar');
            
            // Allumer la ligne SVG qui arrive à ce noeud
            document.querySelectorAll('.connection-path').forEach(p => p.classList.remove('active'));
            // Allume la ligne précédente et suivante si elles existent
            const prevPath = document.querySelector(`.connection-path[id$="-${closestId}"]`);
            const nextPath = document.querySelector(`.connection-path[id^="path-${closestId}-"]`);
            if (prevPath) prevPath.classList.add('active');
            if (nextPath) nextPath.classList.add('active');
        }

        requestAnimationFrame(updateMap);
    };

    updateMap(); // Start loop

    // --- INTERACTIONS SOURIS / TOUCH ---
    const goToNode = (id) => {
        const target = document.getElementById(id);
        if (target) {
            mapState.targetX = -parseFloat(target.getAttribute('data-x'));
            mapState.targetY = -parseFloat(target.getAttribute('data-y'));
            mapState.targetScale = 1; // reset zoom
        }
    };

    if (mapViewport) {
        mapViewport.addEventListener('mousedown', e => {
            if (e.target.closest('.map-section, .floating-nav, .minimap-container')) return;
            mapState.isDragging = true;
            mapState.startX = e.clientX - mapState.targetX;
            mapState.startY = e.clientY - mapState.targetY;
            
            // Appliquer l'effet 'drag' au custom cursor
            const cursor = document.getElementById('custom-cursor');
            if(cursor) cursor.classList.add('cursor-drag');
        });

        window.addEventListener('mousemove', e => {
            if (!mapState.isDragging) return;
            mapState.targetX = e.clientX - mapState.startX;
            mapState.targetY = e.clientY - mapState.startY;
        });

        window.addEventListener('mouseup', () => {
            mapState.isDragging = false;
            const cursor = document.getElementById('custom-cursor');
            if(cursor) cursor.classList.remove('cursor-drag');
        });

        // Zoom logic with mouse wheel
        mapViewport.addEventListener('wheel', e => {
            if (e.target.closest('.map-section, .floating-nav, .minimap-container')) return;
            e.preventDefault(); // On empeche le scroll natif de foirer
            
            // Zoom in / out
            const zoomAmount = e.deltaY * -0.001;
            let newScale = mapState.targetScale + zoomAmount;
            
            // Limites de zoom (0.3 mode radar, 1.5 zoom zoom)
            newScale = Math.min(Math.max(0.3, newScale), 1.5);
            mapState.targetScale = newScale;
        }, { passive: false });
    }

    // Nav clics depuis le hub d'accueil
    navBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            goToNode(btn.getAttribute('href').substring(1));
        });
    });


    // --- LE DETAIL DES SKILLS (Modale Glassmorphism) ---
    const skillCards = document.querySelectorAll('.comp-card');
    const skillModal = document.getElementById('skill-modal');
    const closeModalBtn = document.getElementById('close-modal');

    // on chope les elements
    const dIcon = document.getElementById('detail-icon');
    const dTitle = document.getElementById('detail-title');
    const dLevel = document.getElementById('detail-level');
    const dDesc = document.getElementById('detail-desc');
    const dProof = document.getElementById('detail-proof');

    const openModal = (data) => {
        dIcon.innerHTML = data.icon;
        dTitle.innerText = data.title;
        dLevel.innerText = data.level;
        dDesc.innerText = data.desc;
        dProof.innerHTML = data.proof;
        
        skillModal.classList.remove('hide-modal');
        document.body.style.overflow = 'hidden'; // empecher le scroll en arriere plan
    };

    const closeModal = () => {
        skillModal.classList.add('hide-modal');
        document.body.style.overflow = '';
    };

    skillCards.forEach(card => {
        card.addEventListener('click', () => {
            const data = skills[card.dataset.skill];
            if (data) openModal(data);
        });
    });

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (skillModal) skillModal.addEventListener('click', (e) => {
        if (e.target === skillModal) closeModal(); // clic à l'extérieur
    });


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
    const secondaryProjects = document.querySelectorAll('.secondary-project');
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

        secondaryProjects.forEach(proj => {
            proj.style.display = showAll ? 'flex' : 'none';
        });

        if (showMoreBtn) {
            showMoreBtn.innerText = showAll ? 'Voir Moins' : 'Voir Plus';
        }
        
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

    // Sauvegarde de la position de la souris et effet de spotlight
    window.mainMouseX = -1000;
    window.mainMouseY = -1000;
    document.addEventListener('mousemove', (e) => {
        window.mainMouseX = e.clientX;
        window.mainMouseY = e.clientY;
        
        // Effet "Spotlight" (lumière au survol) sur les cartes
        const allCards = document.querySelectorAll('.comp-card, .project-card, .timeline-content, .btn-primary, .nav-btn');
        allCards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // Le nouveau fond Cyber Réseau 3D (Warp Speed Particles)
    const canvas = document.getElementById('network-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        const focalLength = 400; // Profondeur de champ 3D
        
        function initCanvas() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            particles = [];
            // Densité de particules responsive
            const particleCount = window.innerWidth < 768 ? 60 : 150;
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: (Math.random() - 0.5) * 2000,
                    y: (Math.random() - 0.5) * 2000,
                    z: Math.random() * 2000,
                    size: Math.random() * 1.5 + 0.5
                });
            }
        }

        let lastCanvasScroll = 0; // Utilise sa propre variable pour le diff fluide

        function drawNetwork() {
            ctx.clearRect(0, 0, width, height);
            
            const mX = window.mainMouseX;
            const mY = window.mainMouseY;
            const isLight = document.body.classList.contains('light-mode');

            // Calcul de la vitesse de 'Warp' selon le déplacement de la carte 2D
            const speedX = mapState.targetX - mapState.x;
            const speedY = mapState.targetY - mapState.y;
            const mapSpeed = Math.hypot(speedX, speedY);
            
            // Vitesse de base (2) + accélération si on glisse la carte
            const speed = 1.5 + mapSpeed * 0.02;
            const direction = 1; // Toujours avancer

            particles.forEach((p, index) => {
                // Mouvement 3D
                p.z -= speed * direction;

                // Reset de la particule quand elle passe la caméra
                if (p.z < 1) {
                    p.z = 2000;
                    p.x = (Math.random() - 0.5) * 2000;
                    p.y = (Math.random() - 0.5) * 2000;
                } else if (p.z > 2000) {
                    p.z = 1;
                    p.x = (Math.random() - 0.5) * 2000;
                    p.y = (Math.random() - 0.5) * 2000;
                }

                // Projection 3D -> 2D
                const scale = focalLength / p.z;
                const screenX = (p.x * scale) + (width / 2);
                const screenY = (p.y * scale) + (height / 2);
                const currentSize = p.size * scale;

                // Ne dessine que si c'est visible sur le canvas
                if (screenX > -50 && screenX < width + 50 && screenY > -50 && screenY < height + 50) {
                    // Opacité basée sur la profondeur Z
                    const opacity = (1 - (p.z / 2000)) * 0.8;
                    
                    ctx.beginPath();
                    ctx.arc(screenX, screenY, currentSize, 0, Math.PI * 2);
                    ctx.fillStyle = isLight ? `rgba(56, 189, 248, ${opacity})` : `rgba(125, 211, 252, ${opacity})`;
                    ctx.fill();

                    // Lignes de connexion (Réseau neuronal)
                    for (let j = index + 1; j < particles.length; j++) {
                        const p2 = particles[j];
                        // Limiter les connexions aux particules proches sur l'axe Z
                        if (Math.abs(p.z - p2.z) < 200) {
                            const scale2 = focalLength / p2.z;
                            const screenX2 = (p2.x * scale2) + (width / 2);
                            const screenY2 = (p2.y * scale2) + (height / 2);
                            
                            const dist = Math.hypot(screenX - screenX2, screenY - screenY2);
                            // La distance tolérée dépend du scale (elles ont l'air proches en 2D mais loin en 3D)
                            const maxDist = 120 * scale; 
                            if (dist < maxDist) {
                                ctx.beginPath();
                                ctx.moveTo(screenX, screenY);
                                ctx.lineTo(screenX2, screenY2);
                                const lineOpacity = opacity * (1 - dist / maxDist) * 0.4;
                                ctx.strokeStyle = isLight ? `rgba(56, 189, 248, ${lineOpacity})` : `rgba(125, 211, 252, ${lineOpacity})`;
                                ctx.stroke();
                            }
                        }
                    }
                    
                    // Ligne d'aimantation vers la souris avec l'effet néon
                    if (mX > 0 && mY > 0 && p.z < 800) {
                        const mouseDist = Math.hypot(screenX - mX, screenY - mY);
                        if (mouseDist < 180) {
                            ctx.beginPath();
                            ctx.moveTo(screenX, screenY);
                            ctx.lineTo(mX, mY);
                            const mouseOpacity = Math.max(0, (1 - mouseDist / 180)) * opacity;
                            ctx.strokeStyle = isLight ? `rgba(99, 102, 241, ${mouseOpacity})` : `rgba(99, 102, 241, ${mouseOpacity})`;
                            ctx.stroke();
                        }
                    }
                }
            });

            requestAnimationFrame(drawNetwork);
        }

        initCanvas();
        drawNetwork();
        window.addEventListener('resize', initCanvas);
    }

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
    const cursorFollower = document.getElementById('custom-cursor-follower');
    
    document.addEventListener('mousemove', e => {
        // Le point central rouge
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
        
        // Le cercle qui suit avec un léger délai
        setTimeout(() => {
            cursorFollower.style.left = `${e.clientX}px`;
            cursorFollower.style.top = `${e.clientY}px`;
        }, 50);
    });

    // Les etats du curseur (ajoutés sur les 2 elements)
    document.querySelectorAll('.comp-card').forEach(c => {
        c.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-view');
            cursorFollower.classList.add('cursor-view');
        });
        c.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-view');
            cursorFollower.classList.remove('cursor-view');
        });
    });

    document.querySelectorAll('a.nav-link-btn, a[target="_blank"]').forEach(l => {
        l.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-link');
            cursorFollower.classList.add('cursor-link');
        });
        l.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-link');
            cursorFollower.classList.remove('cursor-link');
        });
    });

    document.querySelectorAll('button, .btn-primary, .btn-secondary').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-hover');
            cursorFollower.classList.add('cursor-hover');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-hover');
            cursorFollower.classList.remove('cursor-hover');
        });
    });
});