const logger = require("../logger")

module.exports = {
  name: 'prune',
  permissions: 'admin',
  usage: '<n>',
  description: '砍最後 <n> 個訊息的啦 (0 < n < 100)',
  execute(client, message, args) {
    const amount = parseInt(args[0]) + 1

    if (isNaN(amount)) {
      return message.reply('這他媽不叫數字')
    } else if (amount < 1 || amount > 100) {
      return message.reply('只能砍 1 到 99 個訊息啦')
    }

    logger.debug("pruning last " + amount + " messages")

    return message.channel.bulkDelete(amount, true).catch(logger.error)
  },
}
