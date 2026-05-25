import { posts } from "./data.js";
import { renderPosts } from "./postCard.js";
import { initEditor } from "./editor.js";
import { initUpload } from "./upload.js";
import { initFAB } from "./fab.js";
import { initDrawer } from "./drawer.js";
import { initUserUI } from "./userUI.js";

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
       1. 渲染帖子
    ========================= */
    renderPosts(postsContainer);

    /* ⭐ UI系统（头像 + badge统一）
       必须在 renderPosts 之后 */
    initUserUI();

    /* =========================
       2. 上传系统
    ========================= */
    const getImage = initUpload(previewImage);

    /* =========================
       3. 编辑器
    ========================= */
    initEditor(postsContainer, getImage);

    /* =========================
       4. FAB
    ========================= */
    initFAB();

    /* =========================
       5. Drawer
    ========================= */
    requestAnimationFrame(() => {
        initDrawer();
        bindInteractionEvents(); // ⭐新增（点赞/评论统一入口）
    });
}

/* =========================
   INTERACTION SYSTEM
========================= */

function bindInteractionEvents() {

    /* =========================
       LIKE SYSTEM
    ========================= */

    document.querySelectorAll(".like-btn").forEach(btn => {

        const svg = btn.querySelector("svg");
        const count = btn.querySelector(".like-count");

        // ⭐ SVG：只做动画（不打开drawer）
        if (svg) {
            svg.addEventListener("click", (e) => {
                e.stopPropagation();
                triggerLikeAnimation(btn);
            });
        }

        // ⭐ 数字：打开点赞drawer
        if (count) {
            count.addEventListener("click", (e) => {
                e.stopPropagation();
                openLikeDrawer(btn);
            });
        }
    });

    /* =========================
       COMMENT LIKE SYSTEM
    ========================= */

    document.querySelectorAll(".comment .like-btn").forEach(btn => {

        const svg = btn.querySelector("svg");
        const count = btn.querySelector(".like-count");

        if (svg) {
            svg.addEventListener("click", (e) => {
                e.stopPropagation();
                triggerLikeAnimation(btn);
            });
        }

        if (count) {
            count.addEventListener("click", (e) => {
                e.stopPropagation();
                openLikeDrawer(btn);
            });
        }
    });
}

/* =========================
   LIKE ANIMATION
========================= */

function triggerLikeAnimation(btn) {

    const svg = btn.querySelector("svg");
    const count = btn.querySelector(".like-count");

    btn.classList.add("active");
    btn.classList.add("ripple");

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

    if (count) {
        count.textContent = (parseInt(count.textContent || 0) + 1);
    }
}

/* =========================
   DRAWER
========================= */

function openLikeDrawer(btn) {
    const overlay = document.getElementById("likeOverlay");
    if (!overlay) return;

    overlay.classList.add("active");
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
