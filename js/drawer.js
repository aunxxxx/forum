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
   CORE
========================= */

function bindDrawer(overlay, drawer, triggerSelector) {

    if (!overlay || !drawer) return;

    const app = document.querySelector(".app");

    let state = "CLOSED";

    const CLOSED = 100;
    const OPEN = 0;

    let startY = 0;
    let startTranslate = 100;
    let current = 100;

    const isMobile = () => window.innerWidth <= 768;

    /* =========================
       RENDER
    ========================= */

    function render(y) {
        current = y;
        drawer.style.transform = `translate3d(0, ${y}%, 0)`;
    }

    function setBlur(open) {
        if (!app) return;
        app.style.filter = open ? "blur(4px)" : "none";
    }

    function setOverlay(open) {
        overlay.classList.toggle("active", open);
    }

    function setBody(open) {
        document.body.classList.toggle("drawer-open", open);
    }

    /* =========================
       STATE
    ========================= */

    function open() {
        state = "OPEN";
        setOverlay(true);
        setBody(true);
        setBlur(true);
        render(OPEN);
    }

    function close() {
        state = "CLOSED";
        setOverlay(false);
        setBody(false);
        setBlur(false);
        render(CLOSED);
    }

    function toggle() {
        state === "OPEN" ? close() : open();
    }

    /* =========================
       TRIGGER
    ========================= */

    document.addEventListener("click", (e) => {
        if (!e.target.closest(triggerSelector)) return;
        toggle();
    });

    overlay.addEventListener("click", close);

    const closeBtn = drawer.querySelector(".drawer-close");
    if (closeBtn) closeBtn.addEventListener("click", close);

    /* =========================
       INIT
    ========================= */

    render(CLOSED);
}
