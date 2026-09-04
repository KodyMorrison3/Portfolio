const progress = document.querySelector('.scroll-progress');
const revealItems = document.querySelectorAll('.reveal');
const magneticItems = document.querySelectorAll('.magnetic');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let ticking = false;

const updateProgress = () => {
  if (!progress) return;

  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const amount = scrollable > 0 ? window.scrollY / scrollable : 0;
  progress.style.transform = `scaleX(${amount})`;
  ticking = false;
};

window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(updateProgress);
    ticking = true;
  }
}, { passive: true });

updateProgress();

if (!reducedMotion && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -4% 0px' });

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

if (!reducedMotion && window.matchMedia('(pointer: fine)').matches) {
  magneticItems.forEach((item) => {
    let frame;

    item.addEventListener('pointermove', (event) => {
      if (frame) cancelAnimationFrame(frame);

      frame = requestAnimationFrame(() => {
        const rect = item.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        item.style.transform = `translate(${x * 0.14}px, ${y * 0.14}px)`;
      });
    });

    item.addEventListener('pointerleave', () => {
      if (frame) cancelAnimationFrame(frame);
      item.style.transform = '';
    });
  });
}

window.addEventListener('load', () => {
  document.body.classList.remove('is-loading');
});
