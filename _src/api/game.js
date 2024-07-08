import { Hero, Trail } from '/modules/hero.js'
import { Mobs } from '/modules/mobs.js'
import { Joystick, Shift } from '/modules/controls.js'
import { Pause } from "/modules/pause.js"



const GAME_FPS = 60
const GAME_UPDATE_INTERVAL = 1000 / GAME_FPS
const TRAIL_UPDATE_INTERVAL = 200
const TRAIL_UPDATE_INTERVAL_2 = 100
const MOB_SPAWN_INTERVAL = 2000

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
    const load = setInterval(() => {
        loadingPercent.textContent = `${c}%`
        loadingLine.style.inlineSize = `${c}%`
        c++

        if (c > 100) clearInterval(load)
    }, 50)
})()

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const cameraW = globalThis.innerWidth
const cameraH = globalThis.innerHeight
const bg = {
    sprite: new Image(),
    x: 2000,
    y: 1000,
} 
const resources = [
    'img/locations/space.jpg',
    'img/hero/sprites.png',
    'img/enemies/myyxa.png',
    'img/enemies/komar.png',
    'img/hero/trail.png',
]

const hero = new Hero()
const trail = new Trail()
const mobs = Mobs
const pause = new Pause()
const shift = new Shift('.shiftBtn', (speed) => (hero.speed = speed))
const joystick = new Joystick('joystickContainer', (dx, dy) => (hero.keys.w = dy < -0.5, hero.keys.s = dy > 0.5, hero.keys.a = dx < -0.5, hero.keys.d = dx > 0.5))

canvas.width = globalThis.innerWidth
canvas.height = globalThis.innerHeight

hero.sprite.src = resources[1]
trail.sprite.src = resources[4]
Mobs.sprites.mob1.src = resources[2]
Mobs.sprites.mob2.src = resources[3]
bg.sprite.src = resources[0]

bg.sprite.onload = () => setTimeout(() => {
    document.body.removeChild(loading)
    setInterval(gameTick, GAME_UPDATE_INTERVAL)
    requestAnimationFrame(animateHero)
    requestAnimationFrame(animateTrail)
}, 5000)

const gameTick = () => { 
    if (!pause.paused) {
        if (Date.now() - mobs.lastMobspawn > MOB_SPAWN_INTERVAL) {
            mobs.spawnMob()
            mobs.lastMobspawn = Date.now()
        }

        mobs.update(hero, trail)

        const trailUpdateInterval = (hero.speed === 3) ? TRAIL_UPDATE_INTERVAL_2 : TRAIL_UPDATE_INTERVAL;

        if (Date.now() - trail.lastTimeSpawn > trailUpdateInterval) {
            trail.add(hero.x_pos + ((canvas.width + canvas.height) / 110), hero.y_pos + ((canvas.width + canvas.height) / 38))
            trail.lastTimeSpawn = Date.now()
        }

        hero.move(bg, cameraW / 2, cameraH / 2)
        pause.refreshScore(mobs.score)
    }

    render()
}

const render = () => {
    const ratio = Math.min(cameraW / hero.w / 10, cameraH / hero.h / 10)
    const cameraOffsetX = cameraW / 2 - hero.x_pos - hero.w / 2
    const cameraOffsetY = cameraH / 2 - hero.y_pos - hero.h / 2
    const cameraOffsetStunX = cameraW / 2 - hero.lastPosX - hero.w / 2
    const cameraOffsetStunY = cameraH / 2 - hero.lastPosY - hero.h / 2

    ctx.clearRect(0, 0, cameraW, cameraH)
    ctx.drawImage(bg.sprite, -bg.x, -bg.y)
    ctx.save()
    // if (hero.x_pos + canvas.width / 2 >= canvas.width || hero.y_pos + canvas.height / 2 >= canvas.height || (hero.x_pos + canvas.width / 2 >= canvas.width && hero.y_pos + canvas.height / 2 >= canvas.height))
    if (hero.x_pos < canvas.width / 50 && hero.y_pos > canvas.height / 20) ctx.translate(cameraOffsetStunX, cameraOffsetY)
    if (hero.x_pos > canvas.width / 50 && hero.y_pos < canvas.height / 20) ctx.translate(cameraOffsetX, cameraOffsetStunY)
    if (hero.x_pos < canvas.width / 50 && hero.y_pos < canvas.height / 20) ctx.translate(cameraOffsetStunX, cameraOffsetStunY)
    if (hero.x_pos > canvas.width / 50 && hero.y_pos > canvas.height / 20) ctx.translate(cameraOffsetX, cameraOffsetY)

    trail.draw(ctx)
    hero.draw(ctx, ratio)
    mobs.draw(ctx)
    ctx.restore()
}

const animateHero = () => (hero.animateHero(pause.paused), requestAnimationFrame(animateHero))
const animateTrail = () => (trail.update(pause.paused), requestAnimationFrame(animateTrail))