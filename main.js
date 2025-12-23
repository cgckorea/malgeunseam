// ✅ 새로고침/뒤로가기에서도 스크롤 복원 막기 + 항상 맨 위
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

(() => {
  // ---------------------------
  // helpers
  // ---------------------------
  const rafThrottle = (fn) => {
    let rafId = null;
    return () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        fn();
      });
    };
  };

  // ---------------------------
  // on load: scroll top
  // ---------------------------
  window.addEventListener("load", () => {
    window.scrollTo(0, 0);
    setTimeout(() => window.scrollTo(0, 0), 50);
  });

  document.addEventListener("DOMContentLoaded", () => {
    /* ---------------------------
     * HEADER / NAV
     * --------------------------- */
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

    /* ---------------------------
     * PARALLAX + hero-ready 토글
     * --------------------------- */
    const hero = document.querySelector(".hero");
    const text = document.querySelector(".hero-tagline-meta");
    const tagline = document.querySelector(".hero-tagline"); // ✅ 추가
    const visual = document.querySelector(".hero-visual");   // 있을 수도/없을 수도

    // row는 CSS에서 제어하지만, 존재 여부는 확인만 (없어도 동작하도록)
    const row = document.querySelector(".hero-tagline-row");

    // ✅ hero + (text 또는 tagline 또는 visual) 중 하나라도 있으면 동작
    if (hero && (text || tagline || visual)) {
      const TEXT_SPEED = 0.1;    // meta 텍스트 시차 (지금은 주석처리 상태)
      const IMG_SPEED = 1.3;     // 이미지 시차
      const TAG_SPEED = 0.22;    // ✅ 큰 타이틀 시차 (0.15~0.35 추천)
      const MOVE_PX = 720;

      // ✅ row가 보이기 시작하는 지점(0~1). 취향대로 0.03~0.10 추천
      const REVEAL_START = 0.06;

      const update = () => {
        const rect = hero.getBoundingClientRect();
        const vh = window.innerHeight || document.documentElement.clientHeight;
        const scrollY = window.scrollY || window.pageYOffset;

        const heroTopAbs = scrollY + rect.top;
        const heroH = hero.offsetHeight;

        // hero가 화면에 들어오기 직전 ~ hero가 완전히 지나간 뒤까지를 0~1로
        const start = heroTopAbs - vh;
        const end = heroTopAbs + heroH;
        const denom = (end - start) || 1;

        let t = (scrollY - start) / denom;
        if (t < 0) t = 0;
        if (t > 1) t = 1;

        // ✅ hero-ready 토글 (CSS가 row 표시/숨김 담당)
        hero.classList.toggle("hero-ready", t >= REVEAL_START);

        const base = t * MOVE_PX;

        // ✅ meta 텍스트 시차(원하면 주석 해제)
        // if (text) text.style.setProperty("--ty", `${-base * TEXT_SPEED}px`);

        // ✅ hero-visual이 있을 때만 적용
        if (visual) visual.style.setProperty("--vy", `${-base * IMG_SPEED}px`);

        // ✅ hero-tagline(큰 타이틀) 시차 적용
        if (tagline) tagline.style.setProperty("--tagY", `${-base * TAG_SPEED}px`);
      };

      const onScroll = rafThrottle(update);

      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);

      // ✅ 초기 상태 강제: DOMContentLoaded 직후 1번
      update();

      // ✅ load 이후(이미지/폰트 로딩 뒤) 한 번 더
      window.addEventListener("load", () => {
        requestAnimationFrame(() => {
          update();
          setTimeout(update, 60);
        });
      });
    }

    /* ---------------------------
     * REVEAL (IntersectionObserver)
     * --------------------------- */
    const items = document.querySelectorAll(".reveal");
    if (items.length) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) e.target.classList.add("is-visible");
            else e.target.classList.remove("is-visible");
          });
        },
        { threshold: 0.18, rootMargin: "0px 0px -12% 0px" }
      );

      items.forEach((el) => io.observe(el));
    }
  });
})();

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".philo-card[data-bg]").forEach((card) => {
    const src = card.getAttribute("data-bg");
    if (src) {
      card.style.backgroundImage = `url("${src}")`;
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const slider = document.querySelector("#productSlider");
  if (!slider) return;

  const track = slider.querySelector(".product-track");
  const cards = Array.from(track.querySelectorAll(".product-card"));

  // ✅ 슬라이더 안에서만 버튼 찾기 (핵심 수정)
  const prevBtn = slider.closest(".section-wide-inner")?.querySelector('[data-product-dir="-1"]');
  const nextBtn = slider.closest(".section-wide-inner")?.querySelector('[data-product-dir="1"]');

  let index = 0;

  const getVisibleCount = () => {
    const w = window.innerWidth;
    if (w <= 640) return 1;
    if (w <= 992) return 2;
    return 4;
  };

  const update = () => {
    const visible = getVisibleCount();
    const maxIndex = Math.max(0, cards.length - visible);

    if (index > maxIndex) index = maxIndex;

    const gap = parseFloat(getComputedStyle(track).gap) || 24;  // ✅ gap을 CSS에서 읽음
    const cardW = cards[0]?.getBoundingClientRect().width || 0;
    const x = index * (cardW + gap);

    track.style.transform = `translateX(${-x}px)`;

    if (prevBtn) prevBtn.disabled = index <= 0;
    if (nextBtn) nextBtn.disabled = index >= maxIndex;
  };

  const move = (dir) => {
    const visible = getVisibleCount();
    const maxIndex = Math.max(0, cards.length - visible);
    index = Math.min(maxIndex, Math.max(0, index + dir));
    update();
  };

  prevBtn?.addEventListener("click", () => move(-1));
  nextBtn?.addEventListener("click", () => move(1));

  window.addEventListener("resize", () => requestAnimationFrame(update));
  update();
});
