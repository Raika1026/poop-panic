const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

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
});

//プレイヤーの座標更新
function updatePlayer(){
    if(keys["ArrowRight"]){
        playerX += 1.5;
    }
    if(keys["ArrowLeft"]){
        playerX -= 1.5;
    }
    if(keys["ArrowDown"]){
        playerY += 1.5;
    }
    if(keys["ArrowUp"]){
        playerY -= 1.5;
    }

    playerX = Math.max(0, Math.min(playerX, canvas.width - 50));
    playerY = Math.max(0, Math.min(playerY, canvas.height - 50));
}

//メンチ君の座標更新
function updateDog(){
    if(dogState === "walk"){
        if(dogDirection === 0){
        dogX += 2;
        }
        if(dogDirection === 1){
            dogX -= 2;
        }
        if(dogDirection === 2){
            dogY -= 2;
        }
        if(dogDirection === 3){
            dogY += 2;
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
            dogTimer = 0;
            dogDirection = Math.floor(Math.random() * 4);
            dogPeriod = Math.floor(Math.random() * 180 + 120);
        }
    }
    
    if(dogState === "rest"){
        dogRestTimer ++;
        if(dogRestTimer >= dogRestPeriod){
            dogState = "walk";
            dogRestTimer = 0;
            dogRestPeriod = Math.floor(Math.random() * 60);
        }
    }
}

function gameLoop(){
    updatePlayer();
    updateDog();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawDog();
    requestAnimationFrame(gameLoop);
}

gameLoop();