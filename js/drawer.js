const STATE = {
    CLOSED: "closed",
    PEEK: "peek",
    OPEN: "open"
};

const config = {
    MAX_UP: -140,
    MAX_DOWN: 260,
    CLOSE_THRESHOLD: 160
};

let currentState = STATE.CLOSED;
let active = null;

/* =========================
   INIT
========================= */

export function initDrawer() {
    initCommentDrawer();
    initLikeDrawer();
}

/* =========================
   STATE CORE
========================= */

function setState(overlay, drawer, state) {

    const app = document.querySelector(".app");
    currentState = state;

    overlay.classList.toggle("active", state !== STATE.CLOSED);
    document.body.classList.toggle("drawer-open", state !== STATE.CLOSED);

    active = { overlay, drawer };

    if (state === STATE.CLOSED) {

        drawer.style.transform = "translateY(100%)";

        if (app) resetApp(app);

        return;
    }

    if (state === STATE.OPEN) {

        drawer.style.transform = "translateY(0)";

        if (app) applyApp(app, "open");

        return;
    }

    if (state === STATE.PEEK) {

        drawer.style.transform = "translateY(40px)";

        if (app) applyApp(app, "peek");
    }
}

/* =========================
   APP EFFECTS
========================= */

function applyApp(app, mode) {

    if (window.innerWidth >= 769) {

        // PC：只 blur
        app.style.filter =
            mode === "open"
                ? "blur(6px)"
                : "blur(3px)";

        return;
    }

    // mobile
    app.style.transform =
        mode === "open"
            ? "scale(.97)"
            : "scale(.985)";
}

function resetApp(app) {
    app.style.transform = "";
    app.style.filter = "";
}

/* =========================
   COMMENT
========================= */

function initCommentDrawer() {

    const overlay = document.getElementById("commentOverlay");
    const drawer = document.getElementById("commentDrawer");

    if (!overlay || !drawer) return;

    document.addEventListener("click", (e) => {

        const btn = e.target.closest(".comment-btn");
        if (!btn) return;

        setState(overlay, drawer, STATE.OPEN);
    });

    bindClose(overlay, drawer);
    bindDrag(overlay, drawer);
}

/* =========================
   LIKE
========================= */

function initLikeDrawer() {

    const overlay = document.getElementById("likeOverlay");
    const drawer = document.getElementById("likeDrawer");

    if (!overlay || !drawer) return;

    document.addEventListener("click", (e) => {

        const btn = e.target.closest(".like-count-trigger");
        if (!btn) return;

        setState(overlay, drawer, STATE.OPEN);
    });

    bindClose(overlay, drawer);
    bindDrag(overlay, drawer);
}

/* =========================
   CLOSE
========================= */

function bindClose(overlay, drawer) {

    overlay.addEventListener("click", (e) => {
        if (e.target !== overlay) return;
        setState(overlay, drawer, STATE.CLOSED);
    });

    document.addEventListener("click", (e) => {

        const btn = e.target.closest(".drawer-close");
        if (!btn) return;

        const ov = btn.closest(".drawer-overlay");
        const dr = ov?.querySelector(".drawer");

        setState(ov, dr, STATE.CLOSED);
    });
}

/* =========================
   RUBBER BAND
========================= */

function rubber(n) {
    const abs = Math.abs(n);
    const v = abs * (1 - Math.exp(-abs / 120));
    return n < 0 ? -v : v;
}

/* =========================
   DRAG ENGINE (FIXED)
========================= */

function bindDrag(overlay, drawer) {

    if (window.innerWidth >= 769) return;

    let startY = 0;
    let currentY = 0;
    let lastY = 0;
    let lastT = 0;
    let velocity = 0;
    let dragging = false;

    drawer.addEventListener("touchstart", (e) => {

        dragging = true;

        startY = e.touches[0].clientY;
        lastY = startY;
        lastT = Date.now();

        drawer.style.transition = "none";
    });

    drawer.addEventListener("touchmove", (e) => {

        if (!dragging) return;

        const y = e.touches[0].clientY;
        const now = Date.now();

        let diff = y - startY;

        velocity = (y - lastY) / (now - lastT);
        lastY = y;
        lastT = now;

        currentY = Math.min(
            config.MAX_DOWN,
            Math.max(config.MAX_UP, diff)
        );

        const move =
            currentY > 0
                ? currentY
                : rubber(currentY);

        drawer.style.transform =
            `translateY(${move}px)`;

        const app = document.querySelector(".app");

        if (app) {
            app.style.transform =
                `scale(${1 - Math.min(Math.abs(currentY)/3000, 0.05)})`;
        }
    });

    drawer.addEventListener("touchend", () => {

        dragging = false;

        const shouldClose =
            currentY > config.CLOSE_THRESHOLD || velocity > 0.6;

        if (shouldClose) {

            setState(overlay, drawer, STATE.CLOSED);

        } else {

            if (currentY < -80) {
                setState(overlay, drawer, STATE.OPEN);
            } else {
                setState(overlay, drawer, STATE.PEEK);
            }
        }

        currentY = 0;
    });
}
