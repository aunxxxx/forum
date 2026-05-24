import { posts } from "./data.js";
import { renderPosts } from "./postCard.js";
import { initEditor } from "./editor.js";
import { initUpload } from "./upload.js";
import { initFAB } from "./fab.js";

const postsContainer = document.getElementById("postsList");
const previewImage = document.getElementById("previewImage");

/* 初始渲染 */
renderPosts(postsContainer);

/* 上传 */
const getImage = initUpload(previewImage);

/* 编辑器 */
initEditor(postsContainer, getImage);

/* FAB */
initFAB();
