
class Mobs {
    constructor() {
        this.arr = []
        this.arrDead = []
        this.lastMobspawn = 0
        this.score = 0
        this.sprites = {
            mob1: new Image(),
            mob2: new Image(),
            dead: new Image(),
        }
    }
    spawnMob() {
        const randomStyle = Math.random() < 0.5 ? this.sprites.mob1 : this.sprites.mob2
        const mob = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            w: 64,
            h: 64,
            speed: 2,
            style: randomStyle,
            alive: true,
            frame: 0,
            tick: 300,
            deadFrames: 8,
        }
        this.arr.push(mob)
        this.lastMobspawn = Date.now()
    }
    draw(ctx) {
        this.arr.forEach((mob) => {
            const ratio = Math.min(canvas.width / mob.w / 10, canvas.height / mob.h / 10)
            ctx.drawImage(mob.style, 0, 0, mob.w, mob.h, mob.x, mob.y, mob.w*ratio, mob.h*ratio)
        })
        this.arrDead.forEach((mob) => {
            const ratio = Math.min(canvas.width / mob.w / 10, canvas.height / mob.h / 10)
            ctx.drawImage(mob.style, 29 * mob.frame, 0, 29, mob.h / 2, mob.x, mob.y, mob.w*ratio, mob.h*ratio)
        })
    }

    update(hero) {
        this.arr.forEach(mob => {
            if (mob.alive) {
                const dx = hero.x_pos - mob.x;
                const dy = hero.y_pos - mob.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                mob.x += (dx / distance) * mob.speed;
                mob.y += (dy / distance) * mob.speed;

                if (
                    mob.x >= hero.x_pos - mob.w / 2 && 
                    mob.x <= hero.x_pos + hero.w - mob.w / 2 && 
                    mob.y >= hero.y_pos - mob.h / 2 && 
                    mob.y <= hero.y_pos + hero.h - mob.h / 2
                ) {
                    if (hero.speed > 3) {
                        mob.alive = false
                        mob.style = this.sprites.dead
                        this.score += 5
                        this.arrDead.push(mob)     
                    } 
                } 
            }
        })
        this.arr = this.arr.filter(mob => mob.alive)
    }

    animateMobs(paused) {
        if (!paused) this.arrDead.forEach((mob, i) => {
            mob.tick++
            if (mob.tick >= 30) {
                mob.tick = 0
                mob.frame++
                if (mob.frame >= mob.deadFrames) {
                    this.arrDead.splice(i, 1)
                }
            }
        })
    }
}

export { Mobs }