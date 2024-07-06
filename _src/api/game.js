import { Hero, Trail } from './modules/Hero.js'
import { Mobs } from './modules/Mobs.js'


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
Hero.sprite.src = 'img/Hero/sprites.png'
Mobs.sprites.mob1.src = 'img/enemies/myyxa.png'
Mobs.sprites.mob2.src = 'img/enemies/komar.png'
Trail.sprite.src = '/img/Hero/trail.png'


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
            Trail.add(Hero.x_pos + 20, Hero.y_pos + 50)
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


function togglePause() {
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

const refreshScore = (score) => document.body.querySelector(".pauseTitle").textContent = `score: ${score}`
const animateHero = () => (Hero.animateHero(paused), requestAnimationFrame(animateHero))
const animateTrail = () => (Trail.update(), requestAnimationFrame(animateTrail))






addEventListener("keydown", (e) => {
    switch(e.keyCode) {
        case 87:
            Hero.keys.w = true
            break
        case 65:
            Hero.keys.a = true
            break
        case 83:
            Hero.keys.s = true
            break
        case 68:
            Hero.keys.d = true
            break
        case 80:
            togglePause()
            break
        case 16: 
            Hero.keys.shift = true
            break
    }
})

addEventListener("keyup", (e) => {
    if (!paused)
        switch(e.keyCode) {
            case 87:
                Hero.keys.w = false
                Hero.Y = 64 * 3
                break
            case 65:
                Hero.keys.a = false
                Hero.Y = 64 
                break
            case 83:
                Hero.keys.s = false
                Hero.Y = 0 
                break
            case 68:
                Hero.keys.d = false
                Hero.Y = 64 * 2
                break
            case 16: 
                Hero.keys.shift = false
                break
        }
})