export function createStatBtn(type, count, onClick) {

  const div = document.createElement("div");

  div.className = `stat-btn ${type}-btn`;

  const icons = {

    like: `

      <svg viewBox="0 0 24 24" class="icon like-icon">

        <path
          d="M12.1 20.3l-.1.1-.1-.1C7 16 4 13.2 4 9.8 4 7.2 6 5.2 8.6 5.2c1.5 0 2.9.7 3.8 1.9.9-1.2 2.3-1.9 3.8-1.9C18 5.2 20 7.2 20 9.8c0 3.4-3 6.2-7.9 10.5z"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
        />

      </svg>

    `,

    comment: `

      <svg viewBox="0 0 24 24" class="icon">

        <path
          d="M21 12c0 4.4-4 8-9 8-1.1 0-2.1-.2-3.1-.6L3 21l1.7-4.2C3.7 15.5 3 13.8 3 12c0-4.4 4-8 9-8s9 3.6 9 8z"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
        />

      </svg>

    `

  };

  div.innerHTML = `

    ${icons[type]}

    <span class="${
      type === "like"
        ? "like-count-trigger"
        : ""
    }">
      ${count}
    </span>

  `;

  if (onClick) {
    div.addEventListener("click", onClick);
  }

  return div;
}
