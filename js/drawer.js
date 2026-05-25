
export function initDrawer() {
    bindDrawer(
        document.getElementById("commentOverlay"),
        document.getElementById("commentDrawer"),
        ".comment-btn"
    );

    bindDrawer(
        document.getElementById("likeOverlay"),
        document.getElementById("likeDrawer"),
        ".like-count-trigger"
    );
}

// =========================
// CONFIG
// =========================

function getPeekHeight() {
    return Math.min(280, Math.max(180, window.innerHeight * 0.35));
}

// =========================
// STATE MACHINE CORE
// =========================

const STATE = {
    CLOSED: "CLOSED",
    PEEK: "PEEK",
    OPEN: "OPEN"
};

function createScrollLock() {
    let scrollY = 0;

    function getScrollY() {
        return window.scrollY || document.documentElement.scrollTop;
    }

    function lock(lock) {
        const body = document.body;

        if (lock) {
            scrollY = getScrollY();

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

    return lock;
}

// =========================
// DRAWER BIND
// =========================

function bindDrawer(overlay, drawer, triggerSelector) {
    if (!overlay || !drawer) return;

    const app = document.querySelector(".app");
    const lockScroll = createScrollLock();

    let state = STATE.CLOSED;

    let PEEK = getPeekHeight();

    let startY = 0;
    let startTranslate = 0;
    let currentY = window.innerHeight;

    const OPEN_Y = 0;

    function CLOSED_Y() {
        return window.innerHeight;
    }

    // =========================
    // PURE RENDER (唯一 DOM 输出点)
    // =========================

    function render(s, animate = true) {
        const isOpen = s !== STATE.CLOSED;

        // overlay
        overlay.classList.toggle("active", isOpen);

        // scroll lock
        lockScroll(isOpen);

        // animation control
        drawer.style.transition = animate
            ? "transform .35s cubic-bezier(.22,1,.36,1)"
            : "none";

        if (app) {
            app.style.transition = animate
                ? "transform .32s cubic-bezier(.22,1,.36,1), filter .25s ease"
                : "none";
        }

        // state mapping
        let y = CLOSED_Y();

        if (s === STATE.PEEK) y = PEEK;
        if (s === STATE.OPEN) y = OPEN_Y;

        currentY = y;

        drawer.style.transform = `translateY(${y}px)`;

        // blur
        let progress = 0;
        if (y <= 0) progress = 1;
        else if (y <= PEEK) progress = 1 - y / PEEK;

        if (app) app.style.filter = `blur(${progress * 6}px)`;

        // visual depth (optional but stable)
        if (app) {
            app.style.transform =
                isOpen && window.innerWidth <= 768
                    ? "scale(0.965) translateY(6px)"
                    : "none";
        }

        state = s;
    }

    // =========================
    // STATE API（唯一入口）
    // =========================

    function open() {
        render(STATE.OPEN);
    }

    function close() {
        render(STATE.CLOSED);
    }

    function peek() {
        render(STATE.PEEK);
    }

    // =========================
    // INIT (关键：锁死初始状态)
    // =========================

    render(STATE.CLOSED, false);

    // =========================
    // TRIGGER
    // =========================

    document.addEventListener("click", (e) => {
        if (!e.target.closest(triggerSelector)) return;

        if (window.innerWidth >= 769) {
            state === STATE.OPEN ? close() : open();
            return;
        }

        state === STATE.OPEN ? close() : peek();
    });

    overlay.addEventListener("click", () => close());

    const closeBtn = drawer.querySelector(".drawer-close");
    if (closeBtn) closeBtn.addEventListener("click", close);

    // =========================
    // DESKTOP LOCK
    // =========================

    if (window.innerWidth >= 769) {
        render(STATE.CLOSED, false);
        return;
    }

    // =========================
    // DRAG SYSTEM
    // =========================

    drawer.addEventListener("touchstart", (e) => {
        startY = e.touches[0].clientY;
        startTranslate = currentY;

        drawer.style.transition = "none";
        if (app) app.style.transition = "none";

        PEEK = getPeekHeight();
    });

    drawer.addEventListener(
        "touchmove",
        (e) => {
            e.preventDefault();

            const y = e.touches[0].clientY;
            let newY = startTranslate + (y - startY);

            newY = Math.max(0, Math.min(CLOSED_Y(), newY));

            currentY = newY;
            drawer.style.transform = `translateY(${newY}px)`;

            let progress = 0;
            if (newY <= 0) progress = 1;
            else if (newY <= PEEK) progress = 1 - newY / PEEK;

            if (app) app.style.filter = `blur(${progress * 6}px)`;
        },
        { passive: false }
    );

    drawer.addEventListener("touchend", () => {
        drawer.style.transition = "transform .35s cubic-bezier(.22,1,.36,1)";
        if (app) app.style.transition = "";

        const closeThreshold = PEEK * 0.6;

        if (currentY > PEEK + closeThreshold) {
            close();
        } else if (currentY < PEEK / 2) {
            open();
        } else {
            peek();
        }
    });

    // =========================
    // RESIZE SAFETY
    // =========================

    window.addEventListener("resize", () => {
        PEEK = getPeekHeight();
        if (state === STATE.PEEK) {
            render(STATE.PEEK, false);
        }
    });
}
