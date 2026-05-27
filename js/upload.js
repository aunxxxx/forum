function initUpload(previewImage) {
 
  const uploadBtn = document.getElementById("uploadBtn");
  const imageInput = document.getElementById("imageInput");
 
  let compressedImage = "";
 
  uploadBtn.onclick = () => {
    imageInput.click();
  };
 
  imageInput.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
 
    const reader = new FileReader();
 
    reader.onload = (event) => {
      const img = new Image();
 
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
 
        canvas.width = img.width;
        canvas.height = img.height;
 
        ctx.drawImage(img, 0, 0);
 
        compressedImage = canvas.toDataURL("image/jpeg", 0.22);
 
        previewImage.src = compressedImage;
        previewImage.style.display = "block";
      };
 
      img.src = event.target.result;
    };
 
    reader.readAsDataURL(file);
  };
 
  return () => compressedImage;
}

window.initUpload = initUpload;
