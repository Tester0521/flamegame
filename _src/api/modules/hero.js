
class Hero {
    constructor() {
        this.w = 64
        this.h = 64
        this.X = 0
        this.Y =  0
        this.x_pos = 4000
        this.y_pos = 2000
        this.tick_count = 0
        this.sprite = new Image()
        this.speed = 2
        this.lastPosX = 4000
        this.lastPosY = 2000
        this.keys = {
            w: false,
            a: false,
            s: false,
            d: false,
        }
        this.paused = false
        this.dash = {
            sprite: new Image(),
            w: 128,
            h: 64,
            frame: 0,
            tick_count: 0,
            X: 0,
            Y: 0,
        }
        this.addEventListeners()
    }

    move(bg) {
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

        const checkDwall = () => (
            (!(
                (this.x_pos < bg.leftWall && this.y_pos < bg.topWall) || (this.x_pos < bg.leftWall && this.y_pos > bg.botWall) ||
                (this.x_pos > bg.rightWall && this.y_pos < bg.topWall) || (this.x_pos > bg.rightWall && this.y_pos > bg.botWall) 
            )) 
        )

        if (this.y_pos < bg.topWall || this.y_pos > bg.botWall) {
            if (this.y_pos + dy + dy + this.h >= -(canvas.height / 2) || this.y_pos + dy + dy + this.h <= 3650) {
                if ((this.keys.a || this.keys.d) && (!(this.keys.w && this.keys.s))) {
                    if (checkDwall()) {
                        this.lastPosX = this.x_pos
                        bg.x += dx
                    } 
                }
                console.log('top')
                bg.walls.top = true
            }
        }
        if (this.x_pos < bg.leftWall || this.x_pos > bg.rightWall) {
            if (this.x_pos + dx + dx + this.w >= -(canvas.width / 2.5) || this.x_pos + dx + dx+ this.w <= 7500) {
                if ((this.keys.w || this.keys.s) && (!(this.keys.a && this.keys.d))) {
                    if (checkDwall()) {
                        this.lastPosY = this.y_pos
                        bg.y += dy
                    }
                }
                console.log('left')
                bg.walls.left = true
            }
        }
        if (this.x_pos > bg.leftWall && this.y_pos > bg.topWall && this.x_pos < bg.rightWall && this.y_pos < bg.botWall) 
                (bg.x += dx, bg.y += dy, Object.keys(bg.walls).forEach(k => bg.walls[k] = false), this.lastPosX = this.x_pos, this.lastPosY = this.y_pos)
        
            
        if (
            this.x_pos + dx + this.w > -(canvas.width / 2.5) && 
            this.y_pos + dy + this.h > -(canvas.height / 3) && 
            this.y_pos  + dy + this.h <= 3650 &&
            this.x_pos + dx + this.w <= 7500
        ) {
            this.x_pos += dx 
            this.y_pos += dy

            if (dy < 0) (this.Y = 64 * 7, this.dash.Y = 192)
            if (dy > 0) (this.Y = 64 * 4, this.dash.Y = 128)
            if (dx > 0) (this.Y = 64 * 6, this.dash.Y = 0)
            if (dx < 0) (this.Y = 64 * 5, this.dash.Y = 64)
        } else (this.x_pos -= dx, this.y_pos -= dy)
    }
    draw(ctx, bg) {
        const ratio = Math.min(canvas.width / this.w / 10, canvas.height / this.h / 10)
        const cameraOffsetX = canvas.width / 2 - this.x_pos - this.w / 2
        const cameraOffsetY = canvas.height / 2 - this.y_pos - this.h / 2
        const cameraOffsetStunX = canvas.width / 2 - this.lastPosX - this.w / 2
        const cameraOffsetStunY = canvas.height / 2 - this.lastPosY - this.h / 2
        const cameraOffsetResX = (bg.walls.left || bg.walls.right) ? cameraOffsetStunX : cameraOffsetX
        const cameraOffsetResY = (bg.walls.top || bg.walls.bot) ? cameraOffsetStunY : cameraOffsetY

        ctx.save()
        ctx.translate(cameraOffsetResX, cameraOffsetResY)
        if (this.speed < 3) {
            ctx.drawImage(this.sprite, this.X, this.Y, this.w, this.h, this.x_pos, this.y_pos, this.w*ratio, this.h*ratio)
        }
        else {
            ctx.drawImage(this.dash.sprite, this.dash.X, this.dash.Y, this.dash.w, this.dash.h, this.x_pos, this.y_pos, this.dash.w, this.dash.h)
        }
    }
    animateHero(paused) {
        this.paused = paused 
        if 
            (this.tick_count >= (1000 / 12) / (1000 / 60) && this.speed < 3) 
            ((this.Y === 64 * 3 || this.Y === 64 * 7) ? this.X = (this.X + 64) % (64 * 7) : this.X = (this.X + 64) % 960, this.tick_count = 0)
        if (this.dash.tick_count >= (1000 / 60) / (1000 / 100) && this.speed > 3) (this.dash.X = (this.dash.X + 160) % 640, this.dash.tick_count = 0)
        if 
            (!paused) (this.tick_count++, this.dash.tick_count++)
    }   
    addEventListeners() {
        addEventListener("keydown", (e) => {
            if (e.keyCode === 87) this.keys.w = true
            if (e.keyCode === 65) this.keys.a = true
            if (e.keyCode === 83) this.keys.s = true
            if (e.keyCode === 68) this.keys.d = true
            if (e.keyCode === 16 && (!this.paused)) (this.speed = 15, setTimeout(() => this.speed = 2, 200))
        })
    
        addEventListener("keyup", (e) => {
            if (e.keyCode === 87) (this.keys.w = false, (!this.paused) ? this.Y = 64 * 3 : 0)
            if (e.keyCode === 65) (this.keys.a = false, (!this.paused) ? this.Y = 64 : 0)
            if (e.keyCode === 83) (this.keys.s = false, (!this.paused) ? this.Y = 0 : 0)
            if (e.keyCode === 68) (this.keys.d = false, (!this.paused) ? this.Y = 64 * 2 : 0)
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