const axios = require('axios')
const SAPI = require('./SimplyAPI').SAPI
const System = require('./system')
const Util = require('./util')

class Member extends SAPI {
    constructor(api, options) {
        super(api)
        
        this.id = options.id ?? ''
        this.exists = options.exists ?? false

        let content = options.content ?? options
        this.name = content.name
        this.desc = content.desc
        this.pronouns = content.pronouns
        this.pkId = content.pkId
        this.color = content.color
        this.avatarUuid = content.avatarUuid
        this.avatarUrl = content.avatarUrl
        this.private = content.private ?? true
        this.preventTrusted = content.preventTrusted ?? false
        this.preventFrontNotifs = content.preventFrontNotifs ?? false
        this.info = content.info ?? {}

        this.get = () => {
            return {
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
    }

    create = async () => {
        let member = this.get()
        return new Promise(async (resolve) => {
            await axios.post(`${this.API().url}/member/`, JSON.stringify(member.content), {
                headers: this.API().header,
            })
                .then(async (res) => {
                    let system = new System(this.API())
                    resolve(await system.getMemberById(res.data))
                })
                .catch(err => console.error(`<Member>.create() method threw an error: ${err.message}\nReason: ${err.response?.data}`))
        })
    }

    update = async () => {
        let member = this.get()
        return new Promise(async (resolve) => {
            await axios.patch(`${this.API().url}/member/`, JSON.stringify(member.content), {
                headers: this.API().header,
            })
                .then(async (res) => {
                    let system = new System(this.API())
                    resolve(await system.getMemberById(res.data))
                })
                .catch(err => console.error(`<Member>.update() method threw an error: ${err.message}\nReason: ${err.response?.data}`))
        })
    }

    delete = async () => {
        let member = this.get()
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
                .catch(err => console.error(`<Member>.delete() method threw an error: ${err.message}\nReason: ${err.response?.data}`))
        })
    }

    syncToPK = async (options) => {
        let member = this.member
        let direction = 'push'
        let content = {
            member: member.id,
            token: this.API().pkToken,
            options: options || {}
        }

        return new Promise(async (resolve) => {
            if (!this.API().pkToken) return console.error('<Member>.syncToPK() method threw an error: method requires a PluralKit token (pkToken)')
            if (!options) return console.error('<Member>.syncToPK() method threw an error: method requires options argument')

            await axios.patch(`${this.API().url}/integrations/pluralkit/sync/member/${member.id}`, content, direction, {
                headers: this.API().header,
            })
                .then(async (res) => {
                    let system = new System(this.API())
                    resolve(await system.getMemberById(res.data))
                })
                .catch(err => console.error('<Member>.syncToPK() method threw an error: ' + err.message || err.response.data))
        })
    }

    syncFromPK = async (options) => {
        let member = this.member
        let direction = 'pull'
        let content = {
            member: member.id,
            token: this.API().pkToken,
            options: options || {}
        }

        return new Promise(async (resolve) => {
            if (!this.API().pkToken) return console.error('<Member>.syncFromPK() method threw an error: method requires a PluralKit token (pkToken)')
            if (!options) return console.error('<Member>.syncFromPK() method threw an error: method requires options argument')

            await axios.patch(`${this.API().url}/integrations/pluralkit/sync/member/${member.id}`, content, direction, {
                headers: this.API().header,
            })
                .then(async (res) => {
                    let system = new System(this.API())
                    resolve(await system.getMemberById(res.data))
                })
                .catch(err => console.error('<Member>.syncFromPK() method threw an error: ' + err.message || err.response.data))
        })
    }

    getNotes = async () => {
        let member = this.get()
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

    getAvatar = async () => {
        let member = this.get()
        let avatarUuid = member.content.avatarUuid
        return new Promise(async (resolve) => {
            let avatar = await axios.get(`https://spaces.apparyllis.com/avatars/${this.API().userId}/${avatarUuid}`, {
                headers: { responseType: 'arraybuffer' }
            })
            let buffer = Buffer.from(avatar.data, 'binary')
            resolve(buffer)
        })
    }
}

module.exports = Member