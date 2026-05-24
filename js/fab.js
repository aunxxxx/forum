export function initFAB() {
  const fab = document.getElementById("fab");
  if (!fab) return;

  let locked = false;

  fab.addEventListener("click", () => {
    if (locked) return;
    locked = true;

    fab.classList.add("active");

    const circle = document.createElement("div");
    circle.className = "fab-circle";
    document.body.appendChild(circle);

    requestAnimationFrame(() => {
      circle.classList.add("expand");
    });

    document.body.style.overflow = "hidden";

    setTimeout(() => {
      window.location.href = "post.html";
    }, 550);

    // 清理 DOM（防止残留）
    setTimeout(() => {
      circle.remove();
    }, 800);
  });
}
