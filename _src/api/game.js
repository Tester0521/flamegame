import { Hero, Trail } from '/modules/hero.js'
import { Mobs } from '/modules/mobs.js'
import { Joystick } from '/modules/controls.js'


const GAME_FPS = 60
const GAME_UPDATE_INTERVAL = 1000 / GAME_FPS
const HERO_FPS = 12
const HERO_UPDATE_INTERVAL = 1000 / HERO_FPS
const TRAIL_UPDATE_INTERVAL = 100
const MOB_SPAWN_INTERVAL = 2000


let canvas = document.querySelector('canvas')
let ctx = canvas.getContext('2d')
let paused = false

const bg = {
    sprite: new Image(),
    x: 0,
    y: 0,
} 

canvas.width = globalThis.innerWidth
canvas.height = globalThis.innerHeight
bg.sprite.src='img/locations/space.png'
Hero.sprite.src = 'img/hero/sprites.png'
Trail.sprite.src = '/img/hero/trail.png'
Mobs.sprites.mob1.src = 'img/enemies/myyxa.png'
Mobs.sprites.mob2.src = 'img/enemies/komar.png'



bg.sprite.onload = () => {
    setInterval(gameTick, GAME_UPDATE_INTERVAL)
    requestAnimationFrame(animateHero)
    requestAnimationFrame(animateTrail)
}

const bgChange = () => { ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.drawImage(bg.sprite, -bg.x, -bg.y) }
const gameTick = () => { 
    if (!paused) {
        if (Date.now() - Mobs.lastMobspawn > MOB_SPAWN_INTERVAL) {
            Mobs.spawnMob()
            Mobs.lastMobspawn = Date.now()
        }

        Mobs.update(Hero, Trail)

        if (Date.now() - Trail.lastTimeSpawn > TRAIL_UPDATE_INTERVAL) {
            Trail.add(Hero.x_pos + (canvas.width / 70), Hero.y_pos + (canvas.height / 13))
            Trail.lastTimeSpawn = Date.now()
        }

        Hero.move(bg)
        if (document.body.querySelector(".pauseTitle")) refreshScore(Mobs.score)
    }
    
    bgChange()
    render()
}

const render = () => {
    let ratio = Math.min( canvas.width / Hero.w / 10, canvas.height / Hero.h / 10)
    let cameraOffsetX = canvas.width / 2 - Hero.x_pos - Hero.w / 2
    let cameraOffsetY = canvas.height / 2 - Hero.y_pos - Hero.h / 2

    ctx.save()
    ctx.translate(cameraOffsetX, cameraOffsetY)
    
    Trail.draw(ctx)
    Hero.draw(ctx, ratio)
    Mobs.draw(ctx)

    ctx.translate(-cameraOffsetX, -cameraOffsetY)
    ctx.restore()
}


const togglePause = () => {
    paused = !paused
    Object.keys(Hero.keys).forEach((k) => Hero.keys[k] = false)


    const createPauseBlock = () => {
        const pauseScreen = document.createElement('div');
        pauseScreen.id = 'pauseBlock'
        pauseScreen.className = 'pauseScreen'

        const pauseContent = document.createElement('div')
        pauseContent.className = 'pauseContent'

        const pauseButtons = document.createElement('div')
        pauseButtons.className = 'pauseButtons'

        const pauseTitle = document.createElement('h1')
        pauseTitle.className = 'pauseTitle'
        pauseTitle.textContent = `score: ${Mobs.score}`

        const resumeButton = document.createElement('button')
        resumeButton.className = 'resumeButton'
        resumeButton.textContent = 'Resume'
        resumeButton.onclick = () => togglePause()

        const homeButton = document.createElement('button')
        homeButton.className = 'homeButton'
        homeButton.textContent = 'Leave'
        homeButton.onclick = () => document.location = '/'

        
        pauseButtons.appendChild(homeButton)
        pauseButtons.appendChild(resumeButton)
        pauseContent.appendChild(pauseTitle)
        pauseContent.appendChild(pauseButtons)
        pauseScreen.appendChild(pauseContent)
        document.body.appendChild(pauseScreen)
    }

    const removePauseBlock = () => {
        const child = document.getElementById("pauseBlock")
        document.body.removeChild(child) 
    }

    (paused) ? createPauseBlock() : removePauseBlock()
}

(globalThis.innerWidth < globalThis.innerHeight) ? (alert('🔥🔥🔥 Поверните устройство 🔥🔥🔥'), togglePause()) : 0;
globalThis.addEventListener('orientationchange', () => (globalThis.innerWidth < globalThis.innerHeight) ? 0 : (alert('🔥🔥🔥 Поверните устройство 🔥🔥🔥'), togglePause()));



const joystick = new Joystick('joystickContainer', (dx, dy) => (Hero.keys.w = dy < -0.5, Hero.keys.s = dy > 0.5, Hero.keys.a = dx < -0.5, Hero.keys.d = dx > 0.5))
const pauseBtn = document.body.querySelector(".pauseBtn")
const shiftBtn = document.body.querySelector(".shiftBtn")
const refreshScore = (score) => document.body.querySelector(".pauseTitle").textContent = `score: ${score}`
const animateHero = () => (Hero.animateHero(paused), requestAnimationFrame(animateHero))
const animateTrail = () => (Trail.update(), requestAnimationFrame(animateTrail))




pauseBtn.onclick = () => togglePause()
shiftBtn.addEventListener('mousedown', () => Hero.speed = 3)
shiftBtn.addEventListener('touchstart', () => Hero.speed = 3)
shiftBtn.addEventListener('mouseup', () => Hero.speed = 1.5)
shiftBtn.addEventListener('touchend', () => Hero.speed = 1.5)
addEventListener("keydown", (e) => {

    if (e.keyCode === 87) Hero.keys.w = true
    if (e.keyCode === 65) Hero.keys.a = true
    if (e.keyCode === 83) Hero.keys.s = true
    if (e.keyCode === 68) Hero.keys.d = true
    if (e.keyCode === 80) togglePause()
    if (e.keyCode === 16) Hero.speed = 3
    
    // switch(e.keyCode) {
    //     case 87:
    //         Hero.keys.w = true
    //         break
    //     case 65:
    //         Hero.keys.a = true
    //         break
    //     case 83:
    //         Hero.keys.s = true
    //         break
    //     case 68:
    //         Hero.keys.d = true
    //         break
    //     case 80:
    //         togglePause()
    //         break
    //     case 16: 
    //         Hero.speed = 3
    //         break
    // }
})

addEventListener("keyup", (e) => {
    if (!paused)
        if (e.keyCode === 87) (Hero.keys.w = false, Hero.Y = 64 * 3)
        if (e.keyCode === 65) (Hero.keys.a = false, Hero.Y = 64 )
        if (e.keyCode === 83) (Hero.keys.s = false, Hero.Y = 0)
        if (e.keyCode === 68) (Hero.keys.d = false, Hero.Y = 64 * 2)
        if (e.keyCode === 16) Hero.speed = 1.5
        // switch(e.keyCode) {
        //     case 87:
        //         Hero.keys.w = false
        //         Hero.Y = 64 * 3
        //         break
        //     case 65:
        //         Hero.keys.a = false
        //         Hero.Y = 64 
        //         break
        //     case 83:
        //         Hero.keys.s = false
        //         Hero.Y = 0 
        //         break
        //     case 68:
        //         Hero.keys.d = false
        //         Hero.Y = 64 * 2
        //         break
        //     case 16: 
        //         Hero.speed = 1.5
        //         break
        // }
})