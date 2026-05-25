const STATE = {
    CLOSED: "closed",
    OPEN: "open"
};

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
   CORE
========================= */

function bind(overlay, drawer, trigger) {

    const app = document.querySelector(".app");

    let startY = 0;
    let diff = 0;
    let dragging = false;

    const MAX_UP = -140;
    const CLOSE_THRESHOLD = 160;

    /* =========================
       OPEN
    ========================= */

    document.addEventListener("click", (e) => {

        if (!e.target.closest(trigger)) return;

        overlay.classList.add("active");
        document.body.classList.add("drawer-open");

        drawer.style.transform = "translateY(0)";
    });

    /* =========================
       CLOSE
    ========================= */

    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) close();
    });

    function close() {
        overlay.classList.remove("active");
        document.body.classList.remove("drawer-open");
        drawer.style.transform = "translateY(100%)";
    }

    /* =========================
       DRAG (mobile only)
    ========================= */

    if (window.innerWidth >= 769) return;

    drawer.addEventListener("touchstart", (e) => {
        dragging = true;
        startY = e.touches[0].clientY;
        drawer.style.transition = "none";
    });

    drawer.addEventListener("touchmove", (e) => {

        if (!dragging) return;

        let y = e.touches[0].clientY;
        diff = y - startY;

        // 上限（不能拉过头）
        if (diff < MAX_UP) diff = MAX_UP;

        // 下拉阻尼
        if (diff > 0) diff *= 0.35;

        drawer.style.transform = `translateY(${diff}px)`;

        /* =========================
           背景（只模糊，不缩放）
        ========================= */

        if (app) {
            const p = Math.min(Math.abs(diff) / 300, 1);
            app.style.filter = `blur(${p * 4}px)`;
        }
    });

    drawer.addEventListener("touchend", () => {

        dragging = false;
        drawer.style.transition = "transform .35s cubic-bezier(.22,1,.36,1)";

        // 关闭
        if (diff > CLOSE_THRESHOLD) {
            close();
            return;
        }

        // 回弹
        drawer.style.transform = "translateY(0)";
        if (app) app.style.filter = "blur(6px)";
    });
}
