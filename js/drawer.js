/* =========================
   forum.js - 最终完整版（已修复所有问题）
========================= */

const STATE = {
    CLOSED: "CLOSED",
    PEEK: "PEEK",
    OPEN: "OPEN"
};

function isMobile() {
    return window.innerWidth <= 768;
}

/* =========================
   FOLLOWING USERS (@提及数据)
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
   GLOBAL CLICK SYSTEM（唯一事件入口）
========================= */

document.addEventListener('click', (e) => {
    /* =========================
       LIKE（只做分发，UI 由 likeUI.js 处理）
    ========================= */
    const likeBtn = e.target.closest('.like-action-btn, .comment-like-btn, .reply-like-btn');
    if (likeBtn) {
        e.stopPropagation();
        
        const id = likeBtn.dataset.likeId;
        const type = likeBtn.dataset.likeType;
        
        const result = toggleLike(type, id, currentUser);
        
        // ✅ 修复：数字已拆出去，单独更新 trigger 上的数字
        const countEl = document.querySelector(`.like-count-trigger[data-like-id="${id}"] .like-count`);
        
        updateLikeUI(likeBtn, countEl, result.count);
        return;
    }

    /* =========================
       LIKE DRAWER（点赞列表弹窗）
    ========================= */
    const likeTrigger = e.target.closest('.like-count-trigger');
    if (likeTrigger) {
        e.stopPropagation();
        document.getElementById('likeOverlay')?.openDrawer?.();
        return;
    }

    /* =========================
       COMMENT CONTENT FOCUS（点击内容聚焦输入框）
    ========================= */
    const commentContent = e.target.closest('.comment-content, .reply-content');
    if (commentContent) {
        const overlay = document.getElementById('commentOverlay');
        overlay?.openDrawer?.();

        const input = document.getElementById('commentInput');
        const content = document.querySelector('.drawer-content');

        setTimeout(() => {
            input?.focus({
                preventScroll: true
            });

            content?.scrollTo({
                top: commentContent.offsetTop - content.clientHeight / 2,
                behavior: 'smooth'
            });
        }, 180);
        return;
    }

    /* =========================
       COMMENT DRAWER & REPLY（评论/回复弹窗）
    ========================= */
    const trigger = e.target.closest('.comment-btn, .reply-btn');
    if (trigger) {
        const overlay = document.getElementById('commentOverlay');
        overlay?.openDrawer?.();

        const input = document.getElementById('commentInput');
        const content = document.querySelector('.drawer-content');
        const preview = document.getElementById('replyPreview');

        setTimeout(() => {
            // ✅ 修复：PC 回复取消 - 切换预览显示
            if (trigger.classList.contains('reply-btn')) {
                if (preview) {
                    preview.style.display = preview.style.display === 'flex' ? 'none' : 'flex';
                }
                
                const target = trigger.closest('.comment');
                if (target && content) {
                    const username = target.querySelector('.comment-username')?.textContent;
                    const previewText = preview?.querySelector('.reply-preview-text');
                    if (previewText && username) {
                        previewText.textContent = `回复 @${username}`;
                    }
                }
            }

            input?.focus({
                preventScroll: true
            });

            const target = trigger.closest('.post, .comment');
            if (target && content) {
                content.scrollTo({
                    top: target.offsetTop - content.clientHeight / 2,
                    behavior: 'smooth'
                });
            }
        }, 250);
        return;
    }
});

/* =========================
   评论定位功能（外部调用）
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
    // SCROLL LOCK（只在移动端锁定）
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
        
        // 只在移动端锁定滚动
        if (isMobile()) {
            lockScroll(open);
        }
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
    // TOUCH START（手势拖拽）
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
    // TOUCH MOVE（手势拖拽）
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
    // END DRAG（手势结束）
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
    // 键盘方案（只使用 visualViewport）
    // =========================
    const visual = window.visualViewport;
    if (visual) {
        visual.addEventListener('resize', () => {
            const inputArea = document.querySelector('.drawer-input-area');
            if (!inputArea) return;
            const keyboardHeight = window.innerHeight - visual.height;
            inputArea.style.bottom = keyboardHeight > 0 ? `${keyboardHeight}px` : '0px';
        });
    }

    // =========================
    // 输入框适配（❌ 已删除所有 scrollIntoView）
    // =========================
    if (commentInput) {
        commentInput.addEventListener("focus", () => {
            setTimeout(() => {
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

/* =========================
   likeStore.js - 数据层
========================= */

const likeStore = new Map();

function toggleLike(type, id, currentUser) {
    const key = `${type}_${id}`;
    
    if (!likeStore.has(key)) {
        likeStore.set(key, {
            count: 0,
            users: new Map()
        });
    }
    
    const data = likeStore.get(key);
    data.count++;
    
    return {
        count: data.count,
        isLiked: true
    };
}

/* =========================
   likeUI.js - UI 动画层
========================= */

function updateLikeUI(btn, countEl, newCount) {
    if (countEl) {
        countEl.textContent = newCount;
    }
    
    btn.classList.add('active');
    
    const icon = btn.querySelector('.like-icon');
    if (icon) {
        icon.classList.remove('pop');
        void icon.offsetWidth;
        icon.classList.add('pop');
    }
    
    if (newCount >= 2) {
        btn.classList.remove('ripple');
        void btn.offsetWidth;
        btn.classList.add('ripple');
        
        setTimeout(() => {
            btn.classList.remove('ripple');
        }, 400);
    }
}
