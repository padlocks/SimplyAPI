const dotenv = require('dotenv')
const Config = dotenv.config().parsed
const Util = require('./util')

class SAPI {
    constructor(config) {
        this.version = config.api_version || 'v1'
        this.url = (config.url || `https://v2.apparyllis.com/${this.version}`)
        this.userId = config.userId
        this.token = config.token
        this.header = {
            'Content-Type': 'application/json',
            'Authorization': this.token
        }
    }

    API = () => {
        return {
            version: this.version,
            url: this.url,
            userId: this.userId,
            token: this.token,
            header: this.header
        }
    }
}

const SimplyAPI = new SAPI(Config)
module.exports = { SimplyAPI, SAPI, Config, Util }