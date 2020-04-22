const logger = require("../logger")

module.exports = {
  name: 'stop',
  permissions: 'admin',
  usage: '',
  description: '關機的啦',
  execute(bot, m) {
    logger.info("Stopping the bot, by " + m.author.tag)

    return m.reply("我溜了，但是我還會回來")
      .then(bot.destroy())
      .then(() => {
        process.exit(0)
      })
      .catch(logger.error)
  }
}
