const axios = require('axios')
const SAPI = require('./SimplyAPI').SAPI
const System = require('./system')

class FrontHistory extends SAPI {
    constructor(api, options) {
        super(api)
        this.customFront = {
            exists: options.exists || false,
            id: options.id || '',
            content: options
        }

        if (options.content) {
            this.id = options.id
            this.exists = options.exists
            this.custom = options.content.custom || false
            this.live = options.content.live || false
            this.customStatus = options.content.customStatus || ''
            this.member = options.content.member
            this.startTime = options.content.startTime
            this.endTime = options.content.endTime
        }
        else {
            this.id = ''
            this.exists = false
            this.custom = options.custom || false
            this.live = options.live || false
            this.customStatus = options.customStatus || ''
            this.member = options.member
            this.startTime = options.startTime
            this.endTime = options.endTime
        }
    }

    create = async () => {
        let customFront = this.customFront
        return new Promise(async (resolve) => {
            await axios.post(`${this.API().url}/frontHistory`, JSON.stringify(customFront.content), {
                headers: this.API().header,
            })
                .then(async (res) => {
                    let system = new System(this.API())
                    resolve(await system.getFrontById(res.data))
                })
                .catch(err => console.error('<FrontHistory>.create() method threw an error: ' + err.response.data))
        })
    }

    remove = async () => {
        let customFront = this.customFront
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
                .catch(err => console.error('<FrontHistory>.remove() method threw an error: ' + err.response.data))
        })
    }

    update = async () => {
        let customFront = this.customFront
        return new Promise(async (resolve) => {
            await axios.patch(`${this.API().url}/frontHistory/${customFront.id}`, customFront, {
                headers: this.API().header,
            })
                .then(async (res) => {
                    let system = new System(this.API())
                    resolve(await system.getFrontById(res.data))
                })
                .catch(err => console.error('<FrontHistory>.update() method threw an error: ' + err.response.data))
        })
    }

    delete = async () => {
        let customFront = this.customFront
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
                .catch(err => console.error('<FrontHistory>.delete() method threw an error: ' + err.response.data))
        })
    }
}

module.exports = FrontHistory