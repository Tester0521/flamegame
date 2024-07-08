import { Hero, Trail } from '/modules/hero.js'
import { Mobs } from '/modules/mobs.js'
import { Joystick, Shift } from '/modules/controls.js'
import { Pause } from "/modules/pause.js"



const GAME_FPS = 60
const GAME_UPDATE_INTERVAL = 1000 / GAME_FPS
const TRAIL_UPDATE_INTERVAL = 200
const TRAIL_UPDATE_INTERVAL_2 = 100
const MOB_SPAWN_INTERVAL = 2000

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const cameraW = globalThis.innerWidth
const cameraH = globalThis.innerHeight
const hero = new Hero()
const trail = new Trail()
const bg = {
    sprite: new Image(),
    x: 0,
    y: 0,
} 
const resources = [
    'img/locations/space.jpg',
    'img/hero/sprites.png',
    'img/enemies/myyxa.png',
    'img/enemies/komar.png',
    'img/hero/trail.png',
]
const pause = new Pause()
new Shift('.shiftBtn', (speed) => (hero.speed = speed))
new Joystick('joystickContainer', (dx, dy) => (hero.keys.w = dy < -0.5, hero.keys.s = dy > 0.5, hero.keys.a = dx < -0.5, hero.keys.d = dx > 0.5))

canvas.width = 8000
canvas.height = 4000

hero.sprite.src = resources[1]
trail.sprite.src = resources[4]
Mobs.sprites.mob1.src = resources[2]
Mobs.sprites.mob2.src = resources[3]
bg.sprite.src = resources[0]

const loading = document.createElement('div')
const loadingText = document.createElement('p')
const loadingPercent = document.createElement('h1')
const loadingLine = document.createElement('hr')
loading.className = "loading"
loadingText.textContent = "Loading"
loadingPercent.textContent = "0%"
loading.appendChild(loadingText)
loading.appendChild(loadingPercent)
loading.appendChild(loadingLine)
document.body.appendChild(loading);

(function(c = 0) {
    setInterval(() => {
        loadingPercent.textContent = `${c}%`
        loadingLine.style.inlineSize = `${c}%`
        c++
    }, 100)
})()

bg.sprite.onload = () => setTimeout(() => {
    document.body.removeChild(loading)
    setInterval(gameTick, GAME_UPDATE_INTERVAL)
    requestAnimationFrame(animateHero)
    requestAnimationFrame(animateTrail)
}, 10000)

const gameTick = () => { 
    if (!pause.paused) {
        if (Date.now() - Mobs.lastMobspawn > MOB_SPAWN_INTERVAL) {
            Mobs.spawnMob()
            Mobs.lastMobspawn = Date.now()
        }

        Mobs.update(hero, trail)

        const trailUpdateInterval = (hero.speed === 3) ? TRAIL_UPDATE_INTERVAL_2 : TRAIL_UPDATE_INTERVAL;

        if (Date.now() - trail.lastTimeSpawn > trailUpdateInterval) {
            trail.add(hero.x_pos + ((cameraW + cameraH) / 96), hero.y_pos + ((cameraW + cameraH) / 36))
            trail.lastTimeSpawn = Date.now()
        }

        hero.move(bg, cameraW / 2, cameraH / 2)
        if (document.body.querySelector(".pauseTitle")) pause.refreshScore(Mobs.score)
    }
    
    render()
}

const render = () => {
    const ratio = Math.min(cameraW / hero.w / 10, cameraH / hero.h / 10)
    const cameraOffsetX = cameraW / 2 - hero.x_pos - hero.w / 2
    const cameraOffsetY = cameraH / 2 - hero.y_pos - hero.h / 2

    ctx.clearRect(0, 0, cameraW, cameraH)
    ctx.drawImage(bg.sprite, -bg.x, -bg.y)
    ctx.save();
    ctx.translate(cameraOffsetX, cameraOffsetY)

    trail.draw(ctx)
    hero.draw(ctx, ratio)
    Mobs.draw(ctx)
    ctx.restore()
}

const animateHero = () => (hero.animateHero(pause.paused), requestAnimationFrame(animateHero))
const animateTrail = () => (trail.update(pause.paused), requestAnimationFrame(animateTrail))