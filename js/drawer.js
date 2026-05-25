function createDrawer(overlay, drawer) {

    const STATE = {
        CLOSED: "closed",
        PEEK: "peek",
        OPEN: "open"
    };

    const config = {
        OPEN_UP: -160,
        PEEK: 60,
        CLOSE_DOWN: 160,
        VELOCITY_CLOSE: 0.65,
        VELOCITY_OPEN: -0.6
    };

    let state = STATE.CLOSED;

    let startY = 0;
    let diff = 0;
    let lastY = 0;
    let lastT = 0;
    let velocity = 0;

    /* =========================
       SET STATE
    ========================= */

    function setState(next) {

        if (state === next) return;

        state = next;

        overlay.classList.toggle("active", state !== STATE.CLOSED);
        document.body.classList.toggle("drawer-open", state !== STATE.CLOSED);

        drawer.style.transition = "transform .35s cubic-bezier(.22,1,.36,1)";

        if (state === STATE.CLOSED) {
            drawer.style.transform = "translateY(100%)";
        }

        if (state === STATE.PEEK) {
            drawer.style.transform = `translateY(${config.PEEK}px)`;
        }

        if (state === STATE.OPEN) {
            drawer.style.transform = "translateY(0)";
        }
    }

    /* =========================
       CLOSE EVENTS
    ========================= */

    overlay.addEventListener("click", (e) => {
        if (e.target !== overlay) return;
        setState(STATE.CLOSED);
    });

    const closeBtn = drawer.querySelector(".drawer-close");
    if (closeBtn) {
        closeBtn.addEventListener("click", () => setState(STATE.CLOSED));
    }

    /* =========================
       DRAG
    ========================= */

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

        // 上限限制（无跳跃版）
        if (diff < config.OPEN_UP) {
            diff = config.OPEN_UP;
        }

        let moveY = diff > 0 ? diff * 0.4 : diff;

        drawer.style.transform = `translateY(${moveY}px)`;
    }, { passive: false });

    drawer.addEventListener("touchend", () => {

        drawer.style.transition = "transform .35s cubic-bezier(.22,1,.36,1)";

        const shouldClose =
            diff > config.CLOSE_DOWN || velocity > config.VELOCITY_CLOSE;

        const shouldOpen =
            diff < -80 || velocity < config.VELOCITY_OPEN;

        if (shouldClose) return setState(STATE.CLOSED);
        if (shouldOpen) return setState(STATE.OPEN);

        setState(STATE.PEEK);
    });

    /* =========================
       INIT
    ========================= */

    setState(STATE.CLOSED);

    return { setState };
}
