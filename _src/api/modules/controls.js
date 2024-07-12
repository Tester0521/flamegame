class Joystick {
    constructor(containerId, onMoveCallback) {
        this.container = document.getElementById(containerId)
        this.onMoveCallback = onMoveCallback

        this.joystickCenterX = this.container.offsetWidth / 2
        this.joystickCenterY = this.container.offsetHeight / 2

        this.joystick = document.createElement('div')
        this.joystick.classList.add('joystick')
        this.joystick.style.left = `${this.joystickCenterX - this.joystick.offsetWidth / 2}px`
        this.joystick.style.top = `${this.joystickCenterY - this.joystick.offsetHeight / 2}px`
        this.container.appendChild(this.joystick)

        this.dragging = false
        this.startX = 0
        this.startY = 0

        this.addEventListeners()
        this.setInitPos()
    }

    setInitPos() {
        this.joystickCenterX = this.container.offsetWidth / 2
        this.joystickCenterY = this.container.offsetHeight / 2
        this.joystick.style.left = `${this.joystickCenterX - this.joystick.offsetWidth / 2}px`
        this.joystick.style.top = `${this.joystickCenterY - this.joystick.offsetHeight / 2}px`
    }

    addEventListeners() {
        this.joystick.addEventListener('touchstart', (e) => this.onStart(e))
        this.joystick.addEventListener('mousedown', (e) => this.onStart(e))

        this.joystick.addEventListener('touchmove', (e) => this.onMove(e))
        this.joystick.addEventListener('mousemove', (e) => this.onMove(e))

        this.joystick.addEventListener('touchend', () => this.onEnd())
        this.joystick.addEventListener('mouseup', () => this.onEnd())
    }

    onStart(e) {
        this.dragging = true
        const touch = e.touches ? e.touches[0] : e
        this.startX = touch.clientX
        this.startY = touch.clientY
        this.joystick.style.transition = '0s'
        this.joystick.style.position = 'absolute'
    }

    onMove(e) {
        if (!this.dragging) return

        const touch = e.touches ? e.touches[0] : e
        const dx = (touch.clientX - this.startX) / 50
        const dy = (touch.clientY - this.startY) / 50

        this.onMoveCallback(dx, dy)

        this.joystick.style.transform = `translate(${dx * 50}px, ${dy * 50}px)`
    }

    onEnd() {
        this.dragging = false
        this.joystick.style.transition = '0.3s'
        this.joystick.style.transform = 'translate(0px, 0px)'
        this.onMoveCallback(0, 0)
    }
}

class Shift {
    constructor(selector, hero) {
        this.container = document.body.querySelector(selector)

        this.addEventListeners(hero)
    }

    addEventListeners(hero) {
        this.container.addEventListener('mousedown', () => hero.dashing())
        this.container.addEventListener('touchstart', () => hero.dashing())
    }

}

export { Joystick, Shift }
