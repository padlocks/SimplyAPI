const axios = require('axios')
const SAPI = require('./SimplyAPI').SAPI
const System = require('./system')

class CustomFront extends SAPI {
    constructor(api, options) {
        super(api)

        this.id = options.id || ''
        this.exists = options.exists || false

        let content = options.content ?? options
        this.name = content.name
        this.desc = content.desc
        this.avatarUrl = content.avatarUrl
        this.avatarUuid = content.avatarUuid
        this.color = content.color
        this.private = content.private || true
        this.preventTrusted = content.preventTrusted || false

        this.get = () => {
            return {
                exists: this.exists,
                id: this.id,
                content: {
                    name: this.name,
                    desc: this.desc,
                    avatarUrl: this.avatarUrl,
                    avatarUuid: this.avatarUuid,
                    color: this.color,
                    private: this.private,
                    preventTrusted: this.preventTrusted
                }
            }
        }
    }

    create = async () => {
        let customFront = this.get()
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
        let customFront = this.get()
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
                .catch(err => console.error('<CustomFront>.update() method threw an error: ' + err.message || err.response.data))
        })
    }

    delete = async () => {
        let customFront = this.get()
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
                .catch(err => console.error('<CustomFront>.delete() method threw an error: ' + err))
        })
    }
}

module.exports = CustomFront