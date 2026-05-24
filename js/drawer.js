export function initDrawer() {

    initCommentDrawer();
    initLikeDrawer();
}

/* =========================
   COMMENT DRAWER
========================= */

function initCommentDrawer() {

    const overlay = document.getElementById("commentOverlay");
    const drawer = document.getElementById("commentDrawer");

    if (!overlay || !drawer) return;

    document.addEventListener("click", (e) => {

        const btn = e.target.closest(".comment-btn");
        if (!btn) return;

        openDrawer(overlay, drawer);
    });

    overlay.addEventListener("click", (e) => {
        if (e.target !== overlay) return;
        closeDrawer(overlay, drawer);
    });

    initDrag(drawer, overlay);
}

/* =========================
   LIKE DRAWER
========================= */

function initLikeDrawer() {

    const overlay = document.getElementById("likeOverlay");
    const drawer = document.getElementById("likeDrawer");

    if (!overlay || !drawer) return;

    document.addEventListener("click", (e) => {

        const btn = e.target.closest(".like-count-trigger");
        if (!btn) return;

        openDrawer(overlay, drawer);
    });

    overlay.addEventListener("click", (e) => {
        if (e.target !== overlay) return;
        closeDrawer(overlay, drawer);
    });

    initDrag(drawer, overlay);
}

/* =========================
   OPEN / CLOSE
========================= */

function openDrawer(overlay, drawer) {

    overlay.classList.add("active");

    requestAnimationFrame(() => {
        drawer.classList.add("active");
        document.body.classList.add("drawer-open");
    });
}

function closeDrawer(overlay, drawer) {

    drawer.classList.remove("active");
    document.body.classList.remove("drawer-open");

    resetTransform(drawer);

    setTimeout(() => {
        overlay.classList.remove("active");
    }, 280);
}

/* =========================
   RESET
========================= */

function resetTransform(drawer) {
    drawer.style.transform = "";
}

/* =========================
   RUBBER BAND（iOS弹性）
========================= */

function rubberBand(distance) {

    const abs = Math.abs(distance);
    const value = abs * (1 - Math.exp(-abs / 120));

    return distance < 0 ? -value : value;
}

/* =========================
   DRAG CORE
========================= */

function initDrag(drawer, overlay) {

    // ⭐ PC 不启用拖拽
    if (window.innerWidth >= 769) return;

    const MAX_UP = -120;      // 上拉最大
    const CLOSE_THRESHOLD = 160;

    let startY = 0;
    let currentY = 0;

    let lastY = 0;
    let lastTime = 0;

    let velocity = 0;
    let dragging = false;

    drawer.addEventListener("touchstart", (e) => {

        dragging = true;

        startY = e.touches[0].clientY;

        lastY = startY;
        lastTime = Date.now();

        drawer.style.transition = "none";
    });

    drawer.addEventListener("touchmove", (e) => {

        if (!dragging) return;

        const y = e.touches[0].clientY;

        const now = Date.now();

        let diff = y - startY;

        velocity = (y - lastY) / (now - lastTime);
        lastY = y;
        lastTime = now;

        currentY = diff;

        /* =========================
           上拉限制（只限制上，不限制下）
        ========================= */

        if (currentY < MAX_UP) {
            currentY = MAX_UP;
        }

        const damped = currentY > 0
            ? currentY
            : rubberBand(currentY);

        drawer.style.transform = `translateY(${damped}px)`;

        /* =========================
           背景联动（稳定版本）
        ========================= */

        const app = document.querySelector(".app");

        if (app) {

            const upProgress = Math.abs(Math.min(currentY, 0)) / 120;
            const downProgress = Math.max(currentY, 0) / 300;

            let scale = 1 - upProgress * 0.05;

            if (currentY > 0) {
                scale = 1 + downProgress * 0.03;
            }

            app.style.transform = `scale(${scale})`;
        }

        overlay.style.background =
            `rgba(0,0,0,${0.18 + Math.min(Math.abs(currentY) / 400, 0.25)})`;
    });

    drawer.addEventListener("touchend", () => {

        dragging = false;

        drawer.style.transition =
            "transform .35s cubic-bezier(.22,1,.36,1)";

        const shouldClose =
            currentY > CLOSE_THRESHOLD || velocity > 0.6;

        if (shouldClose) {

            const overlayEl =
                drawer.closest(".drawer-overlay");

            closeDrawer(overlayEl, drawer);

        } else {

            /* =========================
               PEAK（回弹）
            ========================= */

            currentY = 0;

            drawer.style.transform = "translateY(0)";

            const app = document.querySelector(".app");
            if (app) app.style.transform = "scale(.96)";
        }
    });
}
