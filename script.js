// =====================
// STAGES & ELEMENTS
// =====================

const gStage = document.getElementById("stage-gallery");
const pStage = document.getElementById("stage-proposal");
const mStage = document.getElementById("stage-magic");

const gallery = document.getElementById("gallery");
const linesBox = document.getElementById("lines");
const song = document.getElementById("song");


// =====================
// BGM – start in gallery only once
// =====================

let musicStarted = false;

function startBGM(){
  if(musicStarted) return;
  musicStarted = true;

  song.loop = true;
  song.volume = 0.0;

  song.play().then(()=>{

    // slow sunrise for the ears
    let v = 0;
    let fade = setInterval(()=>{
      v += 0.04;
      song.volume = Math.min(v, 0.8);

      if(v >= 0.8) clearInterval(fade);
    },120);

  }).catch(()=>{});
}

// touch or click anywhere in gallery wakes the music
gStage.addEventListener("click", startBGM, { once:true });
gStage.addEventListener("touchstart", startBGM, { once:true });


// =====================
// GALLERY PHOTOS
// =====================

const pics = ["1.jpeg","2.jpeg","3.jpeg","4.jpeg","5.jpeg"];

pics.forEach((p,i)=>{

  let img = document.createElement("img");
  img.src = "pics/" + p;

  gallery.appendChild(img);

  setTimeout(()=>{
    img.style.opacity = 1;
    img.style.transform = "translateY(0)";
  }, i * 1400);

});


// =====================
// STORY LINES
// =====================

const lines = [
 "Tumhe paake aur paana kya hai??.",
 "Tumhe paake aur paana kya hai??",
 "M ye duniyaa chhod duu",
 "ye zamana kya haiii????"
];

let i = 0;

setTimeout(nextLine, 8200);

function nextLine(){

  if(i < lines.length){
    type(lines[i]);
    i++;
    setTimeout(nextLine, 2600);
  }
  else{
    toProposal();
  }
}

function type(t){

  linesBox.innerHTML = "";
  let j = 0;

  let k = setInterval(()=>{

    linesBox.innerHTML += t[j];
    j++;

    if(j >= t.length) clearInterval(k);

  },38);
}

function toProposal(){
  gStage.classList.add("hidden");
  pStage.classList.remove("hidden");
}


// =====================
// NO BUTTON – escape artist
// =====================

const no = document.getElementById("no");

function escapeNo(e){

  e.preventDefault();
  e.stopPropagation();

  no.style.position = "absolute";

  const maxX = window.innerWidth * 0.65;
  const maxY = window.innerHeight * 0.55;

  no.style.left = Math.random()*maxX + "px";
  no.style.top  = Math.random()*maxY + "px";
}

no.addEventListener("touchstart", escapeNo, {passive:false});
no.addEventListener("touchmove",  escapeNo, {passive:false});
no.addEventListener("mouseover",  escapeNo);
no.addEventListener("click",      escapeNo);


// =====================
// YES BUTTON
// =====================

document.getElementById("yes").onclick = () => {

  // music already playing from gallery
  pStage.classList.add("hidden");
  mStage.classList.remove("hidden");

  startStars();
  showGift();
};


// =====================
// CANVAS SETUP
// =====================

const starsCanvas = document.getElementById("starsLayer");
const fireCanvas  = document.getElementById("fireLayer");

const sctx = starsCanvas.getContext("2d");
const fctx = fireCanvas.getContext("2d");

function resize(){

  starsCanvas.width  = window.innerWidth;
  starsCanvas.height = window.innerHeight;

  fireCanvas.width   = window.innerWidth;
  fireCanvas.height  = window.innerHeight;
}

resize();
window.addEventListener("resize", resize);
window.addEventListener("orientationchange", ()=>{
  setTimeout(resize,300);
});


// =====================
// STAR BACKGROUND
// =====================

let stars = [];

function startStars(){

  stars = [];

  for(let i=0;i<220;i++){
    stars.push({
      x: Math.random()*starsCanvas.width,
      y: Math.random()*starsCanvas.height,

      tx: Math.random()*starsCanvas.width,
      ty: Math.random()*starsCanvas.height
    });
  }

  animateStars();
}

function animateStars(){

  sctx.clearRect(0,0,starsCanvas.width,starsCanvas.height);

  stars.forEach(p=>{

    p.x += (p.tx - p.x) * 0.03;
    p.y += (p.ty - p.y) * 0.03;

    sctx.beginPath();
    sctx.arc(p.x,p.y,1.6,0,Math.PI*2);

    sctx.fillStyle = "white";
    sctx.fill();

  });

  requestAnimationFrame(animateStars);
}


// =====================
// REAL FIREWORKS
// =====================

class Fire{

  constructor(){
    this.x = Math.random()*fireCanvas.width;
    this.y = fireCanvas.height;

    this.vy = -(6 + Math.random()*3);
    this.exploded = false;
  }

  update(){

    this.y += this.vy;

    fctx.fillStyle = "white";
    fctx.fillRect(this.x,this.y,2,8);

    if(this.y < fireCanvas.height*0.35){
      this.exploded = true;
      burst(this.x,this.y);
    }
  }
}

class Dot{

  constructor(x,y){

    this.x = x;
    this.y = y;

    this.vx = Math.random()*5 - 2.5;
    this.vy = Math.random()*5 - 2.5;

    this.life = 90;
  }

  update(){

    this.x += this.vx;
    this.y += this.vy;

    this.vy += 0.03;
    this.life--;

    fctx.beginPath();
    fctx.arc(this.x,this.y,2,0,Math.PI*2);

    fctx.fillStyle =
      `hsl(${Math.random()*360},100%,60%)`;

    fctx.fill();
  }
}

let fires = [];
let dots  = [];

function burst(x,y){
  for(let i=0;i<70;i++)
    dots.push(new Dot(x,y));
}

function launch(){
  fires.push(new Fire());
}

function loop(){

  fctx.fillStyle = "rgba(0,0,0,0.2)";
  fctx.fillRect(0,0,fireCanvas.width,fireCanvas.height);

  fires.forEach(f=>f.update());
  fires = fires.filter(f=>!f.exploded);

  dots.forEach(d=>d.update());
  dots = dots.filter(d=>d.life>0);

  requestAnimationFrame(loop);
}

loop();


// =====================
// SEQUENCE AFTER YES
// =====================

function showGift(){

  const gift = document.getElementById("gift");
  gift.classList.remove("hidden");

  gift.onclick = ()=>{
    gift.style.display="none";
    revealRing();
  };
}

function revealRing(){

  const ring = document.getElementById("ring");
  ring.classList.remove("hidden");

  setTimeout(()=>{
    ring.style.transform="scale(1)";
  },100);

  setTimeout(()=>{

    document
      .getElementById("nameStars")
      .classList.remove("hidden");

    setTimeout(()=>{
      document.getElementById("nameStars").style.opacity=1;
    },100);

  },1600);

  setTimeout(()=>{
    setInterval(launch,1500);   // calm mobile sky
    showLetter();
  },3200);
}

function showLetter(){
  document
    .getElementById("letter")
    .classList.remove("hidden");
}

