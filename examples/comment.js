const { Config, Comment } = require('..')

let data = {
    text: "1234567890",
    type: "Comment",
    documentId: "622caedb7cfe39e9cd7f6e19"
}

main = async () => {
    let newComment = new Comment(Config, data)
    await newComment.create()
        .then(async (commentData) => {
        // commentData is returned from create() method, make sure it exists
            if (commentData) {
                console.log("Comment created: " + commentData.id)

            // update the newly created comment
            commentData.content.text = "testing"
            let c = new Comment(Config, commentData)
            if (await c.update()) {
                // successfully updated
                console.log("Comment updated: " + c.text)
            }
            // delete the newly created comment
            if (await c.delete()) {
                // successfully removed
                console.log("Comment removed: " + c.text)
            }
        }
        
    })
}

main()