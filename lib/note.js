const axios = require('axios')
const Member = require('./member')
const SAPI = require('./SimplyAPI').SAPI
const System = require('./system')

class Note extends SAPI {
    constructor(api, options) {
        super(api)
        if (options.content) {
            this.id = options.id
            this.exists = options.exists
            this.title = options.content.title || 'Untitled'
            this.note = options.content.note || ''
            this.color = options.content.color || ''
            this.member = options.content.member || ''
            this.date = options.content.date || Date.now()
        }
        else {
            this.id = ''
            this.exists = false
            this.title = options.title || 'Untitled'
            this.note = options.note || ''
            this.color = options.color || ''
            this.member = options.member || ''
            this.date = options.date || Date.now()
        }

        this.note = {
            exists: this.exists,
            id: this.id,
            content: {
                title: this.title,
                note: this.note,
                color: this.color,
                member: this.member,
                date: this.date
            }
        }
    }

    create = async () => {
        let note = this.note
        return new Promise(async (resolve) => {
            await axios.post(`${this.API().url}/note`, JSON.stringify(note.content), {
                headers: this.API().header,
            })
                .then(async (res) => {
                    let system = new System(this.API())
                    let memberData = await system.getMemberById(note.content.member)
                    let member = new Member(this.API(), memberData)
                    resolve(await member.getNoteById(res.data))
                })
                .catch(err => console.error('<Note>.create() method threw an error: ' + err.message || err.response.data))
        })
    }

    update = async () => {
        let note = this.note
        return new Promise(async (resolve) => {
            await axios.patch(`${this.API().url}/note/${note.id}`, note.content, {
                headers: this.API().header,
            })
                .then(async (res) => {
                    let system = new System(this.API())
                    let memberData = await system.getMemberById(note.content.member)
                    let member = new Member(this.API(), memberData)
                    resolve(await member.getNoteById(res.data))
                })
                .catch(err => console.error('<Note>.update() method threw an error: ' + err.message || err.response.data))
        })
    }

    delete = async () => {
        let note = this.note
        return new Promise(async (resolve) => {
            await axios.delete(`${this.API().url}/note/${note.id}`, {
                headers: this.API().header,
            })
                .then(async () => {
                    let system = new System(this.API())
                    let memberData = await system.getMemberById(note.content.member)
                    let member = new Member(this.API(), memberData)
                    await member.getNoteById(note.id)
                        .then((match) => {
                            let success = !match.exists
                            resolve(success)
                        })
                })
                .catch(err => console.error('<Note>.delete() method threw an error: ' + err.message || err.response.data))
        })
    }
}

module.exports = Note