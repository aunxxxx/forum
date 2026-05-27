const currentUser = {
    name: "Austin",
    avatar: "https://i.pravatar.cc/40",
    badge: "创始"
};

function createPostCard(text, image) {
    const card = document.createElement("div");
    const id = `post_${Date.now()}`;

    card.className = "post-card";
    card.dataset.postId = id;
    card.innerHTML = `
        <div class="post-header">
            <img class="post-avatar" src="${currentUser.avatar}" alt="">
            <div class="post-user-info">
                <span class="badge founder">${currentUser.badge}</span>
                <span class="post-username">${currentUser.name}</span>
                <span class="post-time">刚刚</span>
            </div>
        </div>
        <div class="post-content"></div>
        ${image ? `<img src="${image}" class="post-image" alt="">` : ""}
        <div class="post-stats">
            <button class="stat-btn like-btn like-action-btn" data-like-id="${id}" data-like-type="post" type="button">
                <svg class="like-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12.1 20.3l-.1.1-.1-.1C7 16 4 13.2 4 9.8C4 7.2 6 5.2 8.6 5.2C10.1 5.2 11.5 5.9 12.4 7.1C13.3 5.9 14.7 5.2 16.2 5.2C18.8 5.2 20.8 7.2 20.8 9.8C20.8 13.2 17.8 16 12.9 20.3Z"/>
                </svg>
                <span class="like-count">0</span>
            </button>
            <button class="stat-btn comment-btn" data-post-id="${id}" type="button">💬 0</button>
        </div>
    `;

    card.querySelector(".post-content").textContent = text;
    return card;
}

export function initEditor(postsContainer, getImage) {
    const editor = document.getElementById("editor");
    const closeEditor = document.getElementById("closeEditor");
    const submitPost = document.getElementById("submitPost");
    const postInput = document.getElementById("postInput");
    const previewImage = document.getElementById("previewImage");

    let isSubmitting = false;

    if (!editor) return;

    function close() {
        editor.classList.add("closing");

        setTimeout(() => {
            editor.classList.remove("active", "closing");
            document.body.style.overflow = "";
        }, 550);
    }

    closeEditor?.addEventListener("click", close);

    editor.addEventListener("transitionend", (e) => {
        if (e.propertyName !== "clip-path") return;
        if (editor.classList.contains("closing")) {
            editor.classList.remove("active", "closing");
        }
    });

    submitPost?.addEventListener("click", () => {
        if (isSubmitting) return;

        const text = postInput?.value.trim() || "";
        const image = getImage();

        if (!text && !image) return;

        isSubmitting = true;
        postsContainer?.prepend(createPostCard(text, image));

        if (postInput) postInput.value = "";
        if (previewImage) {
            previewImage.src = "";
            previewImage.style.display = "none";
        }

        close();

        setTimeout(() => {
            isSubmitting = false;
        }, 550);
    });
}
