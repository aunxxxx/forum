import { currentUser } from "./data.js";
import { renderPosts } from "./postCard.js";

export function initEditor(postsList) {
  const editor = document.getElementById("editor");
  const publishBtn = document.querySelector(".publish-btn");
  const closeBtn = document.getElementById("closeEditor");
  const submitBtn = document.getElementById("submitPost");
  const postInput = document.getElementById("postInput");

  let compressedImage = "";
  let isSubmitting = false;

  /* =========================
     权限控制
  ========================= */
  if (publishBtn && currentUser.role !== "trainee") {
    publishBtn.style.display = "none";
  }

  /* =========================
     打开编辑器
  ========================= */
  function openEditor() {
    editor?.classList.add("active");
  }

  /* =========================
     关闭编辑器（触发动画）
  ========================= */
  function closeEditor() {
    editor?.classList.add("closing");
  }

  /* =========================
     动画结束后清理状态
  ========================= */
  editor?.addEventListener("transitionend", () => {
    if (editor.classList.contains("closing")) {
      editor.classList.remove("active", "closing");
    }
  });

  /* =========================
     发布逻辑
  ========================= */
  function submitPost() {
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

    closeEditor();

    // 防止连点
    setTimeout(() => {
      isSubmitting = false;
    }, 400);
  }

  /* =========================
     事件绑定
  ========================= */
  publishBtn?.addEventListener("click", openEditor);
  closeBtn?.addEventListener("click", closeEditor);
  submitBtn?.addEventListener("click", submitPost);
}
