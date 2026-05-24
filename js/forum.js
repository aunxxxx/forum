const postsList =
  document.getElementById("postsList");

/* 当前用户 */

const currentUser = {
  name: "练习生001",
  role: "trainee"
};

/* editor DOM */

const editor =
  document.getElementById("editor");

const publishBtn =
  document.querySelector(".publish-btn");

const closeEditor =
  document.getElementById("closeEditor");

const submitPost =
  document.getElementById("submitPost");

const postInput =
  document.getElementById("postInput");

const uploadBtn =
  document.getElementById("uploadBtn");

const imageInput =
  document.getElementById("imageInput");

const previewImage =
  document.getElementById("previewImage");

/* 帖子 */

const posts = [

  {
    user: "李",

    name: "李四",

    content:
      "第一位认证用户报到！大家好啊！",

    image: "",

    likes: 10,

    comments: 0,

    time: "刚刚"
  },

  {
    user: "张",

    name: "张三",

    content:
      "契弟广场终于开了，开心！",

    image: "",

    likes: 2,

    comments: 0,

    time: "刚刚"
  }

];

/* trainee 才能发帖 */

if (currentUser.role !== "trainee") {
  publishBtn.style.display = "none";
}

/* 渲染 */

function renderPosts() {

  postsList.innerHTML = "";

  posts.forEach((post) => {

    const div =
      document.createElement("div");

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

      ${post.image ? `

        <img
          src="${post.image}"
          class="post-image"
        />

      ` : ""}

      <div class="post-stats">

        <!-- 点赞 -->

        <div class="stat-btn">

          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="
              M12 21s-6.7-4.35-9.33-8.28
              C.6 9.57 2.18 5 6.4 5
              c2.04 0 3.18 1.17 3.9 2.2
              C11.02 6.17 12.16 5 14.2 5
              c4.22 0 5.8 4.57 3.73 7.72
              C18.7 16.65 12 21 12 21z
            "/>
          </svg>

          <span>${post.likes}</span>

        </div>

        <!-- 评论 -->

        <div class="stat-btn">

          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="
              M21 15a2 2 0 0 1-2 2H7l-4 4V5
              a2 2 0 0 1 2-2h14
              a2 2 0 0 1 2 2z
            "/>
          </svg>

          <span>${post.comments}</span>

        </div>

      </div>

    `;

    postsList.appendChild(div);

  });

}

/* 打开发帖页 */

publishBtn.onclick = () => {

  editor.classList.add("active");

};

/* 关闭动画 */

closeEditor.onclick = () => {

  editor.classList.add("closing");

  setTimeout(() => {

    editor.classList.remove(
      "active"
    );

    editor.classList.remove(
      "closing"
    );

  }, 500);

};

/* 图片上传 */

let compressedImage = "";

uploadBtn.onclick = () => {

  imageInput.click();

};

imageInput.onchange = (e) => {

  const file =
    e.target.files[0];

  if (!file) return;

  if (
    file.size >
    10 * 1024 * 1024
  ) {

    alert("图片不能超过10MB");

    return;

  }

  const reader =
    new FileReader();

  reader.onload = (event) => {

    const img = new Image();

    img.onload = () => {

      const canvas =
        document.createElement("canvas");

      const ctx =
        canvas.getContext("2d");

      /* 保持原尺寸 */

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);

      /* 90年代 JPEG */

      compressedImage =
        canvas.toDataURL(
          "image/jpeg",
          0.22
        );

      previewImage.src =
        compressedImage;

      previewImage.style.display =
        "block";

    };

    img.src =
      event.target.result;

  };

  reader.readAsDataURL(file);

};

/* 发布 */

submitPost.onclick = () => {

  const text =
    postInput.value.trim();

  if (!text && !compressedImage) {
    return;
  }

  if (text.length > 1000) {

    alert("最多1000字");

    return;

  }

  posts.unshift({

    user:
      currentUser.name[0],

    name:
      currentUser.name,

    content:
      text,

    image:
      compressedImage,

    likes: 0,

    comments: 0,

    time: "刚刚"

  });

  renderPosts();

  /* 重置 */

  postInput.value = "";

  compressedImage = "";

  previewImage.src = "";

  previewImage.style.display =
    "none";

  /* 关闭动画 */

  editor.classList.add("closing");

  setTimeout(() => {

    editor.classList.remove(
      "active"
    );

    editor.classList.remove(
      "closing"
    );

  }, 500);

};

/* 初始化 */

renderPosts();
