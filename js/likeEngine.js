const likeStore = {};

export function addLike(id, user) {

  if (!likeStore[id]) {

    likeStore[id] = {
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

export function getLikeData(id) {

  return likeStore[id] || {
    total: 0,
    users: []
  };

}
