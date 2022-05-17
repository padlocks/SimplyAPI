const axios = require('axios')
const SAPI = require('./SimplyAPI').SAPI
const System = require('./system')

class Group extends SAPI {
    constructor(api, options) {
        super(api)

        this.id = options.id || ''
        this.exists = options.exists || false

        let content = options.content ?? options
        this.name = content.name
        this.desc = content.desc
        this.emoji = content.emoji
        this.parent = content.parent
        this.color = content.color
        this.preventTrusted = content.preventTrusted || false
        this.private = content.private || false
        this.members = content.members || []

        this.get = () => {
            return {
                exists: this.exists,
                id: this.id,
                content: {
                    name: this.name,
                    desc: this.desc,
                    emoji: this.emoji,
                    parent: this.parent,
                    color: this.color,
                    preventTrusted: this.preventTrusted,
                    private: this.private,
                    members: this.members
                }
            }
        }
    }

    create = async () => {
        let group = this.get()
        return new Promise(async (resolve) => {
            await axios.post(`${this.API().url}/group/`, JSON.stringify(group.content), {
                headers: this.API().header,
            })
                .then(async (res) => {
                    let system = new System(this.API())
                    resolve(await system.getGroupById(res.data))
                })
                .catch(err => console.error(`<Group>.create() method threw an error: ${err.message}\nReason: ${err.response?.data}`))
        })
    }

    update = async () => {
        let group = this.get()
        return new Promise(async (resolve) => {
            await axios.patch(`${this.API().url}/group/`, JSON.stringify(group.content), {
                headers: this.API().header,
            })
                .then(async (res) => {
                    let system = new System(this.API())
                    resolve(await system.getGroupById(res.data))
                })
                .catch(err => console.error(`<Group>.update() method threw an error: ${err.message}\nReason: ${err.response?.data}`))
        })
    }

    delete = async () => {
        let group = this.get()
        return new Promise(async (resolve) => {
            await axios.delete(`${this.API().url}/group/${group.id}`, {
                headers: this.API().header,
            })
                .then(async () => {
                    let system = new System(this.API())
                    await system.getGroupById(group.id)
                        .then((match) => {
                            let success = !match.exists
                            resolve(success)
                        })
                })
                .catch(err => console.error(`<Group>.delete() method threw an error: ${err.message}\nReason: ${err.response?.data}`))
        })
    }
}

module.exports = Group