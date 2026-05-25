css/drawer.css：/* =========================
   OVERLAY
========================= */

.drawer-overlay {
    position: fixed;
    inset: 0;

    background: rgba(0, 0, 0, 0.42);

    opacity: 0;
    visibility: hidden;
    pointer-events: none;

    transition: opacity .25s ease;

    z-index: 999;
}

.drawer-overlay.is-open {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
}

/* =========================
   DRAWER BASE
========================= */

.drawer {
    position: fixed;

    left: 0;
    right: 0;
    bottom: 0;

    width: 100%;
    height: 85vh;

    background: #fff;

    border-radius: 24px 24px 0 0;

    transform: translateY(100%);

    will-change: transform;

    overflow: hidden;

    display: flex;
    flex-direction: column;

    z-index: 1000;
}

/* =========================
   HANDLE
========================= */

.drawer-handle-wrap {
    display: flex;
    justify-content: center;
    align-items: center;

    padding: 10px 0 4px;

    flex-shrink: 0;
}

.drawer-handle {
    width: 42px;
    height: 5px;

    border-radius: 999px;

    background: #d0d0d0;
}

/* =========================
   HEADER
========================= */

.drawer-header {
    height: 56px;

    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 0 18px;

    border-bottom: 1px solid #f1f1f1;

    flex-shrink: 0;
}

.drawer-title {
    font-size: 18px;
    font-weight: 700;
}

/* 关闭按钮 */
@media (max-width: 768px) {
    .drawer-close {
        display: none !important;
    }
}

@media (min-width: 769px) {

    .drawer-close {

        width: 34px;
        height: 34px;

        border-radius: 50%;

        display: flex;
        align-items: center;
        justify-content: center;

        background: #f5f5f5;

        cursor: pointer;

        flex-shrink: 0;

        transition: background .2s ease;
    }

    .drawer-close:hover {
        background: #ebebeb;
    }
}

/* =========================
   CONTENT
========================= */

.drawer-content {
    flex: 1;

    overflow-y: auto;
    overflow-x: hidden;

    -webkit-overflow-scrolling: touch;

    padding: 14px 16px 28px;
}

/* =========================
   ITEM
========================= */

.comment-item,
.like-item {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;

    gap: 12px;

    padding: 14px 0;

    border-bottom: 1px solid #f3f3f3;
}

.comment-avatar,
.like-avatar {
    width: 42px;
    height: 42px;

    border-radius: 50%;

    background: #111;
    color: #fff;

    display: flex;
    align-items: center;
    justify-content: center;

    font-weight: 700;

    flex-shrink: 0;
}

.comment-main {
    flex: 1;
}

.comment-name,
.like-name {
    font-size: 14px;
    font-weight: 700;
}

.comment-text,
.like-title {
    margin-top: 4px;

    font-size: 14px;
    line-height: 1.5;

    color: #666;
}

.like-left {
    display: flex;
    align-items: center;
    gap: 12px;
}

.like-count {
    font-size: 14px;
    font-weight: 700;

    cursor: pointer;
}

/* =========================
   APP EFFECT
========================= */

.app {
    transition:
        transform .25s ease,
        filter .25s ease;
}

/* =========================
   MOBILE
========================= */

@media (max-width: 768px) {

    body.drawer-open .app {
        transform: scale(.965);
        filter: blur(2px);
    }

    .drawer {
    touch-action: pan-y;
   }
}

/* =========================
   PC DESKTOP MODAL
========================= */

@media (min-width: 769px) {

    /* ❌ PC 不缩放 */
    body.drawer-open .app {
        transform: none !important;
        filter: none !important;
    }

    /* ❌ PC 不显示拖拽条 */
    .drawer-handle-wrap {
        display: none;
    }

    /* ⭐ 真正桌面弹窗 */
    .drawer {

        position: fixed;

        width: 520px;
        height: 720px;

        max-height: 82vh;

        left: 50%;
        top: 50%;

        right: auto;
        bottom: auto;

        border-radius: 28px;

        background: #fff;

        overflow: hidden;

        box-shadow:
            0 30px 80px rgba(0,0,0,.18);

        transform:
            translate(-50%, calc(-50% + 100vh));

        touch-action: auto;
    }

    .drawer-overlay {
        backdrop-filter: blur(6px);
    }
}；css/forum.css：
/* =========================
   TOPBAR
========================= */

.topbar{
    height:88px;
    background:white;

    display:flex;
    align-items:center;
    justify-content:space-between;

    padding:0 20px;

    position:sticky;
    top:0;

    z-index:100;

    border-bottom:1px solid #eee;
}

.logo{
    width:52px;
    height:52px;

    border-radius:16px;
    background:#ff8b6a;
    color:white;

    display:flex;
    align-items:center;
    justify-content:center;

    font-size:32px;
    font-weight:bold;

    flex-shrink:0;
}

.nav{
    display:flex;
    align-items:center;
    gap:36px;

    font-size:18px;
    font-weight:600;

    white-space:nowrap;
}

.nav span{
    cursor:pointer;
    transition:0.2s;
}

.nav span:hover{
    opacity:0.7;
}

.nav .active{
    color:#ff8b6a;
    font-weight:bold;
}

.user-avatar{
    width:52px;
    height:52px;
    border-radius:50%;
    background:#f6c39c;

    display:flex;
    align-items:center;
    justify-content:center;

    font-size:28px;
}

/* =========================
   LAYOUT
========================= */

.container{
    width:100%;
    max-width:760px;
    margin:0 auto;
    padding:22px;
}

.hot-section{
    background:#fff8ed;
    border-radius:30px;
    padding:22px;
    margin-bottom:24px;
}

.hot-header{
    display:flex;
    justify-content:space-between;
    margin-bottom:18px;
}

.hot-title{
    font-size:20px;
    font-weight:bold;
    color:#ff8b6a;
}

.hot-list{
    display:flex;
    flex-direction:column;
    gap:14px;
}

.hot-item{
    background:white;
    border-radius:22px;
    padding:18px 20px;

    display:flex;
    justify-content:space-between;

    font-size:18px;
    font-weight:600;

    transition:0.2s;
}

.hot-item:hover{
    transform:translateY(-2px);
}

.posts-list{
    display:flex;
    flex-direction:column;
    gap:24px;
}

/* =========================
   POST CARD
========================= */

.post-card{
    background:white;
    border-radius:30px;
    padding:22px;

    box-shadow:0 4px 20px rgba(0,0,0,0.03);

    animation:cardEnter .45s cubic-bezier(.22,1,.36,1);
}

.post-header{
    display:flex;
    gap:14px;
    margin-bottom:18px;
}

.post-avatar{
    width:64px;
    height:64px;

    border-radius:50%;
    background:linear-gradient(135deg,#ffb68f,#ff8b6a);
    color:white;

    display:flex;
    align-items:center;
    justify-content:center;

    font-size:28px;
    font-weight:bold;
}

.author-name{
    font-size:20px;
    font-weight:bold;
}

.post-time{
    color:#aaa;
    margin-top:6px;
    font-size:14px;
}

.post-content{
    font-size:18px;
    line-height:1.7;
    white-space:pre-wrap;
}

.post-image{
    width:100%;
    border-radius:24px;
    margin-top:16px;
}

.post-stats{
    border-top:1px solid #eee;
    padding-top:14px;
    margin-top:18px;

    display:flex;
    gap:28px;
}

.stat-btn{
    display:flex;
    align-items:center;
    gap:6px;

    color:#777;
    cursor:pointer;
    transition:0.2s;
}

.stat-btn:hover{
    transform:scale(1.04);
}

.stat-btn svg{
    width:22px;
    height:22px;
}

/* =========================
   COMMENT SYSTEM
========================= */

.comment{
    display:flex;
    align-items:center;
    gap:12px;
}

/* avatar */
.comment .avatar{
    width:52px;
    height:52px;
    border-radius:50%;
    flex-shrink:0;
}

/* content */
.comment-main{
    flex:1;
    display:flex;
    flex-direction:column;
    gap:6px;
}

/* right */
.comment-right{
    display:flex;
    align-items:center;
    gap:10px;
}

/* =========================
   BUTTONS
========================= */

.action-btn,
.reply-btn,
.like-btn{
    background:none;
    border:none;
    cursor:pointer;

    display:flex;
    align-items:center;
    gap:6px;
}

/* reply */
.reply-btn{
    color:#888;
}

/* =========================
   LIKE SYSTEM (FIXED)
========================= */

.like-btn{
    position:relative;
    color:#999;
}

/* icon base */
.like-icon{
    width:20px;
    height:20px;
    fill:#999;
    transition:fill .2s ease;
}

/* active only changes color (NO TRANSFORM HERE) */
.like-btn.active .like-icon{
    fill:#ff4d4f;
}

/* pop animation layer (NO CONFLICT WITH ACTIVE) */
.like-icon.pop{
    animation: pop .25s ease;
}

@keyframes pop{
    0%{transform:scale(1);}
    50%{transform:scale(1.3);}
    100%{transform:scale(1);}
}

/* ripple */
.like-btn.ripple::after{
    content:"";
    position:absolute;
    inset:-6px;
    border-radius:50%;
    border:2px solid #ff4d4f;

    pointer-events:none;
    animation:ripple .4s ease-out;
    opacity:0;
}

@keyframes ripple{
    0%{transform:scale(0.6);opacity:0.8;}
    100%{transform:scale(1.6);opacity:0;}
}

/* =========================
   MOBILE
========================= */

@media (max-width:768px){

    .topbar{
        height:74px;
        padding:0 14px;
    }

    .nav{
        gap:14px;
        font-size:15px;
    }

    .logo{
        width:44px;
        height:44px;
        font-size:24px;
        border-radius:14px;
    }

    .user-avatar{
        width:44px;
        height:44px;
        font-size:22px;
    }

    .container{
        padding:14px;
    }

    .post-card{
        padding:16px;
        border-radius:22px;
    }

    .post-avatar{
        width:52px;
        height:52px;
        font-size:22px;
    }

    .author-name{
        font-size:17px;
    }

    .post-content{
        font-size:16px;
    }
}

/* =========================
   ANIMATION
========================= */

@keyframes cardEnter{
    from{
        opacity:0;
        transform:translateY(20px) scale(.98);
    }
    to{
        opacity:1;
        transform:translateY(0) scale(1);
    }
}
