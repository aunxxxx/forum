const STATE = {
    CLOSED: "CLOSED",
    PEEK: "PEEK",
    OPEN: "OPEN"
};

const currentUser = {
    id: "me",
    name: "Austin",
    badge: "创始",
    avatar: "https://i.pravatar.cc/40"
};

const sampleUsers = [
    { id: "u1", name: "马睿婕", badge: "创始", avatar: "https://i.pravatar.cc/40?img=3" },
    { id: "u2", name: "陈小春", badge: "元老", avatar: "https://i.pravatar.cc/40?img=7" },
    { id: "u3", name: "铁汁", badge: "创始", avatar: "https://i.pravatar.cc/40?img=1" }
];

const followingUsers = [
    { id: 1, name: "李四", avatar: "https://i.pravatar.cc/40?img=2" },
    { id: 2, name: "王五", avatar: "https://i.pravatar.cc/40?img=3" },
    { id: 3, name: "张三", avatar: "https://i.pravatar.cc/40?img=4" }
];

const likeRecords = new Map();
let lockedScrollY = 0;

function isMobile() {
    return window.innerWidth <= 768;
}

function getCommentName(item) {
    return item?.querySelector(".comment-username, .reply-username")?.textContent?.trim() || "用户";
}

function getCommentText(item) {
    return item?.querySelector(".comment-content, .reply-content")?.textContent?.trim() || "";
}

function getDrawerContent() {
    return document.querySelector("#commentDrawer .drawer-content");
}

function getLikeId(likeBtn) {
    return likeBtn.dataset.likeId || `like_${Date.now()}`;
}

function getLikeCountEl(likeBtn) {
    return likeBtn.querySelector(".like-count, .like-count-trigger");
}

function getLikeCount(likeBtn) {
    return Number.parseInt(getLikeCountEl(likeBtn)?.textContent || "0", 10) || 0;
}

function seedLikeRecord(likeBtn) {
    const id = getLikeId(likeBtn);
    if (likeRecords.has(id)) return likeRecords.get(id);

    const total = getLikeCount(likeBtn);
    const users = new Map();

    if (total > 0) {
        const first = Math.ceil(total * 0.45);
        const second = Math.ceil(total * 0.32);
        const third = Math.max(0, total - first - second);

        [
            [sampleUsers[0], first],
            [sampleUsers[1], second],
            [sampleUsers[2], third]
        ].forEach(([user, count]) => {
            if (count > 0) users.set(user.id, { ...user, count });
        });
    }

    const record = { id, users };
    likeRecords.set(id, record);
    return record;
}

function syncLikeCount(likeBtn, record) {
    const countEl = getLikeCountEl(likeBtn);
    if (!countEl) return;

    const total = [...record.users.values()].reduce((sum, user) => sum + user.count, 0);
    countEl.textContent = String(total);
    countEl.classList.remove("pop");
    void countEl.offsetWidth;
    countEl.classList.add("pop");
}

function renderLikeDrawer(likeBtn) {
    const content = document.getElementById("likeDrawerContent");
    if (!content) return;

    const record = seedLikeRecord(likeBtn);
    const users = [...record.users.values()].sort((a, b) => b.count - a.count);

    content.innerHTML = users.map((user) => `
        <div class="like-item">
            <div class="like-left">
                <img class="avatar profile-trigger" src="${user.avatar}" data-user-id="${user.id}" alt="">
                <div class="user-info">
                    <span class="badge">${user.badge}</span>
                    <span class="username">${user.name}</span>
                </div>
            </div>
            <div class="like-times">${user.count}</div>
        </div>
    `).join("");
}

function showLikeDrawerFromButton(likeBtn) {
    renderLikeDrawer(likeBtn);
    document.getElementById("likeOverlay")?.openDrawer?.();
}

function handleLike(likeBtn) {
    const record = seedLikeRecord(likeBtn);
    const existing = record.users.get(currentUser.id);
    const hadLiked = likeBtn.classList.contains("active");

    if (existing) {
        existing.count += 1;
    } else {
        record.users.set(currentUser.id, { ...currentUser, count: 1 });
    }

    likeBtn.classList.add("active");
    syncLikeCount(likeBtn, record);

    const icon = likeBtn.querySelector(".like-icon");
    if (icon) {
        icon.classList.remove("pop");
        void icon.offsetWidth;
        icon.classList.add("pop");
    }

    if (hadLiked) {
        likeBtn.classList.remove("spread");
        void likeBtn.offsetWidth;
        likeBtn.classList.add("spread");
    }
}

function setReplyTarget(item) {
    const preview = document.getElementById("replyPreview");
    const previewText = preview?.querySelector(".reply-preview-text");
    const input = document.getElementById("commentInput");
    const name = getCommentName(item);

    if (preview && previewText) {
        previewText.textContent = `回复 @${name}`;
        preview.classList.add("active");
        preview.style.display = "flex";
    }

    if (input) input.placeholder = `回复 @${name}`;
}

function focusInputNear(item) {
    const input = document.getElementById("commentInput");
    const content = getDrawerContent();

    setReplyTarget(item);
    document.getElementById("commentPreviewPopover")?.remove();

    requestAnimationFrame(() => {
        input?.focus({ preventScroll: true });
        updateKeyboardOffset();

        if (!content || !item) return;

        const contentRect = content.getBoundingClientRect();
        const itemRect = item.getBoundingClientRect();
        const inputArea = document.querySelector(".drawer-input-area");
        const inputHeight = inputArea?.getBoundingClientRect().height || 88;
        const targetTop = itemRect.top - contentRect.top + content.scrollTop;
        const targetBottom = targetTop + itemRect.height;
        const desiredBottom = content.clientHeight - inputHeight - 12;

        content.scrollTo({
            top: Math.max(0, targetBottom - desiredBottom),
            behavior: "smooth"
        });
    });
}

function updateKeyboardOffset() {
    if (!window.visualViewport || !isMobile()) {
        document.documentElement.style.setProperty("--keyboard-offset", "0px");
        return;
    }

    const viewport = window.visualViewport;
    const offset = Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop);
    document.documentElement.style.setProperty("--keyboard-offset", `${offset}px`);
}

function getPreviewPopover() {
    let popover = document.getElementById("commentPreviewPopover");
    if (popover) return popover;

    popover = document.createElement("div");
    popover.id = "commentPreviewPopover";
    popover.className = "comment-preview-popover";
    popover.innerHTML = `
        <div class="comment-preview-head">
            <span class="comment-preview-name"></span>
            <button class="comment-preview-close" type="button">×</button>
        </div>
        <div class="comment-preview-text"></div>
        <button class="comment-preview-reply" type="button">回复</button>
    `;
    document.body.appendChild(popover);

    popover.querySelector(".comment-preview-close")?.addEventListener("click", () => {
        popover.remove();
    });

    popover.querySelector(".comment-preview-reply")?.addEventListener("click", () => {
        const id = popover.dataset.targetId;
        const item = id ? document.querySelector(`[data-comment-preview-id="${id}"]`) : null;
        if (item) {
            setReplyTarget(item);
            document.getElementById("commentInput")?.focus({ preventScroll: true });
        }
        popover.remove();
    });

    return popover;
}

function showDesktopPreview(item, event) {
    if (isMobile()) return;

    const popover = getPreviewPopover();
    const id = item.dataset.commentPreviewId || `preview_${Date.now()}`;
    item.dataset.commentPreviewId = id;
    popover.dataset.targetId = id;

    popover.querySelector(".comment-preview-name").textContent = getCommentName(item);
    popover.querySelector(".comment-preview-text").textContent = getCommentText(item);

    const width = 280;
    const left = Math.min(window.innerWidth - width - 16, Math.max(16, event.clientX + 14));
    const top = Math.min(window.innerHeight - 180, Math.max(16, event.clientY + 14));

    popover.style.left = `${left}px`;
    popover.style.top = `${top}px`;
    popover.classList.add("show");
}

function normalizePostLikeCounts() {
    document.querySelectorAll(".like-action-btn .like-count").forEach((count) => {
        count.classList.add("like-count-trigger");
        count.setAttribute("role", "button");
        count.setAttribute("tabindex", "0");
    });
}

function handleProfileClick(target) {
    const avatar = target.closest(".avatar, .post-avatar, .comment-avatar, .reply-avatar, .profile-trigger");
    if (!avatar) return false;

    const name =
        avatar.closest(".post-header")?.querySelector(".post-username, .author-name")?.textContent?.trim()
        || avatar.closest(".comment")?.querySelector(".comment-username")?.textContent?.trim()
        || avatar.closest(".reply-item")?.querySelector(".reply-username")?.textContent?.trim()
        || avatar.closest(".like-item")?.querySelector(".username")?.textContent?.trim()
        || "用户";

    window.alert(`个人主页开发中：${name}`);
    return true;
}

function bindGlobalEvents() {
    if (window.__DRAWER_GLOBAL_EVENTS__) return;
    window.__DRAWER_GLOBAL_EVENTS__ = true;

    normalizePostLikeCounts();

    document.addEventListener("click", (e) => {
        if (handleProfileClick(e.target)) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }

        const postLikeCount = e.target.closest(".like-action-btn .like-count-trigger");
        if (postLikeCount) {
            e.preventDefault();
            e.stopPropagation();
            showLikeDrawerFromButton(postLikeCount.closest(".like-action-btn"));
            return;
        }

        const likeBtn = e.target.closest(".like-action-btn, .comment-like-btn, .reply-like-btn");
        if (likeBtn) {
            e.preventDefault();
            e.stopPropagation();
            handleLike(likeBtn);
            return;
        }

        const trigger = e.target.closest(".comment-btn, .reply-btn");
        if (trigger) {
            e.preventDefault();
            e.stopPropagation();

            const overlay = document.getElementById("commentOverlay");
            overlay?.openDrawer?.();

            setTimeout(() => {
                const targetItem = trigger.closest(".comment, .reply-item");
                if (targetItem) setReplyTarget(targetItem);
                if (isMobile()) {
                    focusInputNear(targetItem);
                } else if (trigger.classList.contains("reply-btn")) {
                    document.getElementById("commentInput")?.focus({ preventScroll: true });
                }
            }, 220);
            return;
        }

        const commentItem = e.target.closest("#commentDrawer .comment, #commentDrawer .reply-item");
        if (commentItem && !e.target.closest("button, a, input, textarea")) {
            e.preventDefault();
            e.stopPropagation();

            if (isMobile()) {
                document.getElementById("commentOverlay")?.openDrawer?.();
                setTimeout(() => focusInputNear(commentItem), 180);
            } else {
                showDesktopPreview(commentItem, e);
            }
            return;
        }

        if (!e.target.closest(".comment-preview-popover")) {
            document.getElementById("commentPreviewPopover")?.remove();
        }
    });

    window.visualViewport?.addEventListener("resize", updateKeyboardOffset);
    window.visualViewport?.addEventListener("scroll", updateKeyboardOffset);
    window.addEventListener("resize", updateKeyboardOffset);
    updateKeyboardOffset();
}

function createDrawerInstance(overlay, drawer) {
    if (!overlay || !drawer || overlay.__drawerReady) return;
    overlay.__drawerReady = true;

    const app = document.querySelector(".app");
    const commentInput = document.getElementById("commentInput");
    const mentionPanel = document.getElementById("mentionPanel");

    let state = STATE.CLOSED;
    let startY = 0;
    let startTranslate = 100;
    let currentTranslate = 100;
    let dragging = false;

    const CLOSED_Y = 100;
    const PEEK_Y = 15;
    const OPEN_Y = 0;

    function lockScroll(lock) {
        const body = document.body;
        const anyOpen = [...document.querySelectorAll(".drawer-overlay")].some((item) => {
            return item !== overlay && item.classList.contains("is-open");
        });

        if (lock) {
            if (body.classList.contains("scroll-locked")) return;
            lockedScrollY = window.scrollY || document.documentElement.scrollTop || 0;
            body.style.position = "fixed";
            body.style.top = `-${lockedScrollY}px`;
            body.style.left = "0";
            body.style.right = "0";
            body.style.width = "100%";
            body.classList.add("scroll-locked");
            return;
        }

        if (anyOpen || !body.classList.contains("scroll-locked")) return;

        body.classList.remove("scroll-locked");
        body.style.position = "";
        body.style.top = "";
        body.style.left = "";
        body.style.right = "";
        body.style.width = "";
        window.scrollTo(0, lockedScrollY);
    }

    function setBackdrop(progress, animate = false) {
        if (!app) return;

        app.style.transition = animate ? "filter .25s ease, transform .25s ease, border-radius .25s ease" : "none";

        if (!isMobile()) {
            app.style.filter = "none";
            app.style.transform = "none";
            return;
        }

        const brightness = 1 - progress * 0.3;
        app.style.filter = `brightness(${brightness})`;
        app.style.transform = "none";
    }

    function render(y, animate = false) {
        currentTranslate = y;
        drawer.style.transition = animate ? "transform .35s cubic-bezier(.22,1,.36,1)" : "none";

            if (isMobile()) {
                drawer.style.transform = `translateY(calc(${y}% - var(--keyboard-offset, 0px)))`;
            } else {
            drawer.style.transform = y < 100
                ? "translate(-50%, -50%)"
                : "translate(-50%, calc(-50% + 100vh))";
        }

        const progress = Math.max(0, Math.min(1, 1 - y / CLOSED_Y));
        const open = y < CLOSED_Y;

        setBackdrop(progress, animate);
        overlay.classList.toggle("is-open", open);
        document.body.classList.toggle("drawer-open", open || document.querySelector(".drawer-overlay.is-open"));
        lockScroll(open && isMobile());

        if (!open) {
            document.getElementById("commentPreviewPopover")?.remove();
            updateKeyboardOffset();
        }
    }

    function apply(next) {
        if (state === next) return;
        state = next;
        if (state === STATE.OPEN) render(OPEN_Y, true);
        else if (state === STATE.PEEK) render(PEEK_Y, true);
        else render(CLOSED_Y, true);
    }

    overlay.openDrawer = () => apply(STATE.OPEN);
    overlay.closeDrawer = () => apply(STATE.CLOSED);
    overlay.peekDrawer = () => apply(STATE.PEEK);

    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) overlay.closeDrawer();
    });

    drawer.querySelector(".drawer-close")?.addEventListener("click", (e) => {
        e.stopPropagation();
        overlay.closeDrawer();
    });

    drawer.addEventListener("touchstart", (e) => {
        if (!isMobile() || e.target.closest("textarea, input, button, .drawer-content")) return;
        dragging = true;
        startY = e.touches[0].clientY;
        startTranslate = currentTranslate;
        drawer.style.transition = "none";
        if (app) app.style.transition = "none";
    }, { passive: true });

    drawer.addEventListener("touchmove", (e) => {
        if (!dragging) return;
        e.preventDefault();

        const deltaY = e.touches[0].clientY - startY;
        const deltaPercent = (deltaY / window.innerHeight) * 100;
        const next = Math.max(0, Math.min(100, startTranslate + deltaPercent));

        render(next, false);
    }, { passive: false });

    function endDrag() {
        if (!dragging) return;
        dragging = false;

        if (currentTranslate > PEEK_Y + 25) {
            overlay.closeDrawer();
            return;
        }

        Math.abs(currentTranslate - OPEN_Y) <= Math.abs(currentTranslate - PEEK_Y)
            ? overlay.openDrawer()
            : overlay.peekDrawer();
    }

    drawer.addEventListener("touchend", endDrag);
    drawer.addEventListener("touchcancel", endDrag);

    if (commentInput && mentionPanel && !mentionPanel.__mentionReady) {
        mentionPanel.__mentionReady = true;

        commentInput.addEventListener("focus", updateKeyboardOffset);

        commentInput.addEventListener("input", () => {
            const match = commentInput.value.match(/@([\u4e00-\u9fa5\w]*)$/);
            if (!match) {
                mentionPanel.classList.remove("show");
                mentionPanel.innerHTML = "";
                return;
            }

            const keyword = match[1].toLowerCase();
            const result = followingUsers.filter((user) => user.name.toLowerCase().includes(keyword));

            if (!result.length) {
                mentionPanel.classList.remove("show");
                mentionPanel.innerHTML = "";
                return;
            }

            mentionPanel.innerHTML = result.map((user) => `
                <div class="mention-item" data-name="${user.name}">
                    <img class="mention-avatar profile-trigger" src="${user.avatar}" alt="">
                    <span>${user.name}</span>
                </div>
            `).join("");
            mentionPanel.classList.add("show");
        });

        mentionPanel.addEventListener("click", (e) => {
            const item = e.target.closest(".mention-item");
            if (!item) return;

            commentInput.value = commentInput.value.replace(/@([\u4e00-\u9fa5\w]*)$/, `@${item.dataset.name} `);
            mentionPanel.classList.remove("show");
            mentionPanel.innerHTML = "";
            commentInput.focus({ preventScroll: true });
        });
    }

    render(CLOSED_Y, false);
}

function initDrawer() {
    bindGlobalEvents();

    createDrawerInstance(
        document.getElementById("commentOverlay"),
        document.getElementById("commentDrawer")
    );

    createDrawerInstance(
        document.getElementById("likeOverlay"),
        document.getElementById("likeDrawer")
    );
}

window.initDrawer = initDrawer;
