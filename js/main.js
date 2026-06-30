/* ============================================
   PROJECT CATALYST
   Sprint 2
   Devendhar Bachhu Portfolio
============================================ */

/* -----------------------------
   HERO WORD ROTATOR
------------------------------ */

const words = [
    "HELLO",
    "WORLD",
    "TEST"
];

const heroTag = document.querySelector(".hero-tag");

let currentWord = 0;

function changeWord() {

    if (!heroTag) return;

    heroTag.style.opacity = 0;
    heroTag.style.transform = "translateY(15px)";

    setTimeout(() => {

        heroTag.textContent = words[currentWord];

        heroTag.style.opacity = 1;
        heroTag.style.transform = "translateY(0px)";

        currentWord++;

        if (currentWord >= words.length) {

            currentWord = 0;

        }

    }, 300);

}

if(heroTag){

    heroTag.style.transition =
        "all .45s ease";

    setInterval(changeWord,2000);

}

/* -----------------------------
   SMOOTH SCROLL
------------------------------ */

document
.querySelectorAll('a[href^="#"]')
.forEach(anchor=>{

    anchor.addEventListener("click",function(e){

        e.preventDefault();

        const target=document.querySelector(
            this.getAttribute("href")
        );

        if(target){

            target.scrollIntoView({

                behavior:"smooth"

            });

        }

    });

});

/* -----------------------------
   NAVBAR ON SCROLL
------------------------------ */

const navbar=document.querySelector(".navbar");

window.addEventListener("scroll",()=>{

    if(window.scrollY>60){

        navbar.style.padding="14px 28px";

        navbar.style.background=
        "rgba(7,17,31,.82)";

        navbar.style.backdropFilter="blur(25px)";

        navbar.style.boxShadow=
        "0 10px 40px rgba(0,0,0,.35)";

    }

    else{

        navbar.style.padding="18px 30px";

        navbar.style.background=
        "rgba(255,255,255,.08)";

        navbar.style.boxShadow="none";

    }

});

/* -----------------------------
   BUTTON HOVER
------------------------------ */

document
.querySelectorAll(".primary-btn,.secondary-btn")
.forEach(btn=>{

    btn.addEventListener("mouseenter",()=>{

        btn.style.transform="translateY(-6px)";

    });

    btn.addEventListener("mouseleave",()=>{

        btn.style.transform="translateY(0px)";

    });

});

/* -----------------------------
   SCROLL REVEAL
------------------------------ */

const reveals=document.querySelectorAll(
".placeholder"
);

const observer=new IntersectionObserver(

(entries)=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.style.opacity="1";

entry.target.style.transform="translateY(0)";

}

});

},

{

threshold:.15

}

);

reveals.forEach(section=>{

section.style.opacity="0";

section.style.transform="translateY(60px)";

section.style.transition="all .8s ease";

observer.observe(section);

});
