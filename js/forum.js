import { posts } from "./data.js";
import { renderPosts } from "./postCard.js";

import { initLikeEngine, toggleLike, syncLikeUI } from "./likeEngine.js";

const postsContainer = document.getElementById("postsList");
const overlay = document.getElementById("likeOverlay");

/* =========================
   INIT
========================= */

function initApp() {

    if (!postsContainer) {
        console.warn("postsList not found");
        return;
    }

    initLikeEngine();
    bindEvents();
    bindDrawerEvents();
}

/* =========================
   EVENTS
========================= */

function bindEvents() {

    document.addEventListener("click", (e) => {

        const likeBtn = e.target.closest(".like-btn");
        if (!likeBtn) return;

        const id = likeBtn.dataset.likeId;
        if (!id) return;

        const countEl = e.target.closest(".like-count");

        /* =========================
           点数字 → 打开 drawer
        ========================= */
        if (countEl) {
            openLikeDrawer(id);
            return;
        }

        /* =========================
           点按钮 → like / unlike
        ========================= */

        if (likeBtn.dataset.locked === "1") return;
        likeBtn.dataset.locked = "1";

        const state = toggleLike(id);
        syncLikeUI(id);

        animateLike(likeBtn, state.liked);

        setTimeout(() => {
            likeBtn.dataset.locked = "";
        }, 250);
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

    // TODO: 未来可根据 id 拉取点赞用户列表
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

    overlay.addEventListener("click", closeLikeDrawer);

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeLikeDrawer();
        }
    });
}

/* =========================
   SAFE START
========================= */

function start() {

    if (window.__FORUM_INIT__) return;
    window.__FORUM_INIT__ = true;

    initApp();
}

/* =========================
   BOOT
========================= */

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
} else {
    start();
}
