const STATE = {
    CLOSED: "CLOSED",
    PEEK: "PEEK",
    OPEN: "OPEN"
};

function isMobile() {
    return window.innerWidth <= 768;
}

function createDrawerInstance(overlay, drawer, triggerSelector) {

    if (!overlay || !drawer) {
        console.warn("Drawer init failed");
        return;
    }

    const app = document.querySelector(".app");

    let state = STATE.CLOSED;

    let startY = 0;
    let startTranslate = 100;
    let currentTranslate = 100;

    let dragging = false;

    let scrollY = 0;

    const CLOSED_Y = 100;
    const PEEK_Y = 5;  /* 默认高度 */
    const OPEN_Y = 1;  /* 稍微展开一点 */

    // =========================
    // SCROLL LOCK
    // =========================
    function lockScroll(lock) {

        const body = document.body;

        if (lock) {

            scrollY = window.scrollY || 0;

            body.style.position = "fixed";
            body.style.top = `-${scrollY}px`;
            body.style.left = "0";
            body.style.right = "0";
            body.style.width = "100%";
            body.style.overflow = "hidden";

        } else {

            body.style.position = "";
            body.style.top = "";
            body.style.left = "";
            body.style.right = "";
            body.style.width = "";
            body.style.overflow = "";

            window.scrollTo(0, scrollY);
        }
    }

    // =========================
    // BLUR
    // =========================
    function setBlur(progress, animate = false) {

        if (!app) return;

        // PC 不模糊
        if (!isMobile()) {
            app.style.filter = "none";
            app.style.transform = "none";
            return;
        }

        app.style.transition = animate
            ? "filter .25s ease, transform .25s ease"
            : "none";

        const blur = progress * 6;
       const scale = 1 - progress * 0.06;

        app.style.filter = blur > 0
            ? `blur(${blur}px)`
            : "none";

        app.style.transform = progress > 0
            ? `scale(${scale})`
            : "none";
    }

    // =========================
    // RENDER
    // =========================
    function render(y, animate = false) {

        currentTranslate = y;

        drawer.style.transition = animate
            ? "transform .35s cubic-bezier(.22,1,.36,1)"
            : "none";

        // =========================
        // PC
        // =========================
        if (!isMobile()) {

            // OPEN
            if (y < 100) {
                drawer.style.transform =
                    `translate(-50%, -50%)`;
            }

            // CLOSED
            else {
                drawer.style.transform =
                    `translate(-50%, calc(-50% + 100vh))`;
            }
        }

        // =========================
        // MOBILE
        // =========================
        else {
            drawer.style.transform =
                `translateY(${y}%)`;
        }

        /*
|--------------------------------------------------------------------------
| progress
|--------------------------------------------------------------------------
| OPEN_Y   → 最模糊
| CLOSED_Y → 最清晰
|--------------------------------------------------------------------------
*/

let progress =
    1 - (y / CLOSED_Y);

progress = Math.max(
    0,
    Math.min(1, progress)
);

        setBlur(progress, animate);

        const open = y < CLOSED_Y;

        overlay.classList.toggle("is-open", open);

        // ⭐ 只有手机端允许缩放
        if (isMobile()) {
            document.body.classList.toggle(
                "drawer-open",
                open
            );
        } else {
            document.body.classList.remove("drawer-open");
        }

        lockScroll(open);
    }

    // =========================
    // APPLY
    // =========================
    function apply(next) {

        if (state === next) return;

        state = next;

        if (state === STATE.OPEN) {
            render(OPEN_Y, true);
        }

        else if (state === STATE.PEEK) {
            render(PEEK_Y, true);
        }

        else {
            render(CLOSED_Y, true);
        }
    }

    function open() {
        apply(STATE.OPEN);
    }

    function close() {
        apply(STATE.CLOSED);
    }

    function peek() {
        apply(STATE.PEEK);
    }

    // =========================
    // TRIGGER
    // =========================
    document.addEventListener("click", (e) => {

        const trigger = e.target.closest(triggerSelector);

        if (!trigger) return;

        e.stopPropagation();

        // PC
        if (!isMobile()) {

            if (state === STATE.OPEN) {
                close();
            } else {
                open();
            }

            return;
        }

        // MOBILE
        if (state === STATE.CLOSED) {
            peek();
        } else {
            close();
        }
    });

    // =========================
    // OVERLAY CLOSE
    // =========================
    overlay.addEventListener("click", (e) => {

    // ❌ 所有端禁止点击背景关闭
    e.stopPropagation();
});
    
    // =========================
// CLOSE BUTTON
// =========================
const closeBtn = drawer.querySelector(".drawer-close");

if (closeBtn) {

    closeBtn.addEventListener("click", (e) => {

        e.stopPropagation();

        close();
    });
}
    
    // =========================
    // MOBILE DRAG
    // =========================
    drawer.addEventListener("touchstart", (e) => {

        if (!isMobile()) return;

        dragging = true;

        startY = e.touches[0].clientY;
        startTranslate = currentTranslate;

        drawer.style.transition = "none";

        if (app) {
            app.style.transition = "none";
        }

    }, { passive: true });

    drawer.addEventListener("touchmove", (e) => {

        if (!dragging) return;

        e.preventDefault();

        const deltaY = e.touches[0].clientY - startY;

        const deltaPercent =
            (deltaY / window.innerHeight) * 100;

        let next =
            startTranslate + deltaPercent;

       next = Math.max(
    0,
    Math.min(100, next)
);

        render(next, false);

    }, { passive: false });

function endDrag() {

    if (!dragging) return;

    dragging = false;

    const y = currentTranslate;

    const openY = OPEN_Y;
    const peekY = PEEK_Y;
    const closedY = 100;

    // =========================
    // ① 强制关闭阈值（关键）
    // =========================
    const closeThreshold = peekY + 25;

    if (y > closeThreshold) {
        close();
        return;
    }

    // =========================
    // ② 最近点吸附
    // =========================
    const distanceToOpen = Math.abs(y - openY);
    const distanceToPeek = Math.abs(y - peekY);
    const distanceToClosed = Math.abs(y - closedY);

    const min = Math.min(
        distanceToOpen,
        distanceToPeek,
        distanceToClosed
    );

    if (min === distanceToOpen) {
        open();
    } else if (min === distanceToPeek) {
        peek();
    } else {
        close();
    }
}

    drawer.addEventListener("touchend", endDrag);
    drawer.addEventListener("touchcancel", endDrag);

    // =========================
    // RESIZE
    // =========================
    window.addEventListener("resize", () => {

        if (state === STATE.OPEN) {
            render(OPEN_Y, false);
        }

        else if (state === STATE.PEEK) {
            render(PEEK_Y, false);
        }

        else {
            render(CLOSED_Y, false);
        }
    });

    // =========================
    // INIT
    // =========================
    render(CLOSED_Y, false);
}

// =========================
// INIT
// =========================
export function initDrawer() {

    // 评论
    createDrawerInstance(
        document.getElementById("commentOverlay"),
        document.getElementById("commentDrawer"),
        ".comment-btn"
    );

    // 点赞
    createDrawerInstance(
        document.getElementById("likeOverlay"),
        document.getElementById("likeDrawer"),
        ".stat-btn.like-btn"
    );
}
