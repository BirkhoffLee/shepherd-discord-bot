const os = require("os")
const git = require('git-rev-sync')
let config = require('./config.json')

config.token = process.ENV.DISCORD_BOT_TOKEN
config.runtime = {}
config.runtime.environment = process.env.NODE_ENV || "develop"
config.runtime.version = `${git.short()}-${git.branch()}`
config.runtime.hostname = os.hostname()
config.runtime.platform = os.platform()

module.exports = config
