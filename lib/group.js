const axios = require('axios')
const SAPI = require('./SimplyAPI').SAPI
const System = require('./system')

class Group extends SAPI {
    constructor(api, options) {
        super(api)
        if (options.content) {
            this.id = options.id
            this.exists = options.exists
            this.name = options.content.name
            this.desc = options.content.desc
            this.emoji = options.content.emoji
            this.parent = options.content.parent
            this.color = options.content.color
            this.preventTrusted = options.content.preventTrusted || false
            this.private = options.content.private || false
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
            this.private = options.private || false
            this.members = options.members || []
        }

        this.group = {
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

    create = async () => {
        let group = this.group
        return new Promise(async (resolve) => {
            await axios.post(`${this.API().url}/group/`, JSON.stringify(group.content), {
                headers: this.API().header,
            })
                .then(async (res) => {
                    let system = new System(this.API())
                    resolve(await system.getGroupById(res.data))
                })
                .catch(err => console.error('<Group>.create() method threw an error: ' + err.message || err.response.data))
        })
    }

    update = async () => {
        let group = this.group
        return new Promise(async (resolve) => {
            await axios.patch(`${this.API().url}/group/`, JSON.stringify(group.content), {
                headers: this.API().header,
            })
                .then(async (res) => {
                    let system = new System(this.API())
                    resolve(await system.getGroupById(res.data))
                })
                .catch(err => console.error('<Group>.update() method threw an error: ' + err.message || err.response.data))
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
                    await system.getGroupById(group.id)
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