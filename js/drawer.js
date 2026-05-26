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

/* =========================
   GLOBAL LIKE SYSTEM
========================= */

const likeStore = new Map();

/* =========================
   HANDLE LIKE
========================= */

function handleGlobalLike(btn) {
    const likeId = btn.dataset.likeId;
    if (!likeId) return;

    // 初始化 store
    if (!likeStore.has(likeId)) {
        likeStore.set(likeId, {
            total: 0
        });
    }

    const data = likeStore.get(likeId);

    // 无限点赞
    data.total++;

    // ACTIVE
    btn.classList.add('active');

    // COUNT
    const countEl = btn.querySelector('.reply-like-count') ||
        btn.parentElement?.querySelector('.like-count');

    if (countEl) {
        countEl.textContent = data.total;
    }

    // SVG / ICON
    const icon = btn.querySelector('.like-icon');
    if (icon) {
        icon.classList.remove('pop');
        void icon.offsetWidth;
        icon.classList.add('pop');
    }

    // 第二次开始 ripple
    if (data.total >= 2) {
        btn.classList.remove('ripple');
        void btn.offsetWidth;
        btn.classList.add('ripple');
    }
}

/* =========================
   GLOBAL CLICK SYSTEM
========================= */

document.addEventListener('click', (e) => {
    /* =========================
       LIKE
    ========================= */
    const likeBtn = e.target.closest('.like-btn');
    if (likeBtn) {
        // 防止触发 drawer
        e.stopPropagation();
        handleGlobalLike(likeBtn);
        return;
    }

    /* =========================
       COMMENT DRAWER
    ========================= */
    const commentBtn = e.target.closest('.comment-btn');
    if (commentBtn) {
        const overlay = document.getElementById('commentOverlay');
        overlay?.openDrawer?.();
        return;
    }

    /* =========================
       LIKE DRAWER
    ========================= */
    const likeStatBtn = e.target.closest('.stat-btn.like-btn');
    if (likeStatBtn) {
        const overlay = document.getElementById('likeOverlay');
        overlay?.openDrawer?.();
        return;
    }

    /* =========================
       REPLY
    ========================= */
    const replyBtn = e.target.closest('.reply-btn');
    if (replyBtn) {
        const comment = replyBtn.closest('.comment');
        if (!comment) return;

        const username = comment.querySelector('.comment-username')?.textContent;
        const input = document.getElementById('commentInput');
        const preview = document.getElementById('replyPreview');
        const previewText = preview?.querySelector('.reply-preview-text');

        if (preview && previewText) {
            preview.style.display = 'flex';
            previewText.textContent = `回复 @${username}`;
        }

        input?.focus();

        const container = document.querySelector('.drawer-content');
        if (container) {
            container.scrollTo({
                top: comment.offsetTop - 80,
                behavior: 'smooth'
            });
        }
        return;
    }
});

/* =========================
   评论定位功能
========================= */

function scrollToComment(commentId) {
    const el = document.getElementById(commentId);
    const drawerContent = document.querySelector(".drawer-content");

    if (!el || !drawerContent) return;

    drawerContent.scrollTo({
        top: el.offsetTop - 80,
        behavior: "smooth"
    });

    el.classList.add("highlight-comment");

    setTimeout(() => {
        el.classList.remove("highlight-comment");
    }, 1500);
}

/* =========================
   创建抽屉实例
========================= */

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
        app.style.transition = animate ? "filter .25s ease, transform .25s ease" : "none";
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
        drawer.style.transition = animate ? "transform .35s cubic-bezier(.22,1,.36,1)" : "none";
        if (!isMobile()) {
            drawer.style.transform = (y < 100) ? `translate(-50%, -50%)` : `translate(-50%, calc(-50% + 100vh))`;
        } else {
            drawer.style.transform = `translateY(${y}%)`;
        }
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
    // OVERLAY CLOSE
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
    // 键盘适配（scrollIntoView + padding）
    // =========================
    if (commentInput) {
        commentInput.addEventListener("focus", () => {
            setTimeout(() => {
                commentInput.scrollIntoView({ 
                    behavior: "smooth", 
                    block: "center" 
                });
                const drawerContent = document.querySelector(".drawer-content");
                if (drawerContent) {
                    drawerContent.style.paddingBottom = "300px";
                }
            }, 100);
        });
        
        commentInput.addEventListener("blur", () => {
            const drawerContent = document.querySelector(".drawer-content");
            if (drawerContent) {
                drawerContent.style.paddingBottom = "";
            }
        });
    }

    /* =========================
       @MENTION 功能
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
            commentInput.value = commentInput.value.replace(/@([\u4e00-\u9fa5\w]*)$/, `@${name} `);
            mentionPanel.classList.remove("show");
            mentionPanel.innerHTML = "";
            commentInput.focus();
        });

        document.addEventListener("click", (e) => {
            if (!mentionPanel.contains(e.target) && e.target !== commentInput) {
                mentionPanel.classList.remove("show");
            }
        });
    }
    
    // =========================
    // INIT
    // =========================
    render(CLOSED_Y, false);
}

/* =========================
   初始化所有抽屉
========================= */

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
