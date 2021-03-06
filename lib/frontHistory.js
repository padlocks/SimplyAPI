const axios = require('axios')
const SAPI = require('./SimplyAPI').SAPI
const System = require('./system')

class FrontHistory extends SAPI {
    constructor(api, options) {
        super(api)

        this.type = "frontHistory"
        this.id = options.id || ''
        this.exists = options.exists || false

        let content = options.content ?? options
        this.custom = content.custom || false
        this.live = content.live || false
        this.customStatus = content.customStatus || ''
        this.member = content.member
        this.startTime = content.startTime
        this.endTime = content.endTime
        
        this.get = () => {
            return {
                exists: this.exists,
                id: this.id,
                content: {
                    custom: this.custom,
                    live: this.live,
                    customStatus: this.customStatus,
                    member: this.member,
                    startTime: this.startTime,
                    endTime: this.endTime
                }
            }
        }
    }

    create = async () => {
        let customFront = this.get()
        return new Promise(async (resolve) => {
            await axios.post(`${this.API().url}/frontHistory`, JSON.stringify(customFront.content), {
                headers: this.API().header,
            })
                .then(async (res) => {
                    let system = new System(this.API())
                    resolve(await system.getFrontById(res.data))
                })
                .catch(err => console.error(`<FrontHistory>.create() method threw an error: ${err.message}\nReason: ${err.response?.data}`))
        })
    }

    remove = async () => {
        let customFront = this.get()
        let patchedFront = {
            custom: customFront.custom,
            live: false,
            startTime: customFront.startTime,
            endTime: Date.now(),
            member: customFront.member,
            customStatus: customFront.customStatus
        }
        return new Promise(async (resolve) => {
            await axios.patch(`${this.API().url}/frontHistory/${customFront.id}`, patchedFront, {
                headers: this.API().header,
            })
                .then(async () => {
                    let system = new System(this.API())
                    await system.getFrontById(customFront.id)
                    .then((match) => {
                        let success = !match.exists
                        resolve(success)
                    })
                })
                .catch(err => console.error(`<FrontHistory>.remove() method threw an error: ${err.message}\nReason: ${err.response?.data}`))
        })
    }

    update = async () => {
        let customFront = this.get()
        return new Promise(async (resolve) => {
            await axios.patch(`${this.API().url}/frontHistory/${customFront.id}`, customFront, {
                headers: this.API().header,
            })
                .then(async (res) => {
                    let system = new System(this.API())
                    resolve(await system.getFrontById(res.data))
                })
                .catch(err => console.error(`<FrontHistory>.update() method threw an error: ${err.message}\nReason: ${err.response?.data}`))
        })
    }

    delete = async () => {
        let customFront = this.get()
        return new Promise(async (resolve) => {
            await axios.delete(`${this.API().url}/frontHistory/${customFront.id}`, {
                headers: this.API().header,
            })
                .then(async () => {
                    let system = new System(this.API())
                    await system.getFrontById(customFront.id)
                        .then((match) => {
                            let success = !match.exists
                            resolve(success)
                        })
                })
                .catch(err => console.error(`<FrontHistory>.delete() method threw an error: ${err.message}\nReason: ${err.response?.data}`))
        })
    }

    getComments = async () => {
        let customFront = this.get()
        return new Promise(async (resolve) => {
            await axios.get(`${this.API().url}/comments/${this.type}/${customFront.id}`, {
                headers: this.API().header
            })
                .then((comments) => {
                    resolve(comments.data)
                })
                .catch(err => console.error(`<FrontHistory>.getComments() method threw an error: ${err.message}\nReason: ${err.response?.data}`))
        })
    }
}

module.exports = FrontHistory