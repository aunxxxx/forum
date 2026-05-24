import { currentUser } from "./data.js";
import { renderPosts } from "./postCard.js";

export function initEditor(postsList) {
  const editor = document.getElementById("editor");
  const publishBtn = document.querySelector(".publish-btn");
  const closeEditor = document.getElementById("closeEditor");
  const submitPost = document.getElementById("submitPost");
  const postInput = document.getElementById("postInput");

  let compressedImage = "";
  let isSubmitting = false;

  /* =========================
     权限
  ========================= */
  if (publishBtn && currentUser.role !== "trainee") {
    publishBtn.style.display = "none";
  }

  /* =========================
     打开编辑器
  ========================= */
  publishBtn?.addEventListener("click", () => {
    editor.classList.add("active");
  });

  /* =========================
     关闭编辑器
  ========================= */
  closeEditor?.addEventListener("click", () => {
    editor.classList.add("closing");
  });

  editor?.addEventListener("transitionend", () => {
    if (editor.classList.contains("closing")) {
      editor.classList.remove("active", "closing");
    }
  });

  /* =========================
     发布
  ========================= */
  submitPost?.addEventListener("click", () => {
    if (isSubmitting) return;

    const text = postInput.value.trim();
    if (!text && !compressedImage) return;

    isSubmitting = true;

    postsList.unshift({
      user: currentUser.name[0],
      name: currentUser.name,
      content: text,
      image: compressedImage,
      likes: 0,
      comments: 0,
      time: "刚刚"
    });

    renderPosts(postsList);

    postInput.value = "";
    compressedImage = "";

    editor.classList.add("closing");

    setTimeout(() => {
      isSubmitting = false;
    }, 400);
  });
}
