const logger = require("../logger")

module.exports = {
  name: 'stop',
  permissions: 'admin',
  usage: '',
  description: '關機的啦',
  execute(client, m) {
    logger.info("Stopping the client, by " + m.author.tag)

    return m.reply("OK")
      .then(client.destroy())
      .then(() => {
        process.exit(0)
      })
      .catch(logger.error)
  }
}
