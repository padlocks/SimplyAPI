const axios = require('axios')
const FrontHistory = require('./frontHistory')
const SAPI = require('./SimplyAPI').SAPI
const System = require('./system')
const Util = require('./util')

class Comment extends SAPI {
    constructor(api, options) {
        super(api)

        this.id = options.id || ''
        this.exists = options.exists || false

        let content = options.content ?? options
        this.documentId = content.documentId || ''
        this.text = content.text || ''
        this.collection = content.collection || 'frontHistory'
        this.time = content.date || Date.now()

        this.get = () => {
            return {
                exists: this.exists,
                id: this.id,
                content: {
                    documentId: this.documentId,
                    text: this.text,
                    collection: this.collection,
                    time: this.time
                }
            }
        }
    }

    create = async () => {
        let comment = this.get()
        return new Promise(async (resolve) => {
            await axios.post(`${this.API().url}/comment/`, JSON.stringify(comment.content), {
                headers: this.API().header,
            })
            .then(async (res) => {
                let system = new System(this.API())
                let frontData = await system.getFrontById(comment.content.documentId)
                let front = new FrontHistory(this.API(), frontData)
                let comments = await front.getComments()
                Util.asyncForEach(comments, async (comment) => {
                    if (comment.id === res.data) {
                        resolve(comment)
                    }
                })
            })
            .catch(err => console.error('<Comment>.create() method threw an error: ' + err.message || err.response.data))
        })
    }

    update = async () => {
        let comment = this.get()
        return new Promise(async (resolve) => {
            await axios.patch(`${this.API().url}/comment/${comment.id}`, JSON.stringify({ text: comment.content.text }), {
                headers: this.API().header,
            })
                .then(async (res) => {
                    let system = new System(this.API())
                    let frontData = await system.getFrontById(comment.content.documentId)
                    let front = new FrontHistory(this.API(), frontData)
                    let comments = await front.getComments()
                    Util.asyncForEach(comments, async (c) => {
                        if (c.id === comment.id) {
                            resolve(c)
                        }
                    })
                })
                .catch(err => console.error('<Comment>.update() method threw an error: ' + err.message || err.response.data))
        })
    }

    delete = async () => {
        let comment = this.get()
        return new Promise(async (resolve) => {
            await axios.delete(`${this.API().url}/comment/${comment.id}`, {
                headers: this.API().header,
            })
                .then(async () => {
                    let system = new System(this.API())
                    await system.getCommentById(comment.content.id)
                        .then((match) => {
                            let success = !match.exists
                            resolve(success)
                        })
                })
                .catch(err => console.error('<Comment>.delete() method threw an error: ' + err.message || err.response.data))
        })
    }
}

module.exports = Comment