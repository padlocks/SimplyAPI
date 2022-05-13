const axios = require('axios')
const SAPI = require('./SimplyAPI').SAPI
const System = require('./system')

class RepeatedTimer extends SAPI {
    constructor(api, options) {
        super(api)

        this.id = options.id || ''
        this.exists = options.exists || false

        let content = options.content ?? options
        this.name = content.name || 'Untitled Timer'
        this.message = content.message || ''
        this.dayInterval = content.dayInterval || 3
        this.time = content.time || {
            hour: 12,
            minute: 0
        }
        this.startTime = content.startTime || {
            year: 2022,
            month: 1,
            day: 1
        }

        this.get = () => {
            return {
                exists: this.exists,
                id: this.id,
                content: {
                    name: this.name,
                    message: this.message,
                    dayInterval: this.dayInterval,
                    time: this.time,
                    startTime: this.startTime
                }
            }
        }
    }

    create = async () => {
        let timer = this.get()
        return new Promise(async (resolve) => {
            await axios.post(`${this.API().url}/timer/repeated`, JSON.stringify(timer.content), {
                headers: this.API().header,
            })
                .then(async (res) => {
                    let system = new System(this.API())
                    resolve(await system.getRepeatedTimerById(res.data))
                })
                .catch(err => console.error(`<RepeatedTimer>.create() method threw an error: ${err.message}\nReason: ${err.response?.data}`))
        })
    }

    update = async () => {
        let timer = this.get()
        return new Promise(async (resolve) => {
            await axios.patch(`${this.API().url}/timer/repeated/${timer.id}`, timer.content, {
                headers: this.API().header,
            })
                .then(async (res) => {
                    let system = new System(this.API())
                    resolve(await system.getRepeatedTimerById(res.data))
                })
                .catch(err => console.error(`<RepeatedTimer>.update() method threw an error: ${err.message}\nReason: ${err.response?.data}`))
        })
    }

    delete = async () => {
        let timer = this.get()
        return new Promise(async (resolve) => {
            await axios.delete(`${this.API().url}/timer/repeated/${timer.id}`, {
                headers: this.API().header,
            })
                .then(async () => {
                    let system = new System(this.API())
                    await system.getRepeatedTimerById(timer.id)
                        .then((match) => {
                            let success = !match.exists
                            resolve(success)
                        })
                })
                .catch(err => console.error(`<RepeatedTimer>.delete() method threw an error: ${err.message}\nReason: ${err.response?.data}`))
        })
    }
}

module.exports = RepeatedTimer