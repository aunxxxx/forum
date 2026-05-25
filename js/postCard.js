export function createPostCard(post, actions = {}) {

    const card = document.createElement("div");
    card.className = "post-card";
    card.dataset.postId = post.id;

    card.innerHTML = `
        <div class="post-header">
            <div class="post-avatar">${post.user}</div>
            <div>
                <div class="author-name">${post.name}</div>
                <div class="post-time">${post.time}</div>
            </div>
        </div>

        <div class="post-content">${post.content}</div>

        ${post.image ? `<img class="post-image" src="${post.image}">` : ""}
    `;

    const stats = document.createElement("div");
    stats.className = "post-stats";

    // like
    const likeBtn = document.createElement("button");
    likeBtn.className = "stat-btn like-btn";
    likeBtn.dataset.likeId = post.id;

    likeBtn.innerHTML = `
        <svg class="like-icon" viewBox="0 0 24 24">
            <path d="M12 21s-8-4.5-8-11a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6.5-8 11-8 11z"/>
        </svg>
        <span class="like-count">${post.likes}</span>
    `;

    likeBtn.addEventListener("click", () => {
        actions.onLike(post.id, likeBtn);
    });

    // comment
    const commentBtn = document.createElement("button");
    commentBtn.className = "stat-btn";
    commentBtn.textContent = `评论 ${post.comments}`;

    commentBtn.addEventListener("click", () => {
        actions.onComment(post.id);
    });

    stats.appendChild(likeBtn);
    stats.appendChild(commentBtn);

    card.appendChild(stats);

    return card;
}

/*更新*/
export function createPostCard(post, actions = {}) {

    const card = document.createElement("div");
    card.className = "post-card";
    card.dataset.postId = post.id;

    card.innerHTML = `
        <div class="post-header">
            <div class="post-avatar">${post.user}</div>
            <div>
                <div class="author-name">${post.name}</div>
                <div class="post-time">${post.time}</div>
            </div>
        </div>

        <div class="post-content">${post.content}</div>

        ${post.image ? `<img class="post-image" src="${post.image}">` : ""}

        <div class="post-stats">
            <button class="stat-btn like-btn" data-like-id="${post.id}">
                <svg class="like-icon" viewBox="0 0 24 24">
                    <path d="M12 21s-8-4.5-8-11a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6.5-8 11-8 11z"/>
                </svg>
                <span class="like-count">${post.likes}</span>
            </button>

            <button class="stat-btn comment-btn">
                评论 ${post.comments}
            </button>
        </div>
    `;

    return card;
}
