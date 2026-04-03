        AOS.init({ duration: 900, once: true });

        // â•â•â• FLOATING NAV SCROLL EFFECT â•â•â•
        window.addEventListener('scroll', () => {
            const nav = document.querySelector('nav');
            if (window.scrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }

            // Update active link on scroll
            const sections = document.querySelectorAll('section');
            const navLinks = document.querySelectorAll('.nav-links a');

            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (window.pageYOffset >= (sectionTop - 100)) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(a => {
                a.classList.remove('active');
                if (a.getAttribute('href').includes(current)) {
                    a.classList.add('active');
                }
            });
        });

        document.getElementById('hamburger').addEventListener('click', () => {

            document.getElementById('navLinks').classList.toggle('active');
        });

        // â•â•â• 3D TILT EFFECT â•â•â•
        const tiltCards = document.querySelectorAll('.card, .forge-card-v, .hub-card, .market-card, .pillar, .sharp-card');
        tiltCards.forEach(card => {
            let cachedRect = null;

            card.addEventListener('mouseenter', () => {
                cachedRect = card.getBoundingClientRect();
            });

            card.addEventListener('mousemove', e => {
                if (!cachedRect) return;
                const x = e.clientX - cachedRect.left;
                const y = e.clientY - cachedRect.top;

                const centerX = cachedRect.width / 2;
                const centerY = cachedRect.height / 2;

                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
            });

            card.addEventListener('mouseleave', () => {
                cachedRect = null;
                card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)`;
            });
        });



        document.querySelectorAll('a[href^="#"]').forEach(a => {
            a.addEventListener('click', e => {
                e.preventDefault();
                document.getElementById('navLinks').classList.remove('active');
                const target = document.querySelector(a.getAttribute('href'));
                if (target) target.scrollIntoView({ behavior: 'smooth' });
            });
        });

        // â•â•â• HERO PARAGRAPH TYPEWRITER â•â•â•
        (function () {
            const el = document.getElementById('hero-typewriter');
            const sentences = [
                'Leading the era of Agentic AI. We build autonomous agents and intelligent business processes to transform industries.',
                'From neural foundations to Agentic AI â€” we give you the skills, tools, and real-world projects to dominate the future.',
                'Training future-ready AI professionals. Deploying custom Agentic systems. Solving complex business problems.'
            ];
            let si = 0, ci = 0, deleting = false;
            function type() {
                const cur = sentences[si];
                if (!deleting && ci <= cur.length) {
                    el.innerHTML = cur.slice(0, ci++) + '<span class="hero-cursor"></span>';
                    setTimeout(type, 36);
                } else if (!deleting && ci > cur.length) {
                    deleting = true; setTimeout(type, 2200);
                } else if (deleting && ci > 0) {
                    el.innerHTML = cur.slice(0, ci--) + '<span class="hero-cursor"></span>';
                    setTimeout(type, 18);
                } else {
                    deleting = false; si = (si + 1) % sentences.length; setTimeout(type, 300);
                }
            }
            setTimeout(type, 1100);
        })();

        // â•â•â• ROBO EYE TRACKING â•â•â•
        const forgeSection = document.getElementById('forge');
        const roboSvg = forgeSection.querySelector('.forge-robo svg');
        const lPupil = document.getElementById('lPupil');
        const rPupil = document.getElementById('rPupil');
        const lHL = document.getElementById('lHL');
        const rHL = document.getElementById('rHL');
        const lIris = document.getElementById('lIris');
        const rIris = document.getElementById('rIris');
        const lGlow = document.getElementById('lGlow');
        const rGlow = document.getElementById('rGlow');

        const L_EYE = { x: 204, y: 132 };
        const R_EYE = { x: 276, y: 132 };
        const MAX_H = 7, MAX_V = 4; // max px offset in SVG coords

        function toSVGPoint(clientX, clientY) {
            const pt = roboSvg.createSVGPoint();
            pt.x = clientX; pt.y = clientY;
            return pt.matrixTransform(roboSvg.getScreenCTM().inverse());
        }

        function movePupil(eye, pupil, hl, cx, cy) {
            const dx = cx - eye.x, dy = cy - eye.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const ox = Math.min(Math.abs(dx), MAX_H) * Math.sign(dx);
            const oy = Math.min(Math.abs(dy), MAX_V) * Math.sign(dy);
            pupil.setAttribute('cx', eye.x + ox);
            pupil.setAttribute('cy', eye.y + oy);
            hl.setAttribute('cx', eye.x + ox - 4);
            hl.setAttribute('cy', eye.y + oy - 3);
        }

        forgeSection.addEventListener('mousemove', function (e) {
            const { x, y } = toSVGPoint(e.clientX, e.clientY);
            movePupil(L_EYE, lPupil, lHL, x, y);
            movePupil(R_EYE, rPupil, rHL, x, y);
        });

        // Reset pupils when leaving forge section
        forgeSection.addEventListener('mouseleave', function () {
            [lPupil, rPupil].forEach(p => { p.setAttribute('cx', p === lPupil ? 204 : 276); p.setAttribute('cy', 132); });
            [lHL, rHL].forEach((h, i) => { h.setAttribute('cx', i === 0 ? 200 : 272); h.setAttribute('cy', 129); });
            setEyeSize(false);
        });

        // Enlarge eyes on card hover
        function setEyeSize(big) {
            if (big) {
                [lIris, rIris].forEach(e => { e.setAttribute('rx', '21'); e.setAttribute('ry', '14'); });
                [lGlow, rGlow].forEach(e => { e.setAttribute('rx', '28'); e.setAttribute('ry', '20'); });
                [lPupil, rPupil].forEach(e => { e.setAttribute('rx', '11'); e.setAttribute('ry', '8'); });
            } else {
                [lIris, rIris].forEach(e => { e.setAttribute('rx', '17'); e.setAttribute('ry', '11'); });
                [lGlow, rGlow].forEach(e => { e.setAttribute('rx', '22'); e.setAttribute('ry', '15'); });
                [lPupil, rPupil].forEach(e => { e.setAttribute('rx', '8'); e.setAttribute('ry', '6'); });
            }
        }

        document.querySelectorAll('.forge-card-v').forEach(card => {
            card.addEventListener('mouseenter', () => setEyeSize(true));
            card.addEventListener('mouseleave', () => {
                // Only shrink back if no other card is hovered
                const anyHovered = [...document.querySelectorAll('.forge-card-v')].some(c => c.matches(':hover'));
                if (!anyHovered) setEyeSize(false);
            });
        });

        /* MATRIX RAIN */
        (function () {
            const c = document.getElementById('matrix-canvas');
            const ctx = c.getContext('2d');
            function resize() {
                c.width = window.innerWidth;
                c.height = window.innerHeight;
            }
            resize();
            window.addEventListener('resize', resize);
            const chars = '01ã‚¢ã‚¤ã‚¦ã‚¨ã‚ªã‚«ã‚­ã‚¯ã‚±ã‚³ã‚µã‚·ã‚¹ã‚»ã‚½ã‚¿ãƒãƒ„ãƒ†ãƒˆãƒŠãƒ‹ãƒŒãƒãƒŽABCDEF'.split('');
            const fs = 14;
            const cols = Math.floor(c.width / fs);
            const drops = Array(cols).fill(1);
            function draw() {
                ctx.fillStyle = 'rgba(255,255,255,0.05)';
                ctx.fillRect(0, 0, c.width, c.height);
                ctx.font = fs + 'px JetBrains Mono,monospace';
                drops.forEach((y, i) => {
                    const ch = chars[Math.floor(Math.random() * chars.length)];
                    // Theme color: mix of gold and green
                    const color = Math.random() > 0.5 ? '#eab308' : '#22c55e';
                    ctx.fillStyle = color + Math.floor(Math.random() * 150 + 50).toString(16).padStart(2, '0'); // Add varying alpha in hex
                    ctx.fillText(ch, i * fs, y * fs);
                    if (y * fs > c.height && Math.random() > 0.975) drops[i] = 0;
                    drops[i]++;
                });
            }
            setInterval(draw, 45);
        })();

        /* GLOBAL PARTICLE BACKGROUND */
        (function () {
            const canvas = document.getElementById('global-particle-canvas');
            const ctx = canvas.getContext('2d');
            let particles = [];

            function resize() {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
            resize();
            window.addEventListener('resize', resize);

            class Particle {
                constructor() {
                    this.x = Math.random() * canvas.width;
                    this.y = Math.random() * canvas.height;
                    this.vx = (Math.random() - 0.5) * 0.5;
                    this.vy = (Math.random() - 0.5) * 0.5;
                    this.radius = Math.random() * 2 + 1;
                }
                update() {
                    this.x += this.vx;
                    this.y += this.vy;
                    if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
                    if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
                }
                draw() {
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(34, 197, 94, 0.4)';
                    ctx.fill();
                }
            }

            for (let i = 0; i < 80; i++) particles.push(new Particle());

            function animate() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                particles.forEach(p => {
                    p.update();
                    p.draw();
                });

                // Draw connections
                for (let i = 0; i < particles.length; i++) {
                    for (let j = i + 1; j < particles.length; j++) {
                        const dx = particles[i].x - particles[j].x;
                        const dy = particles[i].y - particles[j].y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist < 150) {
                            ctx.beginPath();
                            ctx.moveTo(particles[i].x, particles[i].y);
                            ctx.lineTo(particles[j].x, particles[j].y);
                            ctx.strokeStyle = `rgba(34, 197, 94, ${0.1 * (1 - dist / 150)})`;
                            ctx.lineWidth = 1;
                            ctx.stroke();
                        }
                    }
                }
                requestAnimationFrame(animate);
            }
            animate();
        })();

        /* OLD THREE.JS CODE DISABLED
    
            const canvas = document.getElementById('three-canvas');
            if(!canvas) return;
            const renderer = new THREE.WebGLRenderer({canvas, antialias: true, alpha: true});
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.setSize(canvas.clientWidth, canvas.clientHeight);
            renderer.setClearColor(0x000000, 0);
            
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
            camera.position.z = 4;
            
            const N = 180, R = 2.4;
            const pos = [], siz = [];
            for(let i=0; i<N; i++){
                const phi = Math.acos(1 - 2 * (i + 0.5) / N);
                const theta = Math.PI * (1 + Math.sqrt(5)) * i;
                pos.push(R * Math.sin(phi) * Math.cos(theta), R * Math.cos(phi), R * Math.sin(phi) * Math.sin(theta));
                siz.push(Math.random() * 4 + 4.0);
            }
            
            const geo = new THREE.BufferGeometry();
            geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
            geo.setAttribute('size', new THREE.Float32BufferAttribute(siz, 1));
            
            const mat = new THREE.ShaderMaterial({
                uniforms: { color: { value: new THREE.Color('#eab308') } }, // Yellow points
                vertexShader: `
                    attribute float size;
                    void main() {
                        gl_PointSize = size;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform vec3 color;
                    void main() {
                        float d = length(gl_PointCoord - vec2(0.5));
                        if(d > 0.5) discard;
                        float strength = 1.0 - (d * 2.0);
                        gl_FragColor = vec4(color, pow(strength, 1.5) * 1.8);
                    }
                `,
                transparent: true,
                depthWrite: false
            });
            
            const points = new THREE.Points(geo, mat);
            scene.add(points);
            
            const lPos = [];
            const pts = geo.attributes.position;
            for(let i=0; i<N; i++){
                for(let j=i+1; j<N; j++){
                    const ax = pts.getX(i), ay = pts.getY(i), az = pts.getZ(i);
                    const bx = pts.getX(j), by = pts.getY(j), bz = pts.getZ(j);
                    const d = Math.sqrt((ax-bx)**2 + (ay-by)**2 + (az-bz)**2);
                    if(d < 0.9) lPos.push(ax, ay, az, bx, by, bz);
                }
            }
            
            const lgeo = new THREE.BufferGeometry();
            lgeo.setAttribute('position', new THREE.Float32BufferAttribute(lPos, 3));
            const lmat = new THREE.LineBasicMaterial({
                color: 0x011c0f, // Dark Emerald/Stealth lines
                transparent: true, 
                opacity: 0.18
            });
            const lines = new THREE.LineSegments(lgeo, lmat);
            scene.add(lines);
    
            // â•â•â• LOGO CORE â•â•â•
            const loader = new THREE.TextureLoader();
            const logoTexture = loader.load(logoBase64);
            const logoMat = new THREE.SpriteMaterial({ 
                map: logoTexture, 
                transparent: true,
                opacity: 0.95
            });
            const logoSprite = new THREE.Sprite(logoMat);
            logoSprite.scale.set(3.5, 3.5, 1); // Perfect fit inside neural points
            scene.add(logoSprite);
            
            let mx = 0, my = 0;
            window.addEventListener('mousemove', e => {
                mx = (e.clientX / window.innerWidth - 0.5) * 2;
                my = (e.clientY / window.innerHeight - 0.5) * 2;
            });
            
            window.addEventListener('resize', () => {
                camera.aspect = canvas.clientWidth / canvas.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(canvas.clientWidth, canvas.clientHeight);
            });
            
            function animate() {
                requestAnimationFrame(animate);
                points.rotation.y += 0.002 + mx * 0.0005;
                points.rotation.x += 0.0005 + my * 0.0005;
                lines.rotation.y = points.rotation.y;
                lines.rotation.x = points.rotation.x;
                renderer.render(scene, camera);
            }
            animate();
        })();
    
        /* CHARACTER REVEAL ENGINE â€” H1 only */
        (function () {
            const targets = document.querySelectorAll('.hero h1');
            targets.forEach(el => {
                const html = el.innerHTML;
                el.innerHTML = '';
                let delay = 0.5;

                function splitText(node, parent) {
                    if (node.nodeType === 3) { // TEXT_NODE
                        [...node.textContent].forEach(char => {
                            if (char === ' ') {
                                parent.appendChild(document.createTextNode(' '));
                            } else {
                                const span = document.createElement('span');
                                span.className = 'char';
                                span.textContent = char;
                                span.style.animationDelay = `${delay}s`;
                                delay += 0.02;
                                parent.appendChild(span);
                            }
                        });
                    } else if (node.nodeType === 1) { // ELEMENT_NODE
                        const clone = node.cloneNode(false);
                        parent.appendChild(clone);
                        node.childNodes.forEach(child => splitText(child, clone));
                    }
                }
                const temp = document.createElement('div');
                temp.innerHTML = html;
                temp.childNodes.forEach(child => splitText(child, el));
            });
        })();
        /* OLD THREE.JS CODE DISABLED END */

        /* â•â• SOCIAL ICONS â€” STAGGERED ENTRANCE â•â• */
(function () {
    const icons = document.querySelectorAll('.social-icon');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                icons.forEach((icon, i) => {
                    icon.style.opacity = '0';
                    icon.style.transform = 'translateY(20px) scale(0.8)';
                    setTimeout(() => {
                        icon.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                        icon.style.opacity = '1';
                        icon.style.transform = 'translateY(0) scale(1)';
                    }, i * 80);
                });
                observer.disconnect();
            }
        });
    }, { threshold: 0.3 });

    const hub = document.querySelector('.social-hub');
    if (hub) observer.observe(hub);
})();

        /* â•â• IPL LIVE SCORE TICKER â•â• */
        (function () {
            // ESPN public cricket API â€” IPL series ID 8048, no key needed
            const ESPN_API = 'https://site.api.espn.com/apis/site/v2/sports/cricket/8048/scoreboard';

            const track = document.getElementById('ticker-track');
            const refreshEl = document.getElementById('ticker-refresh-time');

            function item(cls, txt) {
                return `<span class="ticker-item"><span class="${cls}">${txt}</span></span>`;
            }

            function buildTickerHTML(parts) {
                if (!parts.length) {
                    parts = [item('ticker-status', 'ðŸ IPL 2026 â€” No live matches right now. Stay tuned!')];
                }
                const sep = '<span class="ticker-sep"> â—† </span>';
                const single = parts.join(sep);
                // Repeat 8 times so track is always wider than any viewport
                const repeated = Array(8).fill(single).join(sep + sep);
                return repeated;
            }

            function parseESPN(data) {
                const parts = [];
                const events = data.events || [];

                events.forEach(ev => {
                    try {
                        const comp   = ev.competitions[0];
                        const state  = ev.status?.type?.state || '';
                        const detail = ev.status?.type?.shortDetail || '';
                        const home   = comp.competitors.find(c => c.homeAway === 'home') || comp.competitors[0];
                        const away   = comp.competitors.find(c => c.homeAway === 'away') || comp.competitors[1];

                        const t1 = home?.team?.shortDisplayName || home?.team?.abbreviation || '';
                        const t2 = away?.team?.shortDisplayName || away?.team?.abbreviation || '';
                        const s1 = home?.score || '';
                        const s2 = away?.score || '';

                        if (state === 'in') {
                            // LIVE match
                            parts.push(item('ticker-team', `ðŸ”´ LIVE`));
                            parts.push(item('ticker-team', t1));
                            if (s1) parts.push(item('ticker-score', s1));
                            parts.push(item('ticker-vs', 'vs'));
                            parts.push(item('ticker-team', t2));
                            if (s2) parts.push(item('ticker-score', s2));
                            if (detail) parts.push(item('ticker-status', `Â· ${detail}`));
                        } else if (state === 'post') {
                            // Completed match
                            parts.push(item('ticker-team', `âœ… ${t1} ${s1} vs ${t2} ${s2}`));
                            if (detail) parts.push(item('ticker-status', `Â· ${detail}`));
                        } else {
                            // Scheduled match
                            const time = ev.date ? new Date(ev.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' }) : '';
                            parts.push(item('ticker-team', `ðŸ• ${t1} vs ${t2}`));
                            if (time) parts.push(item('ticker-status', `Â· Today ${time} IST`));
                        }
                    } catch (e) {}
                });

                return parts;
            }

            async function fetchScores() {
                try {
                    const res = await fetch(ESPN_API);
                    if (!res.ok) throw new Error('ESPN API error');
                    const data = await res.json();
                    track.innerHTML = buildTickerHTML(parseESPN(data));
                track.style.animation = 'none';
                track.offsetHeight; // reflow
                track.style.animation = '';
                } catch (e) {
                    track.innerHTML = item('ticker-status', 'ðŸ IPL scores temporarily unavailable').repeat(4);
                }
                const now = new Date();
                refreshEl.textContent = `â†» ${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}:${now.getSeconds().toString().padStart(2,'0')}`;
            }

            fetchScores();
            setInterval(fetchScores, 5000);
        })();



    //  SHASTRA AI CHAT ENGINE 
    const CHAT_KB = [
      { keys:['hello','hi','hey','namaste','hii','start'], reply: "Namaste!  I'm <b>SHASTRA AI</b>, your 3D assistant. How can I help you today?" },
      { keys:['course','training','learn','teach'], reply: "We offer 3 flagship programs: <b>Algorithms</b>, <b>Vybe Coding</b>, and <b>AI Tools</b>. Next batch starts <b>April 26th</b>!" },
      { keys:['enroll','join','register','apply','fee'], reply: "To enroll, visit <b>Connect.ai</b> on our site or email <a href='mailto:theaishastra@gmail.com'>theaishastra@gmail.com</a>. We'll onboard you in 24 hours!" },
      { keys:['business','enterprise','solution','automate'], reply: "Our <b>Forge Room</b> provides Process Automation, Custom AI Agents, and Business Intelligence for companies. Reach us at <b>+91 63096 46644</b>." },
      { keys:['internship','job','career','trainee'], reply: "Our <b>Tribe Internship</b> is a 2-month intensive program on live AI projects. Top performers get full-time offers!" },
      { keys:['who built','team','founder','hrushi'], reply: "Built by <b>The Council</b> (Hrushi, Bhavaani, Deekshitha, Bhaskar, Mohan) — the minds behind The AI Shastra." },
      { keys:['contact','phone','email','address','location'], reply: " <b>Connect:</b><br> theaishastra@gmail.com<br> +91 63096 46644<br> Hyderabad, India" },
      { keys:['thank','great','awesome','helpful'], reply: "You're welcome!  Knowledge is our supreme goal. Anything else?" },
      { keys:['bye','goodbye','later'], reply: "Goodbye!  See you soon in the AI world!" }
    ];

    let isMuted = false;
    let isListening = false;
    const speechSnyder = window.speechSynthesis;
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognizer;

    if (Recognition) {
      recognizer = new Recognition();
      recognizer.continuous = false;
      recognizer.interimResults = false;
      recognizer.lang = 'en-US'; // Native English (US) for better fluency
      
      recognizer.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        document.getElementById('userInput').value = transcript;
        stopListeningUI();
        sendChatMessage();
      };
      recognizer.onerror = () => stopListeningUI();
      recognizer.onend = () => stopListeningUI();
    }

    function toggleChat() {
      const box = document.getElementById('chatbox');
      const launch = document.getElementById('launcher');
      const notif = document.getElementById('notifBubble');
      const isOpen = box.classList.toggle('visible');
      launch.classList.toggle('chat-open');
      if (notif) notif.style.display = 'none';
      if (isOpen) {
        document.getElementById('chatTime').textContent = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        if (document.getElementById('chatMessages').children.length <= 1) {
          setTimeout(() => botRespond("Namaste! I am your Shastra AI assistant. How may I guide you today?"), 600);
        }
        setTimeout(() => document.getElementById('userInput').focus(), 400);
      }
    }

    function sendChatMessage() {
      const inp = document.getElementById('userInput');
      const val = inp.value.trim();
      if (!val) return;
      inp.value = '';
      appendMsg(val, 'user');
      
      const botReply = getChatReply(val);
      setTimeout(() => botRespond(botReply), 800);
    }

    function getChatReply(input) {
      const q = input.toLowerCase();
      const match = CHAT_KB.find(item => item.keys.some(k => q.includes(k)));
      return match ? match.reply : "I'm still learning about that.  Please ask about our <b>courses, business solutions, or internships</b>!";
    }

    function botRespond(html) {
      appendMsg(html, 'bot');
      if (!isMuted) {
        const cleanText = html.replace(/<[^>]*>/g, '');
        const utter = new SpeechSynthesisUtterance(cleanText);
        
        // Find best native English voice
        const voices = speechSnyder.getVoices();
        const preferredVoice = voices.find(v => v.name.includes("Google US English") || v.name.includes("Microsoft Zira") || (v.lang === 'en-US' && v.localService));
        if (preferredVoice) utter.voice = preferredVoice;

        utter.lang = 'en-US';
        utter.rate = 1.0; 
        utter.pitch = 1.0;
        speechSnyder.speak(utter);
        
        document.getElementById('voiceWave').classList.add('active');
        utter.onend = () => document.getElementById('voiceWave').classList.remove('active');
      }
    }

    function appendMsg(content, side) {
      const msgs = document.getElementById('chatMessages');
      const row = document.createElement('div');
      row.className = "msg-row " + side;
      const avatar = side === 'bot' ? "<img src='assets/shastra_robot_3d_floating.png' class='bot-avatar-mini'>" : "";
      row.innerHTML = avatar + "<div class='bubble " + side + "'>" + content + "</div>";
      msgs.appendChild(row);
      msgs.scrollTop = msgs.scrollHeight;
    }

    function handleChatKey(e) { if (e.key === 'Enter') sendChatMessage(); }
    function quickSend(t) { document.getElementById('userInput').value = t; sendChatMessage(); }
    function toggleMute() { isMuted = !isMuted; document.getElementById('voiceToggle').textContent = isMuted ? '🔇' : '🔊'; document.getElementById('voiceToggle').classList.toggle('muted', isMuted); }

    function toggleSpeech() {
      if (!recognizer) return alert("Speech recognition not supported in this browser.");
      if (isListening) { recognizer.stop(); stopListeningUI(); } 
      else { recognizer.start(); startListeningUI(); }
    }
    function startListeningUI() { isListening = true; document.getElementById('micBtn').classList.add('active'); }
    function stopListeningUI() { isListening = false; document.getElementById('micBtn').classList.remove('active'); }

    // Hide notif after 8s
    setTimeout(() => { const n = document.getElementById('notifBubble'); if (n) n.style.opacity = '0'; }, 8000);

