const logger = require("../logger")
const config = require("../config")
const Discord = require('discord.js')

const timeout = config.ticketCloseTimeout // seconds

module.exports = {
  name: 'close',
  permissions: '',
  usage: '[now]',
  description: '關閉入團申請',
  execute(_client, message) {
    // check if the request comes from a ticket channel ->
    // -> send confirmation -> await confirmation -> delete channel

    const ticketCategory = message.guild.channels.find(c =>
      c.type === 'category' && c.name == "入團申請")

    if (message.channel.parentID != ticketCategory.id) {
      return
    }

    message.delete()

    const confirmation = new Discord.RichEmbed()
      .setTitle(`關閉入團申請 - 確認`)
      .setColor("#f04747") // red
      .setTimestamp()
      .setDescription(
        `此申請將在 **${timeout}** 秒內被銷毀。\n` +
        `回覆任意訊息以取消此操作`
      )

    return message.channel.send({
      embed: confirmation
    }).then(m => {
      m.channel.awaitMessages(response => response.content, {
        max: 1,
        time: timeout * 1000,
        errors: ['time'],
      })
      .then(() => {
        // There was reply, delete the confirmation message
        m.delete()
      })
      .catch(() => {
        // There was no reply, so delete the channel
        message.channel.delete()
        message.guild.members.get(message.author.id)
          .removeRole(message.guild.roles.find(r => r.name === "我要入隊"))
          .catch(logger.error)
      })
    }).catch(logger.error)
  },
}

