const postsList = document.getElementById("postsList");

const posts = [
  {
    user: "李",
    name: "李四",
    content: "第一位认证用户报到！大家好啊！",
    likes: 10,
    comments: 0,
    time: "刚刚"
  },

  {
    user: "张",
    name: "张三",
    content: "契弟广场终于开了，开心！",
    likes: 2,
    comments: 0,
    time: "刚刚"
  }
];

function renderPosts() {

  postsList.innerHTML = "";

  posts.forEach(post => {

    const div = document.createElement("div");

    div.className = "post-card";

    div.innerHTML = `
      <div class="post-header">

        <div class="post-avatar">
          ${post.user}
        </div>

        <div>
          <div class="author-name">
            ${post.name}
          </div>

          <div class="post-time">
            ${post.time}
          </div>
        </div>

      </div>

      <div class="post-content">
        ${post.content}
      </div>

      <div class="post-stats">
        <div>❤️ ${post.likes}</div>
        <div>💬 ${post.comments}</div>
      </div>
    `;

    postsList.appendChild(div);

  });

}

renderPosts();
