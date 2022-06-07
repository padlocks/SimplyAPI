const axios = require('axios')
const SAPI = require('./SimplyAPI').SAPI
const Util = require('./util')

class System extends SAPI {
    constructor(api) {
        super(api)
        this.API = this.API()
    }

    // Allowed once every 24h, emails user exported data.
    requestExport = async () => {
        let response = { success: false, message: ''}
        return new Promise(async (resolve) => {
            let exported = await axios.post(`${this.API.url}/user/${this.API.userId}/export`, {}, {
                headers: this.API.header
            })
                .catch(err => {
                    let reason = err.response?.data
                    if (err.response.status === 403) {
                        reason = 'Exports can only be requested once every 24 hours.'
                        response.message = reason
                    } 
                    else {
                        console.error(`<System>.requestExport() method threw an error: ${err.message}\nReason: ${reason}`)
                    }
                })
            
            if (exported?.data) {
                response.success = true
                response.message = 'Export request sent. You should receive an email with the exported data shortly.'
            }
            resolve(response)
        })
    }

    getUser = async () => {
        return new Promise(async (resolve) => {
            let system = await axios.get(`${this.API.url}/user/${this.API.userId}`, {
                headers: this.API.header
            })
            resolve(system.data)
        })
    }

    getReports = async () => {
        return new Promise(async (resolve) => {
            let reports = await axios.get(`${this.API.url}/user/${this.API.userId}/reports`, {
                headers: this.API.header
            })
                .catch(err => console.error(`<System>.getReports() method threw an error: ${err.message}\nReason: ${err.response?.data}`))
            resolve(reports.data)
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
                .catch(err => console.error(`<System>.getFronters() method threw an error: ${err.message}\nReason: ${err.response?.data}`))

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

    getAutomatedTimers = async () => {
        return new Promise(async (resolve) => {
            let timers = await axios.get(`${this.API.url}/timers/automated/${this.API.userId}`, {
                headers: this.API.header
            })
            resolve(timers.data)
        })
    }

    getAutomatedTimer = async (timer) => {
        let found = false
        let timers = await this.getAutomatedTimers()
        return new Promise(async (resolve) => {
            await Util.asyncForEach(timers, async (t) => {
                if (t.content.name == timer) {
                    found = true
                    resolve(t)
                }
            })

            if (!found) resolve({ "name": "Unknown timer", "exists": false })
        })
    }

    getAutomatedTimerById = async (id) => {
        return new Promise(async (resolve) => {
            await axios.get(`${this.API.url}/timer/automated/${this.API.userId}/${id}`, {
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

    getRepeatedTimers = async () => {
        return new Promise(async (resolve) => {
            let timers = await axios.get(`${this.API.url}/timers/repeated/${this.API.userId}`, {
                headers: this.API.header
            })
            resolve(timers.data)
        })
    }

    getRepeatedTimer = async (timer) => {
        let found = false
        let timers = await this.getRepeatedTimers()
        return new Promise(async (resolve) => {
            await Util.asyncForEach(timers, async (t) => {
                if (t.content.name == timer) {
                    found = true
                    resolve(t)
                }
            })

            if (!found) resolve({ "name": "Unknown timer", "exists": false })
        })
    }

    getRepeatedTimerById = async (id) => {
        return new Promise(async (resolve) => {
            await axios.get(`${this.API.url}/timer/repeated/${this.API.userId}/${id}`, {
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

    getAllFriends = async () => {
        return new Promise(async (resolve) => {
            let friends = await axios.get(`${this.API.url}/friends/`, {
                headers: this.API.header
            })
            resolve(friends.data)
        })
    }

    getFriend = async (name) => {
        name = name.toLowerCase()
        let found = false
        return new Promise(async (resolve) => {
            await this.getAllFriends()
                .then(async (friends) => {
                    await Util.asyncForEach(friends, (f) => {
                        let username = f.content.username.toLowerCase()
                        if (username == name) {
                            found = true
                            resolve(f)
                        }
                    })

                    if (!found) resolve({ "name": "Unknown friend", "exists": false })
                })
        })
    }

    getFriendById = async (id) => {
        return new Promise(async (resolve) => {
            await axios.get(`${this.API.url}/friend/${this.API.userId}/${id}`, {
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

    getAllFriendFrontValues = async () => {
        return new Promise(async (resolve) => {
            let frontValues = await axios.get(`${this.API.url}/friends/getFrontValues`, {
                headers: this.API.header
            })
            resolve(frontValues.data)
        })
    }

    getIncomingFriendRequests = async () => {
        return new Promise(async (resolve) => {
            let requests = await axios.get(`${this.API.url}/friends/requests/incoming`, {
                headers: this.API.header
            })
            resolve(requests.data)
        })
    }

    getOutgoingFriendRequests = async () => {
        return new Promise(async (resolve) => {
            let requests = await axios.get(`${this.API.url}/friends/requests/outgoing`, {
                headers: this.API.header
            })
            resolve(requests.data)
        })
    }

    sendFriendRequest = async (userId, options = { seeMembers: false, seeFront: false, getFrontNotif: false, getTheirFrontNotif: false, trusted: false }) => {
        let action = {
            settings: {
                seeMembers: options.seeMembers,
                seeFront: options.seeFront,
                getFrontNotif: options.getFrontNotif,
                getTheirFrontNotif: options.getTheirFrontNotif,
                trusted: options.trusted
            }
        }

        return new Promise(async (resolve) => {
            await axios.post(`${this.API.url}/friends/request/add/${userId}`, JSON.stringify(action.content), {
                headers: this.API.header,
            })
                .then(async (response) => {
                    if (!response.data.success) {
                        console.log('<System>.sendFriendRequest() was unsuccessful: ' + response.data.msg)
                    }
                    resolve(response.data.success)
                })
                .catch(err => console.error(`<System>.sendFriendRequest() method threw an error: ${err.message}\nReason: ${err.response?.data}`))
        })
    }

    cancelFriendRequest = async (userId) => {
        return new Promise(async (resolve) => {
            await axios.delete(`${this.API.url}/friends/request/${userId}`, {
                headers: this.API.header,
            })
                .then(async (response) => {
                    if (!response.data.success) {
                        console.log('<System>.cancelFriendRequest() was unsuccessful: ' + response.data.msg)
                    }
                    resolve(response.data.success)
                })
                .catch(err => console.error(`<System>.cancelFriendRequest() method threw an error: ${err.message}\nReason: ${err.response?.data}`))
        })
    }

    respondToFriendRequest = async (userId, accept, options = { seeMembers: false, seeFront: false, getFrontNotif: false, trusted: false }) => {
        let action = {
            accept: accept,
            settings: {
                seeMembers: options.seeMembers,
                seeFront: options.seeFront,
                getFrontNotif: options.getFrontNotif,
                trusted: options.trusted
            }
        }

        return new Promise(async (resolve) => {
            await axios.post(`${this.API.url}/friends/request/respond/${userId}`, JSON.stringify(action), {
                headers: this.API.header,
            })
                .then(async (response) => {
                    if (!response.data.success) {
                        console.log('<System>.respondToFriendRequest() was unsuccessful: ' + response.data.msg)
                    }
                    resolve(response.data.success)
                })
                .catch(err => console.error(`<System>.respondToFriendRequest() method threw an error: ${err.message}\nReason: ${err.response?.data}`))
        })
    }

    acceptFriendRequest = (userId, options = {}) => this.respondToFriendRequest(userId, true, options)
    declineFriendRequest = (userId) => this.respondToFriendRequest(userId, false)

    syncAllMembersWithPluralKit = async (options, direction) => {
        let member = this.get()
        let content = {
            member: member.id,
            token: this.API().pk_token,
            options: options.options,
            syncOptions: options.syncOptions
        }

        if (!this.API().pk_token) return console.error('<System>.syncAllMembersWithPluralKit() method threw an error: method requires a PluralKit token (pk_token)')
        if (!options) return console.error('<System>.syncAllMembersWithPluralKit() method threw an error: method requires an object with both an options and syncOptions field.')

        await axios.patch(`${this.API().url}/integrations/pluralkit/sync/members?direction=${direction}`, content, {
            headers: this.API().header,
        })
            .catch(err => console.error(`<System>.syncAllMembersWithPluralKit() method threw an error: ${err.message}\nReason: ${err.response?.data}`))
    }

    syncAllMembersToPK = (options = {}) => this.syncAllMembersWithPluralKit(options, 'push')
    syncAllMembersFromPK = (options = {}) => this.syncAllMembersWithPluralKit(options, 'pull')

    getAnalytics = async () => {
        return new Promise(async (resolve) => {
            let analytics = await axios.get(`${this.API.url}/user/analytics`, {
                headers: this.API.header
            })
                .catch(err => console.error(`<System>.getAnalytics() method threw an error: ${err.message}\nReason: ${err.response?.data}`))
            resolve(analytics.data)
        })
    }

    getMorningFronters = () => this.getAnalytics().then(data => data.timings.morningFronters)
    getDayFronters = () => this.getAnalytics().then(data => data.timings.dayFronters)
    getEveningFronters = () => this.getAnalytics().then(data => data.timings.eveningFronters)
    getNightFronters = () => this.getAnalytics().then(data => data.timings.nightFronters)
    getAnalyticValues = () => this.getAnalytics().then(data => data.values)
}

module.exports = System