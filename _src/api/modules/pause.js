

class Pause {
    constructor(keys) {
        this.paused = false
        this.keys = keys
        this.score = 0
        this.pauseBtn = document.body.querySelector(".pauseBtn")
        this.pauseBtn.onclick = () => this.togglePause(this.keys)

        this.addEventListeners()
    }
    
    togglePause(keys) {
        this.paused = !this.paused
        if (keys === 'function') Object.keys(keys).forEach(k => keys[k] = false)

        const pauseScreen = document.createElement('div')
        const pauseContent = document.createElement('div')
        const pauseButtons = document.createElement('div')
        const pauseTitle = document.createElement('h1')
        const resumeButton = document.createElement('button')
        const homeButton = document.createElement('button')

        const createPauseBlock = () => {
            
            pauseScreen.id = 'pauseBlock'
            pauseScreen.className = 'pauseScreen'
            pauseContent.className = 'pauseContent'
            pauseButtons.className = 'pauseButtons'
            pauseTitle.className = 'pauseTitle'
            pauseTitle.textContent = `score: ${this.score}`
            resumeButton.className = 'resumeButton'
            resumeButton.textContent = 'Resume'
            resumeButton.onclick = () => this.togglePause(this.keys)
            homeButton.className = 'homeButton'
            homeButton.textContent = 'Leave'
            homeButton.onclick = () => document.location = '/'

            pauseButtons.appendChild(homeButton)
            pauseButtons.appendChild(resumeButton)
            pauseContent.appendChild(pauseTitle)
            pauseContent.appendChild(pauseButtons)
            pauseScreen.appendChild(pauseContent)
            document.body.appendChild(pauseScreen)
        }

        const removePauseBlock = () => document.body.removeChild(document.body.querySelector('.pauseScreen'));

        (this.paused) ? createPauseBlock() : removePauseBlock()
    }

    refreshScore(score) {
        this.score = score
    }

    addEventListeners() {
        addEventListener('keydown', (e) => {
            if (e.keyCode === 27) this.togglePause(this.keys)
            if (e.keyCode === 80) this.togglePause(this.keys)
        })
    }
}

export { Pause }