const axios = require('axios')
const SAPI = require('./SimplyAPI').SAPI
const System = require('./system')

class Member extends SAPI {
    constructor(api, options) {
        super(api)
        this.member = {
            exists: options.exists || false,
            id: options.id || '',
            content: options
        }

        if (options.content) {
            this.id = options.id
            this.exists = options.exists
            this.name = options.content.name
            this.desc = options.content.desc
            this.pronouns = options.content.pronouns
            this.pkId = options.content.pkId
            this.color = options.content.color
            this.avatarUuid = options.content.avatarUuid
            this.avatarUrl = options.content.avatarUrl
            this.private = options.content.private || true
            this.preventTrusted = options.content.preventTrusted || false
            this.preventFrontNotifs = options.content.preventFrontNotifs || false
            this.info = options.content.info || {}
        }
        else {
            this.id = ''
            this.exists = false
            this.name = options.name
            this.desc = options.desc
            this.pronouns = options.pronouns
            this.pkId = options.pkId
            this.color = options.color
            this.avatarUuid = options.avatarUuid
            this.avatarUrl = options.avatarUrl
            this.private = options.private || true
            this.preventTrusted = options.preventTrusted || false
            this.preventFrontNotifs = options.preventFrontNotifs || false
            this.info = options.info || {}
        }
    }

    create = async () => {
        let member = this.member
        return new Promise(async (resolve) => {
            await axios.post(`${this.API().url}/member/`, JSON.stringify(member.content), {
                headers: this.API().header,
            })
                .then(async (res) => {
                    let system = new System(this.API())
                    resolve(await system.getMemberById(res.data))
                })
                .catch(err => console.error('<Member>.create() method threw an error: ' + err.response.data))
        })
    }

    delete = async () => {
        let member = this.member
        return new Promise(async (resolve) => {
            await axios.delete(`${this.API().url}/member/${member.id}`, {
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
                .catch(err => console.error('<Member>.delete() method threw an error: ' + err))
        })
    }
}

module.exports = Member