import { currentUser, posts } from "./data.js";
import { renderPosts } from "./postCard.js";

export function initEditor(postsContainer, getImage) {

    const editor = document.getElementById("editor");

    const publishBtn = document.querySelector(".publish-btn");

    const closeEditor = document.getElementById("closeEditor");

    const submitPost = document.getElementById("submitPost");

    const postInput = document.getElementById("postInput");

    const previewImage = document.getElementById("previewImage");

    let isSubmitting = false;

    if (!editor) return;

    /* 非练习生隐藏按钮 */
    if (currentUser.role !== "trainee" && publishBtn) {
        publishBtn.style.display = "none";
    }

    /* 打开发帖页 */
    publishBtn?.addEventListener("click", () => {
        editor.classList.add("active");
    });

    /* 关闭发帖页 */
    closeEditor?.addEventListener("click", () => {

        editor.classList.add("closing");

        setTimeout(() => {

            editor.classList.remove("active");
            editor.classList.remove("closing");

            document.body.style.overflow = "";

        }, 550);

    });

    /* transition 修正 */
    editor.addEventListener("transitionend", (e) => {

        if (e.propertyName !== "clip-path") return;

        if (editor.classList.contains("closing")) {

            editor.classList.remove("active");
            editor.classList.remove("closing");

        }

    });

    /* 发帖 */
    submitPost?.addEventListener("click", () => {

        if (isSubmitting) return;

        const text = postInput.value.trim();

        const image = getImage();

        if (!text && !image) return;

        isSubmitting = true;

        posts.unshift({
            user: currentUser.name[0],
            name: currentUser.name,
            content: text,
            image: image,
            likes: 0,
            comments: 0,
            time: "刚刚"
        });

        /* 重新渲染 */
        renderPosts(postsContainer);

        /* 清空输入 */
        postInput.value = "";

        /* 清空图片 */
        previewImage.src = "";
        previewImage.style.display = "none";

        /* 关闭 */
        editor.classList.add("closing");

        setTimeout(() => {

            editor.classList.remove("active");
            editor.classList.remove("closing");

            document.body.style.overflow = "";

            isSubmitting = false;

        }, 550);

    });

}
