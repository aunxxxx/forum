const STATE = {
    CLOSED: "CLOSED",
    PEEK: "PEEK",
    OPEN: "OPEN"
};

function isMobile() {
    return window.innerWidth <= 768;
}

export function createDrawerInstance(overlay, drawer, triggerSelector) {

    if (!overlay || !drawer) {
        console.warn("Drawer init failed");
        return;
    }

    const app = document.querySelector(".app");

    // =========================
    // STATE
    // =========================
    let state = STATE.CLOSED;

    let startY = 0;
    let startTranslate = 100;
    let currentTranslate = 100;

    let dragging = false;

    let scrollY = 0;

    // =========================
    // POSITIONS (%)
    // =========================
    const CLOSED_Y = 100;
    const PEEK_Y = 15;   // ⭐ 更合理高度（你可以再调）
    const OPEN_Y = 0;

    // =========================
    // SCROLL LOCK
    // =========================
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

    // =========================
    // BLUR + SCALE
    // =========================
    function setBlur(progress, animate = false) {

        if (!app) return;

        if (!isMobile()) {
            app.style.filter = "none";
            app.style.transform = "none";
            return;
        }

        app.style.transition = animate
            ? "filter .25s ease, transform .25s ease"
            : "none";

        const blur = progress * 6;
        const scale = 1 - progress * 0.06;

        app.style.filter = blur > 0 ? `blur(${blur}px)` : "none";
        app.style.transform = `scale(${scale})`;
    }

    // =========================
    // RENDER
    // =========================
    function render(y, animate = false) {

        currentTranslate = y;

        drawer.style.transition = animate
            ? "transform .35s cubic-bezier(.22,1,.36,1)"
            : "none";

        // PC
        if (!isMobile()) {

            drawer.style.transform =
                (y < 100)
                    ? `translate(-50%, -50%)`
                    : `translate(-50%, calc(-50% + 100vh))`;

        } else {

            drawer.style.transform = `translateY(${y}%)`;
        }

        // progress
        let progress = 1 - (y / CLOSED_Y);
        progress = Math.max(0, Math.min(1, progress));

        setBlur(progress, animate);

        const open = y < CLOSED_Y;

        overlay.classList.toggle("is-open", open);

        document.body.classList.toggle("drawer-open", open);

        lockScroll(open);
    }

    // =========================
    // APPLY STATE
    // =========================
    function apply(next) {

        if (state === next) return;

        state = next;

        if (state === STATE.OPEN) render(OPEN_Y, true);
        else if (state === STATE.PEEK) render(PEEK_Y, true);
        else render(CLOSED_Y, true);
    }

    const open = () => apply(STATE.OPEN);
    const close = () => apply(STATE.CLOSED);
    const peek = () => apply(STATE.PEEK);

    // =========================
    // TRIGGER
    // =========================
    document.addEventListener("click", (e) => {

        const trigger = e.target.closest(triggerSelector);
        if (!trigger) return;

        e.stopPropagation();

        if (!isMobile()) {
            state === STATE.OPEN ? close() : open();
            return;
        }

        state === STATE.CLOSED ? peek() : close();
    });

    // =========================
    // OVERLAY CLOSE（禁止点击关闭）
    // =========================
    overlay.addEventListener("click", (e) => {
        e.stopPropagation();
    });

    const closeBtn = drawer.querySelector(".drawer-close");
    if (closeBtn) {
        closeBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            close();
        });
    }

    // =========================
    // TOUCH START
    // =========================
    drawer.addEventListener("touchstart", (e) => {

        if (!isMobile()) return;

        dragging = true;

        startY = e.touches[0].clientY;
        startTranslate = currentTranslate;

        drawer.style.transition = "none";
        if (app) app.style.transition = "none";

    }, { passive: true });

    // =========================
    // TOUCH MOVE
    // =========================
    drawer.addEventListener("touchmove", (e) => {

        if (!dragging) return;

        e.preventDefault();

        const deltaY = e.touches[0].clientY - startY;
        const deltaPercent = (deltaY / window.innerHeight) * 100;

        let next = startTranslate + deltaPercent;
        next = Math.max(0, Math.min(100, next));

        render(next, false);

    }, { passive: false });

    // =========================
    // END DRAG (核心修复)
    // =========================
    function endDrag() {

        if (!dragging) return;

        dragging = false;

        // 🔥 防止残值
        currentTranslate = Math.max(0, Math.min(100, currentTranslate));

        const y = currentTranslate;

        const closeThreshold = PEEK_Y + 25;

        // 强制关闭
        if (y > closeThreshold) {
            close();
            return;
        }

        const dOpen = Math.abs(y - OPEN_Y);
        const dPeek = Math.abs(y - PEEK_Y);
        const dClose = Math.abs(y - CLOSED_Y);

        const min = Math.min(dOpen, dPeek, dClose);

        if (min === dOpen) open();
        else if (min === dPeek) peek();
        else close();
    }

    drawer.addEventListener("touchend", endDrag);
    drawer.addEventListener("touchcancel", endDrag);

    // =========================
    // RESIZE
    // =========================
    window.addEventListener("resize", () => {

        if (state === STATE.OPEN) render(OPEN_Y, false);
        else if (state === STATE.PEEK) render(PEEK_Y, false);
        else render(CLOSED_Y, false);
    });

    // =========================
    // INIT
    // =========================
    render(CLOSED_Y, false);
}

// =========================
// INIT DRAWERS
// =========================
export function initDrawer() {

    createDrawerInstance(
        document.getElementById("commentOverlay"),
        document.getElementById("commentDrawer"),
        ".comment-btn"
    );

    createDrawerInstance(
        document.getElementById("likeOverlay"),
        document.getElementById("likeDrawer"),
        ".stat-btn.like-btn"
    );
}
