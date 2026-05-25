
import { posts } from "./data.js";
import { renderPosts } from "./postCard.js";
import { initEditor } from "./editor.js";
import { initUpload } from "./upload.js";
import { initFAB } from "./fab.js";
import { initDrawer } from "./drawer.js";

/* =========================
   DOM
========================= */

const postsContainer = document.getElementById("postsList");
const previewImage = document.getElementById("previewImage");

/* =========================
   INIT APP
========================= */

function initApp() {

    // ❗ 安全检查：避免 DOM 未挂载直接报错
    if (!postsContainer) {
        console.warn("postsList not found");
        return;
    }

    /* =========================
       1. 渲染帖子
    ========================= */
    renderPosts(postsContainer);

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
       5. Drawer（关键：最后初始化）
    ========================= */
    requestAnimationFrame(() => {
        initDrawer();
    });
}

/* =========================
   SAFE START
========================= */

function start() {
    // 防止重复初始化
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
