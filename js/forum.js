const postsContainer = document.getElementById("postsList");
const previewImage = document.getElementById("previewImage");

function initInputSystem() {
    const cancelReply = document.getElementById("cancelReply");
    const input = document.getElementById("commentInput");

    cancelReply?.addEventListener("click", () => {
        const preview = document.getElementById("replyPreview");
        if (preview) {
            preview.classList.remove("active");
            preview.style.display = "none";
        }
        if (input) input.placeholder = "发一条友善评论...";
    });

    input?.addEventListener("input", () => {
        input.style.height = "auto";
        input.style.height = `${Math.min(input.scrollHeight, 120)}px`;
    });
}

function initStickyObserver() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                const parent = entry.target.closest(".comment, .reply-item");
                if (!parent) return;
                parent.classList.toggle("is-sticky", entry.boundingClientRect.top <= 0);
            });
        },
        {
            threshold: 0,
            rootMargin: "-1px 0px 0px 0px"
        }
    );

    document.querySelectorAll(".comment-content, .reply-content").forEach((el) => {
        observer.observe(el);
    });
}

function initApp() {
    if (!postsContainer) {
        console.warn("postsList not found");
        return;
    }

    const getImage = initUpload(previewImage);

    initEditor(postsContainer, getImage);
    initFAB();
    initDrawer();
    initInputSystem();
    initStickyObserver();
}

function start() {
    if (window.__APP_INIT__) return;
    window.__APP_INIT__ = true;
    initApp();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
} else {
    start();
}
