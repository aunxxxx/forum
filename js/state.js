import { posts as initialPosts } from "./data.js";
 
export const state = {
    posts: structuredClone(initialPosts)
};
 
export function getPosts() {
    return state.posts;
}
 
export function updatePost(id, updater) {
    const post = state.posts.find(p => p.id === id);
    if (!post) return;
    updater(post);
}
