// Desktop dropdowns
const desktopItems = document.querySelectorAll('.nav .item[data-dd]');

function closeAllDropdowns() {
  desktopItems.forEach(i => i.classList.remove('open'));
}

desktopItems.forEach(item => {
  item.addEventListener('mouseenter', () => {
    closeAllDropdowns();
    item.classList.add('open');
  });

  item.addEventListener('mouseleave', () => {
    item.classList.remove('open');
  });

  // click-to-toggle (접근성/터치 대응)
  item.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = item.classList.contains('open');
    closeAllDropdowns();
    if (!isOpen) item.classList.add('open');
  });
});

document.addEventListener('click', closeAllDropdowns);

// Language popover
const lang = document.getElementById('lang');
const langBtn = lang?.querySelector('.lang-btn');

if (lang && langBtn) {
  langBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = lang.classList.toggle('open');
    langBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  document.addEventListener('click', () => {
    lang.classList.remove('open');
    langBtn.setAttribute('aria-expanded', 'false');
  });
}

// Mobile menu toggle
const hamburger = document.getElementById('hamburger');
const mnav = document.getElementById('mnav');

if (hamburger && mnav) {
  hamburger.addEventListener('click', () => {
    const show = !mnav.classList.contains('show');
    mnav.classList.toggle('show', show);
    hamburger.setAttribute('aria-expanded', show ? 'true' : 'false');
  });
}

// Mobile accordion groups
document.querySelectorAll('.mgroup > button').forEach(btn => {
  btn.addEventListener('click', () => {
    // CONTACT 버튼(스크롤) 처리
    const scrollTarget = btn.getAttribute('data-scroll');
    if (scrollTarget) {
      const el = document.querySelector(scrollTarget);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    const group = btn.closest('.mgroup');
    if (!group) return;

    const isOpen = group.classList.contains('open');
    document.querySelectorAll('.mgroup').forEach(g => g.classList.remove('open'));
    if (!isOpen) group.classList.add('open');
  });
});

// Fake submit (데모)
const form = document.getElementById('contactForm');
const toast = document.getElementById('toast');
const submitBtn = document.getElementById('submitBtn');

if (form && toast && submitBtn) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    submitBtn.disabled = true;

    // 실제 전송 시:
    // fetch("/api/contact", { method:"POST", body: new FormData(form) })
    setTimeout(() => {
      toast.style.display = 'block';
      toast.textContent = '문의가 접수되었습니다. (데모) 실제 전송은 서버 연동이 필요합니다.';
      submitBtn.disabled = false;
      form.reset();
    }, 600);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("header");

  const toggleHeader = () => {
    if (!header) return;
    if (window.scrollY > 10) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  };

  window.addEventListener("scroll", toggleHeader, { passive: true });
  window.addEventListener("load", toggleHeader);

  if (header) {
    setTimeout(() => header.classList.add("nav-visible"), 700);
  }
});

window.addEventListener("load", () => {
  requestAnimationFrame(() => {
    document.body.classList.add("loaded");
  });
});

window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});