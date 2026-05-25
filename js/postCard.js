import { posts } from "./data.js";
import { createStatBtn } from "./statBtn.js";

export function renderPosts(container) {

  if (!container) return;

  container.innerHTML = "";

  posts.forEach((post) => {

    const card = document.createElement("div");

    card.className = "post-card";

    const header = `

      <div class="post-header">

        <a
          class="avatar-link"
          href="/user.html?id=${post.userId || "1"}"
        >

          <div class="post-avatar">
            ${post.user}
          </div>

        </a>

        <div>

          <div class="name-row">

            ${
              post.badge
                ? `
                  <span class="badge ${post.badgeType || ""}">
                    ${post.badge}
                  </span>
                `
                : ""
            }

            <div class="author-name">
              ${post.name}
            </div>

          </div>

          <div class="post-time">
            ${post.time}
          </div>

        </div>

      </div>

    `;

    const content = `

      <div class="post-content">
        ${post.content}
      </div>

      ${
        post.image
          ? `<img src="${post.image}" class="post-image" />`
          : ""
      }

    `;

    const stats = document.createElement("div");

    stats.className = "post-stats";

    const likeBtn = createStatBtn(
      "like",
      post.likes
    );

    const commentBtn = createStatBtn(
      "comment",
      post.comments
    );

    stats.appendChild(likeBtn);

    stats.appendChild(commentBtn);

    card.innerHTML = header + content;

    card.appendChild(stats);

    container.appendChild(card);

  });

}
