import { Hero, Trail } from '/modules/hero.js'
import { Mobs } from '/modules/mobs.js'
import { Joystick, Shift } from '/modules/controls.js'
import { Pause } from "/modules/pause.js"
import { Map } from "/modules/map.js"

const GAME_FPS = 60
const GAME_UPDATE_INTERVAL = 1000 / GAME_FPS
const TRAIL_UPDATE_INTERVAL = 100
const MOB_SPAWN_INTERVAL = 3000

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
const resources = [
    'img/locations/space.jpg', 'img/hero/sprites.png', 'img/enemies/myyxa.png', 'img/enemies/komar.png',
    'img/hero/fireTrail.png', 'img/hero/dash.png', 'img/hero/smokeTrail.png', 'img/hero/trail.png'
]

const bg = new Map()
const hero = new Hero()
const trail = new Trail()
const mobs = new Mobs()
const pause = new Pause()
const shift = new Shift('.shiftBtn', hero)
const joystick = new Joystick('joystickContainer', (dx, dy) => {
    (hero.keys.w = dy < -0.5, hero.keys.s = dy > 0.5, hero.keys.a = dx < -0.5, hero.keys.d = dx > 0.5)
})

canvas.width = globalThis.innerWidth
canvas.height = globalThis.innerHeight

hero.sprite.src = resources[1]
hero.dash.sprite.src = resources[5]
trail.sprite.src = resources[6]
mobs.sprites.mob1.src = resources[2]
mobs.sprites.mob2.src = resources[3]
mobs.sprites.dead.src = resources[7]
bg.sprite.src = resources[0]

bg.sprite.onload = () => setTimeout(() => {
    document.body.removeChild(loading)
    setInterval(render, GAME_UPDATE_INTERVAL)
    requestAnimationFrame(animateHero)
    requestAnimationFrame(animateMobs)
    requestAnimationFrame(animateTrail)
}, 5000)

const render = () => { 
    const cameraOffsetX = canvas.width / 2 - hero.x_pos - hero.w / 2
    const cameraOffsetY = canvas.height / 2 - hero.y_pos - hero.h / 2
    const cameraOffsetStunX = canvas.width / 2 - hero.lastPosX - hero.w / 2
    const cameraOffsetStunY = canvas.height / 2 - hero.lastPosY - hero.h / 2
    const cameraOffsetResX = (bg.walls.left || bg.walls.right) ? cameraOffsetStunX : cameraOffsetX
    const cameraOffsetResY = (bg.walls.top || bg.walls.bot) ? cameraOffsetStunY : cameraOffsetY



    ctx.clearRect(0, 0, canvas.width, canvas.height)
    bg.draw(ctx)
    ctx.save()
    ctx.translate(cameraOffsetResX, cameraOffsetResY)
    trail.draw(ctx)
    mobs.draw(ctx)
    hero.draw(ctx)
    ctx.restore()


    if (!pause.paused) {
        if (Date.now() - mobs.lastMobspawn > MOB_SPAWN_INTERVAL) mobs.spawnMob()
        if (Date.now() - trail.lastTimeSpawn > TRAIL_UPDATE_INTERVAL) trail.add(hero.x_pos - 16, hero.y_pos - 16)

        mobs.update(hero)
        hero.move(bg) 
        pause.refreshScore(mobs.score)
    }

}
const animateHero = () => (hero.animateHero(pause.paused), requestAnimationFrame(animateHero))
const animateTrail = () => (trail.animateTrail(pause.paused), requestAnimationFrame(animateTrail))
const animateMobs = () => (mobs.animateMobs(pause.paused), requestAnimationFrame(animateMobs))