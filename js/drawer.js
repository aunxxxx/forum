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
// SCROLL LOCK
// =========================

function createScrollLock() {
    let scrollY = 0;

    return function lock(isLock) {
        const body = document.body;

        if (isLock) {
            scrollY = window.scrollY || document.documentElement.scrollTop;

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
    };
}

// =========================
// STATE
// =========================

const STATE = {
    CLOSED: "CLOSED",
    PEEK: "PEEK",
    OPEN: "OPEN"
};

// =========================
// CORE
// =========================

function bindDrawer(overlay, drawer, triggerSelector) {
    if (!overlay || !drawer) return;

    const app = document.querySelector(".app");
    const lockScroll = createScrollLock();

    let state = STATE.CLOSED;

    let PEEK = getPeekHeight();
    let currentY = window.innerHeight;

    const OPEN_Y = 0;

    function CLOSED_Y() {
        return window.innerHeight;
    }

    // =========================
    // RENDER（唯一入口）
    // =========================

    function render(next, animate = true) {
        const isOpen = next !== STATE.CLOSED;

        overlay.classList.toggle("active", isOpen);
        document.body.classList.toggle("drawer-open", isOpen);

        lockScroll(isOpen);

        drawer.style.transition = animate
            ? "transform .35s cubic-bezier(.22,1,.36,1)"
            : "none";

        app.style.transition = animate
            ? "transform .32s cubic-bezier(.22,1,.36,1), filter .25s ease"
            : "none";

        let y = CLOSED_Y();
        if (next === STATE.PEEK) y = PEEK;
        if (next === STATE.OPEN) y = OPEN_Y;

        currentY = y;

        // drawer
        drawer.style.display = "flex";
        drawer.style.transform = `translateY(${y}px)`;

        // blur
        let progress = 0;
        if (y <= 0) progress = 1;
        else if (y <= PEEK) progress = 1 - y / PEEK;

        app.style.filter = `blur(${progress * 6}px)`;

        // mobile background effect
        if (window.innerWidth <= 768) {
            app.style.transform = isOpen
                ? "scale(0.965) translateY(6px)"
                : "none";
        } else {
            app.style.transform = "none";
            app.style.filter = isOpen ? app.style.filter : "none";
        }

        state = next;
    }

    function open() { render(STATE.OPEN); }
    function close() { render(STATE.CLOSED); }
    function peek() { render(STATE.PEEK); }

    // =========================
    // INIT
    // =========================

    render(STATE.CLOSED, false);

    // =========================
    // TRIGGER
    // =========================

    document.addEventListener("click", (e) => {
        if (!e.target.closest(triggerSelector)) return;

        if (window.innerWidth >= 769) {
            state === STATE.OPEN ? close() : open();
        } else {
            state === STATE.OPEN ? close() : peek();
        }
    });

    overlay.addEventListener("click", () => close());

    const closeBtn = drawer.querySelector(".drawer-close");
    if (closeBtn) closeBtn.addEventListener("click", close);

    // =========================
    // DESKTOP
    // =========================

    if (window.innerWidth >= 769) {
        render(STATE.CLOSED, false);
        return;
    }

    // =========================
    // DRAG
    // =========================

    let startY = 0;
    let startTranslate = 0;

    drawer.addEventListener("touchstart", (e) => {
        startY = e.touches[0].clientY;
        startTranslate = currentY;

        drawer.style.transition = "none";
        app.style.transition = "none";

        PEEK = getPeekHeight();
    });

    drawer.addEventListener("touchmove", (e) => {
        e.preventDefault();

        const y = e.touches[0].clientY;
        let newY = startTranslate + (y - startY);

        newY = Math.max(0, Math.min(CLOSED_Y(), newY));

        currentY = newY;
        drawer.style.transform = `translateY(${newY}px)`;

        let progress = 0;
        if (newY <= 0) progress = 1;
        else if (newY <= PEEK) progress = 1 - newY / PEEK;

        app.style.filter = `blur(${progress * 6}px)`;
    }, { passive: false });

    drawer.addEventListener("touchend", () => {
        drawer.style.transition = "transform .35s cubic-bezier(.22,1,.36,1)";
        app.style.transition = "";

        const closeThreshold = PEEK * 0.6;

        if (currentY > PEEK + closeThreshold) close();
        else if (currentY < PEEK / 2) open();
        else peek();
    });

    window.addEventListener("resize", () => {
        PEEK = getPeekHeight();
        if (state === STATE.PEEK) render(STATE.PEEK, false);
    });
}
