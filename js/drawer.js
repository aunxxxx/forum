/* =========================
   DRAWER.JS FINAL STABLE
========================= */

const STATE = {
    CLOSED: "closed",
    PEEK: "peek",
    OPEN: "open"
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

/* =========================
   BIND DRAWER
========================= */

function bindDrawer(overlay, drawer, triggerSelector) {
    if (!overlay || !drawer) return;

    let state = STATE.CLOSED;

    /* =========================
       SET STATE
    ========================= */

    function setState(next) {
        state = next;

        // overlay
        overlay.classList.toggle("active", next !== STATE.CLOSED);

        // body lock
        document.body.classList.toggle("drawer-open", next !== STATE.CLOSED);

        // reset drawer classes
        drawer.classList.remove("open", "peek");

        if (next === STATE.OPEN) {
            drawer.classList.add("open");
        }

        if (next === STATE.PEEK) {
            drawer.classList.add("peek");
        }
    }

    /* =========================
       ACTIONS
    ========================= */

    function open() {
        setState(STATE.OPEN);
    }

    function close() {
        setState(STATE.CLOSED);
    }

    function peek() {
        setState(STATE.PEEK);
    }

    /* =========================
       TRIGGER CLICK
    ========================= */

    document.addEventListener("click", (e) => {
        const trigger = e.target.closest(triggerSelector);
        if (!trigger) return;

        // PC：直接开关
        if (window.innerWidth >= 769) {
            state === STATE.OPEN ? close() : open();
            return;
        }

        // Mobile：peek toggle
        state === STATE.OPEN ? close() : peek();
    });

    /* =========================
       CLOSE EVENTS
    ========================= */

    overlay.addEventListener("click", close);

    const closeBtn = drawer.querySelector(".drawer-close");
    if (closeBtn) closeBtn.addEventListener("click", close);

    /* =========================
       INIT
    ========================= */

    setState(STATE.CLOSED);
}
