const config = {
    OPEN_UP: -160,
    CLOSE_DOWN: 160,
    PEEK: 60,
    VELOCITY_CLOSE: 0.65,
    VELOCITY_OPEN: -0.6
};

/* =========================
   ENTRY
========================= */

export function initDrawer() {

    createDrawer(
        document.getElementById("commentOverlay"),
        document.getElementById("commentDrawer"),
        ".comment-btn"
    );

    createDrawer(
        document.getElementById("likeOverlay"),
        document.getElementById("likeDrawer"),
        ".like-count-trigger"
    );
}

/* =========================
   CORE FACTORY
========================= */

function createDrawer(overlay, drawer, triggerSelector) {

    if (!overlay || !drawer) return;

    let startY = 0;
    let diff = 0;
    let lastY = 0;
    let lastT = 0;
    let velocity = 0;

    let state = "CLOSED";

    function setState(s) {

        state = s;

        overlay.classList.toggle("active", s !== "CLOSED");
        document.body.classList.toggle("drawer-open", s !== "CLOSED");

        drawer.style.transition = "transform .35s cubic-bezier(.22,1,.36,1)";

        if (s === "CLOSED") {
            drawer.style.transform = "translateY(100%)";
        }

        if (s === "PEEK") {
            drawer.style.transform = `translateY(${config.PEEK}px)`;
        }

        if (s === "OPEN") {
            drawer.style.transform = "translateY(0)";
        }
    }

    /* =========================
       OPEN
    ========================= */

    document.addEventListener("click", (e) => {
        if (e.target.closest(triggerSelector)) {
            setState("OPEN");
        }
    });

    /* =========================
       CLOSE
    ========================= */

    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
            setState("CLOSED");
        }
    });

    const closeBtn = drawer.querySelector(".drawer-close");
    if (closeBtn) {
        closeBtn.addEventListener("click", () => setState("CLOSED"));
    }

    /* =========================
       DRAG（mobile only）
    ========================= */

    if (window.innerWidth >= 769) {
        setState("CLOSED");
        return;
    }

    drawer.addEventListener("touchstart", (e) => {

        startY = e.touches[0].clientY;
        lastY = startY;
        lastT = Date.now();

        diff = 0;
        velocity = 0;

        drawer.style.transition = "none";
    });

    drawer.addEventListener("touchmove", (e) => {

        e.preventDefault();

        const y = e.touches[0].clientY;
        const now = Date.now();

        const dt = now - lastT;

        if (dt > 0) {
            velocity = (y - lastY) / dt;
        }

        lastY = y;
        lastT = now;

        diff = y - startY;

        if (diff < config.OPEN_UP) diff = config.OPEN_UP;

        let move = diff > 0 ? diff * 0.4 : diff;

        drawer.style.transform = `translateY(${move}px)`;

    }, { passive: false });

    drawer.addEventListener("touchend", () => {

        drawer.style.transition = "transform .35s cubic-bezier(.22,1,.36,1)";

        const shouldClose =
            diff > config.CLOSE_DOWN || velocity > config.VELOCITY_CLOSE;

        const shouldOpen =
            diff < -80 || velocity < config.VELOCITY_OPEN;

        if (shouldClose) return setState("CLOSED");
        if (shouldOpen) return setState("OPEN");

        setState("PEEK");
    });

    setState("CLOSED");
}
