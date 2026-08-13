/* =========================================================
   SUBASHTI — 5 MINUTE MAGICAL BIRTHDAY EXPERIENCE
   Vanilla JavaScript: no libraries, works on GitHub Pages.
   ========================================================= */
(() => {
  "use strict";

  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];

  const loader = $("#loader");
  const welcome = $("#welcome");
  const experience = $("#experience");
  const startBtn = $("#startBtn");
  const music = $("#bgMusic");
  const musicBtn = $("#musicBtn");
  const progressBar = $("#progressBar");
  const sceneLabel = $("#sceneLabel");
  const canvas = $("#fxCanvas");
  const ctx = canvas.getContext("2d");
  const gift = $("#gift");
  const giftBtn = $("#giftBtn");
  const giftMessage = $("#giftMessage");
  const wishBtn = $("#wishBtn");
  const wishResult = $("#wishResult");
  const celebrateBtn = $("#celebrateBtn");
  const finalMessage = $("#finalMessage");
  const replayBtn = $("#replayBtn");
  const typeText = $("#typeText");

  const chapterNames = [
    "CHAPTER 1 · A SPECIAL DAY",
    "CHAPTER 2 · A LITTLE GIFT",
    "CHAPTER 3 · MEMORIES",
    "CHAPTER 4 · MAKE A WISH",
    "CHAPTER 5 · A LETTER FOR YOU",
    "CHAPTER 6 · THE GRAND FINALE"
  ];

  let started = false;
  let finalRunning = false;
  let timers = [];
  let particles = [];

  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = innerWidth * dpr;
    canvas.height = innerHeight * dpr;
    canvas.style.width = innerWidth + "px";
    canvas.style.height = innerHeight + "px";
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  addEventListener("resize", resize);
  resize();

  addEventListener("load", () => {
    setTimeout(() => {
      loader.style.opacity = "0";
      setTimeout(() => loader.remove(), 900);
    }, 900);
  });

  function safePlay() {
    music.play().then(() => {
      musicBtn.textContent = "🔊";
    }).catch(() => {
      musicBtn.textContent = "🔈";
    });
  }

  musicBtn.addEventListener("click", () => {
    if (music.paused) {
      safePlay();
    } else {
      music.pause();
      musicBtn.textContent = "🔈";
    }
  });

  startBtn.addEventListener("click", () => {
    if (started) return;
    started = true;
    welcome.classList.remove("active");
    welcome.style.opacity = "0";
    setTimeout(() => {
      welcome.remove();
      experience.hidden = false;
      safePlay();
      startAmbientMagic();
      typeWriter();
      startFiveMinuteTimeline();
      scrollToChapter(0);
    }, 700);
  });

  function typeWriter() {
    const text = "May your day sparkle with laughter, your heart stay light, and every dream you carry find its way to you. This little universe is yours tonight. ✨";
    let i = 0;
    typeText.textContent = "";
    const id = setInterval(() => {
      typeText.textContent += text[i++];
      if (i >= text.length) clearInterval(id);
    }, 38);
    timers.push(id);
  }

  function startFiveMinuteTimeline() {
    /* The experience is designed to unfold for ~5 minutes.
       User can always click buttons or scroll; nothing is locked. */
    const sequence = [
      [45000,1],[95000,2],[150000,3],[215000,4],[260000,5],[300000,6]
    ];
    sequence.forEach(([ms, index]) => {
      timers.push(setTimeout(() => scrollToChapter(index), ms));
    });
  }

  function scrollToChapter(index) {
    const chapters = $$(".chapter");
    if (!chapters[index]) return;
    chapters[index].scrollIntoView({behavior:"smooth", block:"center"});
    sceneLabel.textContent = chapterNames[index] || "";
  }

  $$(".next-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const current = btn.closest(".chapter");
      const chapters = $$(".chapter");
      const i = chapters.indexOf(current);
      scrollToChapter(i + 1);
    });
  });

  giftBtn.addEventListener("click", () => {
    gift.classList.add("open");
    giftMessage.classList.remove("hidden-message");
    giftBtn.textContent = "Gift Opened 🤍";
    giftBtn.disabled = true;
    burst(innerWidth/2, innerHeight/2, 80, ["💖","✨","🤍","🌸"]);
    firework(innerWidth/2, innerHeight*.42, 90);
  });

  wishBtn.addEventListener("click", () => {
    wishResult.textContent = "✨ Wish released into the stars. May it come true. ✨";
    burst(innerWidth/2, innerHeight/2, 100, ["✨","🌟","💫","🤍"]);
    wishBtn.textContent = "Wish Made ✨";
    wishBtn.disabled = true;
  });

  celebrateBtn.addEventListener("click", grandFinale);

  replayBtn.addEventListener("click", () => {
    location.reload();
  });

  function startAmbientMagic() {
    for (let i=0;i<35;i++) {
      const p = document.createElement("div");
      p.className = "particle";
      p.textContent = ["✦","·","♡","✧"][Math.floor(Math.random()*4)];
      p.style.left = Math.random()*100+"vw";
      p.style.top = Math.random()*100+"vh";
      p.style.fontSize = (8+Math.random()*16)+"px";
      p.style.opacity = .15 + Math.random()*.45;
      p.style.color = ["#fff","#ffe7a3","#ff9fd7","#aaa3ff"][Math.floor(Math.random()*4)];
      p.animate(
        [{transform:"translateY(0) rotate(0deg)"},{transform:`translateY(${-30-Math.random()*60}px) rotate(180deg)`}],
        {duration:3000+Math.random()*5000,iterations:Infinity,direction:"alternate",easing:"ease-in-out"}
      );
      document.body.appendChild(p);
    }
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const index = $$(".chapter").indexOf(entry.target);
      if (index >= 0) sceneLabel.textContent = chapterNames[index];
      progressBar.style.width = ((index / 5) * 100) + "%";
      entry.target.animate(
        [{opacity:.2, transform:"translateY(30px)"},{opacity:1, transform:"translateY(0)"}],
        {duration:900,easing:"cubic-bezier(.2,.8,.2,1)",fill:"both"}
      );
    });
  }, {threshold:.55});
  $$(".chapter").forEach(ch => observer.observe(ch));

  function burst(x,y,count,chars) {
    for(let i=0;i<count;i++) {
      const el = document.createElement("div");
      el.className = "particle heart-p";
      el.textContent = chars[Math.floor(Math.random()*chars.length)];
      el.style.left = x+"px";
      el.style.top = y+"px";
      el.style.fontSize = (12+Math.random()*22)+"px";
      document.body.appendChild(el);
      const angle = Math.random()*Math.PI*2;
      const distance = 70+Math.random()*360;
      const dx = Math.cos(angle)*distance;
      const dy = Math.sin(angle)*distance;
      const anim = el.animate(
        [{transform:"translate(-50%,-50%) scale(.4)",opacity:1},
         {transform:`translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px)) scale(1.2)`,opacity:0}],
        {duration:1200+Math.random()*1000,easing:"cubic-bezier(.1,.8,.2,1)"}
      );
      anim.finished.finally(()=>el.remove());
    }
  }

  function firework(x,y,count=90) {
    const palette = ["#fff","#ffe66d","#ff7ecb","#9c8cff","#7df9ff"];
    for(let i=0;i<count;i++) {
      const el = document.createElement("div");
      el.className = "particle firework-p";
      el.style.left=x+"px"; el.style.top=y+"px";
      el.style.color=palette[Math.floor(Math.random()*palette.length)];
      document.body.appendChild(el);
      const angle = Math.random()*Math.PI*2;
      const speed = 70+Math.random()*280;
      const dx = Math.cos(angle)*speed;
      const dy = Math.sin(angle)*speed;
      const anim = el.animate(
        [{transform:"translate(-50%,-50%) scale(1)",opacity:1},
         {transform:`translate(${dx}px,${dy}px) scale(0)`,opacity:0}],
        {duration:1000+Math.random()*900,easing:"cubic-bezier(.15,.7,.25,1)"}
      );
      anim.finished.finally(()=>el.remove());
    }
  }

  function confetti(count=180) {
    const chars = ["✦","•","♦","♥"];
    for(let i=0;i<count;i++) {
      const el=document.createElement("div");
      el.className="particle confetti-p";
      el.textContent=chars[Math.floor(Math.random()*chars.length)];
      el.style.left=Math.random()*100+"vw";
      el.style.top="-20px";
      el.style.fontSize=(8+Math.random()*15)+"px";
      el.style.color=["#ffe66d","#ff83c8","#9c8cff","#fff","#7df9ff"][Math.floor(Math.random()*5)];
      document.body.appendChild(el);
      const dx=(Math.random()-.5)*300;
      const dy=innerHeight+80;
      const anim=el.animate(
        [{transform:"translateY(0) rotate(0deg)",opacity:1},
         {transform:`translate(${dx}px,${dy}px) rotate(${Math.random()*1440}deg)`,opacity:.9}],
        {duration:2500+Math.random()*3000,easing:"linear"}
      );
      anim.finished.finally(()=>el.remove());
    }
  }

  function heartRain(duration=15000) {
    const end=Date.now()+duration;
    const id=setInterval(()=>{
      if(Date.now()>end){clearInterval(id);return;}
      const x=Math.random()*innerWidth;
      const y=innerHeight+30;
      const el=document.createElement("div");
      el.className="particle heart-p";
      el.textContent=["❤️","🤍","💗","💖"][Math.floor(Math.random()*4)];
      el.style.left=x+"px"; el.style.top=y+"px";
      document.body.appendChild(el);
      const dx=(Math.random()-.5)*120;
      const anim=el.animate(
        [{transform:"translate(-50%,0) rotate(0)",opacity:0},
         {transform:`translate(calc(-50% + ${dx}px),-${innerHeight+120}px) rotate(360deg)`,opacity:1}],
        {duration:5000+Math.random()*4000,easing:"linear"}
      );
      anim.finished.finally(()=>el.remove());
    },260);
    timers.push(id);
  }

  function grandFinale() {
    if(finalRunning) return;
    finalRunning=true;
    celebrateBtn.disabled=true;
    celebrateBtn.textContent="THE MAGIC IS HERE ✨";
    finalMessage.hidden=false;
    document.body.style.background="#02020b";

    const end=Date.now()+30000;
    const id=setInterval(()=>{
      if(Date.now()>end){clearInterval(id);return;}
      firework(80+Math.random()*(innerWidth-160),80+Math.random()*(innerHeight*.55),70+Math.floor(Math.random()*60));
    },650);
    timers.push(id);

    confetti(280);
    heartRain(22000);

    for(let i=0;i<9;i++){
      setTimeout(()=>firework(Math.random()*innerWidth,100+Math.random()*innerHeight*.5,110),i*700);
    }
    setTimeout(()=>confetti(160),5000);
    setTimeout(()=>confetti(160),11000);
    setTimeout(()=>burst(innerWidth/2,innerHeight/2,160,["🤍","💖","✨","🌸","🦋"]),7000);
    setTimeout(()=>burst(innerWidth/2,innerHeight/2,160,["🎉","🎊","💫","❤️","⭐"]),15000);
  }
})();

/* =========================================================
   SUBASHTI BIRTHDAY COUNTDOWN
   Birthday: 21 January 2027
   Time: 12:00 AM IST
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const countdownScreen = document.getElementById("countdownScreen");
    const daysElement = document.getElementById("days");
    const hoursElement = document.getElementById("hours");
    const minutesElement = document.getElementById("minutes");
    const secondsElement = document.getElementById("seconds");
    const lockedMessage = document.getElementById("countdownLocked");

    /* ---------------------------------------------------------
       BIRTHDAY TIME

       21 January 2027
       12:00:00 AM
       Indian Standard Time

       IST = UTC + 5:30

       Therefore:
       2027-01-20T18:30:00Z
       --------------------------------------------------------- */

    const birthdayTime =
        new Date("2027-01-20T18:30:00Z").getTime();


    function updateCountdown() {

        /* Current real-world time */

        const now =
            Date.now();


        /* Time remaining */

        const difference =
            birthdayTime - now;


        /* -----------------------------------------------------
           BIRTHDAY HAS ARRIVED
           ----------------------------------------------------- */

        if (difference <= 0) {

            daysElement.textContent = "00";
            hoursElement.textContent = "00";
            minutesElement.textContent = "00";
            secondsElement.textContent = "00";

            if (lockedMessage) {
                lockedMessage.innerHTML =
                    "🎉 THE WAIT IS OVER! 🎉";
            }

            unlockBirthday();

            return;
        }


        /* -----------------------------------------------------
           CALCULATE DAYS
           ----------------------------------------------------- */

        const days =
            Math.floor(
                difference /
                (1000 * 60 * 60 * 24)
            );


        /* -----------------------------------------------------
           CALCULATE HOURS
           ----------------------------------------------------- */

        const hours =
            Math.floor(
                (difference /
                (1000 * 60 * 60)) % 24
            );


        /* -----------------------------------------------------
           CALCULATE MINUTES
           ----------------------------------------------------- */

        const minutes =
            Math.floor(
                (difference /
                (1000 * 60)) % 60
            );


        /* -----------------------------------------------------
           CALCULATE SECONDS
           ----------------------------------------------------- */

        const seconds =
            Math.floor(
                (difference / 1000) % 60
            );


        /* -----------------------------------------------------
           DISPLAY COUNTDOWN
           ----------------------------------------------------- */

        daysElement.textContent =
            String(days).padStart(2, "0");

        hoursElement.textContent =
            String(hours).padStart(2, "0");

        minutesElement.textContent =
            String(minutes).padStart(2, "0");

        secondsElement.textContent =
            String(seconds).padStart(2, "0");


        /* Small animation every second */

        secondsElement.style.transform =
            "scale(1.08)";

        setTimeout(function () {

            secondsElement.style.transform =
                "scale(1)";

        }, 150);
    }


    /* ---------------------------------------------------------
       UNLOCK BIRTHDAY
       --------------------------------------------------------- */

    let birthdayUnlocked = false;


    function unlockBirthday() {

        if (birthdayUnlocked) {
            return;
        }

        birthdayUnlocked = true;


        /* Celebration message */

        if (lockedMessage) {

            lockedMessage.innerHTML =
                "🎉 HAPPY BIRTHDAY SUBASHTI! 🎉";

        }


        /* Add celebration class */

        if (countdownScreen) {

            countdownScreen.classList.add(
                "countdown-ready"
            );

        }


        /*
           Give the visitor 4 seconds to see
           the birthday message.
        */

        setTimeout(function () {

            if (countdownScreen) {

                countdownScreen.classList.add(
                    "countdown-hidden"
                );

            }

            /*
               Tell the rest of your birthday
               website that it is unlocked.
            */

            document.body.classList.add(
                "birthday-unlocked"
            );


            /*
               If your existing birthday page
               has a welcome section, make sure
               it is visible.
            */

            const welcome =
                document.querySelector(".welcome");

            if (welcome) {
                welcome.style.display = "";
            }

        }, 4000);
    }


    /* ---------------------------------------------------------
       START COUNTDOWN IMMEDIATELY
       --------------------------------------------------------- */

    updateCountdown();


    /* ---------------------------------------------------------
       UPDATE EVERY SECOND
       --------------------------------------------------------- */

    setInterval(
        updateCountdown,
        1000
    );

}); 