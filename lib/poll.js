const axios = require('axios')
const SAPI = require('./SimplyAPI').SAPI
const System = require('./system')

class Poll extends SAPI {
    constructor(api, options) {
        super(api)

        this.id = options.id || ''
        this.exists = options.exists || false

        let content = options.content ?? options
        let day = 24 * 60 * 60 * 1000
        this.name = content.name || 'Untitled Poll'
        this.desc = content.desc || 'This is a poll.'
        this.allowAbstain = content.allowAbstain || false
        this.allowVeto = content.allowVeto || false
        this.endTime = content.endTime || Date.now() + day * 3
        this.custom = content.custom?.enum?.[0] || false
        this.votes = content.votes || []
        this.options = content.options || []
        if (this.custom) this.options = [
            {
                name: "Option 1",
                color: "#ff0000"
            },
            {
                name: "Option 2",
                color: "#00ff00"
            }
        ]

        this.get = () => {
            let poll = {
                exists: this.exists,
                id: this.id,
                content: {
                    name: this.name,
                    desc: this.desc,
                    allowAbstain: this.allowAbstain,
                    allowVeto: this.allowVeto,
                    endTime: this.endTime,
                    custom: { "enum": [this.custom] },
                    votes: this.votes
                }
            }
            if (this.custom) poll.content.options = this.options
            return poll
        }
    }

    create = async () => {
        let poll = this.get()
        return new Promise(async (resolve) => {
            await axios.post(`${this.API().url}/poll`, JSON.stringify(poll.content), {
                headers: this.API().header,
            })
                .then(async (res) => {
                    console.log('aaaaaaaaaaaa')
                    let system = new System(this.API())
                    resolve(await system.getPollById(res.data))
                })
                .catch(err => console.error('<Poll>.create() method threw an error: ' + err.message || err.response.data))
        })
    }

    vote = async (memberId, comment, choice) => {
        let vote = { id: memberId, comment: comment, vote: choice }
        return new Promise(async (resolve) => {
            await axios.patch(`${this.API().url}/poll/${this.id}`, JSON.stringify(vote), {
                headers: this.API().header,
            })
                .then(async (res) => {
                    let system = new System(this.API())
                    resolve(await system.getPollById(res.data))
                })
                .catch(err => console.error('<Poll>.update() method threw an error: ' + err.message || err.response.data))
        })
    }

    update = async () => {
        let poll = this.get()
        return new Promise(async (resolve) => {
            await axios.patch(`${this.API().url}/poll/${poll.id}`, poll.content, {
                headers: this.API().header,
            })
                .then(async (res) => {
                    let system = new System(this.API())
                    resolve(await system.getPollById(res.data))
                })
                .catch(err => console.error('<Poll>.update() method threw an error: ' + err.message || err.response.data))
        })
    }

    delete = async () => {
        let poll = this.get()
        return new Promise(async (resolve) => {
            await axios.delete(`${this.API().url}/poll/${poll.id}`, {
                headers: this.API().header,
            })
                .then(async () => {
                    let system = new System(this.API())
                    await system.getPollById(poll.id)
                        .then((match) => {
                            let success = !match.exists
                            resolve(success)
                        })
                })
                .catch(err => console.error('<Poll>.delete() method threw an error: ' + err.message || err.response.data))
        })
    }
}

module.exports = Poll