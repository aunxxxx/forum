const STATE = {
    CLOSED: "CLOSED",
    PEEK: "PEEK",
    OPEN: "OPEN"
};

function isMobile() {
    return window.innerWidth <= 768;
}

function createDrawerInstance(overlay, drawer, triggerSelector) {

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

    // =========================
    // ⭐ 关键修复：严格绑定 triggerSelector（不再兜底）
    // =========================
    document.addEventListener("click", (e) => {

        const trigger = e.target.closest(triggerSelector);

        if (!trigger) return;

        e.preventDefault();

        if (!isMobile()) {
            apply(state === STATE.OPEN ? STATE.CLOSED : STATE.OPEN);
            return;
        }

        if (state === STATE.CLOSED) apply(STATE.PEEK);
        else apply(STATE.CLOSED);
    });

    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
            state = STATE.CLOSED;
            render(STATE.CLOSED, true);
        }
    });

    const closeBtn = drawer.querySelector(".drawer-close");
    if (closeBtn) closeBtn.addEventListener("click", () => {
        state = STATE.CLOSED;
        render(STATE.CLOSED, true);
    });

    currentY = closedY();
    render(STATE.CLOSED, false);
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
        ".like-count"
    );
}
