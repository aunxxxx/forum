export function initFAB() {
  const fab = document.getElementById("fab");
  const editor = document.getElementById("editor");

  if (!fab || !editor) return;

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

    // 👉 打开 editor（关键）
    setTimeout(() => {
      editor.classList.add("active");
    }, 300);

    // 清理
    setTimeout(() => {
      circle.remove();
      fab.classList.remove("active");
      locked = false;
    }, 700);
  });
}
