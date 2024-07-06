

const Mobs = {
    arr: [],
    lastMobspawn: 0,
    score: 0,
    sprites: {
        mob1: new Image(),
        mob2: new Image(),
    },
    spawnMob: () => {
        const randomStyle = Math.random() < 0.5 ? Mobs.sprites.mob1 : Mobs.sprites.mob2
        const mob = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            w: 64,
            h: 64,
            speed: 1,
            style: randomStyle,
            alive: true,
        }
        Mobs.arr.push(mob)
    },
    draw(ctx) {
        this.arr.forEach((mob) => ctx.drawImage(mob.style, mob.x, mob.y, mob.w, mob.h))
    },

    update(Hero, Trail) {
        this.arr.forEach(mob => {
            if (mob.alive) {
                const dx = Hero.x_pos - mob.x;
                const dy = Hero.y_pos - mob.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                mob.x += (dx / distance) * mob.speed;
                mob.y += (dy / distance) * mob.speed;

                Trail.trails.forEach(trail => {
                    if (
                        mob.x >= trail.x - mob.w / 2 && 
                        mob.x <= trail.x + Trail.width - 
                        mob.w / 2 && mob.y >= trail.y - 
                        mob.h / 2 && mob.y <= trail.y + Trail.height - 
                        mob.h / 2 && trail.frame < 5)
                        (mob.alive = false, this.score += 5)
                })
            }
        })
        this.arr = this.arr.filter(mob => mob.alive);      
    }
}

export { Mobs }