const axios = require('axios')
const SAPI = require('./SimplyAPI').SAPI
const System = require('./system')

class AutomatedTimer extends SAPI {
    constructor(api, options) {
        super(api)

        this.id = options.id || ''
        this.exists = options.exists || false

        let content = options.content ?? options
        this.name = content.name || 'Untitled Timer'
        this.message = content.message || ''
        this.action = content.action || 1
        this.delayInHours = content.member || 3
        this.type = content.type || 1

        this.get = () => {
            return {
                exists: this.exists,
                id: this.id,
                content: {
                    name: this.name,
                    message: this.message,
                    action: this.action,
                    delayInHours: this.delayInHours,
                    type: this.type
                }
            }
        }
    }

    create = async () => {
        let timer = this.get()
        return new Promise(async (resolve) => {
            await axios.post(`${this.API().url}/timer/automated`, JSON.stringify(timer.content), {
                headers: this.API().header,
            })
                .then(async (res) => {
                    let system = new System(this.API())
                    resolve(await system.getAutomatedTimerById(res.data))
                })
                .catch(err => console.error(`<AutomatedTimer>.create() method threw an error: ${err.message}\nReason: ${err.response?.data}`))
        })
    }

    update = async () => {
        let timer = this.get()
        return new Promise(async (resolve) => {
            await axios.patch(`${this.API().url}/timer/automated/${timer.id}`, timer.content, {
                headers: this.API().header,
            })
                .then(async (res) => {
                    let system = new System(this.API())
                    resolve(await system.getAutomatedTimerById(res.data))
                })
                .catch(err => console.error(`<AutomatedTimer>.update() method threw an error: ${err.message}\nReason: ${err.response?.data}`))
        })
    }

    delete = async () => {
        let timer = this.get()
        return new Promise(async (resolve) => {
            await axios.delete(`${this.API().url}/timer/automated/${timer.id}`, {
                headers: this.API().header,
            })
                .then(async () => {
                    let system = new System(this.API())
                    await system.getAutomatedTimerById(timer.id)
                        .then((match) => {
                            let success = !match.exists
                            resolve(success)
                        })
                })
                .catch(err => console.error(`<AutomatedTimer>.delete() method threw an error: ${err.message}\nReason: ${err.response?.data}`))
        })
    }
}

module.exports = AutomatedTimer