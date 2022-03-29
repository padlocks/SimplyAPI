const { Config, System, Friend } = require('..')

let username = "wedobeevibing"

main = async () => {
    let system = new System(Config)
    await system.getAllFriendFrontValues()
        .then((res) => {
            console.log(res.results)
        })

    await system.getIncomingFriendRequests()
        .then((res) => {
            console.log(res.length)
        })

    await system.getOutgoingFriendRequests()
        .then((res) => {
            console.log(res.length)
        })

    await system.sendFriendRequest(username)
        .then(async (success) => {
            if (success) {
                console.log("Friend request sent: " + username)
            }
        })

    await system.acceptFriendRequest(username)
        .then(async (success) => {
            if (success) {
                console.log("Friend request accepted: " + username)
            }
        })

    await system.declineFriendRequest(username)
        .then(async (success) => {
            if (success) {
                console.log("Friend request declined: " + username)
            }
        })
    
    await system.getFriend(username)
        .then(async (friend) => {
            if (friend) {
                let f = new Friend(Config, friend)
                let front = await f.getFront()
                if (front) console.log(`${username}'s front: ${JSON.stringify(front.frontString)}`)
            }
        })

    await system.getFriend(username)
        .then(async (friend) => {
            if (friend) {
                let f = new Friend(Config, friend)
                f.trusted = true
                await f.update()
                    .then((friendData) => {
                        if (friendData) console.log(`${username} is now a trusted friend`)
                    })
                
            }
        })
}

main()