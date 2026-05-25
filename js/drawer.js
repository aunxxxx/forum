const STATE = {
    CLOSED: "CLOSED",
    PEEK: "PEEK",
    OPEN: "OPEN"
};

function isMobile() {
    return window.innerWidth <= 768;
}

function createDrawerInstance(overlay, drawer, triggerSelector) {

    if (!overlay || !drawer) return;

    const app = document.querySelector(".app");

    // =========================
    // STATE
    // =========================
    let state = STATE.CLOSED;
    let currentY = 0;

    let startY = 0;
    let startYPos = 0;
    let dragging = false;

    let scrollY = 0;

    // =========================
    // SAFE HEIGHT SYSTEM
    // =========================
    function getH() {
        return window.innerHeight;
    }

    function getPeekY() {
        return getH() * 0.65;
    }

    function getClosedY() {
        return getH(); // 关键：必须和视觉一致
    }

    function getOpenY() {
        return 0;
    }

    function clamp(v, min, max) {
        return Math.max(min, Math.min(max, v));
    }

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
    // BLUR
    // =========================
    function setBlur(v, animate = false) {
        if (!app) return;
        app.style.transition = animate ? "filter .25s ease" : "none";
        app.style.filter = v > 0 ? `blur(${v}px)` : "none";
    }

    // =========================
    // RENDER
    // =========================
    function render(animate = false) {

        const y = currentY;

        drawer.style.transition = animate
            ? "transform .35s cubic-bezier(.22,1,.36,1)"
            : "none";

        drawer.style.transform = `translateY(${y}px)`;

        const peek = getPeekY();
        const progress = 1 - clamp(y / peek, 0, 1);

        setBlur(progress * 6, animate);

        const open = state !== STATE.CLOSED;

        overlay.classList.toggle("is-open", open);
        document.body.classList.toggle("drawer-open", open);

        lockScroll(open);
    }

    // =========================
    // APPLY STATE
    // =========================
    function apply(next, animate = true) {
        if (state === next) return;

        state = next;

        if (state === STATE.OPEN) currentY = getOpenY();
        else if (state === STATE.PEEK) currentY = getPeekY();
        else currentY = getClosedY();

        render(animate);
    }

    // =========================
    // ACTIONS
    // =========================
    const open = () => apply(STATE.OPEN);
    const close = () => apply(STATE.CLOSED);
    const peek = () => apply(STATE.PEEK);

    // =========================
    // TRIGGER
    // =========================
    document.addEventListener("click", (e) => {

        const t = e.target.closest(triggerSelector);
        if (!t) return;

        console.log("CLICK TRIGGERED");
        console.log("TRIGGER FOUND:", trigger);
        console.log("IS MOBILE:", isMobile());
        console.log("STATE BEFORE:", state);
        
        if (!isMobile()) {
            apply(state === STATE.OPEN ? STATE.CLOSED : STATE.OPEN);
            return;
        }

        apply(state === STATE.CLOSED ? STATE.PEEK : STATE.CLOSED);
    });

    // =========================
    // OVERLAY
    // =========================
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) close();
    });

    const closeBtn = drawer.querySelector(".drawer-close");
    if (closeBtn) closeBtn.addEventListener("click", close);

    // =========================
    // DRAG
    // =========================
    drawer.addEventListener("touchstart", (e) => {

        if (!isMobile()) return;

        dragging = true;

        startY = e.touches[0].clientY;
        startYPos = currentY;

        drawer.style.transition = "none";
        if (app) app.style.transition = "none";

    }, { passive: true });

    drawer.addEventListener("touchmove", (e) => {

        if (!dragging) return;

        const delta = e.touches[0].clientY - startY;

        let nextY = startYPos + delta;

        nextY = clamp(nextY, 0, getClosedY());

        currentY = nextY;

        drawer.style.transform = `translateY(${nextY}px)`;

        const peek = getPeekY();
        const p = 1 - clamp(nextY / peek, 0, 1);

        setBlur(p * 6, false);

    }, { passive: false });

    function endDrag() {

        if (!dragging) return;
        dragging = false;

        const y = currentY;
        const peek = getPeekY();
        const closed = getClosedY();

        const openThreshold = peek * 0.3;
        const closeThreshold = peek + (closed - peek) * 0.5;

        if (y <= openThreshold) apply(STATE.OPEN);
        else if (y >= closeThreshold) apply(STATE.CLOSED);
        else apply(STATE.PEEK);
    }

    drawer.addEventListener("touchend", endDrag);
    drawer.addEventListener("touchcancel", endDrag);

    // =========================
    // RESIZE
    // =========================
    window.addEventListener("resize", () => {
        apply(state, false);
    });

    // =========================
    // INIT
    // =========================
    currentY = getClosedY();
    render(false);
}

export function initDrawer() {

    createDrawerInstance(
        document.getElementById("commentOverlay"),
        document.getElementById("commentDrawer"),
        ".comment-btn"
    );

    createDrawerInstance(
        document.getElementById("likeOverlay"),
        document.getElementById("like-count-trigger")
    );
}
