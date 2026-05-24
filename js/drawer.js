export function initDrawer() {

    initCommentDrawer();

    initLikeDrawer();

}

/* =========================
   评论 Drawer
========================= */

function initCommentDrawer(){

    const overlay =
        document.getElementById("commentOverlay");

    const drawer =
        document.getElementById("commentDrawer");

    if(!overlay || !drawer) return;

    document.addEventListener("click",(e)=>{

        const btn =
            e.target.closest(".comment-btn");

        if(!btn) return;

        openDrawer(overlay,drawer);

    });

    overlay.addEventListener("click",(e)=>{

        if(e.target !== overlay) return;

        closeDrawer(overlay,drawer);

    });

    initDrag(drawer,overlay);

}

/* =========================
   点赞 Drawer
========================= */

function initLikeDrawer(){

    const overlay =
        document.getElementById("likeOverlay");

    const drawer =
        document.getElementById("likeDrawer");

    if(!overlay || !drawer) return;

    document.addEventListener("click",(e)=>{

        const btn =
            e.target.closest(".like-count-trigger");

        if(!btn) return;

        openDrawer(overlay,drawer);

    });

    overlay.addEventListener("click",(e)=>{

        if(e.target !== overlay) return;

        closeDrawer(overlay,drawer);

    });

    initDrag(drawer,overlay);

}

/* =========================
   OPEN
========================= */

function openDrawer(overlay,drawer){

    overlay.classList.add("active");

    requestAnimationFrame(()=>{

        drawer.classList.add("active");

        document.body.classList.add("drawer-open");

    });

}

/* =========================
   CLOSE
========================= */

function closeDrawer(overlay,drawer){

    drawer.classList.remove("active");

    document.body.classList.remove("drawer-open");

    setTimeout(()=>{

        overlay.classList.remove("active");

    },300);

}

/* =========================
   DRAG
========================= */

function initDrag(drawer,overlay){

    if(window.innerWidth >= 769) return;

    let startY = 0;

    let currentY = 0;

    let dragging = false;

    drawer.addEventListener("touchstart",(e)=>{

        dragging = true;

        startY =
            e.touches[0].clientY;

        drawer.style.transition = "none";

    });

    drawer.addEventListener("touchmove",(e)=>{

        if(!dragging) return;

        currentY =
            e.touches[0].clientY;

        let delta =
            currentY - startY;

        if(delta > 0){

            delta *= .35;

            drawer.style.transform =
                `translateY(${delta}px)`;

            const scale =
                0.94 + (delta / 3000);

            document.querySelector(".app").style.transform =
                `scale(${scale})`;

        }

    });

    drawer.addEventListener("touchend",()=>{

        dragging = false;

        drawer.style.transition =
            "transform .38s cubic-bezier(.22,1,.36,1)";

        const moved =
            currentY - startY;

        if(moved > 140){

            closeDrawer(overlay,drawer);

            document.querySelector(".app").style.transform = "";

        }else{

            drawer.style.transform =
                "translateY(0)";

            document.querySelector(".app").style.transform =
                "scale(.94)";
        }

    });

}
