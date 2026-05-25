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
        console.warn("Drawer init failed:", overlay, drawer);
        return;
    }

    const app = document.querySelector(".app");

    // =========================
    // SINGLE SOURCE OF TRUTH
    // =========================
    const model = {
        mode: STATE.CLOSED,
        y: 0
    };

    let dragging = false;
    let startY = 0;
    let startYValue = 0;
    let scrollY = 0;

    // =========================
    // HEIGHT SYSTEM
    // =========================
    function H() {
        return Math.min(window.innerHeight * 0.85, 720);
    }

    function Y_OPEN() {
        return 0;
    }

    function Y_PEEK() {
        return H() * 0.65;
    }

    function Y_CLOSED() {
        return H();
    }

    function getTargetY(mode) {
        if (mode === STATE.OPEN) return Y_OPEN();
        if (mode === STATE.PEEK) return Y_PEEK();
        return Y_CLOSED();
    }

    // =========================
    // RENDER (ONLY ONE ENTRY)
    // =========================
    function render(animate = false) {

        const y = model.y;

        drawer.style.transition = animate
            ? "transform .35s cubic-bezier(.22,1,.36,1)"
            : "none";

        drawer.style.transform = `translateY(${y}px)`;

        // blur
        const p = Math.max(0, Math.min(1, 1 - y / Y_PEEK()));
        if (app) {
            app.style.transition = animate ? "filter .25s ease" : "none";
            app.style.filter = p > 0 ? `blur(${p * 6}px)` : "none";
        }

        const open = model.mode !== STATE.CLOSED;

        overlay.classList.toggle("is-open", open);
        document.body.classList.toggle("drawer-open", open);

        lockScroll(open);
    }

    // =========================
    // STATE SETTER (ONLY ENTRY)
    // =========================
    function setState(nextMode, animate = true) {

        if (model.mode === nextMode) return;

        model.mode = nextMode;
        model.y = getTargetY(nextMode);

        render(animate);
    }

    function lockScroll(lock) {
        const body = document.body;

        if (lock) {
            scrollY = window.scrollY || 0;

            body.style.position = "fixed";
            body.style.top = `-${scrollY}px`;
            body.style.left = "0";
            body.style.right = "0";
            body.style.width = "100%";
        } else {
            body.style.position = "";
            body.style.top = "";
            body.style.left = "";
            body.style.right = "";
            body.style.width = "";

            window.scrollTo(0, scrollY);
        }
    }

    // =========================
    // ACTIONS
    // =========================
    const open = () => setState(STATE.OPEN);
    const close = () => setState(STATE.CLOSED);
    const peek = () => setState(STATE.PEEK);

    // =========================
    // TRIGGER
    // =========================
    document.addEventListener("click", (e) => {

        const t = e.target.closest(triggerSelector);
        if (!t) return;

        e.preventDefault();

        if (!isMobile()) {
            setState(
                model.mode === STATE.OPEN ? STATE.CLOSED : STATE.OPEN
            );
            return;
        }

        if (model.mode === STATE.CLOSED) {
            setState(STATE.PEEK);
        } else {
            setState(STATE.CLOSED);
        }
    });

    // =========================
    // OVERLAY CLOSE
    // =========================
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) close();
    });

    const closeBtn = drawer.querySelector(".drawer-close");
    if (closeBtn) closeBtn.addEventListener("click", close);

    // =========================
    // DRAG (MOBILE ONLY)
    // =========================
    drawer.addEventListener("touchstart", (e) => {

        if (!isMobile()) return;

        dragging = true;

        startY = e.touches[0].clientY;
        startYValue = model.y;

        drawer.style.transition = "none";
        if (app) app.style.transition = "none";

    }, { passive: true });

    drawer.addEventListener("touchmove", (e) => {

        if (!dragging) return;

        e.preventDefault();

        const delta = e.touches[0].clientY - startY;

        let nextY = startYValue + delta;

        nextY = Math.max(0, Math.min(Y_CLOSED(), nextY));

        model.y = nextY;

        drawer.style.transform = `translateY(${nextY}px)`;

        const p = Math.max(0, Math.min(1, 1 - nextY / Y_PEEK()));

        if (app) {
            app.style.filter = `blur(${p * 6}px)`;
        }

    }, { passive: false });

    function endDrag() {

        if (!dragging) return;
        dragging = false;

        const y = model.y;

        const openThreshold = Y_PEEK() * 0.25;
        const closeThreshold = Y_PEEK() + (Y_CLOSED() - Y_PEEK()) * 0.5;

        if (y <= openThreshold) {
            setState(STATE.OPEN);
        } else if (y >= closeThreshold) {
            setState(STATE.CLOSED);
        } else {
            setState(STATE.PEEK);
        }
    }

    drawer.addEventListener("touchend", endDrag);
    drawer.addEventListener("touchcancel", endDrag);

    // =========================
    // RESIZE
    // =========================
    window.addEventListener("resize", () => {

        model.y = getTargetY(model.mode);

        render(false);
    });

    // =========================
    // INIT
    // =========================
    model.y = Y_CLOSED();
    render(false);
}

// =========================
// EXPORT
// =========================
export function initDrawer() {

    createDrawerInstance(
        document.getElementById("commentOverlay"),
        document.getElementById("commentDrawer"),
        ".comment-btn"
    );

    createDrawerInstance(
        document.getElementById("likeOverlay"),
        document.getElementById("likeDrawer"),
        ".like-count-trigger"
    );
}
