import { posts } from "./data.js";
import { createPostCard } from "./postCard.js";

import { initLikeEngine, toggleLike, syncLikeUI, getLikeList } from "./likeEngine.js";

const postsContainer = document.getElementById("postsList");
const overlay = document.getElementById("likeOverlay");
const drawer = document.getElementById("likeDrawer");

/* =========================
   INIT
========================= */

function initApp() {

    if (!postsContainer) return;

    initLikeEngine();
    renderPosts();
    bindEvents();
    bindDrawer();
}

/* =========================
   RENDER (稳定局部重建)
========================= */

function renderPosts() {

    postsContainer.innerHTML = "";

    posts.forEach(post => {

        const card = createPostCard(post);

        postsContainer.appendChild(card);
    });
}

/* =========================
   EVENTS
========================= */

function bindEvents() {

    if (window.__BOUND__) return;
    window.__BOUND__ = true;

    document.addEventListener("click", (e) => {

        const likeBtn = e.target.closest(".like-btn");
        if (!likeBtn) return;

        const id = likeBtn.dataset.likeId;

        const isCount = e.target.closest(".like-count");

        /* =====================
           打开drawer
        ===================== */
        if (isCount) {
            openLikeDrawer(id);
            return;
        }

        /* =====================
           like
        ===================== */
        const state = toggleLike(id);

        syncLikeUI(id);
        animateLike(likeBtn, state.liked);
    });
}

/* =========================
   ANIMATION
========================= */

function animateLike(btn, liked) {

    const icon = btn.querySelector(".like-icon");

    btn.classList.toggle("active", liked);
    btn.classList.add("ripple");

    if (icon) {
        icon.classList.remove("pop");
        void icon.offsetWidth;
        icon.classList.add("pop");
    }

    setTimeout(() => btn.classList.remove("ripple"), 300);
}

/* =========================
   DRAWER（你要的：去重 + 头像 + title + count）
========================= */

function openLikeDrawer(postId) {

    const list = getLikeList(postId);

    overlay.classList.add("active");
    document.body.classList.add("drawer-open");

    const content = drawer.querySelector(".drawer-content");

    content.innerHTML = "";

    list.forEach((item) => {

        const div = document.createElement("div");
        div.className = "like-item";

        div.innerHTML = `
            <div class="like-left">
                <img class="avatar" src="${item.avatar}">
                <div class="user-info">
                    <span class="badge">${item.title}</span>
                    <span class="username">${item.name}</span>
                </div>
            </div>

            <div class="like-right">×${item.count}</div>
        `;

        content.appendChild(div);
    });
}

/* =========================
   CLOSE
========================= */

function bindDrawer() {

    overlay.addEventListener("click", closeDrawer);
}

function closeDrawer() {
    overlay.classList.remove("active");
    document.body.classList.remove("drawer-open");
}

/* =========================
   START
========================= */

initApp();
