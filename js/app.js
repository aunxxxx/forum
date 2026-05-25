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

    /* 1. 渲染帖子 */
    renderPosts(postsContainer);

    /* 1.5 全局UI系统（头像 + badge） */
    initUserUI();

    /* 2. 上传系统 */
    const getImage = initUpload(previewImage);

    /* 3. 编辑器 */
    initEditor(postsContainer, getImage);

    /* 4. FAB */
    initFAB();

    /* 5. Drawer */
    requestAnimationFrame(() => {
        initDrawer();
    });
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
