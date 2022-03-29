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
                .catch(err => console.error('<System>.sendFriendRequest() method threw an error: ' + err.message || err.response.data))
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
                .catch(err => console.error('<System>.cancelFriendRequest() method threw an error: ' + err.message || err.response.data))
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
                .catch(err => console.error('<System>.respondToFriendRequest() method threw an error: ' + err.message || err.response.data))
        })
    }

    acceptFriendRequest = (userId, options={}) => this.respondToFriendRequest(userId, true, options)
    declineFriendRequest = (userId) => this.respondToFriendRequest(userId, false)
}

module.exports = System