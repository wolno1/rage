/* =============================================
   RAGE — Site Scripts
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ----- Page load reveal sequence ----- */
  const loader = document.getElementById('loader');
  const reveals = document.querySelectorAll('.reveal');

  function revealPage() {
    // Fade out the loading overlay
    loader.classList.add('loader--hidden');

    // Stagger the reveal of each element
    reveals.forEach((el, i) => {
      setTimeout(() => {
        el.classList.add('reveal--visible');
      }, 200 + i * 200);
    });

    // Remove loader from DOM after transition
    setTimeout(() => { loader.remove(); }, 800);
  }

  // Wait for all images + resources, then reveal
  if (document.readyState === 'complete') {
    revealPage();
  } else {
    window.addEventListener('load', revealPage);
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

  /* ----- Position secret button over left cluster window ----- */
  const secretBtn = document.getElementById('secretBtn');
  const leftWin = document.querySelector('.cluster--left .cluster__win');

  function positionSecretBtn() {
    if (!secretBtn || !leftWin) return;
    const rect = leftWin.getBoundingClientRect();
    secretBtn.style.left = (rect.left + rect.width / 2 - 20) + 'px';
    secretBtn.style.top  = (rect.top + rect.height / 2 - 20) + 'px';
  }

  if (secretBtn && leftWin) {
    positionSecretBtn();
    window.addEventListener('resize', positionSecretBtn);
    window.addEventListener('scroll', positionSecretBtn);
    setTimeout(positionSecretBtn, 1500);
  }

});
