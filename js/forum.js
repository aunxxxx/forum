import { posts } from "./data.js";
import { renderPosts } from "./postCard.js";
import { initEditor } from "./editor.js";
import { initUpload } from "./upload.js";
import { initFAB } from "./fab.js";
import { initDrawer } from "./drawer.js";

/* =========================
   DOM
========================= */

const postsContainer =
    document.getElementById("postsList");

const previewImage =
    document.getElementById("previewImage");

/* =========================
   INIT APP
========================= */

function initApp() {

    if (!postsContainer) {
        console.warn("postsList not found");
        return;
    }

    /* =========================
       1. render posts
    ========================= */

    renderPosts(postsContainer);

    /* =========================
       2. editor / upload
    ========================= */

    const getImage =
        initUpload(previewImage);

    initEditor(
        postsContainer,
        getImage
    );

    /* =========================
       3. FAB
    ========================= */

    initFAB();

    /* =========================
       4. drawer
    ========================= */

    requestAnimationFrame(() => {

        initDrawer();

        initInputSystem();
    });
}

/* =========================
   INPUT SYSTEM
========================= */

function initInputSystem() {

    /* =========================
       CANCEL REPLY
    ========================= */

    const cancelReply =
        document.getElementById("cancelReply");

    if (cancelReply) {

        cancelReply.addEventListener(
            "click",
            () => {

                const preview =
                    document.getElementById(
                        "replyPreview"
                    );

                if (preview) {
                    preview.style.display = "none";
                }
            }
        );
    }

    /* =========================
       AUTO HEIGHT
    ========================= */

    const input =
        document.getElementById(
            "commentInput"
        );

    if (input) {

        input.addEventListener(
            "input",
            () => {

                input.style.height = "auto";

                input.style.height =
                    input.scrollHeight + "px";
            }
        );
    }
}

/* =========================
   吸附逻辑
========================= */

function initStickyObserver() {
    const contentSelectors = [
        ".comment-content",
        ".reply-content"
    ];

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                const target = entry.target;
                const parent = target.closest(".comment-item, .reply-item");
                
                if (!parent) return;

                if (entry.boundingClientRect.top <= 0) {
                    parent.classList.add("is-sticky");
                } else {
                    parent.classList.remove("is-sticky");
                }
            });
        },
        {
            threshold: 0,
            rootMargin: "-1px 0px 0px 0px"
        }
    );

    document.querySelectorAll(contentSelectors.join(",")).forEach(el => {
        observer.observe(el);
    });

    return observer;
}

/* =========================
   SAFE START
========================= */

function start() {

    if (window.__APP_INIT__) return;

    window.__APP_INIT__ = true;

    initApp();
    
    // 延迟初始化吸附监听，确保 DOM 已渲染
    setTimeout(() => {
        initStickyObserver();
    }, 100);
}

/* =========================
   DOM READY
========================= */

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        start
    );

} else {

    start();
}
