


const Hero = {
    w: 64,
    h: 64,
    X: 0,
    Y: 0,
    x_pos: 0,
    y_pos: 0,
    tick_count: 0,
    sprite: new Image(),
    speed: 1.5,
    keys: {
        w: false,
        a: false,
        s: false,
        d: false,
        shift: false,
    },
    move(bg) {
        (this.keys.shift) ? (this.speed = 3) : (this.speed = 1.5)

        // WASD === 87 65 83 68

        if (this.keys.w && this.keys.a) {
            this.x_pos -= this.speed * 0.75
            this.y_pos -= this.speed * 0.75
            this.Y = 64 * 5
            bg.x -= this.speed * 0.75
            bg.y -= this.speed * 0.75
        } else if (this.keys.w && this.keys.d) {
            this.x_pos += this.speed * 0.75
            this.y_pos -= this.speed * 0.75
            this.Y = 64 * 6
            bg.x += this.speed * 0.75
            bg.y -= this.speed * 0.75
        } else if (this.keys.s && this.keys.a) {
            this.x_pos -= this.speed * 0.75
            this.y_pos += this.speed * 0.75
            this.Y = 64 * 5
            bg.x -= this.speed * 0.75
            bg.y += this.speed * 0.75
        } else if (this.keys.s && this.keys.d) {
            this.x_pos += this.speed * 0.75
            this.y_pos += this.speed * 0.75
            this.Y = 64 * 6
            bg.x += this.speed * 0.75
            bg.y += this.speed * 0.75
        } else if (this.keys.a) {
            this.x_pos -= this.speed
            this.Y = 64 * 5
            bg.x -= this.speed
        } else if (this.keys.d) {
            this.x_pos += this.speed
            this.Y = 64 * 6
            bg.x += this.speed
        } else if (this.keys.w) {
            this.y_pos -= this.speed
            this.Y = 64 * 7
            bg.y -= this.speed
        } else if (this.keys.s) {
            this.y_pos += this.speed
            this.Y = 64 * 4
            bg.y += this.speed
        }
    },

    draw(ctx, ratio) {
        ctx.drawImage(this.sprite, this.X, this.Y, this.w, this.h, this.x_pos, this.y_pos, this.w*ratio, this.h*ratio)
    },
    animateHero(paused) {
        if 
            (Hero.tick_count >= (1000 / 12) / (1000 / 60)) 
            ((Hero.Y === 64 * 3 || Hero.Y === 64 * 7) ? Hero.X = (Hero.X + 64) % (64 * 7) : Hero.X = (Hero.X + 64) % 960, Hero.tick_count = 0)
        if 
            (!paused) Hero.tick_count++
    }   
}

const Trail = {
    frames: 8,
    width: 29,
    height: 23,
    sprite: new Image(),
    trails: [],
    tickInterval: 10,
    lastTimeSpawn: 0,

    add(x, y) {
        this.trails.push({ x, y, frame: 0, tick: 0, })
    },

    update() {
        this.trails.forEach((trail, index) => {
            trail.tick++
            if (trail.tick >= this.tickInterval) {
                trail.tick = 0
                trail.frame++
                if (trail.frame >= this.frames) {
                    this.trails.splice(index, 1)
                }
            }
        })
    },

    draw(ctx) {
        this.trails.forEach(trail => {
            ctx.drawImage(
                this.sprite,
                trail.frame * this.width,
                0,
                this.width,
                this.height,
                trail.x,
                trail.y,
                this.width,
                this.height
            )
        })
    },
}

export { Hero, Trail }