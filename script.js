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

// Pricing accordion
const spazaToggle  = document.getElementById('spaza-toggle');
const spazaContent = document.getElementById('spaza-content');
const spazaChevron = document.getElementById('spaza-chevron');

spazaToggle.addEventListener('click', () => {
  const isOpen = spazaToggle.getAttribute('aria-expanded') === 'true';
  spazaToggle.setAttribute('aria-expanded', String(!isOpen));
  spazaContent.style.maxHeight = isOpen ? '0' : spazaContent.scrollHeight + 'px';
  spazaChevron.style.transform = isOpen ? '' : 'rotate(180deg)';
});

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
