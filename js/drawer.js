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

    let state = STATE.CLOSED;
    let currentY = 0;

    let startY = 0;
    let startYPos = 0;
    let dragging = false;

    let scrollY = 0;

    function h() {
        return window.innerHeight;
    }

    function peekY() {
        return h() * 0.65;
    }

    function closedY() {
        return h();
    }

    function openY() {
        return 0;
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

    function setBlur(v, animate = false) {
        if (!app) return;

        app.style.transition = animate ? "filter .25s ease" : "none";
        app.style.filter = v > 0 ? `blur(${v}px)` : "none";
    }

    function render(s, animate = false) {

        let y;
        if (s === STATE.OPEN) y = openY();
        else if (s === STATE.PEEK) y = peekY();
        else y = closedY();

        currentY = y;

        drawer.style.transition = animate
            ? "transform .35s cubic-bezier(.22,1,.36,1)"
            : "none";

        drawer.style.transform = `translateY(${y}px)`;

        const p = 1 - Math.min(1, y / peekY());
        setBlur(p * 6, animate);

        const open = s !== STATE.CLOSED;

        overlay.classList.toggle("is-open", open);
        document.body.classList.toggle("drawer-open", open);

        lockScroll(open);
    }

    function apply(next) {
        if (state === next) return;
        state = next;
        render(state, true);
    }

    function open() { apply(STATE.OPEN); }
    function close() { apply(STATE.CLOSED); }
    function peek() { apply(STATE.PEEK); }

    // =========================
    // CLICK TRIGGER
    // =========================
    document.addEventListener("click", (e) => {

        const trigger = e.target.closest(triggerSelector);
        if (!trigger) return;

        e.preventDefault();

        if (!isMobile()) {
            apply(state === STATE.OPEN ? STATE.CLOSED : STATE.OPEN);
            return;
        }

        if (state === STATE.CLOSED) {
            apply(STATE.PEEK);
        } else {
            apply(STATE.CLOSED);
        }
    });

    // =========================
    // CLOSE OVERLAY
    // =========================
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) close();
    });

    const closeBtn = drawer.querySelector(".drawer-close");
    if (closeBtn) closeBtn.addEventListener("click", close);

    // =========================
    // TOUCH DRAG (MOBILE)
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

        e.preventDefault();

        const delta = e.touches[0].clientY - startY;

        let nextY = startYPos + delta;

        nextY = Math.max(0, Math.min(closedY(), nextY));

        currentY = nextY;

        drawer.style.transform = `translateY(${nextY}px)`;

        const p = 1 - Math.min(1, nextY / peekY());
        setBlur(p * 6, false);

    }, { passive: false });

    function endDrag() {

        if (!dragging) return;
        dragging = false;

        const y = currentY;

        const openThreshold = peekY() * 0.25;
        const closeThreshold = peekY() + (closedY() - peekY()) * 0.5;

        if (y <= openThreshold) {
            apply(STATE.OPEN);
        } else if (y >= closeThreshold) {
            apply(STATE.CLOSED);
        } else {
            apply(STATE.PEEK);
        }
    }

    drawer.addEventListener("touchend", endDrag);
    drawer.addEventListener("touchcancel", endDrag);

    // =========================
    // RESIZE
    // =========================
    window.addEventListener("resize", () => {
        render(state, false);
    });

    // =========================
    // INIT
    // =========================
    apply(STATE.CLOSED);
}

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
