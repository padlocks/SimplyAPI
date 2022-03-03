const { Config, System } = require('../')

main = async () => {
    let system = new System(Config)
    console.log(await system.getUser())
    console.log(await system.getMembers())
    console.log(await system.getGroups())
}
main()