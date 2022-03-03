const { Config, System, CustomFront } = require('../')

let data = {
    name: "sus",
    desc: "idk lol",
    preventTrusted: false,
    private: false
}

main = async () => {
    let system = new System(Config)
    let newCustomFront = new CustomFront(Config, data)
    await newCustomFront.create()
        .then(async (customFrontData) => {
        // customFrontData is returned from create() method, make sure it exists
        if (customFrontData) {
            console.log("CustomFront created: " + customFrontData.content.name)

            customFrontData.content.name = "testing"
            let c = new CustomFront(Config, customFrontData)
            // delete the newly created group
            if (await c.update()) {
                // successfully updated
                console.log("CustomFront updated: " + c.name)
            }
            // delete the newly created customFront
            if (await c.delete()) {
                // successfully removed
                console.log("CustomFront removed: " + c.name)
            }
        }
        
    })
}

main()