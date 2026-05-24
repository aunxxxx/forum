import { posts } from "./data.js";

export function renderPosts(postsList) {
  postsList.innerHTML = "";

  posts.forEach((post) => {
    const div = document.createElement("div");
    div.className = "post-card";

    div.innerHTML = `
      <div class="post-header">
        <div class="post-avatar">${post.user}</div>
        <div>
          <div class="author-name">${post.name}</div>
          <div class="post-time">${post.time}</div>
        </div>
      </div>

      <div class="post-content">${post.content}</div>

      ${post.image ? `<img src="${post.image}" class="post-image" />` : ""}

    import { posts } from "./data.js";
import { createStatBtn } from "./statBtn.js";

export function renderPosts(postsList) {
  postsList.innerHTML = "";

  posts.forEach((post) => {
    const div = document.createElement("div");
    div.className = "post-card";

    const header = `
      <div class="post-header">
        <div class="post-avatar">${post.user}</div>
        <div>
          <div class="author-name">${post.name}</div>
          <div class="post-time">${post.time}</div>
        </div>
      </div>
    `;

    const content = `
      <div class="post-content">${post.content}</div>
      ${post.image ? `<img src="${post.image}" class="post-image" />` : ""}
    `;

    const stats = document.createElement("div");
    stats.className = "post-stats";

    const likeBtn = createStatBtn("like", post.likes, () => {
      post.likes++;
      renderPosts(postsList);
    });

    const commentBtn = createStatBtn("comment", post.comments, () => {
      console.log("打开评论");
    });

    stats.appendChild(likeBtn);
    stats.appendChild(commentBtn);

    div.innerHTML = header + content;
    div.appendChild(stats);

    postsList.appendChild(div);
  });
}
    `;

    postsList.appendChild(div);
  });
}
