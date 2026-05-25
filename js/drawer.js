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

function createDrawer(overlay, drawer, triggerSelector) {

    if (!overlay || !drawer) return;

    let startY = 0;
    let moveY = 0;

    let isOpen = false;

    /* =========================
       OPEN
    ========================= */

    document.addEventListener("click", (e) => {
        if (e.target.closest(triggerSelector)) {
            open();
        }
    });

    function open() {
        isOpen = true;

        overlay.classList.add("active");
        document.body.classList.add("drawer-open");

        drawer.style.transition = "transform .35s cubic-bezier(.22,1,.36,1)";
        drawer.style.transform = "translateY(0)";
    }

    /* =========================
       CLOSE
    ========================= */

    function close() {
        isOpen = false;

        overlay.classList.remove("active");
        document.body.classList.remove("drawer-open");

        drawer.style.transform = "translateY(100%)";
    }

    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) close();
    });

    const closeBtn = drawer.querySelector(".drawer-close");
    if (closeBtn) closeBtn.addEventListener("click", close);

    /* =========================
       MOBILE DRAG
    ========================= */

    if (window.innerWidth >= 769) return;

    drawer.addEventListener("touchstart", (e) => {
        startY = e.touches[0].clientY;
        moveY = 0;

        drawer.style.transition = "none";
    });

    drawer.addEventListener("touchmove", (e) => {

        e.preventDefault();

        const y = e.touches[0].clientY;
        moveY = y - startY;

        if (moveY > 0) {
            drawer.style.transform = `translateY(${moveY}px)`;
        }

    }, { passive: false });

    drawer.addEventListener("touchend", () => {

        drawer.style.transition = "transform .35s cubic-bezier(.22,1,.36,1)";

        if (moveY > 140) {
            close();
        } else {
            drawer.style.transform = "translateY(0)";
        }

        moveY = 0;
    });
}
