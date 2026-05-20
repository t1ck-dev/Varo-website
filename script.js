// Nav scroll effect
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
});

// Mobile menu
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const menuBars = document.querySelectorAll('.menu-bar');

menuBtn.addEventListener('click', () => {
  const isOpen = !mobileMenu.classList.contains('hidden');
  mobileMenu.classList.toggle('hidden', isOpen);
  menuBars[0].style.transform = isOpen ? '' : 'translateY(8px) rotate(45deg)';
  menuBars[1].style.opacity  = isOpen ? '1' : '0';
  menuBars[2].style.transform = isOpen ? '' : 'translateY(-8px) rotate(-45deg)';
});

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
    menuBars[0].style.transform = '';
    menuBars[1].style.opacity   = '1';
    menuBars[2].style.transform = '';
  });
});

// Pricing accordions
function makeAccordion(toggleId, contentId, chevronId) {
  const toggle  = document.getElementById(toggleId);
  const content = document.getElementById(contentId);
  const chevron = document.getElementById(chevronId);
  if (!toggle) return;
  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isOpen));
    content.style.maxHeight = isOpen ? '0' : content.scrollHeight + 'px';
    chevron.style.transform = isOpen ? '' : 'rotate(180deg)';
  });
}

makeAccordion('spaza-toggle', 'spaza-content', 'spaza-chevron');
makeAccordion('individual-toggle', 'individual-content', 'individual-chevron');

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (href.length <= 1) return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const offset = nav.offsetHeight + 16;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// Scroll reveal
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Animated counters
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1600;
  const step = 16;
  const increment = target / (duration / step);
  let current = 0;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      el.textContent = target + (target === 48 ? 'h' : '+');
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current) + (target === 48 ? 'h' : '+');
    }
  }, step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

// Phone mockup chat animation
function runChatAnimation() {
  const sequence = [
    { show: 'msg1',    delay: 400 },
    { show: 'typing1', delay: 900 },
    { hide: 'typing1', show: 'msg2', delay: 1600 },
    { show: 'msg3',    delay: 2200 },
    { show: 'typing2', delay: 2700 },
    { hide: 'typing2', show: 'msg4', delay: 3400 },
    { show: 'msg5',    delay: 4000 },
    { show: 'typing3', delay: 4500 },
    { hide: 'typing3', show: 'msg6', delay: 5300 },
    { notif: true,     delay: 5900 },
  ];

  sequence.forEach(({ show, hide, notif, delay }) => {
    setTimeout(() => {
      if (hide)  document.getElementById(hide)?.classList.remove('show');
      if (show)  document.getElementById(show)?.classList.add('show');
      if (notif) document.getElementById('lead-notif')?.classList.add('show');
    }, delay);
  });
}

// Trigger chat animation when hero is in view
const heroSection = document.querySelector('.hero-bg');
if (heroSection) {
  const heroObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      runChatAnimation();
      heroObserver.disconnect();
    }
  }, { threshold: 0.3 });
  heroObserver.observe(heroSection);
}

// Scratch & Win popup
(function () {
  const PRIZES = [
    { emoji: '🏅', label: 'You won!', value: '10% OFF',       sub: 'First month',         code: 'VARO10',   msg: 'Hi Varo! I scratched and won 10% off my first month (code: VARO10). I\'d love to get started!' },
    { emoji: '🎁', label: 'You won!', value: 'FREE Creative',  sub: 'Design (R150 value)', code: 'VAROGIFT', msg: 'Hi Varo! I scratched and won a free design creative (code: VAROGIFT). I\'d love to get started!' },
    { emoji: '⭐', label: 'Rare win!', value: '30% OFF',       sub: 'First month',         code: 'VARO30',   msg: 'Hi Varo! I scratched and won 30% off my first month (code: VARO30). I\'d love to get started!' }
  ];

  function pickPrize() {
    const r = Math.random();
    return r < 0.50 ? PRIZES[0] : r < 0.85 ? PRIZES[1] : PRIZES[2];
  }

  function makeEl(tag, cls, text) {
    const el = document.createElement(tag);
    if (cls)  el.className   = cls;
    if (text !== undefined) el.textContent = text;
    return el;
  }

  const overlay      = document.getElementById('vp-overlay');
  const backdrop     = document.getElementById('vp-backdrop');
  const closeBtn     = document.getElementById('vp-close');
  const form         = document.getElementById('vp-form');
  const errorEl      = document.getElementById('vp-error');
  const stepForm     = document.getElementById('vp-step-form');
  const stepScratch  = document.getElementById('vp-step-scratch');
  const stepClaimed  = document.getElementById('vp-step-claimed');
  const prizeEl      = document.getElementById('vp-prize');
  const canvas       = document.getElementById('vp-canvas');
  const claimBtn     = document.getElementById('vp-claim-btn');
  const codeEl       = document.getElementById('vp-code');
  const claimedBox   = document.getElementById('vp-claimed-display');
  const confettiWrap = document.getElementById('vp-confetti');

  const prize = pickPrize();
  let revealed = false;

  function openPopup()  { overlay.classList.add('active'); document.body.style.overflow = 'hidden'; }
  function closePopup() { overlay.classList.remove('active'); document.body.style.overflow = ''; localStorage.setItem('vp-seen', '1'); }

  if (!localStorage.getItem('vp-seen')) setTimeout(openPopup, 3200);

  closeBtn.addEventListener('click', closePopup);
  backdrop.addEventListener('click', closePopup);

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const name  = document.getElementById('vp-name').value.trim();
    const phone = document.getElementById('vp-phone').value.trim();
    const email = document.getElementById('vp-email').value.trim();

    if (!name || !phone || !email)                  { errorEl.textContent = 'Please fill in all fields.';        return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { errorEl.textContent = 'Please enter a valid email.';        return; }
    if (!/^[0-9+\s]{8,15}$/.test(phone))            { errorEl.textContent = 'Please enter a valid phone number.'; return; }

    errorEl.textContent      = '';
    stepForm.style.display    = 'none';
    stepScratch.style.display = 'block';

    prizeEl.textContent = '';
    prizeEl.appendChild(makeEl('div', 'pz-label', prize.emoji + ' ' + prize.label));
    prizeEl.appendChild(makeEl('div', 'pz-value', prize.value));
    prizeEl.appendChild(makeEl('div', 'pz-sub',   prize.sub));

    requestAnimationFrame(function () { requestAnimationFrame(initCanvas); });
  });

  function initCanvas() {
    var wrap = canvas.parentElement;
    var w = wrap.offsetWidth;
    var h = wrap.offsetHeight;
    canvas.width  = w;
    canvas.height = h;

    var ctx  = canvas.getContext('2d');
    var grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0,   '#b8b8b8');
    grad.addColorStop(0.4, '#d4d4d4');
    grad.addColorStop(0.7, '#a4a4a4');
    grad.addColorStop(1,   '#c0c0c0');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = 'rgba(90,90,90,0.12)';
    ctx.lineWidth   = 1;
    for (var x = 0; x < w; x += 12) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
    for (var y = 0; y < h; y += 12) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }

    ctx.fillStyle    = 'rgba(60,60,60,0.45)';
    ctx.font         = 'bold 14px Inter, sans-serif';
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✦  SCRATCH HERE  ✦', w / 2, h / 2);

    var isDown = false;

    function getPos(e) {
      var r = canvas.getBoundingClientRect();
      var s = e.touches ? e.touches[0] : e;
      return { x: (s.clientX - r.left) * (w / r.width), y: (s.clientY - r.top) * (h / r.height) };
    }

    function doScratch(e) {
      if (!isDown) return;
      e.preventDefault();
      var p = getPos(e);
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 24, 0, Math.PI * 2);
      ctx.fill();
      checkDone(ctx, w, h);
    }

    canvas.addEventListener('mousedown',  function () { isDown = true; });
    canvas.addEventListener('mouseup',    function () { isDown = false; });
    canvas.addEventListener('mouseleave', function () { isDown = false; });
    canvas.addEventListener('mousemove',  doScratch);
    canvas.addEventListener('touchstart', function (e) { isDown = true; e.preventDefault(); }, { passive: false });
    canvas.addEventListener('touchend',   function () { isDown = false; });
    canvas.addEventListener('touchmove',  doScratch, { passive: false });
  }

  function checkDone(ctx, w, h) {
    if (revealed) return;
    var data    = ctx.getImageData(0, 0, w, h).data;
    var cleared = 0;
    for (var i = 3; i < data.length; i += 4) { if (data[i] < 128) cleared++; }
    if (cleared / (data.length / 4) > 0.52) revealPrize();
  }

  function revealPrize() {
    revealed = true;
    canvas.style.transition = 'opacity 0.55s ease';
    canvas.style.opacity    = '0';
    setTimeout(function () {
      stepScratch.style.display = 'none';
      stepClaimed.style.display = 'block';

      claimedBox.textContent = '';
      claimedBox.appendChild(makeEl('div', 'vp-claimed-emoji', prize.emoji));
      claimedBox.appendChild(makeEl('div', 'vp-claimed-value', prize.value));
      claimedBox.appendChild(makeEl('div', 'vp-claimed-sub',   prize.sub));

      codeEl.textContent = prize.code;
      claimBtn.href = 'https://wa.me/27616133747?text=' + encodeURIComponent(prize.msg);
      spawnConfetti();
    }, 600);
  }

  function spawnConfetti() {
    var colors = ['#00E5A0', '#00c484', '#ffffff', '#ffd700', '#ff6b9d', '#7c3aed'];
    for (var i = 0; i < 22; i++) {
      var el = makeEl('div', 'vp-confetti-piece');
      el.style.left              = Math.random() * 100 + '%';
      el.style.background        = colors[i % colors.length];
      el.style.animationDelay    = (Math.random() * 0.4) + 's';
      el.style.animationDuration = (0.7 + Math.random() * 0.7) + 's';
      confettiWrap.appendChild(el);
    }
  }
}());
