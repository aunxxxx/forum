export function initFAB() {
  const fab = document.getElementById("fab");

  fab.addEventListener("click", () => {
    /* 1️⃣ 点击反馈 */
    fab.classList.add("active");

    /* 2️⃣ 创建扩散圆 */
    const circle = document.createElement("div");
    circle.className = "fab-circle";

    document.body.appendChild(circle);

    /* 3️⃣ 下一帧触发动画（关键） */
    requestAnimationFrame(() => {
      circle.classList.add("expand");
    });

    /* 4️⃣ 锁定滚动（防抖动） */
    document.body.style.overflow = "hidden";

    /* 5️⃣ 跳转 */
    setTimeout(() => {
      window.location.href = "post.html";
    }, 550);
  });
}
