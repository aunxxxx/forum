export function initEditor(postsList) {
  const editor = document.getElementById("editor");
  const publishBtn = document.querySelector(".publish-btn");
  const closeEditor = document.getElementById("closeEditor");
  const submitPost = document.getElementById("submitPost");
  const postInput = document.getElementById("postInput");

  let compressedImage = "";
  let isSubmitting = false;

  if (publishBtn && currentUser.role !== "trainee") {
    publishBtn.style.display = "none";
  }

  publishBtn?.addEventListener("click", () => {
    editor.classList.add("active");
  });

  closeEditor?.addEventListener("click", () => {
    editor.classList.add("closing");

    setTimeout(() => {
      editor.classList.remove("active", "closing");
    }, 550);
  });

  editor?.addEventListener("transitionend", (e) => {
    if (e.propertyName !== "clip-path") return;

    if (editor.classList.contains("closing")) {
      editor.classList.remove("active", "closing");
    }
  });

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
