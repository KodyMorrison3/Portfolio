const progress = document.querySelector('.scroll-progress');
const revealItems = document.querySelectorAll('.reveal');
const magneticItems = document.querySelectorAll('.magnetic');

const updateProgress = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${scrollable > 0 ? window.scrollY / scrollable : 0})`;
};

window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealItems.forEach((item) => {
  if (!item.classList.contains('reveal-delay-1') && !item.classList.contains('reveal-delay-3')) {
    observer.observe(item);
  }
});

if (window.matchMedia('(pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  magneticItems.forEach((item) => {
    item.addEventListener('pointermove', (event) => {
      const rect = item.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      item.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
    });

    item.addEventListener('pointerleave', () => {
      item.style.transform = '';
    });
  });
}
