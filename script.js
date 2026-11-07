const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const restartButton = document.getElementById("restartButton");
const startButton = document.getElementById("startButton");

const dogImage1 = new Image();
dogImage1.src = "images/menchi_left_walk1.png";

const dogImage2 = new Image();
dogImage2.src = "images/menchi_left_walk2.png";

///画像を切り替えるまでの時間
let dogAnimationTimer = 0;
//現在どちらの画像を使うか
let dogAnimationFrame = 0;

let playerX = 100;
let playerY = 100;
let keys = {};

let dogX = 200;
let dogY = 200;

//メンチ君の移動方向
let dogDirection = 0;

//歩行時間の計測と歩行する時間
let dogTimer = 0;
let dogPeriod = 120; //メンチ君の移動方向を変える周期（フレーム数）

//休憩時間の計測と休憩時間
let dogRestTimer = 0;
let dogRestPeriod = 120;

let dogState = "walk";

let willPoop = true;
let poops = [];
let hasPooped = false;

//ウンチ君とプレイヤーの距離
let distance;

let dirtiness = 0;

let isGameOver = false;
let elapsedTime = 0;

let animationId;
let isGameStarted = false;


//プレイヤーの描画処理
function drawPlayer(){
    ctx.fillStyle = "blue";
    ctx.fillRect(playerX, playerY, 50, 50);
}

//めんちくんの描画処理
function drawDog(){
    let currentDogImage;

    if(dogAnimationFrame === 0){
        currentDogImage = dogImage1;
    }else {
        currentDogImage = dogImage2;
    }

    if(currentDogImage.complete && currentDogImage.naturalWidth > 0){
        ctx.drawImage(currentDogImage, dogX, dogY, 50, 50);
    }
}


document.addEventListener("keydown", function(event){
    keys[event.key] = true;
});

document.addEventListener("keyup", function(event){
    keys[event.key] = false;
    if(event.key === " "){
        poops.forEach(function(poop, index){
            if(isNearPoop(poop)){
                poop.cleanCount ++;
            }
            if(poop.cleanCount >= 3){
                poops.splice(index, 1)
            }
        })
    }
});

//リスタートボタンの処理
restartButton.addEventListener("click", function(){
    restartGame();
})

///スタートボタンの処理
startButton.addEventListener("click", function(){
    isGameStarted = true;
    startButton.style.display = "none";
    animationId = requestAnimationFrame(gameLoop);
})

//うんちくんの描画処理
function drawPoops(){
    poops.forEach(function(poop){
        ctx.beginPath();
        ctx.arc(poop.x + 25, poop.y + 25, 10, 0, Math.PI*2);
        ctx.fillStyle = "brown";
        ctx.fill();
    })
}

//汚れゲージの描画処理
function drawDirtiness(){
    ctx.fillStyle = "gray";
    ctx.fillRect(20, 20, 200, 15);
    ctx.fillStyle = "brown";
    ctx.fillRect(20, 20, 200*dirtiness/100, 15);
}

function drawGameOver(){
    ctx.fillStyle = "red";
    ctx.font = "50px sans-serif"
    ctx.fillText("GAME OVER", 190, 200);
}

function drawElapsedTime(){
    ctx.fillStyle = "black";
    ctx.font = "30px sans-serif";
    ctx.fillText("経過時間：" + Math.floor(elapsedTime) + "秒", 350, 35);
}

function drawResult(){
    ctx.fillStyle = "orange";
    ctx.font = "40px sans-serif";
    ctx.fillText("生存時間：" + Math.floor(elapsedTime) + "秒", 190, 300);
}

//プレイヤーの座標更新
function updatePlayer(){
    if(keys["ArrowRight"]){
        playerX += 2;
    }
    if(keys["ArrowLeft"]){
        playerX -= 2;
    }
    if(keys["ArrowDown"]){
        playerY += 2;
    }
    if(keys["ArrowUp"]){
        playerY -= 2;
    }

    playerX = Math.max(0, Math.min(playerX, canvas.width - 50));
    playerY = Math.max(0, Math.min(playerY, canvas.height - 50));
}

//メンチ君の座標更新
function updateDog(){
    if(dogState === "walk"){
        if(dogDirection === 0){
        dogX += 4;
        }
        if(dogDirection === 1){
            dogX -= 4;
        }
        if(dogDirection === 2){
            dogY -= 4;
        }
        if(dogDirection === 3){
            dogY += 4;
        }
   

        if(dogX  >= canvas.width - 50 && dogDirection === 0){
            dogDirection = Math.floor(Math.random() * 4);
            dogX = canvas.width - 50;
        }
        if(dogX <= 0 && dogDirection === 1){
            dogDirection = Math.floor(Math.random() * 4);
            dogX = 0;
        }
        if(dogY >= canvas.height - 50 && dogDirection === 3){
            dogDirection = Math.floor(Math.random() * 4);
            dogY = canvas.height - 50;
        }
        if(dogY <= 0 && dogDirection === 2){
            dogDirection = Math.floor(Math.random() * 4);
            dogY = 0;
        }

        dogTimer ++;
        dogAnimationTimer ++;
        if(dogAnimationTimer >= 10){
            dogAnimationFrame = 1 - dogAnimationFrame;
            dogAnimationTimer = 0;
        }

        if(dogTimer >= dogPeriod){
            dogState = "rest";
            hasPooped = false;
            willPoop = true;

            dogAnimationFrame = 0;
            dogAnimationTimer = 0;
            dogTimer = 0;
            dogDirection = Math.floor(Math.random() * 4);
            dogPeriod = Math.floor(Math.random() * 90 + 120);
        }
    }
    
    if(dogState === "rest"){
        dogRestTimer ++;
        if(willPoop && !hasPooped){
            poops.push({
                x: dogX,
                y:dogY,
                cleanCount:0
            });
            hasPooped = true;
        }
        if(dogRestTimer >= dogRestPeriod){
            dogState = "walk";
            dogRestTimer = 0;
            dogRestPeriod = Math.floor(Math.random() * 60);
        }
    }
}

function isNearPoop(poop){
    distance = Math.sqrt(
        (poop.x + 25 - (playerX + 25))**2 + (poop.y + 25 - (playerY + 25))**2
    );
    return distance <= 50;
}

function restartGame(){
    playerX = 100;
    playerY = 100;
    keys = {};
    dogX = 200;
    dogY = 100;
    dogDirection = 0;
    dogTimer = 0;
    dogPeriod = 120;
    dogRestTimer = 0;
    dogRestPeriod = 120;
    dogState = "walk";
    willPoop = false;
    poops = [];
    hasPooped = false;
    dirtiness = 0;
    elapsedTime = 0;
    isGameOver = false;
    dogAnimationTimer = 0;
    dogAnimationFrame = 0;

    cancelAnimationFrame(animationId);
    animationId = requestAnimationFrame(gameLoop);
}

function gameLoop(){
    if(!isGameStarted){
        return;
    }

    if(isGameOver){
        drawGameOver();
        drawResult();
        return;
    }
    
    updatePlayer();
    updateDog();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawDog();
    drawPoops();
    drawDirtiness();
    drawElapsedTime();

    elapsedTime += 1/60;
    dirtiness += poops.length / 30;
    if(dirtiness >= 100){
        isGameOver = true;
    }

    animationId = requestAnimationFrame(gameLoop);    
}

