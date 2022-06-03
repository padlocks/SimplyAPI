const axios = require('axios')
const SAPI = require('./SimplyAPI').SAPI
const System = require('./system')
const Util = require('./util')

/**
* Represents a system member
* @constructor
* @param {string} api - The API's config
* @param {object} options - The member data represented by an object
* @prop {string} id The member's ID
* @prop {boolean} exists Whether the member exists
* @prop {object} content The container for the member's data
* @prop {string} name The member's name
* @prop {string} desc Description of the member
* @prop {string} pronouns The member's pronouns
* @prop {string} pkId The member's known PluralKit ID
* @prop {string} color The member's representing color
* @prop {string} avatarUuid The member's avatar UUID
* @prop {string} avatarUrl The member's avatar URL if availible
* @prop {boolean} private Whether the member is private
* @prop {boolean} preventTrusted Whether the member is visible to trusted users
* @prop {boolean} preventsFrontNotifs Whether the member sends out fronting notifications
* @prop {object} info Custom fields defined by the member
*/
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
        this.preventsFrontNotifs = content.preventsFrontNotifs ?? false
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
                    preventsFrontNotifs: this.preventsFrontNotifs,
                    info: this.info
                }
            }
        }
    }

    /**
     * Creates a new member in the system with the given data
     * @returns {Member} - The newly created member
     */
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

    /**
     * Updates an existing member in the system with the given data
     * @returns {Member} - The updated member
     */
    update = async () => {
        let member = this.get()
        return new Promise(async (resolve) => {
            await axios.patch(`${this.API().url}/member/${member.id}`, JSON.stringify(member.content), {
                headers: this.API().header,
            })
                .then(async (res) => {
                    let system = new System(this.API())
                    resolve(await system.getMemberById(res.data))
                })
                .catch(err => console.error(`<Member>.update() method threw an error: ${err.message}\nReason: ${err.response?.data}`))
        })
    }

    /**
     * Deletes an existing member in the system with the given data
     * @returns {boolean} - Whether the member was successfully deleted
     */
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

    /**
     * Syncs specified data between SimplyPlural and PluralKit
     * @param {object} options - The data to be pushed/pulled
     * @param {string} direction - Whether to push or pull
     * @returns {Member}
     */
    syncWithPluralKit = async (options, direction) => {
        let member = this.get()
        let content = {
            member: member.id,
            token: this.API().pk_token,
            options: options ?? {}
        }

        return new Promise(async (resolve) => {
            if (!this.API().pk_token) return console.error('<Member>.syncWithPluralKit() method threw an error: method requires a PluralKit token (pk_token)')
            if (!options) return console.error('<Member>.syncWithPluralKit() method threw an error: method requires an object with both an options and syncOptions field.')

            await axios.patch(`${this.API().url}/integrations/pluralkit/sync/member/${member.id}?direction=${direction}`, content, {
                headers: this.API().header,
            })
                .then(async (res) => {
                    let system = new System(this.API())
                    resolve(await system.getMemberById(res.data))
                })
                .catch(err => console.error(`<Member>.syncWithPluralKit() method threw an error: ${err.message}\nReason: ${err.response?.data}`))
        })
    }

    syncToPK = (options = {}) => this.syncWithPluralKit(options, 'push')
    syncFromPK = (options = {}) => this.syncWithPluralKit(options, 'pull')

    /**
     * Gets all notes for the member
     * @returns {Array<Note>} - The notes for the member
     */
    getNotes = async () => {
        let member = this.get()
        return new Promise(async (resolve) => {
            let notes = await axios.get(`${this.API().url}/notes/${this.API().userId}/${member.id}`, {
                headers: this.API().header
            })
            resolve(notes.data)
        })
    }

    /**
     * Gets a specific note for the member by ID
     * @returns {Note} - The note for the member
     */
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

    /**
     * Gets a specific note for the member by title
     * @returns {Note} - The note for the member
     */
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

    /**
     * Gets the member's avatar
     * @returns {Buffer} - The image rawdata
     */
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