let currentLevel = 1;
let energy=100;
let xp=0;
let overclockActive=false;

const energyBar= document.getElementById("energy-bar");
const xpBar = document.getElementById("xp-bar");

function updateEnergy(){
    energyBar.style.width= energy +"%";
}
function checkLevelUp(newLevel) {
  if (newLevel > currentLevel) {
    currentLevel = newLevel;

    const xpCard = document.querySelector(".xp-card");
    xpCard.classList.add("level-up");
    setTimeout(() => xpCard.classList.remove("level-up"), 600);

    showLevelBanner();
  }
}

 function showLevelBanner(){
    const banner =document.createElement("div");
    banner.classList.add("level-banner");
    banner.textContent="LEVEL UP";
    document.body.appendChild(banner);

    setTimeout(()=> banner.remove(), 1000);
 }
setInterval(()=> {
    if( !overclockActive){
        energy -=1;
    } else{
        energy-=0.5; //slower drain when boosted
    }
    if (energy === 0) {
  xp -= 5;
  if (xp < 0) xp = 0;
}
    if(energy<0)energy = 0;

    updateEnergy();
    updateSystemStatus(energy);
}, 1000);

document.getElementById("caffeine-btn").addEventListener("click", () => {

  if (overclockActive) return;

  overclockActive = true;
  energy = Math.min(100, energy + 20);
  updateEnergy();

  setTimeout(() => {
    overclockActive = false;
  }, 10000); // 10 second boost
});
//update XP
function addXP(amount) {
    if(energy<30){
        amount*=0.5;
    }
    xp+= amount;

    const xpCard= document.querySelector(".xp-card");
    xpCard.classList.add("xp-flash");
    setTimeout(() => xpCard.classList.remove("xp-flash"), 400);
    showFloatingXP(amount);

    document.getElementById("xp").textContent=Math.floor(xp);

    let level=Math.floor(xp/100) + 1;
    document.getElementById("level").textContent=level;
    xpBar.style.width = (xp % 100) + "%";
    checkLevelUp(level);
}
document.getElementById("nap-btn").addEventListener("click", ()=> {
    energy = Math.min(100, energy + 40);
    updateEnergy();
});
//Task System
document.getElementById("add-task").addEventListener("click", () => {
  const input = document.getElementById("task-input");
  const taskText = input.value.trim();

  if (!taskText) return;

  createMission(taskText, false);
  input.value = "";
  saveMissions();
});

    document.getElementById("task-list").appendChild(li);
    input.value="";


document.getElementById("nap-btn").addEventListener("click", function(){
    energy=Math.min(100, energy + 20);
    energyBar.style.width = energy +"%";
    addXP(5);
});

function updateSystemStatus(power){
    const status= document.getElementById("systemStatus");

    if(power>60) {
        status.textContent="SYSTEM STATUS: STABLE";
        status.style.color="#00ffcc";
    }
    else if(power>30){
        status.textContent="SYSTEM STATUS: FLUCTUATING";
        status.style.color="#ffaa00"; 
    }
    else{
        status.textContent="WARNING: CORE INSTABILITY";
        status.style.color="#ff3366";
    }
}

if (power <= 30) {
  status.classList.add("warning-pulse");
} else {
  status.classList.remove("warning-pulse");
}
function showFloatingXP(amount) {
  const xpCard = document.querySelector(".xp-card");

  const float = document.createElement("div");
  float.classList.add("floating-xp");
  float.textContent = "+" + Math.floor(amount) + " XP";

  xpCard.appendChild(float);

  setTimeout(() => float.remove(), 1000);
}

function updateSystemStatus(energy){
    const energyCard = document.querySelector(".energy-card");
    const status = document.getElementById("system-status");

    energyCard.classList.remove("warning", "critical");

    if(energy <=50 && energy>20){
        status.textContent="CRITICAL INSTABILITY";
        energyCard.classList.add("critical");
    }

    else if( energy===0){
        status.textContent="SYSTEM FAILURE";
        energyCard.classList.add("critical");
    }
    else{
        status.textContent="System Stable";
    }
}
function saveMissions(){
    const missions = [];
    document.querySelectorAll("#mission-list li").forEach(li => {
        missions.push({
            text: li.textContent,
            completed: li.classList.contains("completed")
        });
    });
    localStorage.setItem("missions", JSON.stringify(missions));
}

function loadMissions(){
    const missions = JSON.parse(localStorage.getItem("missions") || "[]");

    SVGAnimatedEnumeration.forEach(mission => {
        createMission(mission.text, mission.completed);
    });
}
function createMission(text, completed){
    const li= document.createElement("li");
    li.textContent=text;

    if(completed){
        li.classList.add("completed");
        li.style.textDecoration="line-through";
    }

    li.addEventListener("click", () => {
        li.classList.toggle("completed");
        if(li.classList.contains("completed")){
            li.style.textDecoration="line-through";
            addXP(10);
        } else{
            li.style.textDecoration="none"; }
        saveMissions();
    });

    document.getElementById("mission-list").appendChild(li);

}

loadMissions();