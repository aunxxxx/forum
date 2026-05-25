const likeStore = new Map();

/* =========================
   INIT STATE
========================= */

export function initLikeEngine() {
    console.log("Like Engine ready");
}

/* =========================
   GET STATE
========================= */

export function getLike(id) {
    return likeStore.get(id) || {
        count: 0,
        liked: false,
        users: []
    };
}

/* =========================
   TOGGLE LIKE
========================= */

export function toggleLike(id, user = "me") {

    const state = getLike(id);

    const alreadyLiked = state.users.includes(user);

    if (alreadyLiked) {
        state.users = state.users.filter(u => u !== user);
        state.count = Math.max(0, state.count - 1);
        state.liked = false;
    } else {
        state.users.push(user);
        state.count += 1;
        state.liked = true;
    }

    likeStore.set(id, state);

    return state;
}

/* =========================
   SYNC UI
========================= */

export function syncLikeUI(id) {

    const state = getLike(id);

    document.querySelectorAll(`[data-like-id="${id}"]`).forEach(el => {

        const countEl = el.querySelector(".like-count");
        const btn = el.querySelector(".like-btn");
        const icon = el.querySelector("svg");

        if (countEl) {
            countEl.textContent = state.count;
        }

        if (btn) {
            btn.classList.toggle("active", state.liked);
        }

        if (icon) {
            icon.classList.toggle("active", state.liked);
        }
    });
}
