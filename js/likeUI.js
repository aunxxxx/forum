export function updateLikeUI(btn, countEl, newCount) {
 
  // 防闪烁：只改数字，不替换节点
  countEl.textContent = newCount;
 
  // 动画：数字弹一下
  countEl.classList.remove("pop");
  void countEl.offsetWidth; // 强制重绘触发动画
  countEl.classList.add("pop");
 
  // svg按钮动画
  btn.classList.remove("liked");
  void btn.offsetWidth;
  btn.classList.add("liked");
}
