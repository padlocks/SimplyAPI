const { Config, System, FrontHistory } = require('../')

let data = {
    custom: false,
    live: true,
    startTime: Date.now(),
    member: "621d51ebbea8db010427e7e4",
    customStatus: ""
}

main = async () => {
    let system = new System(Config)
    let newFront = new FrontHistory(Config, data)
    let isMemberFronting = await system.isMemberFronting(data.member)
    if (!isMemberFronting.exists) {
        await newFront.create()
            .then(async (frontData) => {
                // frontData is returned from create() method, make sure it exists
                if (frontData) {
                    await system.getMemberById(frontData.content.member)
                        .then((m) => {
                            console.log("FrontHistory created: " + m.content.name)
                        })
                    
                    // parse frontHistory data
                    let f = new FrontHistory(Config, frontData)
                    // delete the newly created frontHistory
                    if (await f.remove()) {
                        // successfully removed
                        await system.getMemberById(f.member)
                            .then((m) => {
                                console.log("FrontHistory removed: " + m.content.name)
                            })
                    }
                }
            })
            .catch(err => console.error(err))
    }
    else {
        console.log("Member is already fronting")
    }

    await system.getFrontHistoryForMember(data.member)
    .then(async (history) => {
        console.log(`FrontHistory found: ${history.length}`)
        let targetFront = new FrontHistory(Config, history[0])
        await targetFront.delete()
        .then(async (success) => {
            if (success) {
                let newHistory = await system.getFrontHistoryForMember(data.member)
                console.log(`Latest FrontHistory deleted, ${newHistory.length} remaining`)
            }
            else {
                console.log("Failed to delete FrontHistory")
            }
        })
    })
}

main()