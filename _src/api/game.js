


let canvas = document.querySelector('canvas')
let ctx = canvas.getContext('2d')
let bg = new Image()
let hero = new Image()
let heroFrames = {
    X: 0,
    Y: 0,
    x_pos: 0,
    y_pos: 400,
    tick_count: 0
}
let hero_size = {
    w: 64,
    h: 64,
}

canvas.width = globalThis.innerWidth
canvas.height = globalThis.innerHeight
bg.src='img/locations/meadow.webp'
hero.src = 'img/hero/sprites.png'

bg.onload = () => {
    bgChange()
    tick()
}

const bgChange = () => ctx.drawImage(bg, 0, 0)
const tick = () => {
    if (heroFrames.tick_count > 5) {
        spriteHero()
        heroFrames.tick_count=0
    }
    heroFrames.tick_count+=1
    heroMove()
    requestAnimationFrame(tick)
}


const spriteHero = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (heroFrames.Y === 64 * 3 || heroFrames.Y === 64 * 7) 
        heroFrames.X = (heroFrames.X + 64) % (64 * 7)
    else heroFrames.X = (heroFrames.X + 64) % 960
    // else heroFrames.X = ( heroFrames.X === 960 ? 0 : heroFrames.X + 64 )
    bgChange()
    let wRatio = canvas.width / hero_size.w / 10
    let hRatio = canvas.height / hero_size.h / 10
    let ratio = Math.min( wRatio, hRatio)
    ctx.drawImage(
        hero, heroFrames.X, heroFrames.Y, 
        hero_size.w, hero_size.h, heroFrames.x_pos, heroFrames.y_pos, 
        hero_size.w*ratio, hero_size.h*ratio)
}

const keys = {
    w: false,
    a: false,
    s: false,
    d: false
}

const heroMove = () => {
    let step = 1.5

    // WASD === 87 65 83 68

    if (keys.w && keys.a) {
        heroFrames.x_pos -= step * 0.75
        heroFrames.y_pos -= step * 0.75
        heroFrames.Y = 64 * 5
    } else if (keys.w && keys.d) {
        heroFrames.x_pos += step * 0.75
        heroFrames.y_pos -= step * 0.75
        heroFrames.Y = 64 * 6
    } else if (keys.s && keys.a) {
        heroFrames.x_pos -= step * 0.75
        heroFrames.y_pos += step * 0.75
        heroFrames.Y = 64 * 5
    } else if (keys.s && keys.d) {
        heroFrames.x_pos += step * 0.75
        heroFrames.y_pos += step * 0.75
        heroFrames.Y = 64 * 6
    } else if (keys.a) {
        heroFrames.x_pos -= step
        heroFrames.Y = 64 * 5
    } else if (keys.d) {
        heroFrames.x_pos += step
        heroFrames.Y = 64 * 6
    } else if (keys.w) {
        heroFrames.y_pos -= step
        heroFrames.Y = 64 * 7
    } else if (keys.s) {
        heroFrames.y_pos += step
        heroFrames.Y = 64 * 4
    }
}


addEventListener("keydown", (e) => {
    switch(e.keyCode) {
        case 87:
            keys.w = true
            break
        case 65:
            keys.a = true
            break
        case 83:
            keys.s = true
            break
        case 68:
            keys.d = true
            break
    }
})

addEventListener("keyup", (e) => {
    switch(e.keyCode) {
        case 87:
            keys.w = false
            heroFrames.Y = 64 * 3
            break
        case 65:
            keys.a = false
            heroFrames.Y = 64 
            break
        case 83:
            keys.s = false
            heroFrames.Y = 0 
            break
        case 68:
            keys.d = false
            heroFrames.Y = 64 * 2
            break
    }
})