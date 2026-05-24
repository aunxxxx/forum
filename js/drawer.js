export function initDrawer() {

    if (window.__drawerInit) return;
    window.__drawerInit = true;

    const app = document.querySelector(".app");

    initDrawerCore(app);
}

let drawerLocked = false;

function initDrawerCore(app) {

    bind("commentOverlay", "commentDrawer", ".comment-btn", app);
    bind("likeOverlay", "likeDrawer", ".like-count-trigger", app);
}

/* =========================
   核心绑定
========================= */

function bind(overlayId, drawerId, trigger, app) {

    const overlay = document.getElementById(overlayId);
    const drawer = document.getElementById(drawerId);

    if (!overlay || !drawer) return;

    let startY = 0;
    let currentY = 0;

    const MAX_UP = -120;   // ⭐ 上拉最大
    const MAX_DOWN = 220;  // ⭐ 下拉关闭阈值（可调）
    const ANCHOR = 0;      // ⭐ 初始点

    let dragging = false;

    /* =========================
       OPEN
    ========================= */

    document.addEventListener("click", (e) => {

        const btn = e.target.closest(trigger);
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
        close();
    });

    /* =========================
       DRAG（PC + MOBILE）
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

    const MAX_UP = -120;
    const MAX_DOWN = 220;

    /* ⭐ 统一边界（关键） */
    diff = Math.max(MAX_UP, Math.min(diff, MAX_DOWN));

    currentY = diff;

    drawer.style.transform =
        `translateY(${currentY}px)`;

    /* =========================
       背景缩放（修正后）
    ========================= */

    let progress =
        (currentY - MAX_UP) / (MAX_DOWN - MAX_UP);

    let scale = 0.92 + progress * 0.08;

    let blur = Math.max(0, -currentY / 200);

    app.style.transform = `scale(${scale})`;

    app.style.filter =
        `blur(${blur}px) brightness(${1 - blur * 0.3})`;

    overlay.style.background =
        `rgba(0,0,0,${0.25 + progress * 0.25})`;
};

    const end = () => {

        dragging = false;

        const shouldClose =
            currentY > MAX_DOWN * 0.6;

        if (shouldClose) {

            close();

        } else {

            /* =========================
               回弹到 anchor（0点）
            ========================= */

            drawer.style.transition =
                "transform .35s cubic-bezier(.22,1,.36,1)";

            drawer.style.transform = "translateY(0)";

            app.style.transition =
                "transform .35s, filter .35s";

            app.style.transform = "scale(.96)";
            app.style.filter = "none";

            overlay.style.background = "rgba(0,0,0,0.25)";

            currentY = 0;
        }
    };

    /* MOBILE */
    overlay.addEventListener("touchstart", start, { passive: true });
    overlay.addEventListener("touchmove", move, { passive: false });
    overlay.addEventListener("touchend", end);

    /* PC */
    overlay.addEventListener("mousedown", start);
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", end);

    function close() {

        drawerLocked = false;
        dragging = false;

        overlay.classList.remove("active");
        drawer.classList.remove("active");
        document.body.classList.remove("drawer-open");

        drawer.style.transform = "";
        app.style.transform = "";
        app.style.filter = "";
        overlay.style.background = "";

        currentY = 0;
    }
}
