const axios = require('axios')
const Member = require('./member')
const SAPI = require('./SimplyAPI').SAPI
const System = require('./system')

class Note extends SAPI {
    constructor(api, options) {
        super(api)

        this.id = options.id || ''
        this.exists = options.exists || false

        let content = options.content ?? options
        this.title = content.title || 'Untitled'
        this.note = content.note || ''
        this.color = content.color || ''
        this.member = content.member || ''
        this.date = content.date || Date.now()

        this.get = () => {
            return {
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
    }

    create = async () => {
        let note = this.get()
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
                .catch(err => console.error(`<Note>.create() method threw an error: ${err.message}\nReason: ${err.response?.data}`))
        })
    }

    update = async () => {
        let note = this.get()
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
                .catch(err => console.error(`<Note>.update() method threw an error: ${err.message}\nReason: ${err.response?.data}`))
        })
    }

    delete = async () => {
        let note = this.get()
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
                .catch(err => console.error(`<Note>.delete() method threw an error: ${err.message}\nReason: ${err.response?.data}`))
        })
    }
}

module.exports = Note