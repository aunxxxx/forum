export function initDrawer() {

    const app = document.querySelector(".app");

    initCommentDrawer(app);
    initLikeDrawer(app);
}

/* =========================
   COMMENT
========================= */

function initCommentDrawer(app) {

    const overlay = document.getElementById("commentOverlay");
    const drawer = document.getElementById("commentDrawer");

    if (!overlay || !drawer) return;

    document.addEventListener("click", (e) => {

        const btn = e.target.closest(".comment-btn");
        if (!btn) return;

        openDrawer(overlay, drawer, app);

    });

    /* PC 点击背景关闭 */
    overlay.addEventListener("click", (e) => {

        if (window.innerWidth <= 768) return;
        if (e.target !== overlay) return;

        closeDrawer(overlay, drawer, app);

    });

    /* PC 关闭按钮 */
    drawer.querySelector(".drawer-close")?.addEventListener("click", (e) => {
        e.stopPropagation();
        closeDrawer(overlay, drawer, app);
    });

    initDrag(drawer, overlay, app);
}

/* =========================
   LIKE
========================= */

function initLikeDrawer(app) {

    const overlay = document.getElementById("likeOverlay");
    const drawer = document.getElementById("likeDrawer");

    if (!overlay || !drawer) return;

    document.addEventListener("click", (e) => {

        const btn = e.target.closest(".like-count-trigger");
        if (!btn) return;

        openDrawer(overlay, drawer, app);

    });

    overlay.addEventListener("click", (e) => {

        if (window.innerWidth <= 768) return;
        if (e.target !== overlay) return;

        closeDrawer(overlay, drawer, app);

    });

    drawer.querySelector(".drawer-close")?.addEventListener("click", (e) => {
        e.stopPropagation();
        closeDrawer(overlay, drawer, app);
    });

    initDrag(drawer, overlay, app);
}

/* =========================
   OPEN
========================= */

function openDrawer(overlay, drawer, app) {

    overlay.classList.add("active");

    requestAnimationFrame(() => {
        drawer.classList.add("active");
        document.body.classList.add("drawer-open");
    });
}

/* =========================
   CLOSE
========================= */

function closeDrawer(overlay, drawer, app) {

    drawer.classList.remove("active");
    document.body.classList.remove("drawer-open");

    drawer.style.transform = "";
    app.style.transform = "";

    setTimeout(() => {
        overlay.classList.remove("active");
    }, 300);
}

/* =========================
   RUBBER BAND
========================= */

function rubberBand(d) {
    const a = Math.abs(d);
    const v = a * (1 - Math.exp(-a / 120));
    return d < 0 ? -v : v;
}

/* =========================
   DRAG（核心）
========================= */

function initDrag(drawer, overlay, app) {

    if (window.innerWidth >= 769) return;

    let startY = 0;
    let lastY = 0;
    let lastT = 0;

    let velocity = 0;
    let dragging = false;

    drawer.style.touchAction = "none";

    drawer.addEventListener("touchstart", (e) => {

        dragging = true;

        startY = e.touches[0].clientY;

        lastY = startY;
        lastT = Date.now();

        drawer.style.transition = "none";

    }, { passive: true });

    drawer.addEventListener("touchmove", (e) => {

        if (!dragging) return;

        let y = e.touches[0].clientY;
        let now = Date.now();

        let diff = y - startY;

        velocity = (y - lastY) / (now - lastT);

        lastY = y;
        lastT = now;

        if (diff < 0) diff = 0;

        const d = rubberBand(diff);

        drawer.style.transform = `translateY(${d}px)`;

        app.style.transform =
            `scale(${1 - Math.min(d / 1800, 0.08)})`;

        overlay.style.background =
            `rgba(0,0,0,${Math.min(d / 500, 0.35)})`;

    }, { passive: true });

    drawer.addEventListener("touchend", () => {

        dragging = false;

        const moved = lastY - startY;

        const shouldClose = moved > 120 || velocity > 0.7;

        if (shouldClose) {
            closeDrawer(overlay, drawer, app);
        } else {
            drawer.style.transform = "translateY(36px)";
            app.style.transform = "scale(.96)";
            overlay.style.background = "rgba(0,0,0,0.25)";
        }

    });
}
