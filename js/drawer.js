const STATE = {
    CLOSED: "CLOSED",
    PEEK: "PEEK",
    OPEN: "OPEN"
};

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
// UTIL
// =========================

function getPeekHeight() {
    return Math.min(320, Math.max(180, window.innerHeight * 0.35));
}

function getClosedY() {
    return window.innerHeight;
}

function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
}

// =========================
// CORE
// =========================

function bindDrawer(overlay, drawer, triggerSelector) {
    if (!overlay || !drawer) return;

    const app = document.querySelector(".app");

    let state = STATE.CLOSED;

    let PEEK = getPeekHeight();
    let currentY = getClosedY();

    let startY = 0;
    let startTranslate = 0;

    let dragging = false;

    let scrollY = 0;

    // =========================
    // SCROLL LOCK
    // =========================

    function lockScroll(lock) {
        if (lock) {
            scrollY = window.scrollY;

            document.body.style.position = "fixed";
            document.body.style.top = `-${scrollY}px`;
            document.body.style.left = "0";
            document.body.style.right = "0";
            document.body.style.width = "100%";
        } else {
            document.body.style.position = "";
            document.body.style.top = "";
            document.body.style.left = "";
            document.body.style.right = "";
            document.body.style.width = "";

            window.scrollTo(0, scrollY);
        }
    }

    // =========================
    // BLUR
    // =========================

    function setBlur(v, animate = false) {
        if (!app) return;

        app.style.transition = animate
            ? "filter .25s ease"
            : "none";

        app.style.filter = `blur(${v}px)`;
    }

    // =========================
    // RENDER（修复：overlay 不再依赖 state 闭包）
    // =========================

    function render(y, nextState = state, animate = false) {
        currentY = y;

        if (!animate) {
            drawer.style.transition = "none";
        } else {
            drawer.style.transition =
                "transform .35s cubic-bezier(.22,1,.36,1)";
        }

        drawer.style.transform = `translateY(${y}px)`;

        const progress = y <= PEEK ? 1 - y / PEEK : 0;

        setBlur(progress * 6, false);

        // ✅ 修复：用 nextState 而不是 state（避免闭包不同步）
        overlay.classList.toggle(
            "is-open",
            nextState !== STATE.CLOSED
        );
    }

    // =========================
    // APPLY
    // =========================

    function apply(nextState) {
        if (state === nextState) return;

        state = nextState;

        lockScroll(state !== STATE.CLOSED);

        if (state === STATE.CLOSED) {
            render(getClosedY(), state, true);
            setBlur(0, true);
        }

        if (state === STATE.PEEK) {
            render(PEEK, state, true);
            setBlur(2, true);
        }

        if (state === STATE.OPEN) {
            render(0, state, true);
            setBlur(6, true);
        }
    }

    const open = () => apply(STATE.OPEN);
    const close = () => apply(STATE.CLOSED);
    const peek = () => apply(STATE.PEEK);

    // =========================
    // TRIGGER
    // =========================

    document.addEventListener("click", (e) => {
        const t = e.target.closest(triggerSelector);
        if (!t) return;

        if (window.innerWidth >= 769) {
            state === STATE.OPEN ? close() : open();
        } else {
            if (state === STATE.CLOSED) peek();
            else if (state === STATE.PEEK) open();
            else close();
        }
    });

    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) close();
    });

    drawer.querySelector(".drawer-close")
        ?.addEventListener("click", close);

    // =========================
    // TOUCH（修复 PEEK 重算问题 + cancel 行为）
    // =========================

    drawer.addEventListener("touchstart", (e) => {
        if (window.innerWidth >= 769) return;

        dragging = true;

        startY = e.touches[0].clientY;
        startTranslate = currentY;

        drawer.style.transition = "none";
        if (app) app.style.transition = "none";

        // ❌ 修复：PEEK 不在 touchstart 更新
    }, { passive: true });

    drawer.addEventListener("touchmove", (e) => {
        if (!dragging) return;

        e.preventDefault();

        const y = e.touches[0].clientY;

        let nextY = startTranslate + (y - startY);

        nextY = clamp(nextY, 0, getClosedY());

        render(nextY, state, false);
    }, { passive: false });

    drawer.addEventListener("touchend", () => {
        dragging = false;

        if (app) app.style.transition = "";

        const toOpen = currentY;
        const toClose = getClosedY() - currentY;

        if (toOpen < PEEK * 0.4) {
            open();
        } else if (toClose < PEEK * 0.6) {
            close();
        } else {
            peek();
        }
    });

    // ✅ 修复：cancel 不直接 close
    drawer.addEventListener("touchcancel", () => {
        dragging = false;

        if (state === STATE.OPEN) open();
        else if (state === STATE.CLOSED) close();
        else peek();
    });

    // =========================
    // RESIZE
    // =========================

    window.addEventListener("resize", () => {
        PEEK = getPeekHeight();

        if (state === STATE.OPEN) render(0, state, false);
        else if (state === STATE.PEEK) render(PEEK, state, false);
        else render(getClosedY(), state, false);
    });

    // =========================
    // INIT
    // =========================

    render(getClosedY(), state, false);
}
