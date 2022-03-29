const axios = require('axios')
const SAPI = require('./SimplyAPI').SAPI
const System = require('./system')
const FrontHistory = require('./frontHistory')

class Friend extends SAPI {
    constructor(api, options) {
        super(api)
        if (options.content) {
            this.id = options.id
            this.exists = options.exists
            this.username = options.content.username || ''
            this.color = options.content.color || null
            this.desc = options.content.desc || ''
            this.fields = options.content.fields || []
            this.isASystem = options.content.isAsystem || false
            this.seeMembers = options.content.seeMembers || false
            this.seeFront = options.content.seeFront || false
            this.getFrontNotif = options.content.getFrontNotif || false
            this.getTheirFrontNotif = options.content.getTheirFrontNotif || false
            this.trusted = options.content.trusted || false
        }
        else {
            this.id = ''
            this.exists = false
            this.username = options.username || ''
            this.color = options.color || null
            this.desc = options.desc || ''
            this.fields = options.fields || []
            this.isASystem = options.isAsystem || false
            this.seeMembers = options.seeMembers || false
            this.seeFront = options.seeFront || false
            this.getFrontNotif = options.getFrontNotif || false
            this.getTheirFrontNotif = options.getTheirFrontNotif || false
            this.trusted = options.trusted || false
        }

        this.friend = {
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

    getFront = async () => {
        if (!this.friend.content.isASystem) return console.error('<Friend>.getFront() can only be called on a system friend')
        return new Promise(async (resolve) => {
            await axios.get(`${this.API().url}/friend/${this.friend.id}/getFrontValue`, {
                headers: this.API().header,
            })
                .then(async (res) => {
                    resolve(res.data)
                })
                .catch(err => console.error('<Friend>.getFront() method threw an error: ' + err.message || err.response.data))
        })
    }

    getIDsOfFronters = async () => {
        if (!this.friend.content.isASystem) return console.error('<Friend>.getIDsOfFronters() can only be called on a system friend')
        return new Promise(async (resolve) => {
            await axios.get(`${this.API().url}/friend/${this.friend.id}/getFront`, {
                headers: this.API().header,
            })
                .then(async (res) => {
                    resolve(res.data)
                })
                .catch(err => console.error('<Friend>.getFront() method threw an error: ' + err.message || err.response.data))
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
            await axios.patch(`${this.API().url}/friend/${this.friend.id}`, JSON.stringify(friendPermissions), {
                headers: this.API().header,
            })
                .then(async () => {
                    let system = new System(this.API())
                    resolve(await system.getFriendById(this.friend.id))
                })
                .catch(err => console.error('<Friend>.update() method threw an error: ' + err.message || err.response.data))
        })
    }

    delete = async () => {
        let friend = this.friend
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
                .catch(err => console.error('<Friend>.delete() method threw an error: ' + err.message || err.response.data))
        })
    }
}

module.exports = Friend