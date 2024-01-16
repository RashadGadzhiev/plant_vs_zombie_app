

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const background_img = document.getElementById("background");
const buck1_img = document.getElementById("buck1");
const buck2_img = document.getElementById("buck2");
const bul_img = document.getElementById("bul");
const cone1_img = document.getElementById("cone1");
const cone2_img = document.getElementById("cone2");
const end_img = document.getElementById("end");
const firebul_img = document.getElementById("firebul");
const logo_img = document.getElementById("logo");
const menu_vertical_img = document.getElementById("menu_vertical");
const nut1_img = document.getElementById("nut1");
const nut2_img = document.getElementById("nut2");
const nut3_img = document.getElementById("nut3");
const pea1_img = document.getElementById("pea1");
const pea2_img = document.getElementById("pea2");
const pea3_img = document.getElementById("pea3");
const sun_img = document.getElementById("sun");
const sun1_img = document.getElementById("sun1");
const sun2_img = document.getElementById("sun2");
const tree1_img = document.getElementById("tree1");
const tree2_img = document.getElementById("tree2");
const tree3_img = document.getElementById("tree3");
const zom1_img = document.getElementById("zom1");
const zom2_img = document.getElementById("zom2");
const grasswalk = document.getElementById("grasswalk");
const hit = document.getElementById("hit");
const peaspawn = document.getElementById("peaspawn");
const seedSound = document.getElementById("seed");
const sunspawn = document.getElementById("sunspawn");

let sun = 300;
let suns = [];
ctx.fillStyle = "brown";
ctx.font = "30px Arial";
let plants = [];
let seed = null;
let lawns = [];
let sunKill = -1;
let peas = [];
let peaKill = -1;
let plantKill = -1;
let zombies = [];
let zombieKill = -1;
let zombieSpawn = Date.now();
let zombieNum = 30;
let game = true;



function Plant(health, cost){
    this.health = health;
    this.cost  = cost;
    this.kill = false;
    this.x = 0;
    this.y = 0;
    this.line = 0;
    this.column = 0;
    this.planting = function(x, y, line, column){
        this.x = x;
        this.y = y;
        this.line = line;
        this.column = column;
    }
    this.update = function(){
        if(this.health <= 0){
            this.kill = true;
        }
    }
    this.drawSeed = function(){
        ctx.globalAlpha = 0.7;
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        ctx.globalAlpha = 1;
    }
}



function Sunflower(){
    Plant.call(this, 80, 50);
    this.img = sun1_img;
    this.width = 81;
    this.height = 75;
    this.frame = 0;
    this.sunSpawn = Date.now();
    this.draw = function(){
        if(this.frame == 45){
            this.frame = 0;
            if(this.img == sun1_img){
                this.img = sun2_img;
            }
            else{
                this.img = sun1_img;
            }
        }
        this.frame++;
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);    
        if(Date.now() - this.sunSpawn >= 15000){
            let sun = new Sun(this.x + this.width / 2, this.y);
            suns.push(sun);
            this.sunSpawn = Date.now();
        }
    }
}



function PeaShooter(){
    Plant.call(this, 100, 100);
    this.width = 136;
    this.height = 72;
    this.frame = 0;
    this.zombieOnline = false; 
    this.img = pea1_img;
    this.peaSpawn = Date.now();
    this.draw = function(){
        if(this.frame == 45){
            if(this.img == pea1_img){
                this.img = pea2_img;
            }
            else if(this.img == pea2_img){
                this.img = pea3_img;
            }
            else{
                this.img = pea1_img;
            }
            this.frame = 0;
        }
        this.frame++;
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        this.zombieOnline = false;
        for(let i = 0; i < zombies.length; i++){
            if(zombies[i].line == this.line){
                this.zombieOnline = true;
            }
        }
        if(Date.now() - this.peaSpawn >= 2000 && this.zombieOnline){
            let pea = new Pea(this.x + 70, this.y + 5);
            peas.push(pea);
            this.peaSpawn = Date.now();
        }
    }
}

function TorchWood(){
    Plant.call(this, 120, 175);
    this.width = 72;
    this.height = 90;
    this.frame = 0;
    this.img = tree1_img;
    this.peaIndex = -1;
    this.draw = function(){
        if(this.frame == 20){
            this.img = tree2_img;
        }
        else if(this.frame == 40){
            this.img = tree3_img;
        }
        else if(this.frame == 60){
            this.img = tree1_img;
            this.frame = 0;
        }
        this.frame++;
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        this.peaIndex = multicollision(this, peas);
        if(this.peaIndex > -1){
            peas[this.peaIndex].damage = 3;
            peas[this.peaIndex].img = firebul_img;
        }
    }
}

function Wallnut(){
    Plant.call(this, 200, 50);
    this.width = 62;
    this.height = 76;
    this.frame = 0;
    this.img = nut1_img;
    this.draw = function(){
        if(this.frame == 100){
            this.img = nut2_img;
        }
        else if(this.frame == 120){
            this.img = nut3_img;
        }
        else if(this.frame == 130){
            this.img = nut1_img;
            this.frame = 0;
        }
        this.frame++;
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
}

function Pea(posX, posY){
    this.x = posX;
    this.y = posY;
    this.width = 25;
    this.height = 25;
    this.changeX = 3;
    this.damage = 1;
    this.hitIndex = -1;
    this.kill = false;
    this.img = bul_img;
    this.draw = function(){
        this.x += this.changeX;
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        if(this.x >= canvas.width){
            this.kill = true;
        }
        this.hitIndex = multicollision(this, zombies);
        if(this.hitIndex > -1){
            this.kill = true;
            zombies[this.hitIndex].health -= this.damage;
        }
    }
}


function Zombie(health, line, posY){
    this.health = health;
    this.line = line;
    this.x = canvas.width;
    this.y = posY;
    this.eating = false;
    this.food = -1;
    this.kill = false;
    this.angle = 0;
    this.changeX = -0.1;
    this.move = function(){
        this.x += this.changeX;
        if(this.health <= 0){
            this.kill = true;
        }
        this.food = multicollision(this, plants);
        this.eating = false;
        if(this.food > -1){
            this.eating = true;
            plants[this.food].health -= 0.1;
        }
        if(this.eating){
            this.changeX = 0;
            this.angle = -0.3;
        }
        else{
            this.changeX = -0.1;
            this.angle = 0;
        }
        if(this.x < 200){
            game = false;
        }
    }
}

function ConeHeadZombie(line, posY){
    Zombie.call(this, 20, line, posY);
    this.width = 70;
    this.height = 108;
    this.frame = 0;
    this.img = cone1_img;
    this.draw = function(){
        if(this.frame == 50 && this.img == cone1_img){
            this.img = cone2_img;
        }
        else if(this.frame == 60){
            this.img = cone1_img;
            this.frame = 0;
        }
        this.frame++;
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.angle);
        ctx.translate(-this.x - this.width / 2, -this.y - this.height / 2);
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        ctx.restore();
    }
}


function OrdirnaryZombie(line, posY){
    Zombie.call(this, 12, line, posY);
    this.width = 70;
    this.height = 108;
    this.frame = 0;
    this.img = zom1_img;
    this.draw = function(){
        if(this.frame == 50 && this.img == zom1_img){
            this.img = zom2_img;
        }
        else if(this.frame == 60){
            this.img = zom1_img;
            this.frame = 0;
        }
        this.frame++;
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.angle);
        ctx.translate(-this.x - this.width / 2, -this.y - this.height / 2);
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        ctx.restore();
    }
}

function BuckHeadZombie(line, posY){
    Zombie.call(this, 32, line, posY);
    this.width = 70;
    this.height = 108;
    this.frame = 0;
    this.img = buck1_img;
    this.draw = function(){
        if(this.frame == 50){
            this.img = buck2_img;
        }
        else if(this.frame == 60){
            this.img = buck1_img;
            this.frame = 0;
        }
        this.frame++;
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.angle);
        ctx.translate(-this.x - this.width / 2, -this.y - this.height / 2);
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        ctx.restore();
    }
}

function lawnX(x){
    let column, centerX;
    
    if(x > 250 && x <= 326){
        column = 1;
        centerX = 283;
    }
    else if(x > 326 && x <= 400){
        column = 2;
        centerX = 360;
    }
    else if(x > 400 && x <= 485){
        column = 3;
        centerX = 440;
    }
    else if(x > 485 && x <= 560){
        column = 4;
        centerX = 520;
    }
    else if(x > 560 && x <= 640){
        column = 5;
        centerX = 600;
    }
    else if(x > 640 && x <= 715){
        column = 6;
        centerX = 675;
    }
    else if(x > 715 && x <= 785){
        column = 7;
        centerX = 750;
    }
    else if(x > 785 && x <= 870){
        column = 8;
        centerX = 830;
    }
    else if(x > 870 && x <= 960){
        column = 9;
        centerX = 915;
    }
    return [centerX, column];
}

function lawnY(y){
    let line, centerY;
    if(y < 571 && y >= 470){
        line = 1;
        centerY = 520;
    }
    else if(y < 470 && y >= 380){
        line = 2;
        centerY = 430;
    }
    else if(y < 380 && y >= 277){
        line = 3;
        centerY = 330;
    }
    else if(y < 277 && y >= 176){
        line = 4;
        centerY = 230;
    }
    else if(y < 176 && y >= 73){
        line = 5;
        centerY = 130;
    }
    return [centerY, line];
}



function Sun(posX, posY){
    this.x = posX;
    this.y = posY;
    this.width = 46;
    this.height = 46;
    this.angle = 0;
    this.kill = false;
    this.draw = function(){
        this.angle += 0.003;
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.width / 2);
        ctx.rotate(this.angle);
        ctx.translate(-this.x - this.width / 2,  -this.y - this.height / 2);
        ctx.drawImage(sun_img, this.x, this.y, this.width, this.height);
        ctx.restore();
    }
}

function collision(one, two){
    if(one.x + one.width > two.x && two.x + two.width > one.x && one.y + one.height > two.y && two.y + two.height > one.y){
        return true;
    }
    return false;
}

function multicollision(one, many) {
    let index = -1;
    for(let i = 0; i < many.length; i++) {
        if(collision(one, many[i])) {
            index = i;
            break;
        }
    }
    return index;
}


function update(){
    ctx.drawImage(background_img, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(menu_vertical_img, 0, 0, 130, 600);
    ctx.fillText(sun, 38, 103);
    for(let i = 0; i < plants.length; i++){
        plants[i].draw();
        plants[i].update();
        if(plants[i].kill){
            plantKill = i;
        }
    }
    if(plantKill > -1){
        let lawnIndex = lawns.indexOf("" + plants[plantKill].column + plants[plantKill].line);
        lawns.splice(lawnIndex, 1);
        plants.splice(plantKill, 1);
        plantKill = -1;
    }
    for(let i = 0; i < suns.length; i++){
        suns[i].draw();
        if(suns[i].kill == true){
            sunKill = i;
        }
    }
    if(sunKill > -1){
        suns.splice(sunKill, 1);
        sunKill = -1
    }
    if(seed != null){
        seed.drawSeed();
    }
    for(let i = 0; i < peas.length; i++){
        peas[i].draw();
        if(peas[i].kill){
            peaKill = i;
        }
    }
    if(peaKill > -1){
        peas.splice(peaKill, 1);
        peaKill = -1
    }
    for(let i = 0; i < zombies.length; i++){
        zombies[i].move();
        zombies[i].draw();
        if(zombies[i].kill){
            zombieKill = i;
        }
    }
    if(zombieKill > -1){
        zombies.splice(zombieKill, 1);
        zombieKill = -1;
    }
    if(Date.now() - zombieSpawn >= 5000 && zombieNum > 0){
        let zPoint = lawnY(Math.round(Math.random() * 490) + 80);
        let zombieType = Math.floor(Math.random() * 3); 
        let zombie;
        if(zombieType == 0){
            zombie =  new OrdirnaryZombie(zPoint[1], zPoint[0]);
        }
        else if(zombieType == 1){
            zombie = new ConeHeadZombie(zPoint[1], zPoint[0]); 
        }
        else if(zombieType == 2){
            zombie = new BuckHeadZombie(zPoint[1], zPoint[0]);
        }
        
        zombie.y -= zombie.height / 2;
        zombies.push(zombie);
        zombieSpawn = Date.now();
        zombieNum--;
        
    }
    if(!game){
        ctx.drawImage(end_img, 318, 66);
        return false;
    }
    window.requestAnimationFrame(update);
}


update();


canvas.addEventListener("mousedown", function(e){
    if(e.layerX > 10 && e.layerX < 110 && e.layerY > 120 && e.layerY < 230){
        console.log("sunflower");
        seed =  new Sunflower();
    }
    if(e.layerX > 10 && e.layerX < 110 && e.layerY > 235 && e.layerY < 345){
        console.log("peashooter");
        seed = new PeaShooter();
    }
    if(e.layerX > 10 && e.layerX < 110 && e.layerY > 350 && e.layerY < 460){
        console.log("wallnut");
        seed = new Wallnut();
    }
    if(e.layerX > 10 && e.layerX < 110 && e.layerY > 465 && e.layerY < 575){
        console.log("torchwood");
        seed = new TorchWood();
    }
    if(seed != null){
        seed.x = e.layerX;
        seed.y = e.layerY;
    }
    for(let i = 0; i < suns.length; i++){
        if(suns[i].x <= e.layerX && suns[i].x + suns[i].width >= e.layerX && suns[i].y <= e.layerY && suns[i].y + suns[i].height >= e.layerY){
            sun += 25;
            suns[i].kill = true;
        }
    }
});

canvas.addEventListener("mousemove", function(e){
    if(seed != null){
        seed.x = e.layerX;
        seed.y = e.layerY;
    }
});


canvas.addEventListener("mouseup", function(e){
    if(seed != null && e.layerX > 250 && e.layerX < 960 && e.layerY > 74 && e.layerY < 570){
        let posX = lawnX(e.layerX);
        let posY = lawnY(e.layerY);
        if(lawns.indexOf("" + posX[1] + posY[1]) == -1 && sun >= seed.cost){
            sun -= seed.cost;
            lawns.push("" + posX[1] + posY[1]);
            seed.planting(posX[0] - seed.width / 2, posY[0] - seed.height / 2, posY[1], posX[1]);
            plants.push(seed);
            seed = null;
        }
        
    }
})