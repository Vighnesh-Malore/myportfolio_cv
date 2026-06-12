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

    // --- Google Guestbook & Sign-in Simulation ---
    const btnToggleDirect = document.getElementById('btn-toggle-direct');
    const btnToggleGoogle = document.getElementById('btn-toggle-google');
    const formDirect = document.getElementById('form-direct');
    const googleContainer = document.getElementById('google-guestbook-container');

    // Tab Switching
    if (btnToggleDirect && btnToggleGoogle && formDirect && googleContainer) {
        btnToggleDirect.addEventListener('click', () => {
            btnToggleDirect.classList.add('active');
            btnToggleGoogle.classList.remove('active');
            formDirect.classList.remove('hidden');
            googleContainer.classList.add('hidden');
        });

        btnToggleGoogle.addEventListener('click', () => {
            btnToggleGoogle.classList.add('active');
            btnToggleDirect.classList.remove('active');
            googleContainer.classList.remove('hidden');
            formDirect.classList.add('hidden');
        });
    }

    const btnGoogleSignin = document.getElementById('btn-google-signin');
    const btnGoogleSignout = document.getElementById('btn-google-signout');
    const authLoggedOut = document.getElementById('auth-logged-out');
    const authLoggedIn = document.getElementById('auth-logged-in');
    
    const userAvatarImg = document.getElementById('user-avatar-img');
    const userDisplayName = document.getElementById('user-display-name');
    const userDisplayEmail = document.getElementById('user-display-email');
    
    const formGoogle = document.getElementById('form-google');
    const googleFormMessage = document.getElementById('google-form-message');
    const guestbookEntriesList = document.getElementById('guestbook-entries-list');

    // Mock profiles to select randomly on sign in for realism
    const mockProfiles = [
        { name: "Vighnesh Malore (Developer Account)", email: "malorevighnesh@gmail.com", avatar: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%23149DDD'/><text x='50%' y='60%' font-size='40' font-family='sans-serif' fill='white' font-weight='bold' text-anchor='middle'>VM</text></svg>" },
        { name: "Suresh Patil", email: "suresh.patil@gmail.com", avatar: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%2310b981'/><text x='50%' y='60%' font-size='40' font-family='sans-serif' fill='white' font-weight='bold' text-anchor='middle'>SP</text></svg>" },
        { name: "Anjali Sharma", email: "anjali.sharma@gmail.com", avatar: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%23f59e0b'/><text x='50%' y='60%' font-size='40' font-family='sans-serif' fill='white' font-weight='bold' text-anchor='middle'>AS</text></svg>" }
    ];

    // Initial default guestbook entries
    const initialEntries = [
        {
            name: "Rahul Verma (Project Manager)",
            email: "rahul.verma@outlook.com",
            avatar: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%23ec4899'/><text x='50%' y='60%' font-size='40' font-family='sans-serif' fill='white' font-weight='bold' text-anchor='middle'>RV</text></svg>",
            message: "Really clean development portfolio! The Habit Tracker APK runs extremely smooth, and the SQLite local database integration speed is very noticeable. Best of luck!",
            date: "2026-06-10T11:45:00.000Z"
        },
        {
            name: "Priya Rao (Tech Lead)",
            email: "priya.rao@gmail.com",
            avatar: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%238b5cf6'/><text x='50%' y='60%' font-size='40' font-family='sans-serif' fill='white' font-weight='bold' text-anchor='middle'>PR</text></svg>",
            message: "Excellent responsive web frontend design for the dental clinic project. Perfect performance and accessibility ratings. Solid full-stack skills!",
            date: "2026-06-11T09:20:00.000Z"
        }
    ];

    // Load guestbook entries from local storage or set defaults
    function getEntries() {
        const stored = localStorage.getItem('guestbook-messages');
        if (!stored) {
            localStorage.setItem('guestbook-messages', JSON.stringify(initialEntries));
            return initialEntries;
        }
        return JSON.parse(stored);
    }

    // Render entries
    function renderGuestbook() {
        if (!guestbookEntriesList) return;
        const entries = getEntries();
        
        if (entries.length === 0) {
            guestbookEntriesList.innerHTML = '<div class="guestbook-empty">No entries yet. Be the first to sign in and leave a message!</div>';
            return;
        }

        // Sort entries by date desc
        const sorted = [...entries].sort((a, b) => new Date(b.date) - new Date(a.date));
        
        guestbookEntriesList.innerHTML = sorted.map(entry => {
            const dateObj = new Date(entry.date);
            const formattedDate = dateObj.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            return `
                <div class="guestbook-entry">
                    <div class="guestbook-entry-header">
                        <div class="entry-user-info">
                            <img src="${entry.avatar}" alt="${entry.name}" class="entry-avatar">
                            <div class="entry-name-wrapper">
                                <span class="entry-name">${escapeHtml(entry.name)}</span>
                                <span class="entry-verified-badge" title="Google Verified Account">
                                    <span class="material-symbols-outlined" style="font-size: 1.1rem;">verified</span>
                                </span>
                            </div>
                        </div>
                        <span class="entry-date">${formattedDate}</span>
                    </div>
                    <p class="entry-content">${escapeHtml(entry.message)}</p>
                </div>
            `;
        }).join('');
    }

    function escapeHtml(str) {
        return str.replace(/&/g, "&amp;")
                  .replace(/</g, "&lt;")
                  .replace(/>/g, "&gt;")
                  .replace(/"/g, "&quot;")
                  .replace(/'/g, "&#039;");
    }

    // Auth State Manager
    function updateAuthState() {
        const user = localStorage.getItem('guestbook-user');
        if (user) {
            const userData = JSON.parse(user);
            if (userAvatarImg) userAvatarImg.src = userData.avatar;
            if (userDisplayName) userDisplayName.textContent = userData.name;
            if (userDisplayEmail) userDisplayEmail.textContent = userData.email;
            
            if (authLoggedOut) authLoggedOut.classList.add('hidden');
            if (authLoggedIn) authLoggedIn.classList.remove('hidden');
        } else {
            if (authLoggedOut) authLoggedOut.classList.remove('hidden');
            if (authLoggedIn) authLoggedIn.classList.add('hidden');
        }
    }

    // Bind Google Sign in Actions
    if (btnGoogleSignin) {
        btnGoogleSignin.addEventListener('click', () => {
            const originalContent = btnGoogleSignin.innerHTML;
            btnGoogleSignin.disabled = true;
            btnGoogleSignin.style.opacity = '0.7';
            btnGoogleSignin.innerHTML = `
                <span class="material-symbols-outlined" style="animation: spin 1s linear infinite;">sync</span>
                <span>Connecting Google Auth...</span>
            `;

            // Style spin animation inline if not present
            if (!document.getElementById('google-spin-style')) {
                const style = document.createElement('style');
                style.id = 'google-spin-style';
                style.textContent = `
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `;
                document.head.appendChild(style);
            }

            // Simulate popup confirmation delay
            setTimeout(() => {
                const randomProfile = mockProfiles[Math.floor(Math.random() * mockProfiles.length)];
                localStorage.setItem('guestbook-user', JSON.stringify(randomProfile));
                updateAuthState();
                
                // Reset button
                btnGoogleSignin.disabled = false;
                btnGoogleSignin.style.opacity = '1';
                btnGoogleSignin.innerHTML = originalContent;
            }, 1200);
        });
    }

    if (btnGoogleSignout) {
        btnGoogleSignout.addEventListener('click', () => {
            localStorage.removeItem('guestbook-user');
            updateAuthState();
        });
    }

    // Handle posting guestbook entry
    if (formGoogle) {
        formGoogle.addEventListener('submit', (e) => {
            e.preventDefault();
            const message = googleFormMessage.value.trim();
            const user = localStorage.getItem('guestbook-user');
            
            if (!message || !user) return;
            
            const userData = JSON.parse(user);
            const newEntry = {
                name: userData.name,
                email: userData.email,
                avatar: userData.avatar,
                message: message,
                date: new Date().toISOString()
            };

            const entries = getEntries();
            entries.push(newEntry);
            localStorage.setItem('guestbook-messages', JSON.stringify(entries));
            
            googleFormMessage.value = '';
            renderGuestbook();
        });
    }

    // Initialize guestbook
    renderGuestbook();
    updateAuthState();

});
