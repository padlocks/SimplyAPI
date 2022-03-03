const { Config, System, Group } = require('../')

let data = {
    parent: "root",
    color: "",
    private: true,
    preventTrusted: false,
    name: "123",
    desc: "test group",
    emoji: "",
    members: []
}

main = async () => {
    let system = new System(Config)
    let newGroup = new Group(Config, data)
    // if group is not found, create it
    if (!system.getGroup(newGroup.name).exists) {
        await newGroup.create()
            .then(async (group) => {
                // group is returned from create() method, make sure it exists
                if (group) {
                    console.log("Group created: " + group.content.name)
                    // parse group data
                    let g = new Group(Config, group)
                    // delete the newly created group
                    if (await g.delete()) {
                        // successfully deleted
                        console.log("Deleted group: " + g.name)
                    }
                }
                else {
                    // the group was not found
                    console.log("Group: " + newGroup.name + " was not found")
                }
            })
            .catch(err => console.error(err.response.data))
    }
}

main()