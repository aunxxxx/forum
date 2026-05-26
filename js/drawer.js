const STATE = {
    CLOSED: "CLOSED",
    PEEK: "PEEK",
    OPEN: "OPEN"
};

function isMobile() {
    return window.innerWidth <= 768;
}

/* =========================
   FOLLOWING USERS
========================= */

const followingUsers = [
    {
        id: 1,
        name: "李四",
        avatar: "https://i.pravatar.cc/40?img=2"
    },
    {
        id: 2,
        name: "王五",
        avatar: "https://i.pravatar.cc/40?img=3"
    },
    {
        id: 3,
        name: "张三",
        avatar: "https://i.pravatar.cc/40?img=4"
    }
];

export function createDrawerInstance(overlay, drawer, triggerSelector) {

    if (!overlay || !drawer) {
        console.warn("Drawer init failed");
        return;
    }

    const app = document.querySelector(".app");
    const commentInput = document.getElementById("commentInput");
    const mentionPanel = document.getElementById("mentionPanel");
    
    // =========================
    // STATE
    // =========================
    let state = STATE.CLOSED;

    let startY = 0;
    let startTranslate = 100;
    let currentTranslate = 100;

    let dragging = false;

    let scrollY = 0;
    
    // 键盘抬升相关
    let keyboardOffset = 0;
    let initialHeight = window.innerHeight;

    // =========================
    // POSITIONS (%)
    // =========================
    const CLOSED_Y = 100;
    const PEEK_Y = 15;
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
    // RENDER (支持键盘抬升)
    // =========================
    function render(y, animate = false, skipKeyboardOffset = false) {
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
            // 移动端：应用键盘偏移
            const keyboardAdjustment = skipKeyboardOffset ? 0 : keyboardOffset;
            drawer.style.transform = `translateY(calc(${y}% - ${keyboardAdjustment}px))`;
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

    overlay.openDrawer = open;
    overlay.closeDrawer = close;
    
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
    // END DRAG
    // =========================
    function endDrag() {
        if (!dragging) return;
        dragging = false;
        currentTranslate = Math.max(0, Math.min(100, currentTranslate));
        const y = currentTranslate;
        const closeThreshold = PEEK_Y + 25;
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
    // 键盘检测 + 自动抬升 (整合)
    // =========================
    function handleKeyboard() {
        const diff = initialHeight - window.innerHeight;
        
        if (diff > 150) {
            // 键盘弹出
            keyboardOffset = diff;
            
            // 只在 OPEN 或 PEEK 状态时抬升
            if (state === STATE.OPEN) {
                render(OPEN_Y, true, false);
            } else if (state === STATE.PEEK) {
                render(PEEK_Y, true, false);
            }
        } else if (diff < -50) {
            // 键盘收起，重置偏移
            keyboardOffset = 0;
            if (state === STATE.OPEN) {
                render(OPEN_Y, true, true);
            } else if (state === STATE.PEEK) {
                render(PEEK_Y, true, true);
            } else if (state === STATE.CLOSED) {
                render(CLOSED_Y, true, true);
            }
        }
    }
    
    // 监听 resize 事件
    let resizeTimer;
    window.addEventListener("resize", () => {
        // 防抖处理
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            handleKeyboard();
            
            // 处理屏幕旋转等其他 resize 情况
            if (state === STATE.OPEN) {
                render(OPEN_Y, false);
            } else if (state === STATE.PEEK) {
                render(PEEK_Y, false);
            } else if (state === STATE.CLOSED) {
                render(CLOSED_Y, false);
            }
        }, 150);
    });
    
    // 输入框聚焦时确保抬升
    if (commentInput) {
        commentInput.addEventListener("focus", () => {
            if (state === STATE.OPEN || state === STATE.PEEK) {
                // 延迟一下确保键盘已弹出
                setTimeout(() => {
                    initialHeight = window.innerHeight;
                    handleKeyboard();
                }, 50);
            }
        });
        
        commentInput.addEventListener("blur", () => {
            // 延迟重置，确保键盘收起
            setTimeout(() => {
                initialHeight = window.innerHeight;
                handleKeyboard();
            }, 100);
        });
    }
    
    // 更新初始高度（页面加载时）
    setTimeout(() => {
        initialHeight = window.innerHeight;
    }, 100);

/* =========================
   @ MENTION
========================= */

if (commentInput && mentionPanel) {

    commentInput.addEventListener("input", () => {
        const value = commentInput.value;
        const match = value.match(/@([\u4e00-\u9fa5\w]*)$/);
        if (!match) {
            mentionPanel.classList.remove("show");
            mentionPanel.innerHTML = "";
            return;
        }
        const keyword = match[1].toLowerCase();
        const result = followingUsers.filter(user =>
            user.name.toLowerCase().includes(keyword)
        );
        if (!result.length) {
            mentionPanel.classList.remove("show");
            mentionPanel.innerHTML = "";
            return;
        }
        mentionPanel.innerHTML = result.map(user => `
            <div class="mention-item" data-name="${user.name}">
                <img class="mention-avatar" src="${user.avatar}">
                <span>${user.name}</span>
            </div>
        `).join("");
        mentionPanel.classList.add("show");
    });

    mentionPanel.addEventListener("click", (e) => {
        const item = e.target.closest(".mention-item");
        if (!item) return;
        const name = item.dataset.name;
        commentInput.value =
            commentInput.value.replace(
                /@([\u4e00-\u9fa5\w]*)$/,
                `@${name} `
            );
        mentionPanel.classList.remove("show");
        mentionPanel.innerHTML = "";
        commentInput.focus();
    });

    document.addEventListener("click", (e) => {
        if (
            !mentionPanel.contains(e.target) &&
            e.target !== commentInput
        ) {
            mentionPanel.classList.remove("show");
        }
    });
}
    
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
