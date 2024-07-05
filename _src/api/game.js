


let canvas = document.querySelector('canvas')
let ctx = canvas.getContext('2d')
let bg = new Image()
let hero_idle = {
    w: new Image(),
    a: new Image(),
    s: new Image(),
    d: new Image()
}
let hero_move = {
    w: new Image(),
    a: new Image(),
    s: new Image(),
    d: new Image()
}
let activeHero = hero_idle.s
let hero_hitbox = {
    x_padding: 0,
    y_padding: 0,
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
hero_idle.w.src='img/hero/idle_up.png'
hero_idle.a.src='img/hero/idle_left.png'
hero_idle.s.src='img/hero/idle_down.png'
hero_idle.d.src='img/hero/idle_right.png'
hero_move.w.src='img/hero/walk_up.png'
hero_move.a.src='img/hero/walk_left.png'
hero_move.s.src='img/hero/walk_down.png'
hero_move.d.src='img/hero/walk_right.png'

bg.onload = () => {
    bgChange()
    tick()
}

const bgChange = () => ctx.drawImage(bg, 0, 0)
const tick = () => {
    if (hero_hitbox.tick_count > 5) {
        spriteHero(activeHero)
        hero_hitbox.tick_count=0
    }
    hero_hitbox.tick_count+=1
    heroMove()
    requestAnimationFrame(tick)
}


const spriteHero = (hero) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    hero_hitbox.x_padding=( hero_hitbox.x_padding === 960 ? 0 : hero_hitbox.x_padding+64 )
    bgChange()
    let wRatio = canvas.width / hero_size.w / 10
    let hRatio = canvas.height / hero_size.h / 10
    let ratio = Math.min( wRatio, hRatio)
    ctx.drawImage(
        hero, hero_hitbox.x_padding, hero_hitbox.y_padding, 
        hero_size.w, hero_size.h, hero_hitbox.x_pos, hero_hitbox.y_pos, 
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
        hero_hitbox.x_pos -= step / 1.5
        hero_hitbox.y_pos -= step / 1.5
        // hero_hitbox.y_padding = 288
        // hero_hitbox.x_padding = 288
    } else if (keys.w && keys.d) {
        hero_hitbox.x_pos += step / 1.5
        hero_hitbox.y_pos -= step / 1.5
        // hero_hitbox.y_padding = 288
        // hero_hitbox.x_padding = 576
    } else if (keys.s && keys.a) {
        hero_hitbox.x_pos -= step / 1.5
        hero_hitbox.y_pos += step / 1.5
        // hero_hitbox.y_padding = 288
        // hero_hitbox.x_padding = 576
    } else if (keys.s && keys.d) {
        hero_hitbox.x_pos += step / 1.5
        hero_hitbox.y_pos += step / 1.5
        // hero_hitbox.y_padding = 576
        // hero_hitbox.x_padding = 576
    } else if (keys.a) {
        hero_hitbox.x_pos -= step
        // hero_hitbox.y_padding = 288
    } else if (keys.d) {
        hero_hitbox.x_pos += step
        // hero_hitbox.y_padding = 576
    } else if (keys.w) {
        hero_hitbox.y_pos -= step
        // hero_hitbox.x_padding = 288
    } else if (keys.s) {
        hero_hitbox.y_pos += step
        // hero_hitbox.x_padding = 576
    }
}


addEventListener("keydown", (e) => {
    switch(e.keyCode) {
        case 87:
            keys.w = true
            activeHero = hero.hero_move.w
            break
        case 65:
            keys.a = true
            activeHero = hero.hero_move.a
            break
        case 83:
            keys.s = true
            activeHero = hero.hero_move.s
            break
        case 68:
            keys.d = true
            activeHero = hero.hero_move.d
            break
    }
})

addEventListener("keyup", (e) => {
    switch(e.keyCode) {
        case 87:
            keys.w = false
            activeHero = hero.hero_idle.w
            break
        case 65:
            keys.a = false
            activeHero = hero.hero_idle.a
            break
        case 83:
            keys.s = false
            activeHero = hero.hero_idle.s
            break
        case 68:
            keys.d = false
            activeHero = hero.hero_idle.d
            break
    }
})