const STATE = {
    CLOSED: "CLOSED",
    PEEK: "PEEK",
    OPEN: "OPEN"
};

const followingUsers = [
    { id: 1, name: "李四", avatar: "https://i.pravatar.cc/40?img=2" },
    { id: 2, name: "王五", avatar: "https://i.pravatar.cc/40?img=3" },
    { id: 3, name: "张三", avatar: "https://i.pravatar.cc/40?img=4" }
];

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

    requestAnimationFrame(() => {
        input?.focus({ preventScroll: true });

        if (!content || !item) return;

        const contentRect = content.getBoundingClientRect();
        const itemRect = item.getBoundingClientRect();
        const inputArea = document.querySelector(".drawer-input-area");
        const inputHeight = inputArea?.getBoundingClientRect().height || 88;
        const targetTop = itemRect.top - contentRect.top + content.scrollTop;
        const roomAboveInput = content.clientHeight - inputHeight - 24;

        content.scrollTo({
            top: Math.max(0, targetTop - roomAboveInput + Math.min(itemRect.height, 120)),
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
        popover.classList.remove("show");
    });

    popover.querySelector(".comment-preview-reply")?.addEventListener("click", () => {
        const id = popover.dataset.targetId;
        const item = id ? document.querySelector(`[data-comment-preview-id="${id}"]`) : null;
        if (item) {
            setReplyTarget(item);
            document.getElementById("commentInput")?.focus({ preventScroll: true });
        }
        popover.classList.remove("show");
    });

    return popover;
}

function showDesktopPreview(item, event) {
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

function handleLike(likeBtn) {
    const countEl = likeBtn.querySelector(".like-count, .like-count-trigger");
    const current = Number.parseInt(countEl?.textContent || "0", 10);
    const active = likeBtn.classList.toggle("active");

    if (countEl) countEl.textContent = String(Math.max(0, current + (active ? 1 : -1)));

    const icon = likeBtn.querySelector(".like-icon");
    if (icon) {
        icon.classList.remove("pop");
        void icon.offsetWidth;
        icon.classList.add("pop");
    }
}

function bindGlobalEvents() {
    if (window.__DRAWER_GLOBAL_EVENTS__) return;
    window.__DRAWER_GLOBAL_EVENTS__ = true;

    document.addEventListener("click", (e) => {
        const likeCountTrigger = e.target.closest(".like-count-trigger");
        if (likeCountTrigger && !e.target.closest(".like-action-btn")) {
            e.stopPropagation();
            document.getElementById("likeOverlay")?.openDrawer?.();
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
            document.getElementById("commentPreviewPopover")?.classList.remove("show");
        }
    });

    window.visualViewport?.addEventListener("resize", updateKeyboardOffset);
    window.visualViewport?.addEventListener("scroll", updateKeyboardOffset);
    window.addEventListener("resize", updateKeyboardOffset);
    updateKeyboardOffset();
}

export function createDrawerInstance(overlay, drawer) {
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
        document.body.style.overflow = lock ? "hidden" : "";
    }

    function setBackdrop(progress, animate = false) {
        if (!app) return;

        app.style.transition = animate ? "filter .25s ease, transform .25s ease" : "none";

        if (!isMobile()) {
            app.style.filter = "none";
            app.style.transform = "none";
            return;
        }

        const brightness = 1 - progress * 0.28;
        const scale = 1 - progress * 0.045;
        app.style.filter = `brightness(${brightness})`;
        app.style.transform = `scale(${scale})`;
    }

    function render(y, animate = false) {
        currentTranslate = y;
        drawer.style.transition = animate ? "transform .35s cubic-bezier(.22,1,.36,1)" : "none";

        if (isMobile()) {
            drawer.style.transform = `translateY(${y}%)`;
        } else {
            drawer.style.transform = y < 100
                ? "translate(-50%, -50%)"
                : "translate(-50%, calc(-50% + 100vh))";
        }

        const progress = Math.max(0, Math.min(1, 1 - y / CLOSED_Y));
        const open = y < CLOSED_Y;

        setBackdrop(progress, animate);
        overlay.classList.toggle("is-open", open);
        document.body.classList.toggle("drawer-open", open);
        lockScroll(open && isMobile());
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
                    <img class="mention-avatar" src="${user.avatar}" alt="">
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

export function initDrawer() {
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
