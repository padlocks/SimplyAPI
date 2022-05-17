const { Config, System, Poll } = require('..')

let day = 24 * 60 * 60 * 1000
let data = {
    name: "Test Poll",
    description: "This is a test poll",
    allowAbstain: true,
    allowVeto: true,
    endTime: Date.now() + day * 7,
    custom: true
}

main = async () => {
    let system = new System(Config)
    let newPoll = new Poll(Config, data)
    // if poll is not found, create it
    if (!system.getPoll(newPoll.name).exists) {
        await newPoll.create()
            .then(async (poll) => {
                // poll is returned from create() method, make sure it exists
                if (poll) {
                    console.log("Poll created: " + poll.content.name)
                    // parse poll data
                    let p = new Poll(Config, poll)
                    // update the newly created poll
                    p.name = "Updated Poll"
                    if (await p.update()) {
                        // successfully deleted
                        console.log("Updated poll: " + p.name)
                    }
                    // delete the newly created poll
                    if (await p.delete()) {
                        // successfully deleted
                        console.log("Deleted poll: " + p.name)
                    }
                }
                else {
                    // the poll was not found
                    console.log("Poll: " + newPoll.name + " was not found")
                }
            })
            .catch(err => console.error(err.message || err.response.data))
    }
}

main()