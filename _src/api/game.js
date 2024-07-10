import { Hero, Trail } from '/modules/hero.js'
import { Mobs } from '/modules/mobs.js'
import { Joystick, Shift } from '/modules/controls.js'
import { Pause } from "/modules/pause.js"
import { Map } from "/modules/map.js"



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
const resources = [
    'img/locations/space.jpg',
    'img/hero/sprites.png',
    'img/enemies/myyxa.png',
    'img/enemies/komar.png',
    'img/hero/trail.png',
    'img/hero/dash.png'
]

const bg = new Map()
const hero = new Hero()
const trail = new Trail()
const mobs = Mobs
const pause = new Pause()
const shift = new Shift('.shiftBtn', (speed) => (hero.speed = speed, setTimeout(() => hero.speed = 2, 200)))
const joystick = new Joystick('joystickContainer', (dx, dy) => (hero.keys.w = dy < -0.5, hero.keys.s = dy > 0.5, hero.keys.a = dx < -0.5, hero.keys.d = dx > 0.5))

canvas.width = globalThis.innerWidth
canvas.height = globalThis.innerHeight

hero.sprite.src = resources[1]
hero.dash.sprite.src = resources[5]
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

        hero.move(bg, canvas.width / 2, canvas.height / 2)
        pause.refreshScore(mobs.score)
    }

    render()
}

const render = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    bg.draw(ctx)
    trail.draw(ctx)
    hero.draw(ctx, bg)
    mobs.draw(ctx)

    ctx.restore()
}

const animateHero = () => (hero.animateHero(pause.paused), requestAnimationFrame(animateHero))
const animateTrail = () => (trail.update(pause.paused), requestAnimationFrame(animateTrail))