const axios = require('axios')
const SAPI = require('./SimplyAPI').SAPI
const System = require('./system')

class Friend extends SAPI {
    constructor(api, options) {
        super(api)

        this.id = options.id || ''
        this.exists = options.exists || false

        let content = options.content ?? options
        this.username = content.username || ''
        this.color = content.color || null
        this.desc = content.desc || ''
        this.fields = content.fields || []
        this.isASystem = content.isAsystem || false
        this.seeMembers = content.seeMembers || false
        this.seeFront = content.seeFront || false
        this.getFrontNotif = content.getFrontNotif || false
        this.getTheirFrontNotif = content.getTheirFrontNotif || false
        this.trusted = content.trusted || false
        
        this.get = () => {
            return {
                exists: this.exists,
                id: this.id,
                content: {
                    username: this.username,
                    color: this.color,
                    desc: this.desc,
                    fields: this.fields,
                    isASystem: this.isASystem,
                    seeMembers: this.seeMembers,
                    seeFront: this.seeFront,
                    getFrontNotif: this.getFrontNotif,
                    getTheirFrontNotif: this.getTheirFrontNotif,
                    trusted: this.trusted
                }
            }
        }
    }

    getFront = async () => {
        if (!this.get().content.isASystem) return console.error('<Friend>.getFront() can only be called on a system friend')
        return new Promise(async (resolve) => {
            await axios.get(`${this.API().url}/friend/${this.get().id}/getFrontValue`, {
                headers: this.API().header,
            })
                .then(async (res) => {
                    resolve(res.data)
                })
                .catch(err => console.error(`<Friend>.getFront() method threw an error: ${err.message}\nReason: ${err.response?.data}`))
        })
    }

    getFronterIDs = async () => {
        if (!this.get().content.isASystem) return console.error('<Friend>.getFronterIDs() can only be called on a system friend')
        return new Promise(async (resolve) => {
            await axios.get(`${this.API().url}/friend/${this.get().id}/getFront`, {
                headers: this.API().header,
            })
                .then(async (res) => {
                    resolve(res.data)
                })
                .catch(err => console.error(`<Friend>.getFronterIDs() method threw an error: ${err.message}\nReason: ${err.response?.data}`))
        })
    }

    update = async () => {
        let friendPermissions = {
            seeMembers: this.seeMembers,
            seeFront: this.seeFront,
            getFrontNotif: this.getFrontNotif,
            getTheirFrontNotif: this.getTheirFrontNotif,
            trusted: this.trusted
        }
        return new Promise(async (resolve) => {
            await axios.patch(`${this.API().url}/friend/${this.get().id}`, JSON.stringify(friendPermissions), {
                headers: this.API().header,
            })
                .then(async () => {
                    let system = new System(this.API())
                    resolve(await system.getFriendById(this.get().id))
                })
                .catch(err => console.error(`<Friend>.update() method threw an error: ${err.message}\nReason: ${err.response?.data}`))
        })
    }

    delete = async () => {
        let friend = this.get()
        return new Promise(async (resolve) => {
            await axios.delete(`${this.API().url}/friend/remove/${friend.id}`, {
                headers: this.API().header,
            })
                .then(async () => {
                    let system = new System(this.API())
                    await system.getMemberById(member.id)
                        .then((match) => {
                            let success = !match.exists
                            resolve(success)
                        })
                })
                .catch(err => console.error(`<Friend>.delete() method threw an error: ${err.message}\nReason: ${err.response?.data}`))
        })
    }
}

module.exports = Friend