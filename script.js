/* =====================================================
   GOKUL CYBERSECURITY PORTFOLIO — JavaScript
   ===================================================== */

/* ---- Matrix / Particle Canvas Background ---- */
const canvas = document.getElementById('matrix-canvas');
const ctx    = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const chars = '01アイウエオカキクケコサシスセソタチツテト>#$%@!?';
const cols  = Math.floor(canvas.width / 18);
const drops = Array(cols).fill(1);

function drawMatrix() {
  ctx.fillStyle = 'rgba(2, 8, 16, 0.04)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#00d4ff';
  ctx.font = '14px Share Tech Mono, monospace';
  drops.forEach((y, i) => {
    const char = chars[Math.floor(Math.random() * chars.length)];
    ctx.fillText(char, i * 18, y * 18);
    if (y * 18 > canvas.height && Math.random() > 0.975) drops[i] = 0;
    drops[i]++;
  });
}
setInterval(drawMatrix, 60);

/* ---- Navbar scroll + active link ---- */
const navbar = document.getElementById('navbar');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  // Scrolled style
  if (window.scrollY > 60) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');

  // Active nav link
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) current = section.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
  });
});

/* ---- Hamburger menu ---- */
const hamburger = document.getElementById('hamburger-btn');
const navLinksEl = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinksEl.classList.toggle('open');
});
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinksEl.classList.remove('open');
  });
});

/* ---- Typed text animation ---- */
const typedEl = document.getElementById('typed-text');
const roles   = [
  'Cybersecurity Analyst',
  'Threat Hunter',
  'Penetration Tester',
  'SOC Analyst',
  'Security Researcher'
];
let roleIdx  = 0;
let charIdx  = 0;
let deleting = false;

function typeLoop() {
  const current = roles[roleIdx];
  if (!deleting) {
    typedEl.textContent = current.substring(0, charIdx + 1);
    charIdx++;
    if (charIdx === current.length) {
      setTimeout(() => { deleting = true; typeLoop(); }, 2000);
      return;
    }
  } else {
    typedEl.textContent = current.substring(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) {
      deleting = false;
      roleIdx  = (roleIdx + 1) % roles.length;
    }
  }
  setTimeout(typeLoop, deleting ? 60 : 90);
}
typeLoop();

/* ---- Counter animation ---- */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const start    = performance.now();
  function step(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}

/* ---- Skill bar animation ---- */
function animateSkillBars(container) {
  container.querySelectorAll('.skill-fill').forEach(bar => {
    bar.style.width = bar.dataset.width + '%';
  });
}

/* ---- Intersection Observer (scroll reveal + triggers) ---- */
const revealEls = document.querySelectorAll('.reveal');
const statNumbers = document.querySelectorAll('.stat-number');
const skillContainers = document.querySelectorAll('.skill-category');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));

// Counters
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
statNumbers.forEach(el => counterObserver.observe(el));

// Skill bars
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateSkillBars(entry.target);
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
skillContainers.forEach(el => skillObserver.observe(el));

/* ---- Add reveal classes to elements dynamically ---- */
function addReveal(selector, delayStep = 100) {
  document.querySelectorAll(selector).forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${i * delayStep}ms`;
  });
}
addReveal('.about-card',      100);
addReveal('.timeline-item',   120);
addReveal('.project-card',    100);
addReveal('.cert-card',       100);
addReveal('.skill-category',  100);
addReveal('.contact-item',     80);
addReveal('.section-header',    0);

// Re-observe after adding reveal classes
revealEls.forEach(el => revealObserver.unobserve(el));
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ---- Contact form ---- */
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = document.getElementById('form-submit-btn');
  btn.disabled = true;
  btn.innerHTML = '<span>Sending...</span>';
  setTimeout(() => {
    formSuccess.classList.add('visible');
    btn.innerHTML = '<span>✓ Sent!</span>';
    contactForm.reset();
    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = '<span>Send Message</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
      formSuccess.classList.remove('visible');
    }, 4000);
  }, 1200);
});

/* ---- Smooth scroll for anchor links ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ---- Cursor glow effect (desktop only) ---- */
if (window.matchMedia('(min-width: 900px)').matches) {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed; pointer-events: none; z-index: 9999;
    width: 300px; height: 300px; border-radius: 50%;
    background: radial-gradient(circle, rgba(0,212,255,0.04) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: opacity 0.3s ease;
  `;
  document.body.appendChild(glow);
  document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });
}
