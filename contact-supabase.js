/* ═══════════════════════════════════════════════════════════════
   CONTACT FORM — SUPABASE + EMAILJS INTEGRATION
   File: contact-supabase.js

   Add to index.html before </body>:
   <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
   <script src="contact-supabase.js"></script>
   ═══════════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    /* ════════════════════════════════════════════
       ①  YOUR CREDENTIALS — FILL THESE IN
    ════════════════════════════════════════════ */

    /* — SUPABASE — */
    const SUPABASE_URL      = 'https://vbctaamuyfpcqokpwatd.supabase.co';       // e.g. https://xyzabc.supabase.co
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZiY3RhYW11eWZwY3Fva3B3YXRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1MDQ0MjIsImV4cCI6MjA5MDA4MDQyMn0.nLAl3NML1ovQc7v2N7NF73q_j6bGU5_byjWjAldScXA';  // anon/public key
    const TABLE_NAME        = 'contact_submissions';

    /* — EMAILJS — */
    const EMAILJS_PUBLIC_KEY  = 'jGlUrMM5jn_A_44Vu';   // Account → API Keys → Public Key
    const EMAILJS_SERVICE_ID  = 'service_umt79jl';   // Email Services → Service ID
    const EMAILJS_TEMPLATE_ID = 'template_8lxdf75';  // Email Templates → Template ID

    /* ════════════════════════════════════════════ */


    /* ── SUPABASE SAVE ── */
    async function saveToSupabase(payload) {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE_NAME}`, {
            method : 'POST',
            headers: {
                'Content-Type'  : 'application/json',
                'apikey'        : SUPABASE_ANON_KEY,
                'Authorization' : `Bearer ${SUPABASE_ANON_KEY}`,
                'Prefer'        : 'return=minimal',
            },
            body: JSON.stringify(payload),
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || `Supabase HTTP ${res.status}`);
        }
        return true;
    }

    /* ── EMAILJS SEND ── */
    /* EmailJS template variables used:
       {{to_name}}    — user's full name
       {{to_email}}   — user's email (EmailJS sends TO this)
       {{subject}}    — their subject
       {{message}}    — their message
       {{reply_to}}   — same as to_email for reply
       {{from_name}}  — "The AI Shastra"
    */
    async function sendEmail(payload) {
        if (typeof emailjs === 'undefined') {
            console.warn('[AI Shastra] EmailJS not loaded — skipping email.');
            return false;
        }
        await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            {
                to_name  : payload.full_name,
                to_email : payload.email,
                subject  : payload.subject,
                message  : payload.message,
                reply_to : payload.email,
                from_name: 'The AI Shastra',
            },
            EMAILJS_PUBLIC_KEY
        );
        return true;
    }


    /* ══════════════════════════════════════════
       VALIDATION
    ══════════════════════════════════════════ */
    function validate(fname, femail, fsubject, fmessage) {
        let ok = true;
        [fname, femail, fsubject, fmessage].forEach(clearError);

        if (!fname.value.trim() || fname.value.trim().length < 2) {
            showError(fname, 'Please enter your full name'); ok = false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(femail.value.trim())) {
            showError(femail, 'Please enter a valid email address'); ok = false;
        }
        if (!fsubject.value.trim() || fsubject.value.trim().length < 3) {
            showError(fsubject, 'Please enter a subject'); ok = false;
        }
        if (!fmessage.value.trim() || fmessage.value.trim().length < 10) {
            showError(fmessage, 'Message too short (min 10 characters)'); ok = false;
        }
        return ok;
    }

    function showError(input, msg) {
        input.style.borderColor = '#ef4444';
        input.style.background  = '#fff1f2';
        input.style.animation   = 'csbShake 0.4s ease';
        setTimeout(() => (input.style.animation = ''), 400);
        const err = document.createElement('div');
        err.className = 'csb-field-error';
        err.style.cssText = 'display:flex;align-items:center;gap:5px;font-size:0.72rem;color:#ef4444;font-weight:600;margin-top:5px;padding-left:4px;';
        err.innerHTML = `<i class="fas fa-circle-exclamation" style="font-size:0.65rem"></i>${msg}`;
        input.parentNode.appendChild(err);
    }

    function clearError(input) {
        input.style.borderColor = '';
        input.style.background  = '';
        const old = input.parentNode.querySelector('.csb-field-error');
        if (old) old.remove();
    }


    /* ══════════════════════════════════════════
       SUCCESS OVERLAY
    ══════════════════════════════════════════ */
    function buildOverlay(wrap) {
        const overlay = document.createElement('div');
        overlay.id = 'csb-overlay';
        overlay.style.cssText = `
            position:absolute;inset:0;border-radius:30px;
            background:linear-gradient(135deg,#f0fdf4 0%,#ffffff 60%,#fefce8 100%);
            border:1.5px solid rgba(34,197,94,0.2);
            display:flex;flex-direction:column;align-items:center;justify-content:center;
            z-index:50;opacity:0;pointer-events:none;
            transition:opacity 0.5s ease;text-align:center;padding:40px 30px;overflow:hidden;
        `;
        overlay.innerHTML = `
            <div id="csb-confetti" style="position:absolute;inset:0;pointer-events:none;overflow:hidden;"></div>

            <div style="
                width:90px;height:90px;border-radius:50%;
                background:linear-gradient(135deg,#22c55e,#eab308);
                display:flex;align-items:center;justify-content:center;
                margin-bottom:22px;
                animation:csbRingPop 0.6s cubic-bezier(0.175,0.885,0.32,1.275) both;
            ">
                <i class="fas fa-check" style="color:white;font-size:2.2rem;"></i>
            </div>

            <h3 style="font-family:'Space Grotesk',sans-serif;font-size:1.6rem;font-weight:800;color:#0f172a;letter-spacing:-0.5px;margin-bottom:10px;animation:csbFadeUp 0.5s 0.3s both;">
                Signal Transmitted!
            </h3>
            <p style="font-size:0.92rem;color:#64748b;line-height:1.65;max-width:320px;margin:0 auto 20px;animation:csbFadeUp 0.5s 0.45s both;">
                Your message is saved &amp; a confirmation email has been sent to your inbox.
            </p>

            <div style="display:flex;flex-direction:column;gap:10px;width:100%;max-width:300px;animation:csbFadeUp 0.5s 0.6s both;">
                <div style="display:flex;align-items:center;gap:10px;background:rgba(34,197,94,0.07);border:1px solid rgba(34,197,94,0.15);border-radius:12px;padding:10px 16px;font-size:0.78rem;font-weight:700;color:#16a34a;">
                    <i class="fas fa-database" style="font-size:0.9rem;"></i>
                    <span>Saved to AI Shastra database</span>
                    <i class="fas fa-circle-check" style="margin-left:auto;color:#22c55e;"></i>
                </div>
                <div style="display:flex;align-items:center;gap:10px;background:rgba(234,179,8,0.07);border:1px solid rgba(234,179,8,0.2);border-radius:12px;padding:10px 16px;font-size:0.78rem;font-weight:700;color:#ca8a04;">
                    <i class="fas fa-envelope" style="font-size:0.9rem;"></i>
                    <span>Confirmation email sent</span>
                    <i class="fas fa-circle-check" style="margin-left:auto;color:#eab308;" id="csb-email-tick"></i>
                </div>
            </div>

            <button id="csb-again-btn" style="
                margin-top:22px;padding:11px 28px;background:transparent;
                border:2px solid rgba(34,197,94,0.3);border-radius:50px;
                font-size:0.8rem;font-weight:700;color:#16a34a;cursor:pointer;
                transition:all 0.3s;font-family:inherit;letter-spacing:0.5px;
                animation:csbFadeUp 0.5s 0.75s both;
            "
            onmouseover="this.style.background='#22c55e';this.style.color='white';this.style.borderColor='#22c55e';"
            onmouseout="this.style.background='transparent';this.style.color='#16a34a';this.style.borderColor='rgba(34,197,94,0.3)';">
                Send Another Message &nbsp;→
            </button>
        `;
        wrap.appendChild(overlay);
    }

    /* ── CONFETTI ── */
    function fireConfetti() {
        const wrap   = document.getElementById('csb-confetti');
        const colors = ['#22c55e','#eab308','#86efac','#fef08a','#4ade80','#fbbf24'];
        for (let i = 0; i < 45; i++) {
            const dot = document.createElement('div');
            const sz  = Math.random() * 9 + 5;
            dot.style.cssText = `
                position:absolute;width:${sz}px;height:${sz}px;
                border-radius:${Math.random() > 0.5 ? '50%' : '2px'};
                background:${colors[Math.floor(Math.random() * colors.length)]};
                left:${Math.random() * 100}%;top:-10px;
                animation:csbFall ${Math.random() * 1.5 + 1.2}s ${Math.random() * 0.6}s linear forwards;
            `;
            wrap.appendChild(dot);
            dot.addEventListener('animationend', () => dot.remove());
        }
    }

    /* ── KEYFRAMES ── */
    function injectKeyframes() {
        if (document.getElementById('csb-kf')) return;
        const s = document.createElement('style');
        s.id = 'csb-kf';
        s.textContent = `
            @keyframes csbRingPop {
                0%  { transform:scale(0) rotate(-180deg); opacity:0; }
                60% { transform:scale(1.15) rotate(10deg); opacity:1; }
                100%{ transform:scale(1) rotate(0deg); opacity:1; }
            }
            @keyframes csbFadeUp {
                from{ opacity:0; transform:translateY(14px); }
                to  { opacity:1; transform:translateY(0); }
            }
            @keyframes csbShake {
                0%,100%{ transform:translateX(0); }
                20%    { transform:translateX(-6px); }
                40%    { transform:translateX(6px); }
                60%    { transform:translateX(-4px); }
                80%    { transform:translateX(4px); }
            }
            @keyframes csbFall {
                0%  { transform:translateY(-10px) rotate(0deg); opacity:1; }
                100%{ transform:translateY(600px) rotate(720deg); opacity:0; }
            }
            @keyframes csbSpin {
                to{ transform:translate(-50%,-50%) rotate(360deg); }
            }
        `;
        document.head.appendChild(s);
    }


    /* ══════════════════════════════════════════
       SUBMIT HANDLER
    ══════════════════════════════════════════ */
    async function handleSubmit(e) {
        e.preventDefault();

        const form     = document.querySelector('.quantum-form');
        const fname    = form.querySelector('#fname');
        const femail   = form.querySelector('#femail');
        const fsubject = form.querySelector('#fsubject');
        const fmessage = form.querySelector('#fmessage');
        const btn      = form.querySelector('.btn-transmit');

        if (!validate(fname, femail, fsubject, fmessage)) return;

        /* Mark fields green */
        [fname, femail, fsubject, fmessage].forEach(f => {
            f.style.borderColor = '#22c55e';
            f.style.background  = '';
        });

        /* Button → loading spinner */
        const origHTML = btn.innerHTML;
        btn.disabled = true;
        btn.style.color    = 'transparent';
        btn.style.position = 'relative';
        const spin = document.createElement('span');
        spin.style.cssText = `
            position:absolute;width:22px;height:22px;
            border:2.5px solid rgba(255,255,255,0.4);
            border-top-color:white;border-radius:50%;
            animation:csbSpin 0.7s linear infinite;
            top:50%;left:50%;transform:translate(-50%,-50%);
        `;
        btn.appendChild(spin);

        /* Payload — only 4 fields */
        const payload = {
            full_name : fname.value.trim(),
            email     : femail.value.trim().toLowerCase(),
            subject   : fsubject.value.trim(),
            message   : fmessage.value.trim(),
        };

        try {
            /* STEP 1 — Save to Supabase */
            await saveToSupabase(payload);

            /* STEP 2 — Send confirmation email via EmailJS */
            await sendEmail(payload);

            /* Restore button */
            btn.innerHTML = origHTML;
            btn.disabled  = false;
            btn.style.color    = '';
            btn.style.position = '';

            /* Show success overlay + confetti */
            const overlay = document.getElementById('csb-overlay');
            overlay.style.opacity      = '1';
            overlay.style.pointerEvents = 'all';
            fireConfetti();

        } catch (err) {
            console.error('[AI Shastra] Submission error:', err);

            btn.innerHTML      = `<i class="fas fa-triangle-exclamation"></i>&nbsp; Failed — Try Again`;
            btn.disabled       = false;
            btn.style.color    = '';
            btn.style.position = '';
            btn.style.background = 'linear-gradient(135deg,#ef4444,#f97316)';

            setTimeout(() => {
                btn.innerHTML        = origHTML;
                btn.style.background = '';
            }, 3500);
        }
    }

    /* ── RESET ── */
    function resetForm() {
        const form    = document.querySelector('.quantum-form');
        const overlay = document.getElementById('csb-overlay');
        form.reset();
        form.querySelectorAll('input,textarea').forEach(f => {
            f.style.borderColor = '';
            f.style.background  = '';
        });
        form.querySelectorAll('.csb-field-error').forEach(el => el.remove());
        overlay.style.opacity      = '0';
        overlay.style.pointerEvents = 'none';
        document.getElementById('csb-confetti').innerHTML = '';
    }

    /* ── INIT ── */
    function init() {
        const form = document.querySelector('.quantum-form');
        const wrap = document.querySelector('.contact-hub-form');
        if (!form || !wrap) return;

        /* Init EmailJS */
        if (typeof emailjs !== 'undefined') {
            emailjs.init(EMAILJS_PUBLIC_KEY);
        }

        injectKeyframes();
        buildOverlay(wrap);

        form.addEventListener('submit', handleSubmit);

        document.addEventListener('click', e => {
            if (e.target.closest('#csb-again-btn')) resetForm();
        });

        /* Clear errors on typing */
        form.querySelectorAll('input,textarea').forEach(input => {
            input.addEventListener('input', () => {
                input.style.borderColor = '';
                input.style.background  = '';
                const old = input.parentNode.querySelector('.csb-field-error');
                if (old) old.remove();
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();