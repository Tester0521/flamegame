
class Hero {
    constructor() {
        this.w = 64
        this.h = 64
        this.X = 0
        this.Y =  0
        this.x_pos = 2000
        this.y_pos = 1000
        this.tick_count = 0
        this.sprite = new Image()
        this.speed = 1.5
        this.lastPosX = 2000
        this.lastPosY = 1000
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

        if (this.x_pos < canvas.width / 50 && this.y_pos < canvas.height / 20) console.log('lol')
        if (this.x_pos > canvas.width / 50 && this.y_pos < canvas.height / 20) ((this.keys.a || this.keys.d) && (!(this.keys.w & this.keys.s)) && (this.y_pos + dy + dy + this.h >= -(canvas.height / 3))) ?  bg.x += dx : 0;
        if (this.x_pos < canvas.width / 50 && this.y_pos > canvas.height / 20) ((this.keys.w || this.keys.s) && (!(this.keys.a & this.keys.d)) && (this.x_pos + dx + dx + this.w >= -(canvas.width / 2.5))) ?  bg.y += dy : 0;
        if (this.x_pos > canvas.width / 50 && this.y_pos > canvas.height / 20) (bg.x += dx, bg.y += dy, this.lastPosX = this.x_pos, this.lastPosY = this.y_pos)
            
        // if (this.x_pos + dx >= -camOffsetX + this.w && this.y_pos + dy >= -camOffsetY && this.x_pos + dx < 8000 - camOffsetX - this.w / 8 && this.y_pos + dy + this.h < 4000 - camOffsetY) {
        if (this.x_pos + dx + this.w >= -(canvas.width / 2.5) && this.y_pos + dy + this.h >= -(canvas.height / 3)) {
            this.x_pos += dx 
            this.y_pos += dy

            if (dy < 0) this.Y = 64 * 7
            if (dy > 0) this.Y = 64 * 4
            if (dx > 0) this.Y = 64 * 6
            if (dx < 0) this.Y = 64 * 5
            console.log(Math.round(this.x_pos), Math.round(this.y_pos), Math.round(this.lastPosX), Math.round(this.lastPosY))
        } else (this.x_pos -= dx, this.y_pos -= dy)
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