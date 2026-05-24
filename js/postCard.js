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

     <div class="stat-btn">
  <!-- like svg -->
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M12 21s-6.7-4.35-9.33-8.28C.6 9.57 2.18 5 6.4 5c2.04 0 3.18 1.17 3.9 2.2C11.02 6.17 12.16 5 14.2 5c4.22 0 5.8 4.57 3.73 7.72C18.7 16.65 12 21 12 21z"/>
  </svg>

  <span>${post.likes}</span>
</div>

<div class="stat-btn">
  <!-- comment svg -->
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>

  <span>${post.comments}</span>
</div>
    `;

    postsList.appendChild(div);
  });
}
