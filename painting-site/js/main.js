// Mobile nav toggle
const hamburger = document.querySelector('.hamburger');
const navWrap = document.querySelector('.main-nav-wrap');
if (hamburger && navWrap) {
  hamburger.addEventListener('click', () => {
    navWrap.classList.toggle('open');
  });
}

// Close nav on outside click
document.addEventListener('click', (e) => {
  if (navWrap && !hamburger.contains(e.target) && !navWrap.contains(e.target)) {
    navWrap.classList.remove('open');
  }
});

// FAQ accordion
document.querySelectorAll('.faq-question').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.closest('.faq-item');
    const answer = item.querySelector('.faq-answer');
    const isOpen = answer.style.display === 'block';
    // Close all
    document.querySelectorAll('.faq-answer').forEach(a => a.style.display = 'none');
    document.querySelectorAll('.faq-question').forEach(q2 => q2.style.setProperty('--icon', '"+"'));
    // Open clicked
    if (!isOpen) {
      answer.style.display = 'block';
      q.style.setProperty('--icon', '"-"');
    }
  });
});

// Form submit placeholder
const forms = document.querySelectorAll('form');
forms.forEach(form => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type=submit]');
    if (btn) {
      btn.textContent = 'Message Sent! We\'ll contact you shortly.';
      btn.disabled = true;
      btn.style.background = '#1b5e20';
    }
  });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
