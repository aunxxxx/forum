import { posts } from "./data.js";
import { renderPosts } from "./postCard.js";
import { initEditor } from "./editor.js";
import { initUpload } from "./upload.js";
import { initFAB } from "./fab.js";
import { initDrawer } from "./drawer.js";
import { initLikeEngine, toggleLike, syncLikeUI } from "./likeEngine.js";

/* =========================
   DOM
========================= */

const postsContainer = document.getElementById("postsList");
const previewImage = document.getElementById("previewImage");

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
    const getImage = initUpload(previewImage);
    initEditor(postsContainer, getImage);

    /* =========================
       3. FAB
    ========================= */
    initFAB();

    /* =========================
       4. drawer + engine
    ========================= */
    requestAnimationFrame(() => {
        initDrawer();
        initLikeEngine();
        bindInteractionEvents();
    });
}

/* =========================
   INTERACTION SYSTEM
========================= */

function bindInteractionEvents() {

    /* =========================
       GLOBAL DELEGATION（关键）
    ========================= */

    document.addEventListener("click", (e) => {

        const likeBtn = e.target.closest(".like-btn");
        if (!likeBtn) return;

        const id = likeBtn.dataset.likeId;
        if (!id) return;

        const isCount = e.target.classList.contains("like-count");

        /* =========================
           数字 → 打开 drawer
        ========================= */
        if (isCount) {
            openLikeDrawer(likeBtn);
            return;
        }

        /* =========================
           SVG / 按钮 → 点赞
        ========================= */
        const state = toggleLike(id);

        syncLikeUI(id);

        triggerLikeAnimation(likeBtn, state.liked);
    });
}

/* =========================
   LIKE ANIMATION
========================= */

function triggerLikeAnimation(btn, liked) {

    const svg = btn.querySelector("svg");
    const count = btn.querySelector(".like-count");

    btn.classList.add("ripple");

    if (liked) {
        btn.classList.add("active");
    } else {
        btn.classList.remove("active");
    }

    void btn.offsetWidth;

    setTimeout(() => {
        btn.classList.remove("ripple");
    }, 500);

    if (svg) {
        svg.classList.add("pop");

        setTimeout(() => {
            svg.classList.remove("pop");
        }, 200);
    }

    if (count && liked) {
        // 只在 like 时视觉增强（避免重复 + UI漂移）
        count.style.transform = "scale(1.1)";
        setTimeout(() => {
            count.style.transform = "scale(1)";
        }, 150);
    }
}

/* =========================
   DRAWER
========================= */

function openLikeDrawer(btn) {

    const overlay = document.getElementById("likeOverlay");
    if (!overlay) return;

    overlay.classList.add("active");

    // 未来扩展：根据 btn.dataset.likeId 拉用户列表
}

/* =========================
   SAFE START
========================= */

function start() {

    if (window.__APP_INIT__) return;
    window.__APP_INIT__ = true;

    initApp();
}

/* =========================
   DOM READY
========================= */

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
} else {
    start();
}
