const STATE = {
    CLOSED: "CLOSED",
    PEEK: "PEEK",
    OPEN: "OPEN"
};

// =========================
// DEVICE DETECT
// =========================

function isMobile() {
    return window.innerWidth <= 768;
}

// =========================
// CORE HEIGHT
// =========================

function getDrawerHeight() {
    return Math.min(window.innerHeight * 0.85, 680);
}

// =========================
// DRAWER ENGINE
// =========================

function createDrawerInstance(overlay, drawer, triggerSelector) {
    if (!overlay || !drawer) {
        console.warn("Drawer init failed:", overlay, drawer);
        return;
    }

    const app = document.querySelector(".app");

    let state = STATE.CLOSED;

    let currentY = 0;

    let startY = 0;
    let startTranslate = 0;

    let dragging = false;
    let scrollY = 0;

    let PEEK = 0;

    function getPeekHeight() {
        const h = getDrawerHeight();
        return Math.min(280, Math.max(180, h * 0.35));
    }

    function refreshPeek() {
        PEEK = getPeekHeight();
    }

    function getY(s) {
        const h = getDrawerHeight();

        if (s === STATE.OPEN) return 0;
        if (s === STATE.PEEK) return h - PEEK;
        return h;
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
        const h = getDrawerHeight();
        const y = getY(s);

        currentY = y;

        drawer.style.transition = animate
            ? "transform .35s cubic-bezier(.22,1,.36,1)"
            : "none";

        drawer.style.transform = `translateY(${y}px)`;

        const peekY = h - PEEK;

        let progress = 0;
        if (y <= peekY) {
            progress = 1 - y / peekY;
        }

        setBlur(progress * 6, animate);
    }

    function renderDrag(y) {
        currentY = y;

        const h = getDrawerHeight();

        drawer.style.transition = "none";
        drawer.style.transform = `translateY(${y}px)`;

        const peekY = h - PEEK;

        let progress = 0;
        if (y <= peekY) {
            progress = 1 - y / peekY;
        }

        setBlur(progress * 6, false);
    }

    function apply(next) {
        if (state === next) return;

        state = next;

        const open = state !== STATE.CLOSED;

        overlay.classList.toggle("is-open", open);
        document.body.classList.toggle("drawer-open", open);

        lockScroll(open);

        render(state, true);
    }

    function open() { apply(STATE.OPEN); }
    function close() { apply(STATE.CLOSED); }
    function peek() { apply(STATE.PEEK); }

    // =========================
    // TRIGGER (PC / MOBILE FIX)
    // =========================

    document.addEventListener("click", (e) => {
        const t = e.target.closest(triggerSelector);
        if (!t) return;

        // 🔥 PC 行为：直接 OPEN / CLOSE
        if (!isMobile()) {
            apply(state === STATE.OPEN ? STATE.CLOSED : STATE.OPEN);
            return;
        }

        // 🔥 Mobile 行为：CLOSED → PEEK → CLOSE
        if (state === STATE.CLOSED) {
            apply(STATE.PEEK);
        } else {
            apply(STATE.CLOSED);
        }
    });

    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) close();
    });

    const closeBtn = drawer.querySelector(".drawer-close");
    if (closeBtn) closeBtn.addEventListener("click", close);

    // =========================
    // TOUCH (ONLY MOBILE)
    // =========================

    drawer.addEventListener("touchstart", (e) => {
        if (!isMobile()) return;

        dragging = true;

        startY = e.touches[0].clientY;
        startTranslate = currentY;

        drawer.style.transition = "none";
        if (app) app.style.transition = "none";
    });

    drawer.addEventListener(
        "touchmove",
        (e) => {
            if (!dragging) return;

            e.preventDefault();

            const y = e.touches[0].clientY;

            let nextY = startTranslate + (y - startY);

            const h = getDrawerHeight();
            nextY = Math.max(0, Math.min(h, nextY));

            renderDrag(nextY);
        },
        { passive: false }
    );

    function endDrag() {
        if (!dragging) return;

        dragging = false;

        const h = getDrawerHeight();
        const peekY = h - PEEK;

        const openThreshold = peekY * 0.35;
        const closeThreshold = h - PEEK * 0.5;

        if (currentY < openThreshold) {
            apply(STATE.OPEN);
        } else if (currentY > closeThreshold) {
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
        refreshPeek();
        render(state, false);
    });

    // =========================
    // INIT
    // =========================

    refreshPeek();
    apply(STATE.CLOSED);
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
