const { Config, System, AutomatedTimer } = require('..')

let data = {
    name: "Test Timer",
    message: "This is a test.",
    action: 1,
    delayInHours: 3,
    type: 1
}

main = async () => {
    let system = new System(Config)
    let newTimer = new AutomatedTimer(Config, data)
    // if timer is not found, create it
    if (!system.getAutomatedTimer(newTimer.name).exists) {
        await newTimer.create()
            .then(async (timer) => {
                // timer is returned from create() method, make sure it exists
                if (timer) {
                    console.log("Timer created: " + timer.content.name)
                    // parse timer data
                    let t = new AutomatedTimer(Config, timer)
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