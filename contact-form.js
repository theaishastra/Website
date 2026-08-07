/* ═══════════════════════════════════════════════════════════════
   CONTACT FORM — GOOGLE APPS SCRIPT INTEGRATION
   File: contact-form.js

   Paste your Apps Script Web App URL below (see
   appscript-contact-backend.gs for the backend + deploy steps).
   ═══════════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    /* ①  this YOUR APPS SCRIPT WEB APP URL — FILL THIS IN (ends in /exec) */
    const APPSCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyWRBrGSlmTbNZFvF6XrG3bDT9dyGHk2_hcPDFFZq2tp5yFJ3Istah69GMEUXqXrTRZXA/exec';


    /* ── SUBMIT TO APPS SCRIPT ── */
    async function submitToAppsScript(payload) {
        const res = await fetch(APPSCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // avoids CORS preflight
            body: JSON.stringify(payload),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.ok) {
            throw new Error(data.error || `Apps Script HTTP ${res.status}`);
        }
        return true;
    }


    /* ══════════════════════════════════════════
       VALIDATION
    ══════════════════════════════════════════ */
    function validate(fname, femail, fphone, fmessage) {
        let ok = true;
        [fname, femail, fphone, fmessage].forEach(clearError);

        if (!fname.value.trim() || fname.value.trim().length < 2) {
            showError(fname, 'Please enter your full name'); ok = false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(femail.value.trim())) {
            showError(femail, 'Please enter a valid email address'); ok = false;
        }
        if (!/^[0-9+\-\s()]{7,15}$/.test(fphone.value.trim())) {
            showError(fphone, 'Please enter a valid mobile number'); ok = false;
        }
        if (!fmessage.value.trim() || fmessage.value.trim().length < 10) {
            showError(fmessage, 'Message too short (min 10 characters)'); ok = false;
        }
        return ok;
    }

    function showError(input, msg) {
        input.style.borderColor = '#ef4444';
        input.style.background = '#fff1f2';
        input.style.animation = 'csbShake 0.4s ease';
        setTimeout(() => (input.style.animation = ''), 400);
        const err = document.createElement('div');
        err.className = 'csb-field-error';
        err.style.cssText = 'display:flex;align-items:center;gap:5px;font-size:0.72rem;color:#ef4444;font-weight:600;margin-top:5px;padding-left:4px;';
        err.innerHTML = `<i class="fas fa-circle-exclamation" style="font-size:0.65rem"></i>${msg}`;
        input.parentNode.appendChild(err);
    }

    function clearError(input) {
        input.style.borderColor = '';
        input.style.background = '';
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
                Your message has been received &amp; a confirmation email is on its way to your inbox.
            </p>

            <div style="display:flex;flex-direction:column;gap:10px;width:100%;max-width:300px;animation:csbFadeUp 0.5s 0.6s both;">
                <div style="display:flex;align-items:center;gap:10px;background:rgba(34,197,94,0.07);border:1px solid rgba(34,197,94,0.15);border-radius:12px;padding:10px 16px;font-size:0.78rem;font-weight:700;color:#16a34a;">
                    <i class="fas fa-envelope" style="font-size:0.9rem;"></i>
                    <span>Message sent to our team</span>
                    <i class="fas fa-circle-check" style="margin-left:auto;color:#22c55e;"></i>
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
        const wrap = document.getElementById('csb-confetti');
        const colors = ['#22c55e', '#eab308', '#86efac', '#fef08a', '#4ade80', '#fbbf24'];
        for (let i = 0; i < 45; i++) {
            const dot = document.createElement('div');
            const sz = Math.random() * 9 + 5;
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

        const form = document.querySelector('.connectai-form');
        const fname = form.querySelector('#fname');
        const femail = form.querySelector('#femail');
        const fphone = form.querySelector('#fphone');
        const fmessage = form.querySelector('#fmessage');
        const btn = form.querySelector('.btn-submit');

        if (!validate(fname, femail, fphone, fmessage)) return;

        /* Mark fields green */
        [fname, femail, fphone, fmessage].forEach(f => {
            f.style.borderColor = '#22c55e';
            f.style.background = '';
        });

        /* Button → loading spinner */
        const origHTML = btn.innerHTML;
        btn.disabled = true;
        btn.style.color = 'transparent';
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

        const payload = {
            full_name: fname.value.trim(),
            email: femail.value.trim().toLowerCase(),
            phone: fphone.value.trim(),
            message: fmessage.value.trim(),
        };

        let ok = false;
        try {
            await submitToAppsScript(payload);
            ok = true;
        } catch (err) {
            console.error('[Contact Form] Apps Script error:', err);
        }

        /* Restore button */
        btn.innerHTML = origHTML;
        btn.disabled = false;
        btn.style.color = '';
        btn.style.position = '';

        if (ok) {
            const overlay = document.getElementById('csb-overlay');
            overlay.style.opacity = '1';
            overlay.style.pointerEvents = 'all';
            fireConfetti();
        } else {
            /* Failed — open mailto as fallback */
            const mailBody = encodeURIComponent(
                `Name: ${payload.full_name}\nEmail: ${payload.email}\nPhone: ${payload.phone}\n\nMessage:\n${payload.message}`
            );
            window.location.href = `mailto:theaishastra@gmail.com?subject=${encodeURIComponent('New Contact: ' + payload.full_name)}&body=${mailBody}`;

            btn.innerHTML = `<i class="fas fa-envelope"></i>&nbsp; Opening Email App…`;
            btn.style.background = 'linear-gradient(135deg,#3b82f6,#6366f1)';
            setTimeout(() => {
                btn.innerHTML = origHTML;
                btn.style.background = '';
            }, 3500);
        }
    }

    /* ── RESET ── */
    function resetForm() {
        const form = document.querySelector('.connectai-form');
        const overlay = document.getElementById('csb-overlay');
        form.reset();
        form.querySelectorAll('input,textarea').forEach(f => {
            f.style.borderColor = '';
            f.style.background = '';
        });
        form.querySelectorAll('.csb-field-error').forEach(el => el.remove());
        overlay.style.opacity = '0';
        overlay.style.pointerEvents = 'none';
        document.getElementById('csb-confetti').innerHTML = '';
    }

    /* ── INIT ── */
    function init() {
        const form = document.querySelector('.connectai-form');
        const wrap = document.querySelector('.connectai-right');
        if (!form || !wrap) return;

        injectKeyframes();
        buildOverlay(wrap);

        form.addEventListener('submit', handleSubmit);

        document.addEventListener('click', e => {
            if (e.target.closest('#csb-again-btn')) resetForm();
        });

        form.querySelectorAll('input,textarea').forEach(input => {
            input.addEventListener('input', () => {
                input.style.borderColor = '';
                input.style.background = '';
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
