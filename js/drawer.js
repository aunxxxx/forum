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

    // =========================
    // STATE
    // =========================
    let state = STATE.CLOSED;

    let startY = 0;
    let startTranslate = 100;
    let currentTranslate = 100;

    let dragging = false;

    let scrollY = 0;

    // =========================
    // POSITION SYSTEM (%)
    // =========================
    const CLOSED_Y = 100;
    const PEEK_Y = 35;
    const OPEN_Y = 0;

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

        // PC 不缩放不模糊
        if (!isMobile()) {
            app.style.filter = "none";
            app.style.transform = "none";
            return;
        }

        app.style.transition = animate
            ? "filter .25s ease, transform .25s ease"
            : "none";

        const blur = progress * 6;
        const scale = 1 - progress * 0.035;

        app.style.filter = blur > 0
            ? `blur(${blur}px)`
            : "none";

        app.style.transform = progress > 0
            ? `scale(${scale})`
            : "none";
    }

    // =========================
    // CORE RENDER
    // =========================
    function render(y, animate = false) {

        currentTranslate = y;

        drawer.style.transition = animate
            ? "transform .35s cubic-bezier(.22,1,.36,1)"
            : "none";

        drawer.style.transform = `translateY(${y}%)`;

        // progress
        let progress = 0;

        if (y <= PEEK_Y) {
            progress = 1 - (y / PEEK_Y);
        }

        setBlur(progress, animate);

        const open = y < CLOSED_Y;

        overlay.classList.toggle("is-open", open);

        // ⭐ 关键修复：PC 不加 drawer-open
        if (isMobile()) {
            document.body.classList.toggle("drawer-open", open);
        } else {
            document.body.classList.remove("drawer-open");
        }

        lockScroll(open);
    }

    // =========================
    // APPLY STATE
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

        // 防闪
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

        if (e.target === overlay) {
            close();
        }
    });

    // =========================
    // CLOSE BTN
    // =========================
    const closeBtn = drawer.querySelector(".drawer-close");

    if (closeBtn) {
        closeBtn.addEventListener("click", close);
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

        // px -> %
        const deltaPercent =
            (deltaY / window.innerHeight) * 100;

        let next =
            startTranslate + deltaPercent;

        next = Math.max(0, Math.min(100, next));

        render(next, false);

    }, { passive: false });

    function endDrag() {

        if (!dragging) return;

        dragging = false;

        // OPEN
        if (currentTranslate < 15) {
            open();
        }

        // CLOSE
        else if (currentTranslate > 65) {
            close();
        }

        // PEEK
        else {
            peek();
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
        ".like-count"
    );
}
