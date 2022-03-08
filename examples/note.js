const { Config, Note } = require('../')

let data = {
    title: "Testing",
    note: "idk lol",
    member: "621d51ebbea8db010427e7e4"
}

main = async () => {
    let newNote = new Note(Config, data)
    await newNote.create()
        .then(async (noteData) => {
            // noteData is returned from create() method, make sure it exists
            if (noteData.exists) {
                console.log("Note created: " + noteData.content.title)

                // update the newly created note
                noteData.content.title = "123"
                let n = new Note(Config, noteData)
                if (await n.update()) {
                    // successfully updated
                    console.log("Note updated: " + n.title)
                }
                // delete the newly created note
                if (await n.delete()) {
                    // successfully removed
                    console.log("Note removed: " + n.title)
                }
            }

        })
}

main()