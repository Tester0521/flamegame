
class Hero {
    constructor() {
        this.w = 64
        this.h = 64
        this.X = 0
        this.Y = 0
        this.x_pos = 4000
        this.y_pos = 2000
        this.tick_count = 0
        this.sprite = new Image()
        this.speed = 2
        this.lastPosX = 4000
        this.lastPosY = 2000        
        this.paused = false
        this.keys = { w: false, a: false, s: false, d: false, }
        this.dash = { sprite: new Image(), w: 128, h: 64, frame: 0, tick_count: 0, X: 0, Y: 0, dashTimer: null, cooldown: true}

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

        const cameraOffsetX = canvas.width / 2 - this.w / 2
        const cameraOffsetY = canvas.height / 2 - this.h / 2
        const notAngle = () => (
            (!(
                (this.x_pos < bg.leftWall && this.y_pos < bg.topWall) || (this.x_pos < bg.leftWall && this.y_pos > bg.botWall) ||
                (this.x_pos > bg.rightWall && this.y_pos < bg.topWall) || (this.x_pos > bg.rightWall && this.y_pos > bg.botWall) 
            )) 
        )


            
        if (
            this.x_pos + dx > -(cameraOffsetX) && 
            this.y_pos + dy > -(cameraOffsetY) && 
            this.y_pos + dy < 4000 - cameraOffsetY - this.h &&
            this.x_pos + dx < 8000 - cameraOffsetX - this.w
        ) {
            this.x_pos += dx 
            this.y_pos += dy


            if (dy < 0) (this.Y = 64 * 7, this.dash.Y = 192)
            else if (dy > 0) (this.Y = 64 * 4, this.dash.Y = 128)
            else if (dx > 0) (this.Y = 64 * 6, this.dash.Y = 0)
            else if (dx < 0) (this.Y = 64 * 5, this.dash.Y = 64)

            if (this.y_pos <= bg.topWall || this.y_pos >= bg.botWall) {

                if ((this.keys.a || this.keys.d) && notAngle()) {
                    this.lastPosX = this.x_pos
                    bg.x += dx
                }

                bg.walls.top = true
            }
            if (this.x_pos <= bg.leftWall || this.x_pos >= bg.rightWall) {

                if ((this.keys.w || this.keys.s) && notAngle()) {
                    this.lastPosY = this.y_pos
                    bg.y += dy
                }

                bg.walls.left = true
            }
            if (this.x_pos > bg.leftWall && this.y_pos > bg.topWall && this.x_pos < bg.rightWall && this.y_pos < bg.botWall) {
                if (bg.walls.top) (bg.y -= dy, this.lastPosY -= dy)
                if (bg.walls.left) bg.x -= dx
                bg.walls.top = false
                bg.walls.left = false
                this.lastPosX = this.x_pos
                this.lastPosY = this.y_pos
                bg.x += dx
                bg.y += dy 
            }
        } 
    }

    draw(ctx) {
        const ratio = Math.min(canvas.width / this.w / 10, canvas.height / this.h / 10)
        const ratioDash = Math.min(canvas.width / this.dash.w / 10, canvas.height / this.dash.h / 10)

        if (this.speed < 3) ctx.drawImage(this.sprite, this.X, this.Y, this.w, this.h, this.x_pos, this.y_pos, this.w*ratio, this.h*ratio)
        else ctx.drawImage(this.dash.sprite, this.dash.X, this.dash.Y, this.dash.w, this.dash.h, this.x_pos, this.y_pos, this.dash.w*ratioDash, this.dash.h*ratioDash)
    }
    animateHero(paused) {
        this.paused = paused 
        if 
            (this.tick_count >= (1000 / 12) / (1000 / 60) && this.speed < 3) 
            ((this.Y === 64 * 3 || this.Y === 64 * 7) ? this.X = (this.X + 64) % (64 * 7) : this.X = (this.X + 64) % 960, this.tick_count = 0)
        if 
            (this.dash.tick_count >= (1000 / 60) / (1000 / 100) && this.speed > 3) 
            (this.dash.X = (this.dash.X + 160) % 640, this.dash.tick_count = 0)
        if 
            (!paused) (this.tick_count++, this.dash.tick_count++)          
    }   
    addEventListeners() {
        addEventListener("keydown", (e) => {
            if (e.keyCode === 87) this.keys.w = true
            if (e.keyCode === 65) this.keys.a = true
            if (e.keyCode === 83) this.keys.s = true
            if (e.keyCode === 68) this.keys.d = true
            if (e.keyCode === 16) this.dashing()
        })
    
        addEventListener("keyup", (e) => {
            if (e.keyCode === 87) ((this.keys.w = null), this.Y = 64 * 3)
            if (e.keyCode === 65) ((this.keys.a = null), this.Y = 64 * 1)
            if (e.keyCode === 83) ((this.keys.s = null), this.Y = 64 * 0)
            if (e.keyCode === 68) ((this.keys.d = null), this.Y = 64 * 2)
            if (e.keyCode === 16 && !this.paused && !this.dash.dashTimer) this.speed = 2
        })
    } 
    dashing() {
        if (!this.paused && this.dash.cooldown && (this.keys.w || this.keys.a || this.keys.s || this.keys.d)) {
            const shiftBtnText = document.body.querySelector('.shiftBtn_text')
                
            this.speed = 12
            this.dash.cooldown = false
            if (this.dash.dashTimer) clearTimeout(this.dash.dashTimer)
            this.dash.dashTimer = setTimeout(() => {
                this.speed = 2
                this.dash.dashTimer = null
            }, 200)
            // setInterval((c = 1000) => shiftBtnText.textContent = `0,${c++}s`, 10)
            setTimeout(() => this.dash.cooldown = true, 1000) 
        }
    }

}

class Trail {
    constructor() {
        this.frames = 5
        this.width = 64
        this.height = 77
        this.sprite = new Image()
        this.trails = []
        this.tickInterval = 25
        this.lastTimeSpawn = 0
    }

    add(x, y) {
        this.trails.push({ x, y, frame: 0, tick: 0 })
        this.lastTimeSpawn = Date.now()
    }
    draw(ctx) {
        const ratioTrail = Math.min(canvas.width / this.width / 10, canvas.height / this.height / 10)
        this.trails.forEach(el => {
            ctx.drawImage(
                this.sprite,
                el.frame * this.width,
                0,
                this.width,
                this.height,
                el.x,
                el.y,
                this.width*1.5*ratioTrail,
                this.height*1.5*ratioTrail
            )
        })
        this.trails = this.trails.filter(el => (el.frame < this.frames))
    }

    animateTrail(paused) {
        this.trails.forEach(el => {
            if (el.tick >= (1000 / 12) / (1000 / 60)) (el.frame++, el.tick = 0)
            if (!paused) el.tick++
        })
    }
}


export { Hero, Trail }