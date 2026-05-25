
const STATE = {
  CLOSED: "closed",
  HALF: "half",
  FULL: "full"
};

/* =========================
   CONFIG
========================= */

const CONFIG = {
  MAX_UP: -220,        // FULL 上限
  CLOSE_THRESHOLD: 160
};

/* =========================
   ENTRY
========================= */

export function initDrawer() {
  initComment();
  initLike();
}

/* =========================
   COMMENT
========================= */

function initComment() {

  const overlay = document.getElementById("commentOverlay");
  const drawer = document.getElementById("commentDrawer");

  if (!overlay || !drawer) return;

  bind(overlay, drawer, ".comment-btn");
}

/* =========================
   LIKE
========================= */

function initLike() {

  const overlay = document.getElementById("likeOverlay");
  const drawer = document.getElementById("likeDrawer");

  if (!overlay || !drawer) return;

  bind(overlay, drawer, ".like-count-trigger");
}

/* =========================
   CORE BIND
========================= */

function bind(overlay, drawer, triggerSelector) {

  let startY = 0;
  let currentY = 0;
  let dragging = false;

  const app = document.querySelector(".app");

  /* =========================
     OPEN
  ========================= */

  document.addEventListener("click", (e) => {

    const btn = e.target.closest(triggerSelector);
    if (!btn) return;

    open();
  });

  function open() {

    overlay.classList.add("active");
    document.body.classList.add("drawer-open");

    drawer.style.transform = "translateY(0)";
  }

  function close() {

    overlay.classList.remove("active");
    document.body.classList.remove("drawer-open");

    drawer.style.transform = "translateY(100%)";

    resetApp();
  }

  function resetApp() {
    if (!app) return;
    app.style.transform = "";
    app.style.filter = "";
  }

  /* =========================
     CLOSE EVENTS
  ========================= */

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });

  drawer.addEventListener("click", (e) => {

    if (e.target.closest(".drawer-close")) {
      close();
    }
  });

  /* =========================
     DRAG
  ========================= */

  drawer.addEventListener("touchstart", (e) => {

    dragging = true;
    startY = e.touches[0].clientY;

    drawer.classList.add("dragging");
  });

  drawer.addEventListener("touchmove", (e) => {

    if (!dragging) return;

    let y = e.touches[0].clientY;
    let diff = y - startY;

    currentY = diff;

    /* =========================
       上拉限制（FULL）
    ========================= */

    if (diff < CONFIG.MAX_UP) {
      diff = CONFIG.MAX_UP;
      currentY = CONFIG.MAX_UP;
    }

    /* =========================
       下拉阻尼
    ========================= */

    if (diff > 0) {
      diff *= 0.35;
    }

    drawer.style.transform = `translateY(${diff}px)`;

    /* =========================
       背景动态（稳定版）
    ========================= */

    if (app) {

      const progress = Math.min(Math.abs(diff) / 300, 1);

      app.style.transform =
        `scale(${1 - progress * 0.06})`;

      app.style.filter =
        `blur(${progress * 2}px) brightness(${1 - progress * 0.05})`;
    }
  });

  drawer.addEventListener("touchend", () => {

    dragging = false;

    drawer.classList.remove("dragging");

    /* =========================
       CLOSE
    ========================= */

    if (currentY > CONFIG.CLOSE_THRESHOLD) {
      close();
      return;
    }

    /* =========================
       SNAP
    ========================= */

    if (currentY < -120) {

      drawer.style.transform = `translateY(${CONFIG.MAX_UP}px)`;

    } else {

      drawer.style.transform = "translateY(0)";
    }

    currentY = 0;
  });
}
