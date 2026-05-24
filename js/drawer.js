export function initDrawer() {

    const app = document.querySelector(".app");

    initCommentDrawer(app);
    initLikeDrawer(app);

}

/* =========================
   评论 Drawer
========================= */

function initCommentDrawer(app) {

    const overlay =
        document.getElementById("commentOverlay");

    const drawer =
        document.getElementById("commentDrawer");

    if (!overlay || !drawer) return;

    /* PC / mobile 关闭按钮 */
    drawer.querySelector(".drawer-close")?.addEventListener("click", (e) => {
        e.stopPropagation();
        closeDrawer(overlay, drawer, app);
    });

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

    /* PC / mobile 关闭按钮 */
    drawer.querySelector(".drawer-close")?.addEventListener("click", (e) => {
        e.stopPropagation();
        closeDrawer(overlay, drawer, app);
    });

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

function rubberBand(distance) {

    const abs = Math.abs(distance);

    const value = abs * (1 - Math.exp(-abs / 120));

    return distance < 0 ? -value : value;

}

/* =========================
   DRAG CORE FIXED
========================= */

function initDrag(drawer, overlay, app) {

    if (window.innerWidth >= 769) return;

    let startY = 0;
    let currentY = 0;

    let lastY = 0;
    let lastTime = 0;

    let velocity = 0;
    let dragging = false;

    /* ⭐ 防止 scroll / iOS 阻断 */
    drawer.style.touchAction = "none";

    drawer.addEventListener("touchstart", (e) => {

        dragging = true;

        startY = e.touches[0].clientY;

        lastY = startY;
        lastTime = Date.now();

        drawer.style.transition = "none";

    }, { passive: true });

    drawer.addEventListener("touchmove", (e) => {

        if (!dragging) return;

        currentY = e.touches[0].clientY;

        const now = Date.now();

        let diff = currentY - startY;

        velocity = (currentY - lastY) / (now - lastTime);

        lastY = currentY;
        lastTime = now;

        /* ⭐ 允许负值但只处理下滑 */
        if (diff < 0) diff = 0;

        const damped = rubberBand(diff);

        drawer.style.transform =
            `translateY(${damped}px)`;

        /* APP 联动 */
        const scale =
            1 - Math.min(damped / 1800, 0.08);

        app.style.transform =
            `scale(${scale})`;

        overlay.style.background =
            `rgba(0,0,0,${Math.min(damped / 500, 0.35)})`;

    }, { passive: true });

    drawer.addEventListener("touchend", () => {

        dragging = false;

        drawer.style.transition =
            "transform .38s cubic-bezier(.22,1,.36,1)";

        app.style.transition =
            "transform .38s cubic-bezier(.22,1,.36,1)";

        const moved = currentY - startY;

        const shouldClose =
            moved > 120 || velocity > 0.7;

        if (shouldClose) {

            closeDrawer(overlay, drawer, app);

        } else {

            /* PEAK 状态 */
            drawer.style.transform = "translateY(36px)";

            app.style.transform = "scale(.96)";

            overlay.style.background = "rgba(0,0,0,0.25)";

        }

    });

}
