const postsList = document.getElementById("postsList");

/* 当前用户 */

const currentUser = {
  name: "练习生001",
  role: "trainee" // fan / trainee
};

/* 发帖相关 DOM */

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

/* 帖子数据 */

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

/* 渲染帖子 */

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

        <div>
          ❤️ ${post.likes}
        </div>

        <div>
          💬 ${post.comments}
        </div>

      </div>

    `;

    postsList.appendChild(div);

  });

}

/* 打开发帖层 */

publishBtn.onclick = () => {

  editor.classList.add("active");

};

/* 关闭 */

closeEditor.onclick = () => {

  editor.classList.remove("active");

};

/* 上传图片 */

let compressedImage = "";

uploadBtn.onclick = () => {

  imageInput.click();

};

imageInput.onchange = (e) => {

  const file =
    e.target.files[0];

  if (!file) return;

  /* 最大 10MB */

  if (file.size > 10 * 1024 * 1024) {

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

      /* 90年代 JPEG 压缩 */

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

/* 发布帖子 */

submitPost.onclick = () => {

  const text =
    postInput.value.trim();

  /* 空内容禁止 */

  if (!text && !compressedImage) {
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

  editor.classList.remove("active");

};

/* 初始化 */

renderPosts();
