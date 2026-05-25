export function initUserUI() {

    /* =========================
       1. 头像 → 自动链接用户页
    ========================= */
    document.querySelectorAll("img.avatar").forEach(img => {

        // 已经包过就跳过
        if (img.closest("a.avatar-wrap")) return;

        const userId = img.dataset.userId || "temp";

        const a = document.createElement("a");
        a.className = "avatar-wrap";
        a.href = `/user.html?id=${userId}`;

        img.parentNode.insertBefore(a, img);
        a.appendChild(img);
    });

    /* =========================
       2. badge 系统预留钩子
       （以后做颜色/等级用）
    ========================= */
    document.querySelectorAll(".badge").forEach(badge => {
        badge.dataset.ready = "true";
    });
}
