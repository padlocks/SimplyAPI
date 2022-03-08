const { Config, Member, System } = require('../')

let data = {
    name: "Test",
    desc: "a test member",
    pronouns: "It/Its",
    pkId: "",
    color: "",
    avatarUuid: "",
    avatarUrl: "",
    private: false,
    preventTrusted: false,
    preventFrontNotifs: false,
    info: {
        "Age": "19",
        "Likes": "bread"
    }
}

main = async () => {
    let system = new System(Config)
    let newMember = new Member(Config, data)
    // if member is not found, create it
    if (!system.getMember(newMember.name).exists) {
        await newMember.create()
            .then(async (member) => {
                // member is returned from create() method, make sure it exists
                if (member) {
                    console.log("Member created: " + member.content.name)
                    // update the newly created member
                    m.name = "Test User"
                    // parse member data
                    let m = new Member(Config, member)
                    if (await m.update()) {
                        // successfully deleted
                        console.log("Updated member: " + m.name)
                    }
                    // delete the newly created member
                    if (await m.delete()) {
                        // successfully deleted
                        console.log("Deleted member: " + m.name)
                    }
                }
                else {
                    // the member was not found
                    console.log("Member: " + newMember.name + " was not found")
                }
            })
            .catch(err => console.error(err.message || err.response.data))
    }
}

main()