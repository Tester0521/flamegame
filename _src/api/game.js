let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');

canvas.width = globalThis.innerWidth
canvas.height = globalThis.innerHeight

let person={
    x_padding:0,
    y_padding:0,
    x_pos:0,
    y_pos:400,
    tick_count:0
}

let bg=new Image();
let runner= new Image();
 bg.src='img/level.png';
 runner.src='img/hero_sprites.png';

bg.onload=function(){
    bgChange();
    tick();

}

function bgChange(){
    ctx.drawImage(bg,0,0);
  
}

function tick(){
if (person.tick_count>5){
    spriteRunner();
    person.tick_count=0;
}
person.tick_count+=1;
requestAnimationFrame(tick);
}


function spriteRunner(){
 ctx.clearRect(0,0,canvas.width,canvas.height);

    person.x_padding=(person.x_padding===720? 0:person.x_padding+144);
    bgChange();
    ctx.drawImage(runner,person.x_padding,person.y_padding,144,144,person.x_pos,person.y_pos,144,144);
    
}

addEventListener("keydown",function(e) {
let step=10;
if(e.keyCode===37){
    person.x_pos-=10;
    person.y_padding=288;
}
else if (e.keyCode===39){
    person.x_pos+=step;
    person.y_padding=576;
}
}

)