/* =============================================
   RAGE — Site Scripts
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ----- Random title letter variants ----- */
  document.querySelectorAll('.hero__title img[data-letter]').forEach((img) => {
    const letter = img.dataset.letter;
    const variants = parseInt(img.dataset.variants, 10) || 1;
    const pick = Math.floor(Math.random() * variants) + 1;
    img.src = `assets/img/title/${letter}/${pick}.png`;
  });

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

  /* ----- Desync cluster character GIFs ----- */
  document.querySelectorAll('.cluster').forEach((cluster) => {
    const second = cluster.querySelector('.cluster__char--2');
    if (second) {
      const src = second.src;
      second.src = '';                       // pause the GIF
      setTimeout(() => { second.src = src; }, 200); // restart 400ms later
    }
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
