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
  // Animate hamburger to X
  menuBars[0].style.transform = isOpen ? '' : 'translateY(8px) rotate(45deg)';
  menuBars[1].style.opacity = isOpen ? '1' : '0';
  menuBars[2].style.transform = isOpen ? '' : 'translateY(-8px) rotate(-45deg)';
});

// Close mobile menu on link click
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
    menuBars[0].style.transform = '';
    menuBars[1].style.opacity = '1';
    menuBars[2].style.transform = '';
  });
});

// Pricing accordion
const spazaToggle = document.getElementById('spaza-toggle');
const spazaContent = document.getElementById('spaza-content');
const spazaChevron = document.getElementById('spaza-chevron');

spazaToggle.addEventListener('click', () => {
  const isOpen = spazaToggle.getAttribute('aria-expanded') === 'true';
  spazaToggle.setAttribute('aria-expanded', String(!isOpen));
  spazaContent.style.maxHeight = isOpen ? '0' : spazaContent.scrollHeight + 'px';
  spazaChevron.style.transform = isOpen ? '' : 'rotate(180deg)';
});

// Smooth scroll for anchor links (handles offset for fixed nav)
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
