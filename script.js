/**
 * Portfolio Milan Loi - Script Principal
 * Gestion des interactions, animations et logique de navigation.
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. ÉCRAN DE CHARGEMENT "MATRIX" (Style Light)
       ========================================================================== */
    const ecranChargement = document.getElementById('loading-screen');
    const toileMatrix = document.getElementById('matrix-canvas');
    const contexteDessin = toileMatrix.getContext('2d');

    // Ajuster la taille du canvas à la fenêtre
    toileMatrix.width = window.innerWidth;
    toileMatrix.height = window.innerHeight;

    // Jeu de caractères pour la pluie (Katakana + Latin + Chiffres)
    const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
    const alphabetLatin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const caracteres = katakana + alphabetLatin;

    const taillePolice = 16;
    const nombreColonnes = toileMatrix.width / taillePolice;

    // Tableau pour suivre la position verticale de chaque goutte
    const gouttesPluie = [];
    for (let x = 0; x < nombreColonnes; x++) {
        gouttesPluie[x] = 1;
    }

    // Fonction de dessin de l'animation
    const dessinerMatrix = () => {
        // Effet de traînée blanche (fade out)
        contexteDessin.fillStyle = 'rgba(255, 255, 255, 0.1)';
        contexteDessin.fillRect(0, 0, toileMatrix.width, toileMatrix.height);

        contexteDessin.font = taillePolice + 'px monospace';

        for (let i = 0; i < gouttesPluie.length; i++) {
            // Choix aléatoire d'un caractère
            const texte = caracteres.charAt(Math.floor(Math.random() * caracteres.length));

            // Alternance aléatoire des couleurs (Bleu foncé / Bleu clair)
            // Donne un effet de scintillement et de profondeur
            if (Math.random() > 0.95) {
                contexteDessin.fillStyle = '#0f172a'; // Bleu ardoise foncé
            } else {
                contexteDessin.fillStyle = '#38bdf8'; // Bleu ciel lumineux
            }

            contexteDessin.fillText(texte, i * taillePolice, gouttesPluie[i] * taillePolice);

            // Réinitialisation aléatoire de la goutte en haut de l'écran
            if (gouttesPluie[i] * taillePolice > toileMatrix.height && Math.random() > 0.975) {
                gouttesPluie[i] = 0;
            }
            gouttesPluie[i]++;
        }
    };

    // Lancer l'animation (vitesse rapide : 15ms)
    const intervalleAnimation = setInterval(dessinerMatrix, 15);

    // Disparition progressive de l'écran de chargement après 2 secondes
    setTimeout(() => {
        ecranChargement.classList.add('fade-out');

        // Déclencher les animations d'entrée (Fly-in)
        document.body.classList.remove('loading');
        document.body.classList.add('loaded');

        clearInterval(intervalleAnimation); // Arrêter l'animation pour économiser les ressources

        // Supprimer l'élément du DOM une fois la transition CSS terminée
        setTimeout(() => {
            ecranChargement.style.display = 'none';
        }, 800);
    }, 2000);

    // Redimensionner le canvas si la fenêtre change de taille
    window.addEventListener('resize', () => {
        toileMatrix.width = window.innerWidth;
        toileMatrix.height = window.innerHeight;
    });


    /* ==========================================================================
       2. DONNÉES DES COMPÉTENCES (C1 - C6)
       ========================================================================== */
    const donneesCompetences = {
        c1: {
            title: "C1 - REALIZE",
            level: "Level 3: Adapt",
            icon: '<i class="fa-solid fa-code"></i>',
            desc: "Develop complex IT applications by choosing appropriate data structures and respecting design patterns.",
            proof: `
                <div class="proof-content">
                    <p><strong>Projects:</strong> Password Manager & Questionary.</p>
                    <p>For the <em>Password Manager</em>, I built a secure Web App using <strong>Python</strong> and <strong>Flask</strong>. For <em>Questionary</em>, I handled the entire Frontend with <strong>Vue.js</strong>.</p>
                </div>
            `
        },
        c2: {
            title: "C2 - OPTIMIZE",
            level: "Level 2: Apply",
            icon: '<i class="fa-solid fa-microchip"></i>',
            desc: "Analyze and optimize applications based on performance and efficiency criteria.",
            proof: `
                <div class="proof-content">
                    <p><strong>Projects:</strong> Game of Life & Latice.</p>
                    <p>In <em>Game of Life</em> (Lua), I optimized the grid rendering to handle large populations without FPS drops. For <em>Latice</em>, I optimized the JavaFX Drag & Drop feedback loop.</p>
                </div>
            `
        },
        c3: {
            title: "C3 - ADMINISTER",
            level: "Level 3: Adapt",
            icon: '<i class="fa-brands fa-linux"></i>',
            desc: "Install, configure, operate, and secure operating systems and networks.",
            proof: `
                <div class="proof-content">
                    <p><strong>Project:</strong> Virtual Network.</p>
                    <p>Simulated a large-scale network with <strong>2000+ machines</strong>. Configured essential services like <strong>DHCP</strong> and <strong>DNS</strong> and managed routing protocols to ensure connectivity across subnets.</p>
                </div>
            `
        },
        c4: {
            title: "C4 - MANAGE",
            level: "Level 2: Apply",
            icon: '<i class="fa-solid fa-database"></i>',
            desc: "Design, manage, administer, and exploit corporate data.",
            proof: `
                <div class="proof-content">
                    <p><strong>Projects:</strong> Cooking Site & Questionary.</p>
                    <p>Designed the relational database for the <em>Cooking Site</em> using <strong>MySQL</strong>. Wrote complex SQL queries to manage recipes, ingredients, and user favorites efficiently.</p>
                </div>
            `
        },
        c5: {
            title: "C5 - LEAD",
            level: "Level 2: Apply",
            icon: '<i class="fa-solid fa-users-gear"></i>',
            desc: "Satisfy user needs within a project value chain.",
            proof: `
                <div class="proof-content">
                    <p><strong>Project:</strong> Latice (Java Board Game).</p>
                    <p>Led a team of <strong>4 developers</strong> for the Latice project. I coordinated task distribution, managed Git workflows, and ensured code quality through regular reviews.</p>
                </div>
            `
        },
        c6: {
            title: "C6 - SECURE",
            level: "Level 2: Apply",
            icon: '<i class="fa-solid fa-shield-virus"></i>',
            desc: "Protect data and applications against cyberattacks.",
            proof: `
                <div class="proof-content">
                    <p><strong>Projects:</strong> Hashing Algo & Password Manager.</p>
                    <p>Implemented a custom <em>Hashing Algorithm</em> in Java to understand cryptographic principles. Applied these concepts in the <em>Password Manager</em> to securely store user credentials.</p>
                </div>
            `
        }
    };


    /* ==========================================================================
       3. LOGIQUE DE NAVIGATION (Onglets)
       ========================================================================== */
    const boutonsNavigation = document.querySelectorAll('.nav-btn');
    const sectionsPage = document.querySelectorAll('.page-section');
    const boutonVoirProjets = document.getElementById('btn-see-projects');
    const zoneContenu = document.querySelector('.content-area');

    /**
     * Change l'onglet actif et affiche la section correspondante.
     * @param {string} idCible - L'ID de la section à afficher.
     */
    function changerOnglet(idCible) {
        // 1. Mettre à jour l'état des boutons
        boutonsNavigation.forEach(btn => {
            btn.classList.remove('active');

            // Cas spécial : Garder "Compétences" actif si on est dans la vue détaillée
            if (idCible === 'skill-detail-view' && btn.dataset.target === 'skills') {
                btn.classList.add('active');
            }
            // Cas normal
            else if (btn.dataset.target === idCible) {
                btn.classList.add('active');
            }
        });

        // 2. Afficher la bonne section
        sectionsPage.forEach(section => {
            section.classList.remove('active');
            if (section.id === idCible) {
                section.classList.add('active');
            }
        });

        // 3. Remonter en haut de la zone de contenu
        if (zoneContenu) zoneContenu.scrollTop = 0;
    }

    // Écouteurs d'événements pour les boutons de la barre latérale
    boutonsNavigation.forEach(btn => {
        btn.addEventListener('click', () => changerOnglet(btn.dataset.target));
    });

    // Bouton "Voir mes projets" sur la page d'accueil
    if (boutonVoirProjets) {
        boutonVoirProjets.addEventListener('click', (e) => {
            e.preventDefault();
            changerOnglet('projects');
        });
    }


    /* ==========================================================================
       4. VUE DÉTAILLÉE DES COMPÉTENCES
       ========================================================================== */
    const cartesCompetence = document.querySelectorAll('.comp-card');
    const boutonRetour = document.getElementById('back-to-skills');

    // Éléments de la vue détaillée
    const detailIcone = document.getElementById('detail-icon');
    const detailTitre = document.getElementById('detail-title');
    const detailNiveau = document.getElementById('detail-level');
    const detailDesc = document.getElementById('detail-desc');
    const detailPreuve = document.getElementById('detail-proof');

    // Clic sur une carte de compétence
    cartesCompetence.forEach(carte => {
        carte.addEventListener('click', () => {
            const idCompetence = carte.dataset.skill; // ex: "c1"
            const donnees = donneesCompetences[idCompetence];

            if (donnees) {
                // Remplir la vue détaillée avec les données
                detailIcone.innerHTML = donnees.icon;
                detailTitre.innerText = donnees.title;
                detailNiveau.innerText = donnees.level;
                detailDesc.innerText = donnees.desc;
                detailPreuve.innerHTML = donnees.proof;

                // Passer à la vue détaillée
                changerOnglet('skill-detail-view');
            }
        });
    });

    // Bouton retour
    if (boutonRetour) {
        boutonRetour.addEventListener('click', () => {
            changerOnglet('skills');
        });
    }


    /* ==========================================================================
       5. GESTION DU THÈME (Clair / Sombre)
       ========================================================================== */
    const boutonTheme = document.getElementById('theme-toggle');
    const iconeTheme = boutonTheme ? boutonTheme.querySelector('i') : null;
    const corpsPage = document.body;

    // Par défaut : Mode Clair
    corpsPage.classList.add('light-mode');

    // Icône par défaut : Lune (pour passer en mode sombre)
    if (iconeTheme) {
        iconeTheme.classList.replace('fa-moon', 'fa-moon');
    }

    if (boutonTheme && iconeTheme) {
        // Vérifier si l'utilisateur a une préférence sauvegardée
        const themeSauvegarde = localStorage.getItem('selected-theme');

        // Si le thème sauvegardé est sombre, l'appliquer
        if (themeSauvegarde === 'dark') {
            corpsPage.classList.remove('light-mode');
            iconeTheme.classList.replace('fa-moon', 'fa-sun');
        }

        // Logique de basculement au clic
        boutonTheme.addEventListener('click', () => {
            corpsPage.classList.toggle('light-mode');

            if (corpsPage.classList.contains('light-mode')) {
                // Mode Clair actif -> Afficher la Lune
                iconeTheme.classList.replace('fa-sun', 'fa-moon');
                localStorage.setItem('selected-theme', 'light');
            } else {
                // Mode Sombre actif -> Afficher le Soleil
                iconeTheme.classList.replace('fa-moon', 'fa-sun');
                localStorage.setItem('selected-theme', 'dark');
            }
        });
    }

    console.log("%c SYSTÈME EN LIGNE ", "background: #5b7cfa; color: white; font-weight: bold; padding: 5px; border-radius: 3px;");
    console.log("Bienvenue sur le portfolio de Milan.");


    /* ==========================================================================
       6. FILTRES DES PROJETS
       ========================================================================== */
    const boutonsFiltre = document.querySelectorAll('.filter-btn');
    const cartesProjet = document.querySelectorAll('.project-card');

    boutonsFiltre.forEach(btn => {
        btn.addEventListener('click', () => {
            // 1. Retirer la classe active de tous les boutons
            boutonsFiltre.forEach(b => b.classList.remove('active'));
            // 2. Ajouter la classe active au bouton cliqué
            btn.classList.add('active');

            const valeurFiltre = btn.getAttribute('data-filter');

            // 3. Filtrer les cartes
            cartesProjet.forEach(carte => {
                const categorieCarte = carte.getAttribute('data-category');

                if (valeurFiltre === 'all' || valeurFiltre === categorieCarte) {
                    carte.classList.remove('hide');
                    carte.classList.add('show');
                } else {
                    carte.classList.add('hide');
                    carte.classList.remove('show');
                }
            });
        });
    });


    /* ==========================================================================
       7. CARTES PROJETS EXTENSIBLES
       ========================================================================== */
    const cartesExtensibles = document.querySelectorAll('.expandable-card');

    cartesExtensibles.forEach(carte => {
        carte.addEventListener('click', (e) => {
            // Ne pas étendre si on clique sur un lien (GitHub, etc.)
            if (e.target.closest('a')) return;

            // Fermer toutes les autres cartes étendues
            cartesExtensibles.forEach(autreCarte => {
                if (autreCarte !== carte) {
                    autreCarte.classList.remove('expanded');
                    const autreImage = autreCarte.querySelector('.project-image-expanded');
                    const autreDescComplete = autreCarte.querySelector('.card-description-full');
                    const autreDescCourte = autreCarte.querySelector('.card-description');

                    if (autreImage) autreImage.style.display = 'none';
                    if (autreDescComplete) autreDescComplete.style.display = 'none';
                    if (autreDescCourte) autreDescCourte.style.display = 'block';
                }
            });

            // Basculer l'état de la carte actuelle
            carte.classList.toggle('expanded');
            const image = carte.querySelector('.project-image-expanded');
            const descComplete = carte.querySelector('.card-description-full');
            const descCourte = carte.querySelector('.card-description');

            if (carte.classList.contains('expanded')) {
                // Afficher l'image seulement si elle contient une balise img
                if (image && image.querySelector('img')) {
                    image.style.display = 'block';
                }
                if (descComplete) descComplete.style.display = 'block';
                if (descCourte) descCourte.style.display = 'none';

                // Faire défiler la page jusqu'à la carte pour une meilleure visibilité
                setTimeout(() => {
                    carte.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            } else {
                if (image) image.style.display = 'none';
                if (descComplete) descComplete.style.display = 'none';
                if (descCourte) descCourte.style.display = 'block';
            }
        });
    });


    /* ==========================================================================
       8. FONCTIONNALITÉS INTERACTIVES (Effets visuels)
       ========================================================================== */

    // --- 8.1 Effet Parallaxe sur les orbes d'arrière-plan ---
    document.addEventListener('mousemove', (e) => {
        const orbes = document.querySelectorAll('.bg-orb');

        orbes.forEach((orbe, index) => {
            const vitesse = (index + 1) * 20; // Vitesse différente pour chaque orbe (profondeur)
            const decalageX = (window.innerWidth / 2 - e.clientX) / vitesse;
            const decalageY = (window.innerHeight / 2 - e.clientY) / vitesse;

            orbe.style.transform = `translate(${decalageX}px, ${decalageY}px)`;
        });
    });

    // --- 8.2 Effet d'inclinaison 3D (Tilt) sur les cartes ---
    const cartesInclinables = [...document.querySelectorAll('.comp-card'), ...document.querySelectorAll('.project-card')];

    cartesInclinables.forEach(carte => {
        carte.addEventListener('mousemove', (e) => {
            // Ne pas appliquer l'effet si la carte est étendue
            if (carte.classList.contains('expanded')) return;

            const rect = carte.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centreX = rect.width / 2;
            const centreY = rect.height / 2;

            // Calcul de l'angle de rotation
            const rotationX = ((y - centreY) / centreY) * -10; // Max 10 degrés
            const rotationY = ((x - centreX) / centreX) * 10;

            carte.style.transform = `perspective(1000px) rotateX(${rotationX}deg) rotateY(${rotationY}deg) scale(1.02)`;
        });

        carte.addEventListener('mouseleave', () => {
            // Réinitialiser la position
            if (!carte.classList.contains('expanded')) {
                carte.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
            }
        });
    });

    // --- 8.3 Animation "Machine à écrire" pour le message d'accueil ---
    const elementSalutation = document.querySelector('.greeting');
    if (elementSalutation) {
        const texteOriginal = elementSalutation.textContent;
        elementSalutation.textContent = '';
        let indexLettre = 0;

        function machineAEcrire() {
            if (indexLettre < texteOriginal.length) {
                elementSalutation.textContent += texteOriginal.charAt(indexLettre);
                indexLettre++;
                setTimeout(machineAEcrire, 50); // Vitesse de frappe
            }
        }
        // Démarrer après un court délai
        setTimeout(machineAEcrire, 500);
    }


    // --- 8.4 Curseur Personnalisé ---
    const curseur = document.getElementById('custom-cursor');

    // Suivre le mouvement de la souris
    document.addEventListener('mousemove', (e) => {
        curseur.style.left = `${e.clientX}px`;
        curseur.style.top = `${e.clientY}px`;
    });

    // A. Survol des cartes de compétences (Mode "VIEW")
    const cartesCompetencesSurvol = document.querySelectorAll('.comp-card');
    cartesCompetencesSurvol.forEach(carte => {
        carte.addEventListener('mouseenter', () => curseur.classList.add('cursor-view'));
        carte.addEventListener('mouseleave', () => curseur.classList.remove('cursor-view'));
    });

    // B. Survol des liens externes (Flèche)
    const liensExternes = document.querySelectorAll('a[target="_blank"]');
    liensExternes.forEach(lien => {
        lien.addEventListener('mouseenter', () => curseur.classList.add('cursor-link'));
        lien.addEventListener('mouseleave', () => curseur.classList.remove('cursor-link'));
    });

    // C. Survol générique (Boutons, Navigation)
    const elementsInteractifs = document.querySelectorAll('button, .nav-btn, a:not([target="_blank"])');
    elementsInteractifs.forEach(el => {
        el.addEventListener('mouseenter', () => curseur.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => curseur.classList.remove('cursor-hover'));
    });
});