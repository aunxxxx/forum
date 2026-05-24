import { posts } from "./data.js";
import { renderPosts } from "./postCard.js";
import { initEditor } from "./editor.js";
import { initUpload } from "./upload.js";
import { initFAB } from "./fab.js";
import { initDrawer } from "./drawer.js";

/* =========================
   DOM 元素
========================= */

const postsContainer = document.getElementById("postsList");
const previewImage = document.getElementById("previewImage");

/* =========================
   App 初始化入口
========================= */

function initApp() {

    if (!postsContainer) return;

    /* 初始渲染 */
    renderPosts(postsContainer);

    /* 上传系统 */
    const getImage = initUpload(previewImage);

    /* 编辑器 */
    initEditor(postsContainer, getImage);

    /* FAB */
    initFAB();

    /* Drawer（最后初始化，避免事件冲突） */
    initDrawer();

}

/* =========================
   等 DOM ready 再启动
========================= */

if (document.readyState === "loading") {

    document.addEventListener("DOMContentLoaded", initApp);

} else {

    initApp();

}
