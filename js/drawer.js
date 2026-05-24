export function initDrawer() {

    // 防止重复初始化（解决越点越卡）
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
let dragging = false;

let startY = 0;
let targetY = 0;

/* =========================
   评论 Drawer
========================= */

function initCommentDrawer(app) {

    const overlay =
        document.getElementById("commentOverlay");

    const drawer =
        document.getElementById("commentDrawer");

    if (!overlay || !drawer) return;

    bindDrawer(overlay, drawer, app, ".comment-btn");
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

    bindDrawer(overlay, drawer, app, ".like-count-trigger");
}

/* =========================
   统一绑定（核心）
========================= */

function bindDrawer(overlay, drawer, app, triggerSelector) {

    /* 打开 */
    document.addEventListener("click", (e) => {

        const btn = e.target.closest(triggerSelector);

        if (!btn) return;

        if (drawerLocked) return;
        drawerLocked = true;

        overlay.classList.add("active");

        requestAnimationFrame(() => {
            drawer.classList.add("active");
            document.body.classList.add("drawer-open");
        });
    });

    /* 背景关闭 */
    overlay.addEventListener("click", (e) => {

        if (e.target !== overlay) return;

        closeDrawer(overlay, drawer, app);
    });

    /* =========================
       手势系统（PC + Mobile）
    ========================= */

    const start = (e) => {

        dragging = true;

        startY = e.touches
            ? e.touches[0].clientY
            : e.clientY;

        drawer.style.transition = "none";
    };

    const move = (e) => {

        if (!dragging) return;

        const y = e.touches
            ? e.touches[0].clientY
            : e.clientY;

        let diff = y - startY;

        if (diff < 0) diff = 0;

        targetY = diff;

        drawer.style.transform =
            `translateY(${targetY}px)`;

        app.style.transform =
            `scale(${1 - Math.min(targetY / 1800, 0.08)})`;

        overlay.style.background =
            `rgba(0,0,0,${Math.min(targetY / 500, 0.35)})`;
    };

    const end = () => {

        dragging = false;

        const shouldClose = targetY > 120;

        if (shouldClose) {

            closeDrawer(overlay, drawer, app);

        } else {

            targetY = 0;

            drawer.style.transition =
                "transform .35s cubic-bezier(.22,1,.36,1)";

            drawer.style.transform = "translateY(0)";
            app.style.transform = "scale(.96)";
            overlay.style.background = "rgba(0,0,0,0.25)";
        }
    };

    /* 手机 */
    overlay.addEventListener("touchstart", start, { passive: true });
    overlay.addEventListener("touchmove", move, { passive: false });
    overlay.addEventListener("touchend", end);

    /* PC */
    overlay.addEventListener("mousedown", start);
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", end);
}

/* =========================
   CLOSE
========================= */

function closeDrawer(overlay, drawer, app) {

    drawerLocked = false;
    dragging = false;
    targetY = 0;

    drawer.classList.remove("active");
    document.body.classList.remove("drawer-open");

    drawer.style.transform = "";
    app.style.transform = "";
    overlay.style.background = "";

    setTimeout(() => {
        overlay.classList.remove("active");
    }, 250);
}
