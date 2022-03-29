const axios = require('axios')
const assert = require('assert')
const SAPI = require('./SimplyAPI').SAPI
const System = require('./system')
const Util = require('./util')

class Member extends SAPI {
    constructor(api, options) {
        super(api)
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

        this.member = {
            exists: this.exists,
            id: this.id,
            content: {
                name: this.name,
                desc: this.desc,
                pronouns: this.pronouns,
                pkId: this.pkId,
                color: this.color,
                avatarUuid: this.avatarUuid,
                avatarUrl: this.avatarUrl,
                private: this.private,
                preventTrusted: this.preventTrusted,
                preventFrontNotifs: this.preventFrontNotifs,
                info: this.info
            }
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
                .catch(err => console.error('<Member>.create() method threw an error: ' + err.message || err.response.data))
        })
    }

    update = async () => {
        let member = this.member
        return new Promise(async (resolve) => {
            await axios.patch(`${this.API().url}/member/`, JSON.stringify(member.content), {
                headers: this.API().header,
            })
                .then(async (res) => {
                    let system = new System(this.API())
                    resolve(await system.getMemberById(res.data))
                })
                .catch(err => console.error('<Member>.update() method threw an error: ' + err.message || err.response.data))
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

    // pushes to PluralKit.
    push = async (options) => {
        let member = this.member
        let direction = 'push'
        let content = {
            member: member.id,
            token: this.API().pkToken,
            options: options || {}
        }

        return new Promise(async (resolve) => {
            if (!this.API().pkToken) return console.error('<Member>.push() method threw an error: method requires a PluralKit token (pkToken)')
            if (!options) return console.error('<Member>.push() method threw an error: method requires options argument')
            let a = this.API();

            await axios.patch(`${this.API().url}/integrations/pluralkit/sync/member/${member.id}`, content, direction, {
                headers: this.API().header,
            })
                .then(async (res) => {
                    let system = new System(this.API())
                    resolve(await system.getMemberById(res.data))
                })
                .catch(err => console.error('<Member>.push() method threw an error: ' + err.message || err.response.data))
        })
    }

    getNotes = async () => {
        let member = this.member
        return new Promise(async (resolve) => {
            let notes = await axios.get(`${this.API().url}/notes/${this.API().userId}/${member.id}`, {
                headers: this.API().header
            })
            resolve(notes.data)
        })
    }

    getNoteById = async (id) => {
        let found = false
        let notes = await this.getNotes()
        return new Promise(async (resolve) => {
            await Util.asyncForEach(notes, async (n) => {
                if (n.id == id) {
                    found = true
                    resolve(n)
                }
            })

            if (!found) resolve({ "name": "Unknown note", "exists": false })
        })
    }

    getNote = async (title) => {
        let found = false
        let notes = await this.getNotes()
        return new Promise(async (resolve) => {
            await Util.asyncForEach(notes, async (n) => {
                if (n.content.title.includes(title)) {
                    found = true
                    resolve(n)
                }
            })

            if (!found) resolve({ "name": "Unknown note", "exists": false })
        })
    }
}

module.exports = Member