const likeStore = {
  posts: {},
  comments: {}
};

export function toggleLike(type, id, user) {

  if (!likeStore[type][id]) {
    likeStore[type][id] = {
      count: 0,
      users: []
    };
  }

  const item = likeStore[type][id];

  const exists = item.users.find(u => u.id === user.id);

  if (exists) {
    // 允许无限点赞：只加次数，不重复用户
    item.count++;
    exists.count = (exists.count || 1) + 1;
  } else {
    item.users.push({
      ...user,
      count: 1
    });
    item.count++;
  }

  return item;
}

export function getLikeData(type, id) {
  return likeStore[type]?.[id] || { count: 0, users: [] };
}
