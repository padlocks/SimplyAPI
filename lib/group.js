const axios = require('axios')
const SAPI = require('./SimplyAPI').SAPI
const System = require('./system')

class Group extends SAPI {
    constructor(api, options) {
        super(api)
        this.group = {
            exists: options.exists || false,
            id: options.id || '',
            content: options
        }

        if (options.content) {
            this.id = options.id
            this.exists = options.exists
            this.name = options.content.name
            this.desc = options.content.desc
            this.emoji = options.content.emoji
            this.parent = options.content.parent
            this.color = options.content.color
            this.preventTrusted = options.content.preventTrusted || false
            this.preventFrontNotifs = options.content.preventFrontNotifs || false
            this.members = options.content.members || []
        }
        else {
            this.id = ''
            this.exists = false
            this.name = options.name
            this.desc = options.desc
            this.emoji = options.emoji
            this.parent = options.parent
            this.color = options.color
            this.preventTrusted = options.preventTrusted || false
            this.preventFrontNotifs = options.preventFrontNotifs || false
            this.members = options.members || []
        }
    }

    create = async () => {
        let group = this.group
        return new Promise(async (resolve) => {
            await axios.post(`${this.API().url}/group/`, JSON.stringify(group.content), {
                headers: this.API().header,
            })
                .then(async (res) => {
                    let system = new System(this.API())
                    resolve(await system.findGroupById(res.data))
                })
                .catch(err => console.error('<Group>.create() method threw an error: ' + err.response.data))
        })
    }

    delete = async () => {
        let group = this.group
        return new Promise(async (resolve) => {
            await axios.delete(`${this.API().url}/group/${group.id}`, {
                headers: this.API().header,
            })
                .then(async () => {
                    let system = new System(this.API())
                    await system.findGroupById(group.id)
                        .then((match) => {
                            let success = !match.exists
                            resolve(success)
                        })
                })
                .catch(err => console.error('<Group>.delete() method threw an error: ' + err))
        })
    }
}

module.exports = Group