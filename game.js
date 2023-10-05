const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", ()=>{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
})
class InputHandler {
    constructor(game){
        this.game = game;
        window.addEventListener("keydown", (e)=>{
            if(e.key === "ArrowLeft" && this.game.keys.indexOf(e.key) === -1){
                this.game.keys.push(e.key);

            }
        })
        window.addEventListener("keyup",(e)=>{
            if(e.key === "ArrowLeft"){
                if(this.game.keys.indexOf(e.key) > -1){
                    this.game.keys.splice(this.game.keys.indexOf(e.key), 1);

                }
            }
        })
        window.addEventListener("keydown", (e)=>{
            if(e.key === "ArrowRight" && this.game.keys.indexOf(e.key) === -1){
                this.game.keys.push(e.key);

            }
        })
        window.addEventListener("keyup",(e)=>{
            if(e.key === "ArrowRight"){
                if(this.game.keys.indexOf(e.key) > -1){
                    this.game.keys.splice(this.game.keys.indexOf(e.key), 1);
                }
            }
        })
        window.addEventListener("keydown", (e)=>{
            if(e.key === " "){
                this.game.player.shoot();
            }
        })
        window.addEventListener("keydown", (e)=>{
            if(e.key === "r" || e.key === "R"){
                this.game.restart();
                document.getElementById("winning-msg").style.display = "none";
                document.getElementById("losing-msg").style.display = "none";
            }
        })
    }
}
class Projectile {
    constructor(game,x,y){
        this.game = game;
        this.width = 10;
        this.height = 30;
        this.x =x;
        this.y = y;
        this.speed = 10;
        this.markedForDeletion = false;
        this.image = document.getElementById("projectile")
    }
    update(){
        this.y -= this.speed;
        if(this.y < 20) this.markedForDeletion = true;
    }
    draw(){
        ctx.drawImage(this.image, this.x, this.y,this.width,this.height);
    }
}
class EProjectile {
    constructor(game,x,y){
        this.game = game;
        this.width = 10;
        this.height = 30;
        this.x = x;
        this.y = y;
        this.speedY = 2;
        this.markedForDeletion = false;
        this.image = document.getElementById("projectile")
    }
    update(){
        this.y += this.speedY;
        if(this.y > 700) this.markedForDeletion=true;
    }
    draw(){
        ctx.drawImage(this.image, this.x, this.y,this.width,this.height);
    }
}
class Enemy{
    constructor(game){
        this.game = game;
        this.y = 0;
        this.x = Math.floor(Math.random() * this.game.width * 0.9 );
        this.width = 100;
        this.height = 100;
        this.speedY = 1;
        this.markedForDeletion = false;
        this.eProjectiles = [];
        this.eProjectileTimer = 0;
        this.eProjectileInterval = 1000;
        this.lives = 2;
        this.frameX = 0
        this.image = document.getElementById("enemy")
    }
    update(deltaTime){
        this.y += this.speedY;
        if(this. y > this.game.height - this.height) {
            this.markedForDeletion = true;
            if(this.game.score > 0)this.game.score--;
        }
        this.eShoot(deltaTime)
        this.eProjectiles.forEach(eProjectile => eProjectile.update())
        this.eProjectiles = this.eProjectiles.filter(eProjectile => !eProjectile.markedForDeletion);

    }
    draw(){
        ctx.drawImage(this.image,this.x,this.y,this.width,this.height);
        this.eProjectiles.forEach(eProjectile => eProjectile.draw())
    }
    eShoot(deltaTime){
        if(this.eProjectileTimer > this.eProjectileInterval){
            this.eProjectiles.push(new EProjectile(this.game, this.x + this.width * 0.45,this.y + this.height * 0.7));
            this.eProjectileTimer = 0
        }else{
            this.eProjectileTimer+= deltaTime
        }
        
    }
}
class Player {
    constructor(game){
        this.game = game;
        this.width =140;
        this.height = 120;
        this.x = (this.game.width * 0.5 - this.width * 0.5);
        this.y = this.game.height * 0.7;
        this.speedX = 0;
        this.maxSpeed = 20;
        this.projectiles = [];
        this.lives = 10;
        this.maxLives = 10;
        this.jetX = 1;
        this.frameX= 0;
        this.image = document.getElementById('player');
        this.jets = document.getElementById('jets')
    }
    update(){
        if(this.game.keys.includes("ArrowLeft")){
            this.speedX = -this.maxSpeed;
            this.jetX = 2;
        }
        else if(this.game.keys.includes("ArrowRight")){
            this.speedX = this.maxSpeed;
            this.jetX = 0;
        }
        else {
            this.speedX = 0;
            this.jetX = 1;
        }
        this.x += this.speedX;
        if(this.x > this.game.width - this.width) this.x = this.game.width -this.width;
        else if ( this.x < 0)this.x = 0;
        this.projectiles.forEach(projectile => projectile.update())
        this.projectiles = this.projectiles.filter(projectile => !projectile.markedForDeletion)
    }
    draw(){
        this.projectiles.forEach(projectile => projectile.draw())
        ctx.drawImage(this.jets,this.jetX * this.width,0,this.width,this.height,this.x,this.y,this.width,this.height);
        ctx.drawImage(this.image,this.frameX * this.width,0,this.width,this.height,this.x,this.y,this.width,this.height);
    }
    shoot(){
        if(this.game.ammo > 0){
            this.projectiles.push(new Projectile(this.game,this.x + this.width * 0.5,this.y + this.height * 0.3));
            this.game.ammo--;
        }
    }
    restart(){
        this.x = (this.game.width * 0.5 - this.width * 0.5);
        this.y = this.game.height * 0.7;
        this.lives = 10;
    }
}
class UI{
    constructor(game){
        this.game = game;
        this.liveImg = document.getElementById("live")
        this.bullet = document.getElementById("bullet")
    }
    draw(){
        document.getElementById("Livescore").textContent = this.game.score
        ctx.fillStyle  ="#fff";
        for(let i = 0; i < this.game.ammo; i++){
            ctx.drawImage(this.bullet,50 + 15*i,120,20,20)
        }
        ctx.fillStyle = "red";
        for(let i = 0; i < this.game.player.lives;i++){
            ctx.drawImage(this.liveImg,50 + 25*i,70,20,20)
        }
    }
}
class Explosion{
    constructor(game,x,y){
        this.game = game;
        this.frameX = 0;
        this.spriteHeight =200;
        this.timer = 0;
        this.interval = 1000/15;
        this.maxFrame =8
        this.markedForDeletion = false;
    }
    update(deltaTime){
        if(this.timer > this.interval){
            this.frameX++;
            this.timer = 0;
        }else{
            this.timer+=deltaTime;
        }
        
        if(this.frameX > this.maxFrame){ this.markedForDeletion = true;}
    }
    draw(){
        ctx.drawImage(this.image,this.frameX * this.spriteWidth,0,this.spriteWidth,this.spriteHeight, this.x,this.y,this.width,this.height);
    }
}
class Smoke extends Explosion{
    constructor(game,x,y){
        super(game,x,y);
        this.image =document.getElementById("smoke")
        this.spriteWidth = 200;
        this.width = this.spriteWidth;
        this.height = this.spriteHeight;
        this.x = x - this.width * 0.5;
        this.y = y - this.height * 0.5;
    }
}
class Game{
    constructor(width,height){
        this.width = width;
        this.height = height;
        this.player = new Player(this);
        this.inputHandler = new InputHandler(this);
        this.ui = new UI(this);
        this.keys = [];
        this.enemies = [];
        this.explosions = [];
        this.enemyTimer = 0;
        this.enemyInterval = 2000;
        this.ammo = 20;
        this.maxAmmo = 50;
        this.ammoTimer = 0;
        this.ammoInterval = 500;
        this.score = 0;
        this.winningScore = 50;
        this.gameOver = false;
        this.gameTime = 0;
        this.liveTime = 0;
        this.liveInterval = 5000;
        this.music = document.querySelector("audio");
        document.getElementById("music-play").addEventListener("click",()=>{
            this.music.pause();
            document.getElementById("music-play").style.display="none";
            document.getElementById("music-pause").style.display="block";
        })
        document.getElementById("music-pause").addEventListener("click",()=>{
            this.music.play();
            document.getElementById("music-play").style.display="block";
            document.getElementById("music-pause").style.display="none";
        })
        
    }
    update(deltaTime){
        if(this.score >= this.winningScore){
            this.gameOver = true;
        }
        if(this.player.lives <=0){
            document.getElementById("losing-msg").style.display = "flex";
            ctx.clearRect(0, 0, this.width, this.height);
        }
        if(this.gameOver){
            document.getElementById("winning-msg").style.display = "flex";
            ctx.clearRect(0, 0, this.width, this.height);
        }
        this.player.update();
        if(this.liveTime > this.liveInterval){
            if(this.player.lives < this.player.maxLives){
                if(!this.gameOver)this.player.lives ++;
                this.liveTime = 0
            }
        }else{
            this.liveTime+=deltaTime
        }
        if(this.ammoTimer > this.ammoInterval){
            if(this.ammo < this.maxAmmo)if(!this.gameOver)this.ammo++;
            this.ammoTimer = 0
        }else{
            this.ammoTimer += deltaTime
        }
        this.enemies.forEach( (enemy) => {
            enemy.update(deltaTime)
            if(this.checkCollision(this.player,enemy)){
                enemy.markedForDeletion = true;
                this.addExplosion(enemy);
                if(!this.gameOver)this.player.lives--;
                
            }
            this.player.projectiles.forEach( (projectile) => {
                if(this.checkCollision(projectile,enemy)){
                    enemy.lives--;
                    projectile.markedForDeletion = true;
                    if(enemy.lives <= 0){
                        enemy.markedForDeletion = true;
                        this.addExplosion(enemy);
                        if(!this.gameOver)this.score++;
                    }
                }
            })
            enemy.eProjectiles.forEach((eProjectile)=>{
                if(this.checkCollision(eProjectile,this.player)){
                    if(!this.gameOver)this.player.lives -=1;
                    eProjectile.markedForDeletion = true;
                }
            })
        })
        this.explosions.forEach( explosion => explosion.update(deltaTime))
        this.explosions = this.explosions.filter(explosion => !explosion.markedForDeletion)
        this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion)
        if(this.enemyTimer > this.enemyInterval){
            this.addEnemy();
            this.enemyTimer = 0
        }else{
            this.enemyTimer += deltaTime
        }
    }
    draw(){
        this.player.draw();
        this.enemies.forEach(enemy =>  enemy.draw())
        this.explosions.forEach(explosion =>  explosion.draw())
        this.ui.draw();
    }
    addEnemy(){
        this.enemies.push(new Enemy(this))
    }
    addExplosion(enemy){
        this.explosions.push(new Smoke(this,enemy.x + enemy.width * 0.5,enemy.y + enemy.height * 0.5))
    }
    checkCollision(rect1,rect2){
        return( rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.height + rect1.y > rect2.y)
    }
    restart(){
        this.player.restart();
        this.keys = [];
        this.enemies = [];
        this.explosions = [];
        this.enemyTimer = 0;
        this.ammo = 20;
        this.ammoTimer = 0;
        this.score = 0;
        this.gameOver = false;
        this.gameTime = 0;
        this.liveTime = 0;
    }
}
const game = new Game(canvas.width, canvas.height)
let lastTime = 0
function animate(timeStamp){
    let deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    ctx.clearRect(0,0,canvas.width,canvas.height)
    game.draw()
    game.update(deltaTime)
    requestAnimationFrame(animate);
}
animate(0);