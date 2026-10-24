const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(pointer: fine)');

/* Reveal on scroll */
const revealItems = document.querySelectorAll('.reveal');
const showAll = () => revealItems.forEach((item) => item.classList.add('is-visible'));

if (!reducedMotion.matches && 'IntersectionObserver' in window) {
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
  showAll();
}

/* Light that follows the pointer.
   Only the surfaces that float above the page (header, project cards,
   current-project bar) track it. Both preferences are checked on every move,
   so changing them while the page is open takes effect straight away. */
const litSurfaces = document.querySelectorAll('.site-header, .current-project, .project');

litSurfaces.forEach((surface) => {
  let frame = 0;
  let x = 0;
  let y = 0;

  const clear = () => {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    surface.style.removeProperty('--glass-x');
    surface.style.removeProperty('--glass-y');
  };

  surface.addEventListener('pointermove', (event) => {
    if (reducedMotion.matches || !finePointer.matches) return;

    const rect = surface.getBoundingClientRect();
    x = event.clientX - rect.left - rect.width / 2;
    y = event.clientY - rect.top - rect.height / 2;

    if (!frame) {
      frame = requestAnimationFrame(() => {
        frame = 0;
        surface.style.setProperty('--glass-x', `${x}px`);
        surface.style.setProperty('--glass-y', `${y}px`);
      });
    }
  });

  surface.addEventListener('pointerleave', clear);
});
