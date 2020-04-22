const logger = require("../logger")
const Discord = require('discord.js')

module.exports = {
	name: 'ping',
  permissions: '',
  usage: '',
	description: '算 Discord API 的狗屁延遲',
	execute(bot, message) {
    return message.channel.send(new Discord.RichEmbed()
      .setTitle(`正在計算等一下啦`)
      .setColor("#0eaa4d") // green
    ).then(m => {
      let editTime = m.createdTimestamp - message.createdTimestamp
      let discordPing = Math.round(bot.ping)

      m.edit(new Discord.RichEmbed()
        .setTitle(`🏓　碰！`)
        .setColor("#f04747") // red
        .setDescription(
          `花了 **${editTime}** 毫秒編輯訊息啦\n` +
          `Discord API heartbeat 是 **${discordPing}** 毫秒的啦`)
      )
    }).catch(logger.error)
  },
};
