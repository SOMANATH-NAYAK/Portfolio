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
    initLogicLab();
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
    const hoverables = document.querySelectorAll('a, button, select, input, textarea, .project-card, .ctrl-btn');
    hoverables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.8)';
            cursor.style.borderColor = 'var(--color-yellow)';
            cursor.style.backgroundColor = 'rgba(255, 215, 0, 0.05)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursor.style.borderColor = 'var(--color-red)';
            cursor.style.backgroundColor = 'transparent';
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
   5. LOGIC LAB (CONWAY'S GAME OF LIFE & CELLULAR AUTOMATA)
   ========================================================================== */
function initLogicLab() {
    const canvas = document.getElementById('logic-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Grid Setup
    const cols = 60;
    const rows = 35;
    let cellSize = 0;
    let grid = createEmptyGrid();
    let isRunning = false;
    let speed = 30; // Generations per second limit
    let generation = 0;
    let lastRenderTime = 0;
    let isDrawing = false;
    let drawMode = 1; // 1 = paint, 0 = erase

    // Dom controls
    const playBtn = document.getElementById('sim-play-btn');
    const stepBtn = document.getElementById('sim-step-btn');
    const clearBtn = document.getElementById('sim-clear-btn');
    const presetSelect = document.getElementById('sim-preset-select');
    const speedSlider = document.getElementById('sim-speed-slider');
    const statGeneration = document.getElementById('stat-generation');
    const statCells = document.getElementById('stat-cells');
    const statFps = document.getElementById('stat-fps');
    const logContainer = document.getElementById('terminal-body');

    function createEmptyGrid() {
        return Array(cols).fill(null).map(() => Array(rows).fill(0));
    }

    function resizeCanvas() {
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        cellSize = canvas.width / cols;
        drawGrid();
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initial fill
    loadPreset('random');

    // Terminal Logging Helper
    function appendTerminalLog(msg) {
        if (!logContainer) return;
        const line = document.createElement('p');
        line.className = 'terminal-line';
        line.textContent = `> ${msg}`;
        logContainer.appendChild(line);
        logContainer.scrollTop = logContainer.scrollHeight;
        
        // Cap terminal log children at 20 rows to avoid DOM bloating
        while (logContainer.children.length > 20) {
            logContainer.removeChild(logContainer.firstChild);
        }
    }

    function countActiveCells(g) {
        let count = 0;
        for (let x = 0; x < cols; x++) {
            for (let y = 0; y < rows; y++) {
                if (g[x][y] === 1) count++;
            }
        }
        return count;
    }

    function drawGrid() {
        ctx.fillStyle = '#050505';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw Grid Lines
        ctx.strokeStyle = '#111115';
        ctx.lineWidth = 1;
        for (let x = 0; x <= cols; x++) {
            ctx.beginPath();
            ctx.moveTo(x * cellSize, 0);
            ctx.lineTo(x * cellSize, canvas.height);
            ctx.stroke();
        }
        for (let y = 0; y <= rows; y++) {
            ctx.beginPath();
            ctx.moveTo(0, y * cellSize);
            ctx.lineTo(canvas.width, y * cellSize);
            ctx.stroke();
        }

        // Draw Cells
        for (let x = 0; x < cols; x++) {
            for (let y = 0; y < rows; y++) {
                if (grid[x][y] === 1) {
                    // Cell style: Gradient of Red & Yellow accents
                    ctx.fillStyle = (x + y) % 2 === 0 ? 'var(--color-red)' : 'var(--color-yellow)';
                    ctx.fillRect(
                        x * cellSize + 1.5,
                        y * cellSize + 1.5,
                        cellSize - 2,
                        cellSize - 2
                    );
                    
                    // Subtle glowing border around active cells
                    ctx.strokeStyle = 'rgba(255, 42, 42, 0.4)';
                    ctx.lineWidth = 0.5;
                    ctx.strokeRect(
                        x * cellSize + 0.5,
                        y * cellSize + 0.5,
                        cellSize - 1,
                        cellSize - 1
                    );
                }
            }
        }

        // Update statistics displays
        if (statGeneration) statGeneration.textContent = generation;
        if (statCells) statCells.textContent = countActiveCells(grid);
    }

    // Next Generation State Resolver
    function computeNextGeneration() {
        let next = createEmptyGrid();

        for (let x = 0; x < cols; x++) {
            for (let y = 0; y < rows; y++) {
                let neighbors = countNeighbors(x, y);
                let state = grid[x][y];

                if (state === 0 && neighbors === 3) {
                    next[x][y] = 1; // Born
                } else if (state === 1 && (neighbors < 2 || neighbors > 3)) {
                    next[x][y] = 0; // Death by under/overpopulation
                } else {
                    next[x][y] = state; // Survival
                }
            }
        }

        grid = next;
        generation++;
    }

    function countNeighbors(x, y) {
        let sum = 0;
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                if (i === 0 && j === 0) continue;
                
                // Wrap around logic (Toroidal grid structure)
                let c = (x + i + cols) % cols;
                let r = (y + j + rows) % rows;
                sum += grid[c][r];
            }
        }
        return sum;
    }

    // Presets catalog
    function loadPreset(presetName) {
        grid = createEmptyGrid();
        generation = 0;

        if (presetName === 'random') {
            for (let x = 0; x < cols; x++) {
                for (let y = 0; y < rows; y++) {
                    grid[x][y] = Math.random() > 0.85 ? 1 : 0;
                }
            }
            appendTerminalLog('Presets loaded: Random cellular distribution.');
        } 
        else if (presetName === 'glider') {
            // Glider template
            const cx = 5, cy = 5;
            grid[cx][cy] = 1;
            grid[cx+1][cy+1] = 1;
            grid[cx+2][cy-1] = 1;
            grid[cx+2][cy] = 1;
            grid[cx+2][cy+1] = 1;
            appendTerminalLog('Presets loaded: Standard kinetic glider pattern.');
        } 
        else if (presetName === 'gosper') {
            // Gosper Glider Gun template
            const gun = [
                [1, 5], [1, 6], [2, 5], [2, 6],
                [11, 5], [11, 6], [11, 7], [12, 4], [12, 8], [13, 3], [13, 9], [14, 3], [14, 9],
                [15, 6], [16, 4], [16, 8], [17, 5], [17, 6], [17, 7], [18, 6],
                [21, 3], [21, 4], [21, 5], [22, 3], [22, 4], [22, 5], [23, 2], [23, 6],
                [25, 1], [25, 2], [25, 6], [25, 7],
                [35, 3], [35, 4], [36, 3], [36, 4]
            ];
            gun.forEach(([x, y]) => {
                if (x + 2 < cols && y + 5 < rows) {
                    grid[x + 2][y + 5] = 1;
                }
            });
            appendTerminalLog('Presets loaded: Gosper glider gun (Infinite Stream).');
        } 
        else if (presetName === 'pulsar') {
            // Pulsar Period 3 oscillator template
            const cx = Math.floor(cols / 2);
            const cy = Math.floor(rows / 2);
            const offsets = [
                // Top outer row
                [-6, -2], [-6, -3], [-6, -4], [6, -2], [6, -3], [6, -4],
                [-1, -2], [-1, -3], [-1, -4], [1, -2], [1, -3], [1, -4],
                // Bottom outer row
                [-6, 2], [-6, 3], [-6, 4], [6, 2], [6, 3], [6, 4],
                [-1, 2], [-1, 3], [-1, 4], [1, 2], [1, 3], [1, 4],
                // Left & Right columns
                [-2, -6], [-3, -6], [-4, -6], [2, -6], [3, -6], [4, -6],
                [-2, 6], [-3, 6], [-4, 6], [2, 6], [3, 6], [4, 6],
                [-2, -1], [-3, -1], [-4, -1], [2, -1], [3, -1], [4, -1],
                [-2, 1], [-3, 1], [-4, 1], [2, 1], [3, 1], [4, 1]
            ];
            offsets.forEach(([dx, dy]) => {
                if (cx + dx >= 0 && cx + dx < cols && cy + dy >= 0 && cy + dy < rows) {
                    grid[cx + dx][cy + dy] = 1;
                }
            });
            appendTerminalLog('Presets loaded: Pulsar Oscillator (Period 3).');
        }
        else if (presetName === 'pentadecathlon') {
            const cx = Math.floor(cols / 2);
            const cy = Math.floor(rows / 2);
            // Horizontal row of 10 cells
            for(let i = -4; i <= 5; i++) {
                grid[cx + i][cy] = 1;
            }
            appendTerminalLog('Presets loaded: Pentadecathlon Oscillator (Period 15).');
        }

        drawGrid();
    }

    // Drawing coordinates resolver
    function handleDrawEvent(e) {
        const rect = canvas.getBoundingClientRect();
        const clientX = e.clientX || e.touches[0].clientX;
        const clientY = e.clientY || e.touches[0].clientY;
        
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        
        const x = (clientX - rect.left) * scaleX;
        const y = (clientY - rect.top) * scaleY;
        
        const cellX = Math.floor(x / cellSize);
        const cellY = Math.floor(y / cellSize);

        if (cellX >= 0 && cellX < cols && cellY >= 0 && cellY < rows) {
            grid[cellX][cellY] = drawMode;
            drawGrid();
        }
    }

    // Interactivity Listeners
    canvas.addEventListener('mousedown', (e) => {
        isDrawing = true;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;
        const cellX = Math.floor(x / cellSize);
        const cellY = Math.floor(y / cellSize);
        
        if (cellX >= 0 && cellX < cols && cellY >= 0 && cellY < rows) {
            // Ee if clicked active or empty to decide paint/erase
            drawMode = grid[cellX][cellY] === 1 ? 0 : 1;
            grid[cellX][cellY] = drawMode;
            drawGrid();
        }
    });

    window.addEventListener('mouseup', () => {
        isDrawing = false;
    });

    canvas.addEventListener('mousemove', (e) => {
        if (isDrawing) {
            handleDrawEvent(e);
        }
    });

    // Touch Event mapping for mobile
    canvas.addEventListener('touchstart', (e) => {
        isDrawing = true;
        handleDrawEvent(e);
    });

    canvas.addEventListener('touchend', () => {
        isDrawing = false;
    });

    canvas.addEventListener('touchmove', (e) => {
        if (isDrawing) {
            e.preventDefault();
            handleDrawEvent(e);
        }
    });

    // Button actions listeners
    playBtn.addEventListener('click', () => {
        isRunning = !isRunning;
        if (isRunning) {
            playBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                </svg>
            `;
            appendTerminalLog('Simulation loop execution: RUNNING.');
        } else {
            playBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                </svg>
            `;
            appendTerminalLog('Simulation loop execution: STOPPED.');
        }
    });

    stepBtn.addEventListener('click', () => {
        if (!isRunning) {
            computeNextGeneration();
            drawGrid();
            appendTerminalLog(`Manual step triggered. Generation: ${generation}`);
        }
    });

    clearBtn.addEventListener('click', () => {
        isRunning = false;
        playBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
            </svg>
        `;
        grid = createEmptyGrid();
        generation = 0;
        drawGrid();
        appendTerminalLog('System cleared. Grid cells reset.');
    });

    presetSelect.addEventListener('change', (e) => {
        loadPreset(e.target.value);
    });

    speedSlider.addEventListener('input', (e) => {
        speed = parseInt(e.target.value);
        appendTerminalLog(`Speed updated: Limit set to ${speed} GPS (Generations Per Second).`);
    });

    // FPS / Render loops
    let lastTime = performance.now();
    let frameCount = 0;
    let fps = 0;

    function gameLoop(time) {
        requestAnimationFrame(gameLoop);

        // Frame counter
        frameCount++;
        if (time >= lastTime + 1000) {
            fps = Math.round((frameCount * 1000) / (time - lastTime));
            if (statFps) statFps.textContent = `${fps} FPS`;
            frameCount = 0;
            lastTime = time;
        }

        // Sim speed controller interval calculation
        if (isRunning) {
            const timeBetweenFrames = 1000 / speed;
            if (time - lastRenderTime >= timeBetweenFrames) {
                computeNextGeneration();
                drawGrid();
                lastRenderTime = time;
            }
        }
    }
    requestAnimationFrame(gameLoop);
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
    const cards = document.querySelectorAll('.project-card');
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
        const inner = card.querySelector('.project-card-inner');
        
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
