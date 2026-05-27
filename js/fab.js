// fab.js
 
function initFAB() {
 
    const fab = document.getElementById("fab");
    const editor = document.getElementById("editor");
 
    if (!fab || !editor) return;
 
    let locked = false;
 
    fab.addEventListener("click", () => {
 
        if (locked) return;
 
        locked = true;
 
        /* FAB 点击动画 */
        fab.classList.add("active");
 
        /* 创建扩散圆 */
        const circle = document.createElement("div");
        circle.className = "fab-circle";
 
        document.body.appendChild(circle);
 
        requestAnimationFrame(() => {
            circle.classList.add("expand");
        });
 
        /* 防止背景滚动 */
        document.body.style.overflow = "hidden";
 
        /* 打开发帖页 */
        setTimeout(() => {
            editor.classList.add("active");
        }, 280);
 
        /* 动画结束 */
        setTimeout(() => {
 
            circle.remove();
 
            fab.classList.remove("active");
 
            document.body.style.overflow = "";
 
            locked = false;
 
        }, 700);
 
    });
 
}

window.initFAB = initFAB;
