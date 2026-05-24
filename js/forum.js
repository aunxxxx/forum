import { renderPosts } from "./postCard.js";
import { posts } from "./data.js";
import { initEditor } from "./editor.js";
import { initUpload } from "./upload.js";

const postsList = document.getElementById("postsList");
const previewImage = document.getElementById("previewImage");

renderPosts(postsList);

const getImage = initUpload(previewImage);
initEditor(postsList);

import { initFAB } from "./fab.js";
initFAB();
