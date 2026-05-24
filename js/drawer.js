export function initDrawer() {

    // 防止重复初始化（解决“越点越卡”核心）
    if (window.__drawerInit) return;
    window.__drawerInit = true;

    const app = document.querySelector(".app");

    initCommentDrawer(app);
    initLikeDrawer(app);
}

/* =========================
   全局状态
========================= */

let drawerLocked = false;
let rafId = null;

/* =========================
   评论 Drawer
========================= */

function initCommentDrawer(app) {

    const overlay =
        document.getElementById("commentOverlay");

    const drawer =
        document.getElementById("commentDrawer");

    if (!overlay || !drawer) return;

    document.addEventListener("click", (e) => {

        const btn =
            e.target.closest(".comment-btn");

        if (!btn) return;

        openDrawer(overlay, drawer, app);

    });

    overlay.addEventListener("click", (e) => {

        if (e.target !== overlay) return;

        closeDrawer(overlay, drawer, app);

    });

    initDrag(drawer, overlay, app);
}

/* =========================
   点赞 Drawer
========================= */

function initLikeDrawer(app) {

    const overlay =
        document.getElementById("likeOverlay");

    const drawer =
        document.getElementById("likeDrawer");

    if (!overlay || !drawer) return;

    document.addEventListener("click", (e) => {

        const btn =
            e.target.closest(".like-count-trigger");

        if (!btn) return;

        openDrawer(overlay, drawer, app);

    });

    overlay.addEventListener("click", (e) => {

        if (e.target !== overlay) return;

        closeDrawer(overlay, drawer, app);

    });

    initDrag(drawer, overlay, app);
}

/* =========================
   OPEN
========================= */

function openDrawer(overlay, drawer, app) {

    if (drawerLocked) return;
    drawerLocked = true;

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

    drawerLocked = false;

    if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
    }

    drawer.classList.remove("active");
    document.body.classList.remove("drawer-open");

    drawer.style.transform = "";
    app.style.transform = "";
    overlay.style.background = "";

    setTimeout(() => {
        overlay.classList.remove("active");
    }, 250);
}

/* =========================
   iOS 弹性（rubber band）
========================= */

function rubberBand(distance) {

    const abs = Math.abs(distance);
    const value = abs * (1 - Math.exp(-abs / 120));

    return distance < 0 ? -value : value;
}

/* =========================
   DRAG（稳定版）
========================= */

function initDrag(drawer, overlay, app) {

    if (window.innerWidth >= 769) return;

    let startY = 0;
    let targetY = 0;
    let currentY = 0;

    let lastY = 0;
    let lastT = 0;
    let velocity = 0;

    let dragging = false;

    function update() {

        currentY += (targetY - currentY) * 0.18;

        drawer.style.transform =
            `translateY(${currentY}px)`;

        const scale =
            1 - Math.min(currentY / 1800, 0.08);

        app.style.transform =
            `scale(${scale})`;

        overlay.style.background =
            `rgba(0,0,0,${Math.min(currentY / 500, 0.35)})`;

        rafId = requestAnimationFrame(update);
    }

    drawer.addEventListener("touchstart", (e) => {

        dragging = true;

        startY = e.touches[0].clientY;

        lastY = startY;
        lastT = Date.now();

        drawer.style.transition = "none";

    }, { passive: true });

    drawer.addEventListener("touchmove", (e) => {

        if (!dragging) return;

        e.preventDefault();

        const y = e.touches[0].clientY;
        const now = Date.now();

        const diff = Math.max(0, y - startY);

        velocity = (y - lastY) / (now - lastT);

        lastY = y;
        lastT = now;

        targetY = rubberBand(diff);

        if (!rafId) {
            rafId = requestAnimationFrame(update);
        }

    }, { passive: false });

    drawer.addEventListener("touchend", () => {

        dragging = false;

        const shouldClose =
            targetY > 120 || velocity > 0.6;

        if (shouldClose) {

            closeDrawer(overlay, drawer, app);

        } else {

            targetY = 0;
            currentY = 0;

            drawer.style.transition =
                "transform .35s cubic-bezier(.22,1,.36,1)";

            drawer.style.transform = "translateY(0)";
            app.style.transform = "scale(.96)";
            overlay.style.background = "rgba(0,0,0,0.25)";
        }

    });
}
