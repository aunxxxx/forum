export function createStatBtn(type, count, onClick) {
  const div = document.createElement("div");
  div.className =
    `stat-btn ${type}-btn`;

  const icons = {
    like: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 21s-6.7-4.35-9.33-8.28C.6 9.57 2.18 5 6.4 5c2.04 0 3.18 1.17 3.9 2.2C11.02 6.17 12.16 5 14.2 5c4.22 0 5.8 4.57 3.73 7.72C18.7 16.65 12 21 12 21z"/>
      </svg>
    `,
    comment: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    `
  };

  div.innerHTML = `
    ${icons[type]}
   <span class="
    ${type === "like"
        ? "like-count-trigger"
        : ""
    }
">
    ${count}
</span>
  `;

  /* 点击事件统一在组件层绑定 */
  if (onClick) {
    div.addEventListener("click", onClick);
  }

  return div;
}
