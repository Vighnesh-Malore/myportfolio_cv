document.addEventListener('DOMContentLoaded', () => {
    
    // --- Mouse Flow Atmospheric Glow ---
    const glow = document.getElementById('ambient-glow');
    document.addEventListener('mousemove', (e) => {
        if (glow) {
            glow.style.setProperty('--mouse-x', `${e.clientX}px`);
            glow.style.setProperty('--mouse-y', `${e.clientY}px`);
        }
    });

    // --- Section Navigation (SPA) ---
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    const sidebar = document.getElementById('sidebar');

    function switchSection(targetId) {
        // Remove active class from all links and sections
        navLinks.forEach(link => {
            if (link.getAttribute('href') === targetId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        sections.forEach(section => {
            const sectionId = `#${section.getAttribute('id')}`;
            if (sectionId === targetId) {
                section.classList.add('active-section');
            } else {
                section.classList.remove('active-section');
            }
        });

        // Scroll to top of content
        window.scrollTo({ top: 0, behavior: 'instant' });

        // Close sidebar on mobile after navigating
        closeSidebar();
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            switchSection(targetId);
        });
    });

    // Handle initial hash routing
    if (window.location.hash) {
        const hash = window.location.hash;
        const exists = Array.from(sections).some(s => `#${s.id}` === hash);
        if (exists) {
            switchSection(hash);
        }
    }

    // --- Mobile Menu Toggle & Backdrop ---
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const backdrop = document.getElementById('sidebar-backdrop');

    function toggleSidebar() {
        if (sidebar && backdrop) {
            sidebar.classList.toggle('open');
            backdrop.classList.toggle('open');
        }
    }

    function closeSidebar() {
        if (sidebar && sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
            if (backdrop) backdrop.classList.remove('open');
        }
    }

    if (menuToggle) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleSidebar();
        });
    }

    if (backdrop) {
        backdrop.addEventListener('click', () => {
            closeSidebar();
        });
    }

    // Close sidebar on mobile when clicking outside (fallback)
    document.addEventListener('click', (e) => {
        if (sidebar && sidebar.classList.contains('open')) {
            if (!sidebar.contains(e.target) && e.target !== menuToggle) {
                closeSidebar();
            }
        }
    });

    // --- Dark / Light Theme Toggle ---
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Load saved preference
    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    if (savedTheme === 'light') {
        body.classList.add('light-mode');
        body.classList.remove('dark-mode');
        themeToggle.querySelector('span').textContent = 'light_mode';
    } else {
        body.classList.add('dark-mode');
        body.classList.remove('light-mode');
        themeToggle.querySelector('span').textContent = 'dark_mode';
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            if (body.classList.contains('dark-mode')) {
                body.classList.remove('dark-mode');
                body.classList.add('light-mode');
                themeToggle.querySelector('span').textContent = 'light_mode';
                localStorage.setItem('portfolio-theme', 'light');
            } else {
                body.classList.remove('light-mode');
                body.classList.add('dark-mode');
                themeToggle.querySelector('span').textContent = 'dark_mode';
                localStorage.setItem('portfolio-theme', 'dark');
            }
        });
    }

    // --- Project Filtering ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button styling
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const tags = card.getAttribute('data-tags');
                
                // Show card if filter is 'all' or matches any tag
                if (filterValue === 'all' || tags.toLowerCase().includes(filterValue.toLowerCase())) {
                    card.style.display = 'flex';
                    card.style.animation = 'none';
                    // Trigger reflow to restart animation
                    void card.offsetWidth;
                    card.style.animation = 'fadeScale var(--transition-normal) ease-out forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // --- Scroll Progress Bar ---
    const progressBar = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
        if (progressBar) {
            progressBar.style.width = scrolled + '%';
        }
    });

});
