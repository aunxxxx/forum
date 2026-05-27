// postCard.js
 
import { posts } from "./data.js";
import { createStatBtn } from "./statBtn.js";
 
export function renderPosts(container) {
 
    if (!container) return;
 
    container.innerHTML = "";
 
    posts.forEach((post) => {
 
        const card = document.createElement("div");
 
        card.className = "post-card";
 
        /* 顶部 */
        const header = `
            <div class="post-header">
 
                <div class="post-avatar">
                    ${post.user}
                </div>
 
                <div>
 
                    <div class="author-name">
                        ${post.name}
                    </div>
 
                    <div class="post-time">
                        ${post.time}
                    </div>
 
                </div>
 
            </div>
        `;
 
        /* 内容 */
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
 
        /* 底部统计 */
        const stats = document.createElement("div");
 
        stats.className = "post-stats";
 
        /* 点赞 */
        const likeBtn = createStatBtn(
            "like",
            post.likes,
            () => {
 
                post.likes++;
 
                renderPosts(container);
 
            }
        );
 
        /* 评论 */
        const commentBtn = createStatBtn(
            "comment",
            post.comments,
            () => {
 
                console.log("打开评论系统");
 
            }
        );
 
        stats.appendChild(likeBtn);
 
        stats.appendChild(commentBtn);
 
        /* 合并 */
        card.innerHTML = header + content;
 
        card.appendChild(stats);
 
        container.appendChild(card);
 
    });
 
}
