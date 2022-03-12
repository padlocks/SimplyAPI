const { Config, CustomFront } = require('../')

let data = {
    name: "sus",
    desc: "idk lol",
    preventTrusted: false,
    private: false
}

main = async () => {
    let newCustomFront = new CustomFront(Config, data)
    await newCustomFront.create()
        .then(async (customFrontData) => {
        // customFrontData is returned from create() method, make sure it exists
        if (customFrontData) {
            console.log("CustomFront created: " + customFrontData.content.name)

            // update the newly created customFront
            customFrontData.content.name = "testing"
            let c = new CustomFront(Config, customFrontData)
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