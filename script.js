const revealItems = document.querySelectorAll('.reveal');
const magneticItems = document.querySelectorAll('.magnetic');
const glassItems = document.querySelectorAll('.site-header, .hero, .projects, .about, .stack, .contact, footer, .current-project, .project, .case-hero, .case-screenshot, .case-section');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reducedMotion && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

if (!reducedMotion && window.matchMedia('(pointer: fine)').matches) {
  glassItems.forEach((item) => {
    item.addEventListener('pointermove', (event) => {
      const rect = item.getBoundingClientRect();
      item.style.setProperty('--glass-x', `${event.clientX - rect.left - rect.width / 2}px`);
      item.style.setProperty('--glass-y', `${event.clientY - rect.top - rect.height / 2}px`);
    });

    item.addEventListener('pointerleave', () => {
      item.style.removeProperty('--glass-x');
      item.style.removeProperty('--glass-y');
    });
  });

  magneticItems.forEach((item) => {
    item.addEventListener('pointermove', (event) => {
      const rect = item.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;

      item.style.transform = `translate(${x * 0.06}px, ${y * 0.06}px)`;
    });

    item.addEventListener('pointerleave', () => {
      item.style.transform = '';
    });
  });
}
