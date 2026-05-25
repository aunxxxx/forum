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
// CONFIG
// =========================

function getPeekHeight() {
    return Math.min(280, Math.max(180, window.innerHeight * 0.35));
}

// =========================
// SCROLL LOCK FACTORY（关键修复）
// =========================

function createScrollLock() {
    let scrollY = 0;

    function getScrollY() {
        return window.scrollY || document.documentElement.scrollTop;
    }

    function lockScroll(lock) {
        const body = document.body;

        if (lock) {
            scrollY = getScrollY();

            body.style.position = "fixed";
            body.style.top = `-${scrollY}px`;
            body.style.left = "0";
            body.style.right = "0";
            body.style.width = "100%";
            body.style.overflow = "hidden";
        } else {
            body.style.position = "";
            body.style.top = "";
            body.style.left = "";
            body.style.right = "";
            body.style.width = "";
            body.style.overflow = "";

            window.scrollTo(0, scrollY);
        }
    }

    return lockScroll;
}

// =========================
// MAIN
// =========================

function bindDrawer(overlay, drawer, triggerSelector) {
    if (!overlay || !drawer) return;

    const app = document.querySelector(".app");

    const lockScroll = createScrollLock();

    let state = "CLOSED";

    let startY = 0;
    let startTranslate = 0;
    let currentY = window.innerHeight;

    let PEEK = getPeekHeight();

    const OPEN_Y = 0;

    function CLOSED_Y() {
        return window.innerHeight;
    }

    // =========================
    // VISUAL CONTROL（关键修复）
    // =========================

    function setVisual(isOpen) {
        const isMobile = window.innerWidth <= 768;

        document.body.classList.toggle("drawer-open", isOpen && isMobile);

        if (!isMobile && app) {
            app.style.transition = "none";
            app.style.transform = "none";
            app.style.filter = "none";
        }
    }

    // =========================
    // BLUR
    // =========================

    function setBlur(v, animate = false) {
        if (!app) return;
        app.style.transition = animate ? "filter .25s ease" : "none";
        app.style.filter = `blur(${v}px)`;
    }

    // =========================
    // RENDER
    // =========================

    function render(y) {
        currentY = y;
        drawer.style.transform = `translateY(${y}px)`;

        let progress = 0;
        if (y <= 0) progress = 1;
        else if (y <= PEEK) progress = 1 - y / PEEK;

        setBlur(progress * 6);
    }

    // =========================
    // STATE APPLY
    // =========================

    function apply(next) {
        state = next;

        overlay.classList.toggle("active", state !== "CLOSED");

        lockScroll(state !== "CLOSED");
        setVisual(state !== "CLOSED");

        drawer.style.transition = "transform .35s cubic-bezier(.22,1,.36,1)";

        if (state === "CLOSED") {
            render(CLOSED_Y());
            setBlur(0, true);
        }

        if (state === "PEEK") {
            render(PEEK);
            setBlur(2, true);
        }

        if (state === "OPEN") {
            render(OPEN_Y);
            setBlur(6, true);
        }
    }

    function open() { apply("OPEN"); }
    function close() { apply("CLOSED"); }
    function peek() { apply("PEEK"); }

    // =========================
    // TRIGGER
    // =========================

    document.addEventListener("click", (e) => {
        if (!e.target.closest(triggerSelector)) return;

        if (window.innerWidth >= 769) {
            state === "OPEN" ? close() : open();
            return;
        }

        state === "OPEN" ? close() : peek();
    });

    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) close();
    });

    const closeBtn = drawer.querySelector(".drawer-close");
    if (closeBtn) closeBtn.addEventListener("click", close);

    // =========================
    // PC MODE
    // =========================

    if (window.innerWidth >= 769) {
        apply("CLOSED");
        return;
    }

    // =========================
    // MOBILE DRAG
    // =========================

    drawer.addEventListener("touchstart", (e) => {
        startY = e.touches[0].clientY;
        startTranslate = currentY;

        drawer.style.transition = "none";
        if (app) app.style.transition = "none";

        PEEK = getPeekHeight();
    });

    drawer.addEventListener(
        "touchmove",
        (e) => {
            e.preventDefault();

            const y = e.touches[0].clientY;
            let newY = startTranslate + (y - startY);

            newY = Math.max(0, Math.min(CLOSED_Y(), newY));

            render(newY);
        },
        { passive: false }
    );

    drawer.addEventListener("touchend", () => {
        drawer.style.transition = "transform .35s cubic-bezier(.22,1,.36,1)";
        if (app) app.style.transition = "";

        const closeThreshold = PEEK * 0.6;

        if (currentY > PEEK + closeThreshold) {
            close();
        } else if (currentY < PEEK / 2) {
            open();
        } else {
            peek();
        }
    });

    // =========================
    // RESIZE
    // =========================

    window.addEventListener("resize", () => {
        PEEK = getPeekHeight();

        if (state === "PEEK") {
            render(PEEK);
        }
    });

    // init
    peek();
}
