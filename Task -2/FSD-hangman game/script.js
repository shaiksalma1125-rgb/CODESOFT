/* script.js */
/* Purpose: Game logic (word selection, scoring, drawing, win/lose) */

// Words list
const words = [
  {word:"APPLE", category:"Fruit"},
  {word:"LION", category:"Animal"},
  {word:"SHIRT", category:"Clothes"},
  {word:"MANGO", category:"Fruit"},
  {word:"TIGER", category:"Animal"}
];

// No repeat words system
let remainingWords = [...words];

let selectedWord="", guessed=[], wrong=0;
let score=0, paused=false;

// High score using localStorage
let highScore = localStorage.getItem("highScore") || 0;

const maxWrong=6;
let winState=false;

// Display high score
document.getElementById("highScore").innerText = "🔥 High Score: " + highScore;

// Canvas setup
const canvas=document.getElementById("canvas");
const ctx=canvas.getContext("2d");

// Initialize game
function init(){
  ctx.clearRect(0,0,220,220);
  winState=false;

  document.getElementById("overlay").style.visibility="hidden";
  document.getElementById("overlay").style.transform="scale(0)";

  // No repeat word selection
  if(remainingWords.length === 0){
    remainingWords = [...words];
  }

  let index = Math.floor(Math.random() * remainingWords.length);
  let obj = remainingWords.splice(index, 1)[0];

  selectedWord = obj.word;

  guessed=[];
  wrong=0;

  document.getElementById("letters").innerHTML="";
  document.getElementById("category").innerText="Category: "+obj.category;

  drawStand();
  createButtons();
  displayWord();
}

// Draw stand
function drawStand(){
  ctx.beginPath();
  ctx.moveTo(10,200); ctx.lineTo(180,200);
  ctx.moveTo(40,200); ctx.lineTo(40,20);
  ctx.lineTo(120,20);
  if(!winState) ctx.lineTo(120,40);
  ctx.stroke();
}

// Draw hangman step by step
function drawMan(stage){
  if(stage>=1){ ctx.beginPath(); ctx.arc(120,60,15,0,Math.PI*2); ctx.stroke(); }
  if(stage>=2){ ctx.beginPath(); ctx.moveTo(120,75); ctx.lineTo(120,130); ctx.stroke(); }
  if(stage>=3){ ctx.beginPath(); ctx.moveTo(120,90); ctx.lineTo(90,110); ctx.stroke(); }
  if(stage>=4){ ctx.beginPath(); ctx.moveTo(120,90); ctx.lineTo(150,110); ctx.stroke(); }
  if(stage>=5){ ctx.beginPath(); ctx.moveTo(120,130); ctx.lineTo(95,170); ctx.stroke(); }
  if(stage>=6){ ctx.beginPath(); ctx.moveTo(120,130); ctx.lineTo(145,170); ctx.stroke(); }
}

// Dancing animation (win)
function drawDance(frame){
  ctx.clearRect(0,0,220,220);

  ctx.beginPath();
  ctx.moveTo(10,200); ctx.lineTo(180,200);
  ctx.moveTo(40,200); ctx.lineTo(40,20);
  ctx.lineTo(120,20);
  ctx.stroke();

  ctx.beginPath(); ctx.arc(120,60,15,0,Math.PI*2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(120,75); ctx.lineTo(120,170); ctx.stroke();

  if(frame%2===0){
    ctx.moveTo(120,95); ctx.lineTo(80,80);
    ctx.moveTo(120,95); ctx.lineTo(160,80);
  } else {
    ctx.moveTo(120,95); ctx.lineTo(90,120);
    ctx.moveTo(120,95); ctx.lineTo(150,120);
  }
  ctx.stroke();
}

// Display word
function displayWord(){
  let display="";
  for(let l of selectedWord){
    display += guessed.includes(l)? l+" " : "_ ";
  }
  document.getElementById("word").innerText=display;

  // Win condition
  if(!display.includes("_")){
    winState=true;

    let frame=0;
    let interval=setInterval(()=>drawDance(frame++),300);

    setTimeout(()=>{
      clearInterval(interval);
      showWin();
    },2000);

    disableAll();
  }
}

// Create letter buttons
function createButtons(){
  const rows=[10,9,7];
  let start=65;

  for(let r of rows){
    let rowDiv=document.createElement("div");
    rowDiv.className="row";

    for(let i=0;i<r;i++){
      let btn=document.createElement("button");
      let letter=String.fromCharCode(start++);
      btn.innerText=letter;

      btn.onclick=function(){
        if(!paused){
          guess(letter);
          btn.disabled=true;
        }
      };

      rowDiv.appendChild(btn);
    }
    document.getElementById("letters").appendChild(rowDiv);
  }
}

// Guess logic
function guess(letter){
  if(selectedWord.includes(letter)){
    if(!guessed.includes(letter)){
      guessed.push(letter);
      score+=2;
      document.getElementById("score").innerText="🏆 Score: "+score;

      // High score update
      if(score > highScore){
        highScore = score;
        localStorage.setItem("highScore", highScore);
        document.getElementById("highScore").innerText="🔥 High Score: "+highScore;
      }
    }
  } else {
    wrong++;
    drawMan(wrong);

    if(wrong===maxWrong){
      showGameOver();
      disableAll();
    }
  }
  displayWord();
}

// Game over
function showGameOver(){
  let overlay=document.getElementById("overlay");
  document.getElementById("overlayText").innerText="GAME OVER 😢";
  document.getElementById("overlayBtn").innerText="🔄 Start Again";
  document.getElementById("overlayBtn").onclick=restartGame;

  overlay.style.visibility="visible";
  setTimeout(()=>overlay.style.transform="scale(1)",50);
}

// Win screen
function showWin(){
  let overlay=document.getElementById("overlay");
  document.getElementById("overlayText").innerText="YOU WON 🎉";
  document.getElementById("overlayBtn").innerText="➡ Next Level";
  document.getElementById("overlayBtn").onclick=restartGame;

  overlay.style.visibility="visible";
  setTimeout(()=>overlay.style.transform="scale(1)",50);
}

// Disable buttons
function disableAll(){
  document.querySelectorAll("#letters button").forEach(b=>b.disabled=true);
}

// Restart
function restartGame(){ init(); }

// Pause
function togglePause(){
  paused=!paused;
}

// Start game
init();