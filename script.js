/* ==========================================
   模块1：全局重置 & 基础样式
========================================== */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: #000;
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  overflow-x: hidden;
}

/* ==========================================
   模块2：页面主容器特效
========================================== */
.page-wrapper {
  background: #f5f7fb;
  min-height: 100vh;
  transition: transform 0.1s ease, filter 0.1s ease;
  will-change: transform, filter;
  position: relative;
  z-index: 1;
  border-radius: 0;
  overflow: hidden;
}
.page-wrapper.modal-open {
  border-radius: 28px 28px 0 0;
}

.forum-container {
  max-width: 700px;
  margin: 0 auto;
  padding: 20px 16px 60px;
}

/* ==========================================
   模块3：顶部导航栏
========================================== */
header {
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  max-width: 700px;
  margin: 0 auto;
}
nav a {
  margin: 0 10px;
  text-decoration: none;
  color: #333;
  font-weight: 500;
  font-size: 15px;
}
nav a.active {
  font-weight: bold;
  color: #ff7b5c;
}

/* ==========================================
   模块4：热门词条区域
========================================== */
.hot-section {
  background: #fff6ea;
  border-radius: 28px;
  padding: 16px;
  margin-bottom: 28px;
}
.hot-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.hot-header .hot-title {
  font-size: 20px;
  font-weight: bold;
  color: #ff7b5c;
  flex: 1;
  text-align: center;
}
.publish-trigger {
  background: #ff7b5c;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(255,123,92,0.3);
}
.hot-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.hot-item {
  background: white;
  border-radius: 20px;
  padding: 12px 16px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.hot-tag { font-weight: 600; color: #333; }
.hot-count { color: #ff7b5c; font-weight: bold; }
.clear-filter {
  background: #eee;
  border-radius: 20px;
  padding: 2px 8px;
  font-size: 12px;
  margin-left: 8px;
  cursor: pointer;
}

/* ==========================================
   模块5：帖子卡片样式
========================================== */
.posts-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.post-card {
  background: white;
  border-radius: 24px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}
.post-header {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}
.post-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ffb88c, #ff7b5c);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 18px;
  cursor: pointer;
}
.author-name {
  font-weight: bold;
  cursor: pointer;
}
.post-time {
  font-size: 11px;
  color: #aaa;
  margin-top: 4px;
}
.post-content {
  margin: 12px 0;
  line-height: 1.4;
  word-break: break-word;
}
.post-image {
  max-width: 100%;
  border-radius: 16px;
  margin: 8px 0;
  max-height: 200px;
}
.post-stats {
  display: flex;
  gap: 24px;
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px solid #eee;
}
.stat-group {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}
.like-action-btn, .comment-action-btn {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
}
.like-action-btn svg {
  width: 20px;
  height: 20px;
  stroke: #777;
  stroke-width: 2;
  fill: none;
  transition: 0.1s;
}
.like-action-btn svg.liked {
  fill: #ff4d4f;
  stroke: #ff4d4f;
}
.comment-action-btn svg {
  width: 20px;
  height: 20px;
  stroke: #777;
  stroke-width: 2;
  fill: none;
}
.stat-num { font-size: 14px; color: #777; }

/* ==========================================
   模块6：点赞爱心粒子动画
========================================== */
.heart-particle {
  position: fixed;
  font-size: 18px;
  pointer-events: none;
  z-index: 9999;
  animation: floatHeart 0.8s ease-out forwards;
}
@keyframes floatHeart {
  0% { transform: translate(0, 0) scale(0.8); opacity: 1; }
  100% { transform: translate(var(--dx, 40px), var(--dy, -60px)) scale(1.2); opacity: 0; }
}

/* ==========================================
   模块7：发帖编辑器
========================================== */
.post-editor-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: white;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  transform: scale(0);
  opacity: 0;
  transition: transform 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1), opacity 0.25s;
  border-radius: 50%;
  pointer-events: none;
}
.post-editor-overlay.active {
  transform: scale(1);
  opacity: 1;
  border-radius: 0;
  pointer-events: auto;
}
.post-editor-overlay.closing {
  transform: scale(0);
  opacity: 0;
  border-radius: 50%;
  transition: transform 0.25s ease-in, opacity 0.2s;
}
.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
  background: white;
}
.editor-header button {
  background: none;
  border: none;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  padding: 8px 12px;
}
.send-btn { color: #ff7b5c; }
.close-editor { color: #888; }
.editor-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}
.editor-textarea {
  width: 100%;
  min-height: 150px;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 16px;
  font-size: 16px;
  font-family: inherit;
  resize: none;
  outline: none;
}
.editor-textarea:focus { border-color: #ff7b5c; }
.image-picker {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.square-image-btn {
  width: 100px;
  height: 100px;
  background: #f1f5f9;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  color: #94a3b8;
  cursor: pointer;
  border: 2px dashed #cbd5e1;
}
.image-preview {
  margin-top: 16px;
  max-width: 200px;
  max-height: 200px;
  border-radius: 16px;
  display: none;
}

/* ==========================================
   模块8：全局模态窗抽屉系统
========================================== */
.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 3000;
  visibility: hidden;
  display: flex;
}
.modal-mask.show { visibility: visible; }

@media (max-width: 768px) {
  .modal-mask {
    align-items: flex-end;
    justify-content: center;
    background: rgba(0,0,0,0.3);
    pointer-events: auto;
  }
  .drawer-modal {
    background: white;
    border-radius: 28px 28px 0 0;
    width: 100%;
    max-width: 700px;
    display: flex;
    flex-direction: column;
    pointer-events: auto;
    box-shadow: 0 -4px 20px rgba(0,0,0,0.2);
    height: 80vh;
    min-height: 400px;
    overflow: hidden;
    position: relative;
  }
  .drag-bar {
    width: 60px;
    height: 4px;
    background: #bbb;
    border-radius: 4px;
    margin: 12px auto;
    cursor: grab;
    touch-action: pan-y;
    padding: 10px 0;
    background-clip: content-box;
    z-index: 30;
  }
  .drag-bar:active {
    cursor: grabbing;
  }
  .drawer-content {
    flex: 1;
    overflow-y: auto;
    padding: 16px 20px 100px 20px;
  }
  .modal-card { display: none; }
  
  /* 手机端隐藏回复按钮 */
  .reply-btn {
    display: none !important;
  }
}

@media (min-width: 769px) {
  .modal-mask {
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.6);
    pointer-events: auto;
  }
  .modal-card {
    background: white;
    border-radius: 32px;
    width: 500px;
    max-width: 90%;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    position: relative;
  }
  .modal-card .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 24px;
    border-bottom: 1px solid #eee;
    position: sticky;
    top: 0;
    background: white;
    border-radius: 32px 32px 0 0;
  }
  .modal-card .modal-header h3 { font-size: 18px; font-weight: 600; }
  .modal-card .close-modal {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #888;
  }
  .modal-body {
    flex: 1;
    overflow-y: auto;
    padding: 16px 24px;
  }
  .drawer-modal { display: none; }
}

/* ==========================================
   模块9：评论 & 楼中楼回复样式
========================================== */
.comment-item, .reply-item {
  margin-bottom: 12px;
}
.comment-main, .reply-main {
  display: flex;
  gap: 12px;
  padding: 8px 0;
}
.comment-avatar, .reply-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #ffd966;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  cursor: pointer;
  flex-shrink: 0;
}
.comment-right, .reply-right {
  flex: 1;
}
.comment-user, .reply-user {
  font-weight: 700;
  color: #ff7b5c;
  cursor: pointer;
  font-size: 14px;
}
.comment-time, .reply-time {
  font-size: 10px;
  color: #aaa;
  margin-left: 8px;
}
.comment-text, .reply-text {
  margin-top: 4px;
  color: #333;
  font-size: 14px;
  line-height: 1.4;
  word-break: break-word;
  cursor: pointer;
}
.action-bar {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 8px;
  align-items: center;
}
.action-btn {
  background: none;
  border: none;
  color: #888;
  font-size: 12px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.action-btn svg {
  width: 20px;
  height: 20px;
  stroke: #888;
  stroke-width: 2;
  fill: none;
}
.nested-replies {
  margin-left: 52px;
  padding-left: 12px;
  border-left: 2px solid #e9ecef;
  margin-top: 8px;
}

.pc-reply-preview {
  display: none;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 20px;
  margin: 0 20px 8px 20px;
  font-size: 13px;
  color: #555;
}
.pc-reply-preview .close-preview {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: #888;
}

.comment-input-fixed {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  box-shadow: 0 -2px 12px rgba(0,0,0,0.1);
  padding: 6px 12px;
  margin: 0 16px 16px 16px;
  gap: 8px;
  z-index: 20;
}
.comment-input-fixed input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  padding: 10px 12px;
  border-radius: 20px;
  background: #f0f0f0;
}
.comment-input-fixed input:focus {
  background: #e8e8e8;
}
.comment-input-fixed button {
  background: #000;
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  transition: all 0.2s;
  flex-shrink: 0;
}
.comment-input-fixed button:active {
  background: #fff;
  color: #000;
  transform: scale(0.95);
}
