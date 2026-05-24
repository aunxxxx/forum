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

 const MAX_UP = -120;   // ⭐ 上拉最大（硬限制）
const MAX_DOWN = 999;  // ⭐ 下拉不限制（软）

const move = (e) => {

    if (!dragging) return;

    const y = e.touches
        ? e.touches[0].clientY
        : e.clientY;

    let diff = y - startY;

    currentY = diff;

    /* =========================
       ⭐ 关键修复：只限制“上拉”
    ========================= */

    if (currentY < MAX_UP) {
        currentY = MAX_UP;   // ⬆️ 顶住
    }

    /* ❌ 不限制下拉（允许继续拖） */

    drawer.style.transform =
        `translateY(${currentY}px)`;

    /* =========================
       背景逻辑（修正方向）
    ========================= */

    let progressUp = Math.abs(Math.min(currentY, 0)) / 120;
    let progressDown = Math.max(currentY, 0) / 300;

    /* ⬆️ 上拉：缩小 + 变暗 + 模糊 */
    let scale = 1 - progressUp * 0.06;
    let blur = progressUp * 0.8;

    /* ⬇️ 下拉：放大一点 + 更清晰 */
    if (currentY > 0) {
        scale = 1 + progressDown * 0.04;
        blur = Math.max(0, 0.8 - progressDown);
    }

    app.style.transform = `scale(${scale})`;

    app.style.filter =
        `blur(${blur}px) brightness(${1 - blur * 0.2})`;

    overlay.style.background =
        `rgba(0,0,0,${0.25 + progressUp * 0.25})`;
};
    
    const MAX_CLOSE = 160;

const end = () => {

    dragging = false;

    const shouldClose = currentY > MAX_CLOSE;

    drawer.style.transition =
        "transform .35s cubic-bezier(.22,1,.36,1)";

    app.style.transition =
        "transform .35s, filter .35s";

    if (shouldClose) {

        close();

    } else {

        currentY = 0;

        drawer.style.transform = "translateY(0)";

        app.style.transform = "scale(.96)";
        app.style.filter = "none";

        overlay.style.background = "rgba(0,0,0,0.25)";
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
