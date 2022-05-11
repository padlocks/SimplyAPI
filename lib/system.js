const axios = require('axios')
const SAPI = require('./SimplyAPI').SAPI
const Util = require('./util')

class System extends SAPI {
    constructor(api) {
        super(api)
        this.API = this.API()
    }

    getUser = async () => {
        return new Promise(async (resolve) => {
            let system = await axios.get(`${this.API.url}/user/${this.API.userId}`, {
                headers: this.API.header
            })
            resolve(system.data)
        })
    }

    getMembers = async () => {
        return new Promise(async (resolve) => {
            let members = await axios.get(`${this.API.url}/members/${this.API.userId}`, {
                headers: this.API.header
            })
            resolve(members.data)
        })
    }

    getMemberById = async (id) => {
        let found = false
        let system = await this.getMembers()
        return new Promise(async (resolve) => {
            await Util.asyncForEach(system, async (m) => {
                if (m.id == id) {
                    found = true
                    resolve(m)
                }
            })

            if (!found) resolve({ "name": "Unknown member", "exists": false })
        })
    }

    getMember = async (member) => {
        let found = false
        let system = await this.getMembers()
        return new Promise(async (resolve) => {
            await Util.asyncForEach(system, async (m) => {
                if (m.content.name.includes(member)) {
                    found = true
                    resolve(m)
                }
            })

            if (!found) resolve({ "name": "Unknown member", "exists": false })
        })
    }

    getGroups = async () => {
        return new Promise(async (resolve) => {
            let members = await axios.get(`${this.API.url}/groups/${this.API.userId}`, {
                headers: this.API.header
            })
            resolve(members.data)
        })
    }

    getGroupById = async (id) => {
        let found = false
        let system = await this.getGroups()
        return new Promise(async (resolve) => {
            await Util.asyncForEach(system, async (g) => {
                if (g.id == id) {
                    found = true
                    resolve(g)
                }
            })

            if (!found) resolve({ "name": "Unknown group", "exists": false })
        })
    }

    getGroup = async (group) => {
        let found = false
        let system = await this.getGroups()
        return new Promise(async (resolve) => {
            await Util.asyncForEach(system, async (g) => {
                if (g.content.name.includes(group)) {
                    found = true
                    resolve(g)
                }
            })

            if (!found) resolve({ "name": "Unknown group", "exists": false })
        })
    }

    getPolls = async () => {
        return new Promise(async (resolve) => {
            let polls = await axios.get(`${this.API.url}/polls/${this.API.userId}`, {
                headers: this.API.header
            })
            resolve(polls.data)
        })
    }

    getPollById = async (id) => {
        let found = false
        let polls = await this.getPolls()
        return new Promise(async (resolve) => {
            await Util.asyncForEach(polls, async (p) => {
                if (p.id == id) {
                    found = true
                    resolve(p)
                }
            })

            if (!found) resolve({ "name": "Unknown poll", "exists": false })
        })
    }

    getPoll = async (poll) => {
        let found = false
        let polls = await this.getPolls()
        return new Promise(async (resolve) => {
            await Util.asyncForEach(polls, async (p) => {
                if (p.content.name.includes(poll)) {
                    found = true
                    resolve(p)
                }
            })

            if (!found) resolve({ "name": "Unknown poll", "exists": false })
        })
    }

    getFronters = async () => {
        return new Promise(async (resolve) => {
            await axios.get(`${this.API.url}/fronters`, {
                headers: this.API.header
            })
            .then((res) => {
                resolve(res.data)
            })
            .catch(err => console.error('<System>.getFronters() method threw an error: ' + err.message || err.response.data))
            
        })
    }

    isMemberFronting = async (id) => {
        let found = false
        let system = await this.getFronters()
        return new Promise(async (resolve) => {
            await Util.asyncForEach(system, async (m) => {
                if (m.content.member == id) {
                    found = true
                    resolve(m)
                }
            })

            if (!found) resolve({ "name": "Member is not fronting", "exists": false })
        })
    }

    getFrontByMember = async (id) => {
        let found = false
        let system = await this.getFronters()
        return new Promise(async (resolve) => {
            await Util.asyncForEach(system, async (f) => {
                if (f.content.member == id) {
                    found = true
                    resolve(f)
                }
            })

            if (!found) resolve({ "name": "Unknown front status", "exists": false })
        })
    }

    getFrontById = async (id) => {
        let found = false
        let system = await this.getFronters()
        return new Promise(async (resolve) => {
            await Util.asyncForEach(system, async (f) => {
                if (f.id == id) {
                    found = true
                    resolve(f)
                }
            })

            if (!found) resolve({ "name": "Unknown front status", "exists": false })
        })
    }

    getFrontHistoryForMember = async (id) => {
        return new Promise(async (resolve) => {
            let history = await axios.get(`${this.API.url}/frontHistory/member/${id}`, {
                headers: this.API.header
            })
            resolve(history.data)
        })
    }

    getCustomFronts = async () => {
        return new Promise(async (resolve) => {
            let customFronts = await axios.get(`${this.API.url}/customFronts/${this.API.userId}`, {
                headers: this.API.header
            })
            resolve(customFronts.data)
        })
    }

    getCustomFrontById = async (id) => {
        return new Promise(async (resolve) => {
            await axios.get(`${this.API.url}/customFront/${this.API.userId}/${id}`, {
                headers: this.API.header
            })
            .then((res) => {
                if (res) resolve(res.data)
                else resolve(false)
            })
            .catch(err => {
                if (err.response.status == 400) resolve(false)
            })
        })
    }

    getCommentById = async (id) => {
        return new Promise(async (resolve) => {
            await axios.get(`${this.API.url}/comment/${this.API.userId}/${id}`, {
                headers: this.API.header
            })
            .then((res) => {
                if (res) resolve(res.data)
                else resolve(false)
            })
            .catch(err => {
                if (err.response.status == 400) resolve(false)
            })
        })
    }
}

module.exports = System