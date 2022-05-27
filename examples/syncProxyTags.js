const axios = require('axios')
const { Config, Member, System } = require('../')

const pkUrl = 'https://api.pluralkit.me/v2'
const pkHeader = {
    'Content-Type': 'application/json; charset=UTF-8',
    'Authorization': Config.pk_token
}

// custom "Proxy" field for my system
let fieldId = 'p24a2VfWQLRNjn2Gk19nTp'
main = async () => {
    let system = new System(Config)

    // get all members from pk
    let request = await axios.get(`${pkUrl}/systems/@me/members`, {
        headers: pkHeader
    })
    let pkData = request.data

    let members = await system.getMembers()
    for (let member of members) {
        let proxyString = member.content.info[fieldId]
        let found = false

        for (let pkMember of pkData) {
            if (member.content.pkId === pkMember.id) {
                found = true
                // push proxy tags to options
                let proxy = ''
                let proxyTags = pkMember.proxy_tags
                // format tags
                for (let tag of proxyTags) {
                    proxy += `${tag.prefix ?? ''} ${tag.suffix ?? ''}\n`
                }
                // set data
                proxyString = proxy
                console.log(`Found proxy tags for ${member.content.name}: ${proxy.replace('\n', ' ')}`)
            }
        }

        // send the updated changes to SP
        if (found) {
            let m = new Member(Config, member)
            await m.update()
                .then(() => {
                    console.log(`Synced ${m.name}'s PluralKit proxy tags to SimplyPlural`)
                })
            }
    }
}

main()