const { Config, System, RepeatedTimer } = require('..')

let data = {
    name: "Test Timer",
    message: "This is a test.",
    dayInterval: 3,
    time: {
        hour: 12,
        minute: 0
    },
    startTime: {
        year: 2022,
        month: 1,
        day: 1
    }
}

main = async () => {
    let system = new System(Config)
    let newTimer = new RepeatedTimer(Config, data)
    // if timer is not found, create it
    if (!system.getRepeatedTimer(newTimer.name).exists) {
        await newTimer.create()
            .then(async (timer) => {
                // timer is returned from create() method, make sure it exists
                if (timer) {
                    console.log("Timer created: " + timer.content.name)
                    // parse timer data
                    let t = new RepeatedTimer(Config, timer)
                    // update the newly created timer
                    t.name = "Updated Timer"
                    if (await t.update()) {
                        // successfully deleted
                        console.log("Updated timer: " + t.name)
                    }
                    // delete the newly created timer
                    if (await t.delete()) {
                        // successfully deleted
                        console.log("Deleted timer: " + t.name)
                    }
                }
                else {
                    // the timer was not found
                    console.log("Timer: " + newTimer.name + " was not found")
                }
            })
            .catch(err => console.error(err.message || err.response.data))
    }
}

main()