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

    findMemberById = async (id) => {
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

    findMember = async (member) => {
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

    findGroupById = async (id) => {
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

    findGroup = async (group) => {
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

    getFronters = async () => {
        return new Promise(async (resolve) => {
            let fronters = await axios.get(`${this.API.url}/fronters`, {
                headers: this.API.header
            })
            .catch(err => console.error('<System>.getFronters() method threw an error: ' + err.response.data))
            resolve(fronters.data)
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

    findFrontByMember = async (id) => {
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

    findFrontById = async (id) => {
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
}

module.exports = System