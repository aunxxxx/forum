import { posts } from "./data.js";
import { renderPosts } from "./postCard.js";
import { initEditor } from "./editor.js";
import { initUpload } from "./upload.js";
import { initFAB } from "./fab.js";
import { initDrawer } from "./drawer.js";
import {
    initLikeEngine,
    toggleLike,
    syncLikeUI
} from "./likeEngine.js";

/* =========================
   DOM
========================= */

const postsContainer =
    document.getElementById("postsList");

const previewImage =
    document.getElementById("previewImage");

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

    const getImage =
        initUpload(previewImage);

    initEditor(
        postsContainer,
        getImage
    );

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

        initInputSystem();
    });
}

/* =========================
   INPUT SYSTEM
========================= */

function initInputSystem() {

    /* =========================
       CANCEL REPLY
    ========================= */

    const cancelReply =
        document.getElementById("cancelReply");

    if (cancelReply) {

        cancelReply.addEventListener(
            "click",
            () => {

                const preview =
                    document.getElementById(
                        "replyPreview"
                    );

                if (preview) {
                    preview.style.display = "none";
                }
            }
        );
    }

    /* =========================
       AUTO HEIGHT
    ========================= */

    const input =
        document.getElementById(
            "commentInput"
        );

    if (input) {

        input.addEventListener(
            "input",
            () => {

                input.style.height = "auto";

                input.style.height =
                    input.scrollHeight + "px";
            }
        );
    }
}

/* =========================
   INTERACTION SYSTEM
========================= */

function bindInteractionEvents() {

    document.addEventListener(
        "click",
        (e) => {

            /* =========================
               LIKE BUTTON
            ========================= */

            const likeBtn =
                e.target.closest(".like-btn");

            if (likeBtn) {

                e.stopPropagation();

                const id =
                    likeBtn.dataset.likeId;

                if (!id) return;

                /* =========================
                   点击数字 → 点赞列表
                ========================= */

                const clickedCount =
                    e.target.classList.contains(
                        "like-count"
                    );

                if (clickedCount) {

                    const overlay =
                        document.getElementById(
                            "likeOverlay"
                        );

                    if (overlay) {
                        overlay.classList.add(
                            "is-open"
                        );
                    }

                    return;
                }

                /* =========================
                   点赞
                ========================= */

                const state =
                    toggleLike(id);

                syncLikeUI(id);

                triggerLikeAnimation(
                    likeBtn,
                    state.liked
                );

                return;
            }

            /* =========================
               REPLY
            ========================= */

            const replyBtn =
                e.target.closest(".reply-btn");

            if (replyBtn) {

                e.stopPropagation();

                const preview =
                    document.getElementById(
                        "replyPreview"
                    );

                if (preview) {
                    preview.style.display =
                        "flex";
                }

                const input =
                    document.getElementById(
                        "commentInput"
                    );

                if (input) {

                    input.focus();

                    /* =========================
                       MOBILE SCROLL
                    ========================= */

                    if (
                        window.innerWidth <= 768
                    ) {

                        setTimeout(() => {

                            input.scrollIntoView({
                                behavior: "smooth",
                                block: "center"
                            });

                        }, 200);
                    }
                }
            }
        }
    );
}

/* =========================
   LIKE ANIMATION
========================= */

function triggerLikeAnimation(
    btn,
    liked
) {

    const svg =
        btn.querySelector("svg");

    const count =
        btn.querySelector(".like-count");

    /* ripple */

    btn.classList.remove("ripple");

    void btn.offsetWidth;

    btn.classList.add("ripple");

    /* active */

    if (liked) {
        btn.classList.add("active");
    } else {
        btn.classList.remove("active");
    }

    /* remove ripple */

    setTimeout(() => {

        btn.classList.remove("ripple");

    }, 500);

    /* svg pop */

    if (svg) {

        svg.classList.remove("pop");

        void svg.offsetWidth;

        svg.classList.add("pop");

        setTimeout(() => {

            svg.classList.remove("pop");

        }, 220);
    }

    /* count pop */

    if (count) {

        count.style.transition =
            "transform .18s ease";

        count.style.transform =
            "scale(1.12)";

        setTimeout(() => {

            count.style.transform =
                "scale(1)";

        }, 180);
    }
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

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        start
    );

} else {

    start();
}
