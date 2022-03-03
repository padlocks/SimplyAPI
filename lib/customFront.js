const axios = require('axios')
const SAPI = require('./SimplyAPI').SAPI
const System = require('./system')

class CustomFront extends SAPI {
    constructor(api, options) {
        super(api)
        this.customFront = {
            exists: options.exists || false,
            id: options.id || '',
            content: options.content || options
        }

        if (options.content) {
            this.id = options.id
            this.exists = options.exists
            this.name = options.content.name
            this.desc = options.content.desc
            this.avatarUrl = options.content.avatarUrl
            this.avatarUuid = options.content.avatarUuid
            this.color = options.content.color
            this.private = options.content.private || true
            this.preventTrusted = options.content.preventTrusted || false
        }
        else {
            this.id = ''
            this.exists = false
            this.name = options.name
            this.desc = options.desc
            this.avatarUrl = options.avatarUrl
            this.avatarUuid = options.avatarUuid
            this.color = options.color
            this.private = options.private || true
            this.preventTrusted = options.preventTrusted || false
        }
    }

    create = async () => {
        let customFront = this.customFront
        return new Promise(async (resolve) => {
            await axios.post(`${this.API().url}/customFront`, JSON.stringify(customFront.content), {
                headers: this.API().header,
            })
                .then(async (res) => {
                    let system = new System(this.API())
                    let f = await system.getCustomFrontById(res.data)
                    if (f.exists) resolve(f)
                })
                .catch(err => console.error('<CustomFront>.create() method threw an error: ' + err))
        })
    }

    update = async () => {
        let customFront = this.customFront
        delete customFront.content.uid 
        delete customFront.content.lastOperationTime

        return new Promise(async (resolve) => {
            await axios.patch(`${this.API().url}/customFront/${customFront.id}`, customFront.content, {
                headers: this.API().header,
            })
                .then(async () => {
                    let system = new System(this.API())
                    await system.getCustomFrontById(customFront.id)
                        .then((match) => {
                            resolve(match.content.name == customFront.content.name)
                        })
                })
                .catch(err => console.error('<CustomFront>.Update() method threw an error: ' + err.response.data))
        })
    }

    delete = async () => {
        let customFront = this.customFront
        return new Promise(async (resolve) => {
            await axios.delete(`${this.API().url}/customFront/${customFront.id}`, {
                headers: this.API().header,
            })
                .then(async () => {
                    let system = new System(this.API())
                    await system.getCustomFrontById(customFront.id)
                        .then((match) => {
                            let success
                            if (match) success = !match.exists
                            else success = true
                            resolve(success)
                        })
                })
                .catch(err => console.error('<CustomFront>.Delete() method threw an error: ' + err))
        })
    }
}

module.exports = CustomFront