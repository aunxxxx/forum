export function initDrawer() {

    const overlay = document.getElementById("drawerOverlay");

    const drawer = document.getElementById("drawer");

    if (!overlay || !drawer) return;

    /* 打开测试 */
    document.addEventListener("click", (e) => {

        const btn = e.target.closest(".stat-btn");

        if (!btn) return;

        overlay.classList.add("active");

        drawer.classList.add("active");

        document.body.classList.add("drawer-open");

    });

    /* 点击背景关闭 */
    overlay.addEventListener("click", (e) => {

        if (e.target !== overlay) return;

        closeDrawer();

    });

    /* 拖拽 */
    let startY = 0;

    let currentY = 0;

    let dragging = false;

    drawer.addEventListener("touchstart", (e) => {

        dragging = true;

        startY = e.touches[0].clientY;

        drawer.style.transition = "none";

    });

    drawer.addEventListener("touchmove", (e) => {

        if (!dragging) return;

        currentY = e.touches[0].clientY;

        let delta = currentY - startY;

        /* 下拉 */
        if (delta > 0) {

            delta *= 0.35;

            drawer.style.transform =
                `translateY(${delta}px)`;

            /* 背景联动 */
            const scale =
                0.94 + (delta / 1200);

        }

    });

    drawer.addEventListener("touchend", () => {

        dragging = false;

        drawer.style.transition =
            "transform .38s cubic-bezier(.22,1,.36,1)";

        const threshold = 120;

        const moved =
            currentY - startY;

        /* 超过阈值关闭 */
        if (moved > threshold) {

            closeDrawer();

        } else {

            drawer.style.transform =
                "translateY(0)";
        }

    });

    function closeDrawer() {

        overlay.classList.remove("active");

        drawer.classList.remove("active");

        document.body.classList.remove("drawer-open");

        drawer.style.transform =
            "";

    }

}
