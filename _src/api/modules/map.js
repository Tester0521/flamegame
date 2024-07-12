

class Map {
    constructor() {
        this.sprite = new Image()
        this.x = 4000
        this.y = 2000
        this.topWall = canvas.height / 20
        this.leftWall = canvas.width / 50
        this.botWall = 3300
        this.rightWall = 7000
        this.walls = {
            top: false,
            left: false, 
            bot: false,
            right: false,
        }
    }

    draw(ctx) {
        ctx.drawImage(this.sprite, -this.x, -this.y, 8000, 4000)
    }
}

export { Map }