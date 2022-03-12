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
            this.seeMembers = options.content.seeMembers || false
            this.seeFront = options.content.seeFront || false
            this.getFrontNotif = options.content.getFrontNotif || false
            this.getTheirFrontNotif = options.content.getTheirFrontNotif || false
            this.trusted = options.content.trusted || false
        }
        else {
            this.id = ''
            this.exists = false
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
                seeMembers: this.seeMembers,
                seeFront: this.seeFront,
                getFrontNotif: this.getFrontNotif,
                getTheirFrontNotif: this.getTheirFrontNotif,
                trusted: this.trusted
            }
        }
    }

    getFront = async () => {
        return new Promise(async (resolve) => {
            await axios.get(`${this.API().url}/friend/${friend.id}/getFront`, {
                headers: this.API().header,
            })
                .then(async (res) => {
                    let front = new FrontHistory(res.data)
                    resolve(front)
                })
                .catch(err => console.error('<Friend>.update() method threw an error: ' + err.message || err.response.data))
        })
    }

    update = async () => {
        let friend = this.friend
        return new Promise(async (resolve) => {
            await axios.patch(`${this.API().url}/friend/${friend.id}`, JSON.stringify(friend.content), {
                headers: this.API().header,
            })
                .then(async () => {
                    let system = new System(this.API())
                    resolve(await system.getFriendById(friend.id))
                })
                .catch(err => console.error('<Friend>.update() method threw an error: ' + err.message || err.response.data))
        })
    }
}

module.exports = Friend