/**
 * SOMANATH NAYAK - PORTFOLIO SYSTEM CORE LOGIC
 * Strictly Vanilla JS (ES6)
 */

document.addEventListener('DOMContentLoaded', () => {
    // Core Elements
    const body = document.body;
    
    // System Time Clock
    const systemTimeEl = document.getElementById('system-time');
    function updateSystemTime() {
        const now = new Date();
        const utcStr = now.toUTCString().replace('GMT', 'UTC');
        if (systemTimeEl) {
            systemTimeEl.textContent = utcStr;
        }
    }
    setInterval(updateSystemTime, 1000);
    updateSystemTime();

    // Init Sub-Modules
    initCustomCursor();
    initMobileMenu();
    initScrollSpy();
    initHeroParticles();
    initScrollAnimations();
    initSortingVisualizer();
    initWorkCards();
    initContactForm();
});

/* ==========================================================================
   1. CUSTOM CURSOR
   ========================================================================== */
function initCustomCursor() {
    const cursor = document.getElementById('custom-cursor');
    const dot = document.getElementById('custom-cursor-dot');
    
    if (!cursor || !dot) return;

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let dotX = 0, dotY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Lerp animation for smooth cursor trailing
    function animateCursor() {
        // Outer circle (slower delay)
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;
        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;

        // Inner dot (faster follow)
        dotX += (mouseX - dotX) * 0.2;
        dotY += (mouseY - dotY) * 0.2;
        dot.style.left = `${dotX}px`;
        dot.style.top = `${dotY}px`;

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover scale effects on interactive elements
    const hoverables = document.querySelectorAll('a, button, select, input, textarea, .project-card-tilt, .ctrl-btn, .footer-social-link');
    hoverables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hovered');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hovered');
        });
    });
}

/* ==========================================================================
   2. MOBILE MENU DRAWER
   ========================================================================== */
function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!menuToggle || !navMenu) return;

    function toggleMenu() {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    }

    menuToggle.addEventListener('click', toggleMenu);

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });
}

/* ==========================================================================
   3. SCROLLSPY & HEADER TRANSFORMATIONS
   ========================================================================== */
function initScrollSpy() {
    const header = document.getElementById('main-header');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY;

        // Shrink header on scroll
        if (scrollPos > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // ScrollSpy active link toggle
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

/* ==========================================================================
   4. HERO INTERACTIVE CANVAS PARTICLES
   ========================================================================== */
function initHeroParticles() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null, radius: 180 };

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Track mouse coordinates strictly within the hero boundary
    const heroSection = document.getElementById('home');
    if (heroSection) {
        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });

        heroSection.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });
    }

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            // Float upward slowly (anti-gravity)
            this.vy = -(Math.random() * 0.4 + 0.1); 
            this.vx = (Math.random() - 0.5) * 0.25; 
            this.radius = Math.random() * 1.5 + 1.0; // Tiny particles
            
            // Core colors: Red (#FF2A2A), Yellow (#FFD700), White (#F8F9FA)
            const colors = ['#FF2A2A', '#FFD700', '#F8F9FA'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.y += this.vy;
            this.x += this.vx;

            // Float upward wrap around logic
            if (this.y < 0) {
                this.y = canvas.height;
                this.x = Math.random() * canvas.width;
            }
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;

            // Magnetic repulsion logic from mouse
            if (mouse.x != null && mouse.y != null) {
                let dx = this.x - mouse.x;
                let dy = this.y - mouse.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    let force = (mouse.radius - dist) / mouse.radius;
                    let angle = Math.atan2(dy, dx);
                    // Push particles away smoothly
                    this.x += Math.cos(angle) * force * 5;
                    this.y += Math.sin(angle) * force * 5;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    function init() {
        particles = [];
        // Generate exactly 200 tiny particles
        const count = 200;
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }
    init();
    window.addEventListener('resize', init);

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw coordinate grid system lines in background
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.015)';
        ctx.lineWidth = 1;
        const gridGap = 80;
        for (let x = 0; x < canvas.width; x += gridGap) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        for (let y = 0; y < canvas.height; y += gridGap) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }

        // Draw connections between nearby nodes (radius 100)
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                let dx = particles[i].x - particles[j].x;
                let dy = particles[i].y - particles[j].y;
                let dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 100) {
                    let alpha = ((100 - dist) / 100) * 0.08;
                    ctx.strokeStyle = `rgba(248, 249, 250, ${alpha})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(animate);
    }
    animate();
}

/* ==========================================================================
   4.2 SCROLL TRIGGERED REVEALS & PARALLAX
   ========================================================================== */
function initScrollAnimations() {
    // Parallax scroll listener
    window.addEventListener('scroll', () => {
        document.documentElement.style.setProperty('--scroll-y', window.scrollY);
    });
    // Set initial value
    document.documentElement.style.setProperty('--scroll-y', window.scrollY);

    // Intersection Observer for scroll-triggered reveal
    const hiddenElements = document.querySelectorAll('.hidden');
    
    const observerOptions = {
        root: null, // viewport
        threshold: 0.1, // trigger when 10% is visible
        rootMargin: '0px 0px -50px 0px' // offset bottom triggers slightly
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target); // Reveal animation occurs once
            }
        });
    }, observerOptions);

    hiddenElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   5. LOGIC LAB (CONWAY'S GAME OF LIFE & CELLULAR AUTOMATA)
   ========================================================================== */
function initSortingVisualizer() {
    const barsContainer = document.getElementById('bars-container');
    const runBtn = document.getElementById('run-visual-btn');
    const resetBtn = document.getElementById('reset-visual-btn');
    const algoSelect = document.getElementById('algo-select');
    
    if (!barsContainer || !runBtn || !resetBtn) return;

    let array = [];
    const arraySize = 32;
    let isSorting = false;

    // Helper sleep timer
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    function randomizeArray() {
        if (isSorting) return;
        array = [];
        barsContainer.innerHTML = '';
        for (let i = 0; i < arraySize; i++) {
            const value = Math.floor(Math.random() * 85) + 12; // heights 12% to 97%
            array.push(value);
            
            const bar = document.createElement('div');
            bar.className = 'bar';
            bar.style.height = `${value}%`;
            barsContainer.appendChild(bar);
        }
    }

    randomizeArray();

    // BubbleSort implementation
    async function bubbleSort() {
        const bars = document.querySelectorAll('.bar');
        for (let i = 0; i < array.length - 1; i++) {
            for (let j = 0; j < array.length - i - 1; j++) {
                if (!isSorting) return;

                bars[j].style.backgroundColor = 'var(--color-red)';
                bars[j+1].style.backgroundColor = 'var(--color-red)';
                await sleep(40);

                if (array[j] > array[j+1]) {
                    const temp = array[j];
                    array[j] = array[j+1];
                    array[j+1] = temp;

                    bars[j].style.height = `${array[j]}%`;
                    bars[j+1].style.height = `${array[j+1]}%`;

                    bars[j].style.backgroundColor = 'var(--color-yellow)';
                    bars[j+1].style.backgroundColor = 'var(--color-yellow)';
                    await sleep(40);
                }

                bars[j].style.backgroundColor = 'rgba(248, 249, 250, 0.3)';
                bars[j+1].style.backgroundColor = 'rgba(248, 249, 250, 0.3)';
            }
            bars[array.length - i - 1].style.backgroundColor = 'var(--color-yellow)';
        }
        bars[0].style.backgroundColor = 'var(--color-yellow)';
    }

    // QuickSort helper methods
    async function runQuickSort(left, right) {
        if (left >= right) return;
        let pivotIdx = await partition(left, right);
        await runQuickSort(left, pivotIdx - 1);
        await runQuickSort(pivotIdx + 1, right);
    }

    async function partition(left, right) {
        const bars = document.querySelectorAll('.bar');
        const pivotValue = array[right];
        bars[right].style.backgroundColor = 'var(--color-yellow)'; // pivot
        
        let i = left;
        for (let j = left; j < right; j++) {
            if (!isSorting) return;

            bars[j].style.backgroundColor = 'var(--color-red)';
            bars[i].style.backgroundColor = 'var(--color-red)';
            await sleep(60);

            if (array[j] < pivotValue) {
                const temp = array[i];
                array[i] = array[j];
                array[j] = temp;

                bars[i].style.height = `${array[i]}%`;
                bars[j].style.height = `${array[j]}%`;

                bars[i].style.backgroundColor = 'var(--color-yellow)';
                bars[j].style.backgroundColor = 'var(--color-yellow)';
                await sleep(60);

                bars[i].style.backgroundColor = 'rgba(248, 249, 250, 0.3)';
                i++;
            }
            bars[j].style.backgroundColor = 'rgba(248, 249, 250, 0.3)';
        }

        const temp = array[i];
        array[i] = array[right];
        array[right] = temp;

        bars[i].style.height = `${array[i]}%`;
        bars[right].style.height = `${array[right]}%`;

        bars[i].style.backgroundColor = 'var(--color-yellow)';
        bars[right].style.backgroundColor = 'rgba(248, 249, 250, 0.3)';
        await sleep(60);

        bars[i].style.backgroundColor = 'rgba(248, 249, 250, 0.3)';
        return i;
    }

    // MergeSort helper methods
    async function runMergeSort(start, end) {
        if (start >= end) return;
        const mid = Math.floor((start + end) / 2);
        await runMergeSort(start, mid);
        await runMergeSort(mid + 1, end);
        await merge(start, mid, end);
    }

    async function merge(start, mid, end) {
        const bars = document.querySelectorAll('.bar');
        const temp = [];
        let i = start, j = mid + 1;

        while (i <= mid && j <= end) {
            if (!isSorting) return;
            bars[i].style.backgroundColor = 'var(--color-red)';
            bars[j].style.backgroundColor = 'var(--color-red)';
            await sleep(50);

            if (array[i] <= array[j]) {
                temp.push(array[i++]);
            } else {
                temp.push(array[j++]);
            }
        }

        while (i <= mid) {
            if (!isSorting) return;
            temp.push(array[i++]);
        }
        while (j <= end) {
            if (!isSorting) return;
            temp.push(array[j++]);
        }

        for (let k = 0; k < temp.length; k++) {
            if (!isSorting) return;
            array[start + k] = temp[k];
            bars[start + k].style.height = `${array[start + k]}%`;
            bars[start + k].style.backgroundColor = 'var(--color-yellow)';
            await sleep(50);
            bars[start + k].style.backgroundColor = 'rgba(248, 249, 250, 0.3)';
        }
    }

    // Run trigger handler
    runBtn.addEventListener('click', async () => {
        if (isSorting) return;
        isSorting = true;
        
        runBtn.disabled = true;
        resetBtn.disabled = true;
        algoSelect.disabled = true;
        runBtn.classList.remove('btn-slide-up');
        runBtn.style.opacity = '0.5';

        const algorithm = algoSelect.value;
        if (algorithm === 'quicksort') {
            await runQuickSort(0, array.length - 1);
        } else if (algorithm === 'mergesort') {
            await runMergeSort(0, array.length - 1);
        } else if (algorithm === 'bubblesort') {
            await bubbleSort();
        }

        // Green finish flash visually indicating completion
        if (isSorting) {
            const bars = document.querySelectorAll('.bar');
            bars.forEach(bar => {
                bar.style.backgroundColor = '#27c93f'; // systems green
            });
            await sleep(800);
            bars.forEach(bar => {
                bar.style.backgroundColor = 'rgba(248, 249, 250, 0.3)';
            });
        }

        isSorting = false;
        runBtn.disabled = false;
        resetBtn.disabled = false;
        algoSelect.disabled = false;
        runBtn.classList.add('btn-slide-up');
        runBtn.style.opacity = '1';
    });

    resetBtn.addEventListener('click', () => {
        randomizeArray();
    });
}

/* ==========================================================================
   6. PROJECTS 3D CARDS & MODAL MANAGER
   ========================================================================== */

const PROJECTS_DATA = [
    {
        title: "Aether OS",
        meta: "Web Application // Terminal Engine",
        desc: "Aether OS mimics a terminal shell built entirely on clean JavaScript. It exposes directory parsing, manual command scripting, simple node systems, and geometric vector arcade modules directly via terminal prompt controls.",
        tags: ["Vanilla JS", "Canvas API", "CSS Variables", "Keyframes"],
        color: "linear-gradient(135deg, #FF2A2A 0%, #0A0A0A 100%)",
        link: "https://github.com/SOMANATH-NAYAK/AetherOS"
    },
    {
        title: "Chronos Ledgers",
        meta: "Fintech Dashboard // Data Pipeline",
        desc: "A frontend analytic dashboard visualizing simulated mock blockchain structures. Showcases pending blocks, node distributions, transaction pools, and ledger indexes in dynamic grids using pure SVG elements and custom SVG graphing classes.",
        tags: ["SVG Architecture", "WebSockets", "Flex Grid", "Transitions"],
        color: "linear-gradient(135deg, #0A0A0A 0%, #FFD700 100%)",
        link: "https://github.com/SOMANATH-NAYAK/Chronos"
    },
    {
        title: "Spectral Audio Sandbox",
        meta: "Web Audio DSP // Waveform Render",
        desc: "This audio testing suite synthesizes structural tones (sine, saw, square waves) in the user's browser, passing it through dynamic volume gain nodes, custom delays, and band-pass filters, with real-time spectrum visualization on dynamic canvas streams.",
        tags: ["Web Audio API", "Canvas Render", "Responsive Flex", "Physics Loop"],
        color: "linear-gradient(135deg, #FF2A2A 0%, #FFD700 100%)",
        link: "https://github.com/SOMANATH-NAYAK/SpectralAudio"
    }
];

function initWorkCards() {
    const cards = document.querySelectorAll('.project-card-tilt');
    const modal = document.getElementById('project-modal');
    const backdrop = document.getElementById('modal-backdrop');
    const closeBtn = document.getElementById('modal-close');
    
    // Modal Target elements
    const mTitle = document.getElementById('modal-project-title');
    const mMeta = document.getElementById('modal-project-meta');
    const mDesc = document.getElementById('modal-project-desc');
    const mTags = document.getElementById('modal-project-tags');
    const mLink = document.getElementById('modal-project-link');
    const mVisual = document.getElementById('modal-visual');

    if (!cards.length) return;

    // 3D Tilt Card Motion Controller
    cards.forEach(card => {
        const inner = card.querySelector('.card-tilt-inner');
        
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calculate tilt angle based on mouse coordinates offset from center
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const tiltX = (centerY - y) / 10;
            const tiltY = (x - centerX) / 10;

            inner.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            inner.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
        });

        // Open details modal
        card.addEventListener('click', () => {
            const idx = parseInt(card.getAttribute('data-project'));
            const project = PROJECTS_DATA[idx];
            if (!project) return;

            // Load data
            mTitle.textContent = project.title;
            mMeta.textContent = project.meta;
            mDesc.textContent = project.desc;
            mLink.setAttribute('href', project.link);

            // Populate tags
            mTags.innerHTML = '';
            project.tags.forEach(tag => {
                const badge = document.createElement('span');
                badge.textContent = tag;
                mTags.appendChild(badge);
            });

            // Set dynamic visual representation inside modal visual area
            mVisual.style.background = project.color;
            mVisual.innerHTML = `
                <div style="font-family: var(--font-heading); color: #F8F9FA; font-size: 2.5rem; font-weight: 700; transform: translateZ(50px); letter-spacing: 2px;">
                    ${project.title.toUpperCase()}
                </div>
            `;

            // Display modal
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Stop background scrolling
        });
    });

    // Close Modal helpers
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);
    
    // Close modal on ESC key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Magnetic social vectors logic
    const magneticLinks = document.querySelectorAll('.magnetic');
    magneticLinks.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Translate the social list card slightly towards mouse offset coordinates
            el.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = 'translate(0px, 0px)';
        });
    });
}

/* ==========================================================================
   7. CONNECT FORM VERIFICATION & TOAST NOTIFIER
   ========================================================================== */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const toast = document.getElementById('system-toast');
    const toastMessage = document.getElementById('toast-message');

    if (!form) return;

    // Toast triggers
    function showToast(message, type = 'info') {
        if (!toast || !toastMessage) return;
        toastMessage.textContent = message;
        
        // Custom styling based on notice type
        const indicator = toast.querySelector('.toast-indicator');
        if (indicator) {
            indicator.style.backgroundColor = type === 'success' ? 'var(--color-yellow)' : 'var(--color-red)';
            indicator.style.boxShadow = type === 'success' ? 'var(--glow-yellow)' : 'var(--glow-red)';
        }

        toast.classList.add('active');

        setTimeout(() => {
            toast.classList.remove('active');
        }, 4000);
    }

    // Input validations
    function validateField(input) {
        const group = input.parentElement;
        let isValid = true;

        if (input.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isValid = emailRegex.test(input.value.trim());
        } else {
            isValid = input.value.trim().length > 0;
        }

        if (!isValid) {
            group.classList.add('error');
        } else {
            group.classList.remove('error');
        }

        return isValid;
    }

    // Validate on input typing
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            if (input.parentElement.classList.contains('error')) {
                validateField(input);
            }
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let isFormValid = true;

        inputs.forEach(input => {
            if (!validateField(input)) {
                isFormValid = false;
            }
        });

        if (isFormValid) {
            // Form payload sent - mock feedback loop
            showToast("TRANSMISSION VECTOR COMPLETED // INBOX LINK ESTABLISHED", "success");
            form.reset();
        } else {
            showToast("TRANSMISSION VECTOR FAILED // VERIFY HIGHLIGHTED CODES", "error");
        }
    });
}
