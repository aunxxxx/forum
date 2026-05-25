import { createPostCard } from "./postCard.js";
import { posts } from "./data.js";

import { initLikeEngine, toggleLike, syncLikeUI } from "./likeEngine.js";

const postsContainer = document.getElementById("postsList");
const overlay = document.getElementById("likeOverlay");

/* =========================
   RENDER
========================= */

function renderPosts(container) {

    if (!container) return;

    container.innerHTML = "";

    posts.forEach(post => {

        const card = createPostCard(post, {
            onLike: (id, btn) => {

                const state = toggleLike(id);
                syncLikeUI(id);

                animateLike(btn, state.liked);
            },

            onComment: (id) => {
                console.log("comment:", id);
            }
        });

        container.appendChild(card);
    });
}

/* =========================
   INIT
========================= */

function initApp() {

    if (!postsContainer) {
        console.warn("postsList not found");
        return;
    }

    initLikeEngine();

    renderPosts(postsContainer);

    bindEvents();
    bindDrawerEvents();
}

/* =========================
   EVENTS
========================= */

function bindEvents() {

    if (window.__FORUM_EVENTS_BOUND__) return;
    window.__FORUM_EVENTS_BOUND__ = true;

    document.addEventListener("click", (e) => {

        const likeBtn = e.target.closest(".like-btn");
        if (!likeBtn) return;

        const id = likeBtn.dataset.likeId;
        if (!id) return;

        const countEl = e.target.closest(".like-count");

        /* =========================
           点数字 → drawer
        ========================= */
        if (countEl) {
            openLikeDrawer(id);
            return;
        }

        /* =========================
           like toggle
        ========================= */

        if (likeBtn.dataset.locked === "1") return;
        likeBtn.dataset.locked = "1";

        const state = toggleLike(id);

        syncLikeUI(id);

        // ⭐ 安全调用（防止未定义报错）
        if (typeof updatePostUI === "function") {
            updatePostUI(id);
        }

        animateLike(likeBtn, state.liked);

        setTimeout(() => {
            likeBtn.dataset.locked = "";
        }, 200);
    });
}

/* =========================
   LIKE ANIMATION
========================= */

function animateLike(btn, liked) {

    const icon =
        btn.querySelector(".like-icon") ||
        btn.querySelector("svg");

    btn.classList.toggle("active", liked);
    btn.classList.add("ripple");

    if (icon) {
        icon.classList.remove("pop");
        void icon.offsetWidth;
        icon.classList.add("pop");
    }

    setTimeout(() => {
        btn.classList.remove("ripple");
    }, 300);
}

/* =========================
   DRAWER
========================= */

function openLikeDrawer(id) {

    if (!overlay) return;

    overlay.classList.add("active");
    document.body.classList.add("drawer-open");

    console.log("open drawer for:", id);
}

function closeLikeDrawer() {

    if (!overlay) return;

    overlay.classList.remove("active");
    document.body.classList.remove("drawer-open");
}

/* =========================
   DRAWER EVENTS
========================= */

function bindDrawerEvents() {

    if (!overlay) return;

    if (window.__DRAWER_EVENTS_BOUND__) return;
    window.__DRAWER_EVENTS_BOUND__ = true;

    overlay.addEventListener("click", closeLikeDrawer);

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeLikeDrawer();
        }
    });
}

/* =========================
   BOOT
========================= */

function start() {

    if (window.__FORUM_INIT__) return;
    window.__FORUM_INIT__ = true;

    initApp();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
} else {
    start();
}
