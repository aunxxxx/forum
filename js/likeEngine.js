import { posts } from "./data.js";
 
const likeMap = new Map(); // postId -> Set(userId)
 
export function initLikeEngine() {
    posts.forEach(p => {
        likeMap.set(p.id, new Set());
    });
}
 
/* ⭐ 无限点赞 + 去重 */
export function toggleLike(postId) {
 
    if (!likeMap.has(postId)) {
        likeMap.set(postId, new Set());
    }
 
    const set = likeMap.get(postId);
 
    // 模拟“当前用户”
    const userId = "me";
 
    if (set.has(userId)) {
        set.delete(userId);
    } else {
        set.add(userId);
    }
 
    return {
        liked: set.has(userId),
        count: set.size
    };
}
 
/* ⭐ UI同步 */
export function syncLikeUI(postId) {
 
    const btn = document.querySelector(`[data-like-id="${postId}"]`);
    if (!btn) return;
 
    const set = likeMap.get(postId) || new Set();
 
    const count = btn.querySelector(".like-count");
    if (count) count.textContent = set.size;
}
 
/* ⭐ drawer数据（去重后的列表） */
export function getLikeList(postId) {
    return likeMap.get(postId) || new Set();
}
