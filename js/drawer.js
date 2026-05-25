export function initDrawer() {

    initCommentDrawer();
    initLikeDrawer();
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

    reset(drawer);

    setTimeout(() => {
        overlay.classList.remove("active");
    }, 250);
}

function reset(drawer) {
    drawer.style.transform = "";
}

/* =========================
   COMMENT
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
   LIKE
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
   RUBBER BAND
========================= */

function rubber(n) {
    const abs = Math.abs(n);
    const val = abs * (1 - Math.exp(-abs / 120));
    return n < 0 ? -val : val;
}

/* =========================
   DRAG CORE (FINAL STABLE)
========================= */

function initDrag(drawer, overlay) {

    // PC 不拖动
    if (window.innerWidth >= 769) return;

    const MAX_UP = -140;     // 上拉极限（peek上限）
    const MAX_DOWN = 280;    // 下拉极限（防飞出）
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

        // clamp（上下边界）
        if (currentY < MAX_UP) currentY = MAX_UP;
        if (currentY > MAX_DOWN) currentY = MAX_DOWN;

        const move = currentY > 0 ? currentY : rubber(currentY);

        drawer.style.transform = `translateY(${move}px)`;

        // 背景联动（只影响透明度，不缩放 app）
        overlay.style.background =
            `rgba(0,0,0,${0.18 + Math.min(Math.abs(currentY) / 500, 0.35)})`;
    });

    drawer.addEventListener("touchend", () => {

        dragging = false;

        drawer.style.transition =
            "transform .35s cubic-bezier(.22,1,.36,1)";

        const shouldClose =
            currentY > CLOSE_THRESHOLD || velocity > 0.65;

        if (shouldClose) {

            closeDrawer(
                overlay,
                drawer
            );

            return;
        }

        // =========================
        // SNAP 回中（关键）
        // =========================

        currentY = 0;

        drawer.style.transform = "translateY(0)";
    });
}
