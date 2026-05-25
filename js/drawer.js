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
   CONFIG
========================= */

const CONFIG = {
    PEEK: 60,
    MAX_UP: -140,
    CLOSE_THRESHOLD: 140
};

/* =========================
   DRAWER CORE
========================= */

function createDrawer(overlay, drawer, triggerSelector) {

    if (!overlay || !drawer) return;

    const app = document.querySelector(".app");

    let state = "CLOSED"; // CLOSED | PEEK | OPEN

    let startY = 0;
    let startTranslate = 0;
    let currentY = window.innerHeight;

    /* =========================
       APP BLUR（ONLY）
    ========================= */

    function setBlur(v) {
        if (!app) return;
        app.style.transition = "filter .2s ease";
        app.style.filter = `blur(${v}px)`;
    }

    /* =========================
       APPLY STATE
    ========================= */

    function apply(s) {

        state = s;

        overlay.classList.toggle("active", s !== "CLOSED");
        document.body.classList.toggle("drawer-open", s !== "CLOSED");

        drawer.style.transition = "transform .35s cubic-bezier(.22,1,.36,1)";

        if (s === "CLOSED") {
            drawer.style.transform = "translateY(100%)";
            setBlur(0);
            currentY = window.innerHeight;
        }

        if (s === "PEEK") {
            drawer.style.transform = `translateY(${CONFIG.PEEK}px)`;
            setBlur(2);
            currentY = CONFIG.PEEK;
        }

        if (s === "OPEN") {
            drawer.style.transform = "translateY(0)";
            setBlur(6);
            currentY = 0;
        }
    }

    /* =========================
       ACTIONS
    ========================= */

    const open = () => apply("OPEN");
    const close = () => apply("CLOSED");
    const peek = () => apply("PEEK");

    /* =========================
       TRIGGER
    ========================= */

    document.addEventListener("click", (e) => {
        const btn = e.target.closest(triggerSelector);
        if (!btn) return;

        if (state === "OPEN") close();
        else peek();
    });

    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) close();
    });

    const closeBtn = drawer.querySelector(".drawer-close");
    if (closeBtn) closeBtn.addEventListener("click", close);

    /* =========================
       PC MODE
    ========================= */

    if (window.innerWidth >= 769) {
        apply("CLOSED");
        return;
    }

    /* =========================
       TOUCH START
    ========================= */

    drawer.addEventListener("touchstart", (e) => {

        startY = e.touches[0].clientY;
        startTranslate = currentY;

        drawer.style.transition = "none";
        if (app) app.style.transition = "none";
    });

    /* =========================
       TOUCH MOVE
    ========================= */

    drawer.addEventListener("touchmove", (e) => {

        e.preventDefault();

        const y = e.touches[0].clientY;
        let newY = startTranslate + (y - startY);

        if (newY < CONFIG.MAX_UP) newY = CONFIG.MAX_UP;
        if (newY > window.innerHeight) newY = window.innerHeight;

        currentY = newY;

        drawer.style.transform = `translateY(${newY}px)`;

        const progress = Math.max(0, Math.min(1, 1 - newY / CONFIG.PEEK));
        setBlur(progress * 6);

    }, { passive: false });

    /* =========================
       TOUCH END
    ========================= */

    drawer.addEventListener("touchend", () => {

        drawer.style.transition = "transform .35s cubic-bezier(.22,1,.36,1)";
        if (app) app.style.transition = "filter .2s ease";

        if (currentY > CONFIG.CLOSE_THRESHOLD) {
            close();
            return;
        }

        if (currentY < CONFIG.PEEK / 2) {
            open();
            return;
        }

        peek();
    });

    /* =========================
       INIT
    ========================= */

    peek();
}
