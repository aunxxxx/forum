import { posts, currentUser } from "./data.js";
import { renderPosts } from "./postCard.js";

export function initEditor(postsList) {

  const editor = document.getElementById("editor");
  const publishBtn = document.querySelector(".publish-btn");
  const closeEditor = document.getElementById("closeEditor");
  const submitPost = document.getElementById("submitPost");
  const postInput = document.getElementById("postInput");

  let compressedImage = "";

  /* 权限 */
  if (currentUser.role !== "trainee") {
    publishBtn.style.display = "none";
  }

  /* 打开 */
  publishBtn.onclick = () => {
    editor.classList.add("active");
  };

  /* 关闭 */
  closeEditor.onclick = () => {
    editor.classList.add("closing");

    setTimeout(() => {
      editor.classList.remove("active", "closing");
    }, 500);
  };

  /* 发布 */
  submitPost.onclick = () => {
    const text = postInput.value.trim();

    if (!text && !compressedImage) return;

    posts.unshift({
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
      editor.classList.remove("active", "closing");
    }, 500);
  };
}
