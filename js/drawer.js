const STATE = {
    CLOSED: 1,
    PEEK: 0.6,
    OPEN: 0
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

function bindDrawer(overlay, drawer, triggerSelector) {

    if (!overlay || !drawer) return;

    let progress = 1; // 1=closed, 0=open
    let startY = 0;
    let startProgress = 1;
    let dragging = false;

    const SNAP = {
        OPEN: 0.25,
        MID: 0.65
    };

    function render(p) {

        progress = Math.max(0, Math.min(1, p));

        const y = progress * 100;
        drawer.style.transform = `translate3d(0, ${y}%, 0)`;

        const isOpen = progress < 0.95;
        overlay.classList.toggle("is-open", isOpen);
        document.body.classList.toggle("drawer-open", isOpen);
    }

    function open() { render(STATE.OPEN); }
    function close() { render(STATE.CLOSED); }
    function peek() { render(STATE.PEEK); }

    /* =========================
       TRIGGER
    ========================= */

    document.addEventListener("click", (e) => {
        if (!e.target.closest(triggerSelector)) return;

        if (progress < 0.2) close();
        else open();
    });

    overlay.addEventListener("click", close);

    const closeBtn = drawer.querySelector(".drawer-close");
    if (closeBtn) closeBtn.addEventListener("click", close);

    /* =========================
       GESTURE
    ========================= */

    drawer.addEventListener("touchstart", (e) => {
        dragging = true;
        startY = e.touches[0].clientY;
        startProgress = progress;

        drawer.style.transition = "none";
    });

    drawer.addEventListener("touchmove", (e) => {
        if (!dragging) return;

        const delta = startY - e.touches[0].clientY;

        const newProgress = startProgress + delta / 300;

        render(newProgress);

    }, { passive: false });

    drawer.addEventListener("touchend", () => {

        dragging = false;

        drawer.style.transition = "transform .28s cubic-bezier(.22,1,.36,1)";

        if (progress > SNAP.MID) {
            close();
        } else if (progress > SNAP.OPEN) {
            peek();
        } else {
            open();
        }
    });

    /* init */
    close();
}
