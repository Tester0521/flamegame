
class Hero {
    constructor(pause) {
        this.w = 64
        this.h = 64
        this.X = 0
        this.Y =  0
        this.x_pos = 0
        this.y_pos = 0
        this.tick_count = 0
        this.sprite = new Image()
        this.speed = 1.5
        this.needCam = true
        this.keys = {
            w: false,
            a: false,
            s: false,
            d: false,
        }
        this.paused = false

        this.addEventListeners()
    }

    move(bg, camOffsetX, camOffsetY) {
        // WASD === 87 65 83 68

        let dx = 0
        let dy = 0
            
        if (this.keys.w) dy -= this.speed
        if (this.keys.s) dy += this.speed
        if (this.keys.a) dx -= this.speed
        if (this.keys.d) dx += this.speed

        if (dx !== 0 && dy !== 0) {
            dx *= Math.SQRT1_2
            dy *= Math.SQRT1_2
        }
        // if (this.x_pos > 0 && this.y_pos > 0) this.needCam = true 
        // else this.needCam = false
        // && this.x_pos + dx < canvas.width - camOffsetX - this.w / 3 && this.y_pos  + dy < canvas.height - camOffsetY - this.h / 1.5

        if (this.x_pos + dx >= -camOffsetX && this.y_pos + dy >= -camOffsetY - this.h / 2 && this.x_pos + dx < canvas.width - camOffsetX - this.w / 8 && this.y_pos  + dy < canvas.height - camOffsetY - this.h / 1.5) {
            this.x_pos += dx 
            this.y_pos += dy

            if (this.needCam) (bg.x += dx, bg.y += dy);
            if (dy < 0) this.Y = 64 * 7
            if (dy > 0) this.Y = 64 * 4
            if (dx > 0) this.Y = 64 * 6
            if (dx < 0) this.Y = 64 * 5 
        } 
    }
    draw(ctx, ratio) {
        ctx.drawImage(this.sprite, this.X, this.Y, this.w, this.h, this.x_pos, this.y_pos, this.w*ratio, this.h*ratio)
    }
    animateHero(paused) {
        this.paused = paused 
        if 
            (this.tick_count >= (1000 / 12) / (1000 / 60)) 
            ((this.Y === 64 * 3 || this.Y === 64 * 7) ? this.X = (this.X + 64) % (64 * 7) : this.X = (this.X + 64) % 960, this.tick_count = 0)
        if 
            (!paused) this.tick_count++
    }   
    addEventListeners() {
        addEventListener("keydown", (e) => {
            if (e.keyCode === 87) this.keys.w = true
            if (e.keyCode === 65) this.keys.a = true
            if (e.keyCode === 83) this.keys.s = true
            if (e.keyCode === 68) this.keys.d = true
            if (e.keyCode === 16) this.speed = 3
        })
        addEventListener("keyup", (e) => {
            if (e.keyCode === 87) (this.keys.w = false, (!this.paused) ? this.Y = 64 * 3 : 0)
            if (e.keyCode === 65) (this.keys.a = false, (!this.paused) ? this.Y = 64 : 0)
            if (e.keyCode === 83) (this.keys.s = false, (!this.paused) ? this.Y = 0 : 0)
            if (e.keyCode === 68) (this.keys.d = false, (!this.paused) ? this.Y = 64 * 2 : 0)
            if (e.keyCode === 16) this.speed = 1.5
        })
    } 
}

class Trail {
    constructor() {
        this.frames = 8
        this.width = 29
        this.height = 23
        this.sprite = new Image()
        this.trails = []
        this.tickInterval = 50
        this.lastTimeSpawn = 0
    }

    add(x, y) {
        this.trails.push({ x, y, frame: 0, tick: 0, })
    }

    update(paused) {
        if (!paused) this.trails.forEach((trail, index) => {
            trail.tick++
            if (trail.tick >= this.tickInterval) {
                trail.tick = 0
                trail.frame++
                if (trail.frame >= this.frames) {
                    this.trails.splice(index, 1)
                }
            }
        })
    }

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
    }
}

export { Hero, Trail }