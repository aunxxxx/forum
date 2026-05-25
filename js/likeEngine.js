/* =========================
   STORE
========================= */

const likeStore = {};

/* =========================
   INIT
========================= */

export function initLikeEngine() {

  console.log("Like Engine Ready");

}

/* =========================
   TOGGLE LIKE
========================= */

export function toggleLike(id) {

  if (!likeStore[id]) {

    likeStore[id] = {
      liked: false,
      total: 12,
      users: []
    };

  }

  likeStore[id].liked = !likeStore[id].liked;

  if (likeStore[id].liked) {

    likeStore[id].total++;

  } else {

    likeStore[id].total--;

  }

  return likeStore[id];
}

/* =========================
   SYNC UI
========================= */

export function syncLikeUI(id) {

  const data = likeStore[id];
  if (!data) return;

  const buttons = document.querySelectorAll(
    `[data-like-id="${id}"]`
  );

  buttons.forEach(btn => {

    const count = btn.querySelector(".like-count");

    if (count) {
      count.textContent = data.total;
    }

    if (data.liked) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }

  });

}

/* =========================
   ADD LIKE
========================= */

export function addLike(id, user) {

  if (!likeStore[id]) {

    likeStore[id] = {
      liked: false,
      total: 0,
      users: []
    };

  }

  likeStore[id].total++;

  const exists = likeStore[id].users.find(
    u => u.id === user.id
  );

  if (exists) {

    exists.count++;

  } else {

    likeStore[id].users.push({
      ...user,
      count: 1
    });

  }

  return likeStore[id];
}

/* =========================
   GET DATA
========================= */

export function getLikeData(id) {

  return likeStore[id] || {
    liked: false,
    total: 0,
    users: []
  };

}
