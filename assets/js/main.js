/* =============================================
   RAGE — Site Scripts
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ----- Subtle parallax on hands when mouse moves ----- */
  const hands = document.querySelectorAll('.hand');
  if (hands.length && !('ontouchstart' in window)) {
    document.addEventListener('mousemove', (e) => {
      const mx = (e.clientX / window.innerWidth  - 0.5) * 2; // -1 to 1
      const my = (e.clientY / window.innerHeight - 0.5) * 2;
      hands.forEach((h) => {
        const depth = h.dataset.depth || 12;
        const tx = mx * depth;
        const ty = my * depth;
        h.style.transform = `translate(${tx}px, ${ty}px)`;
      });
    });
  }

  /* ----- XP window close button ----- */
  document.querySelectorAll('.win__ctrl-btn--close').forEach((btn) => {
    btn.addEventListener('click', () => {
      const win = btn.closest('.win');
      if (win) {
        win.style.transition = 'opacity .3s ease, transform .3s ease';
        win.style.opacity = '0';
        win.style.transform = 'scale(.95)';
        setTimeout(() => { win.style.display = 'none'; }, 300);
      }
    });
  });

  /* ----- XP window minimize button (shrink body) ----- */
  document.querySelectorAll('.win__ctrl-btn--min').forEach((btn) => {
    btn.addEventListener('click', () => {
      const body = btn.closest('.win')?.querySelector('.win__body');
      if (body) {
        body.style.display = body.style.display === 'none' ? '' : 'none';
      }
    });
  });

  /* ----- Intersection Observer for fade-in animations ----- */
  const faders = document.querySelectorAll('.fade-in');
  if (faders.length && 'IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    faders.forEach((el) => {
      el.style.animationPlayState = 'paused';
      obs.observe(el);
    });
  }

});
