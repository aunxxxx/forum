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

            <!-- LIKE -->
            <button class="stat-btn like-btn" data-like-id="${post.id}">
                <svg class="like-icon" viewBox="0 0 24 24">
                    <path d="M12 21s-8-4.5-8-11a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6.5-8 11-8 11z"/>
                </svg>
                <span class="like-count">${post.likes}</span>
            </button>

            <!-- COMMENT -->
            <button class="stat-btn comment-btn">
                <svg class="comment-icon" viewBox="0 0 24 24">
                    <path d="M21 15a4 4 0 0 1-4 4H8l-5 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/>
                </svg>
                <span>评论 ${post.comments}</span>
            </button>

        </div>
    `;

    return card;
}
