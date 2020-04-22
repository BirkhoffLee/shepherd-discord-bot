const logger = require("../logger")
const config = require("../config")
const Discord = require('discord.js')

module.exports = {
  name: 'help',
  permissions: 'staff',
  usage: '',
  description: '指令列表',
  execute(bot, m) {
    let message = ""

    bot.commands.forEach(cmd => {
      let usage = ""

      if (cmd.usage) {
        usage = ` ` + cmd.usage
      }

      message += `\`${config.prefix}${cmd.name}${usage}\` - ${cmd.description}`

      if (cmd.permissions == "staff") {
        message += " (僅限團員)"
      } else if (cmd.permissions == "admin") {
        message += " (限 DC 管理員)"
      }

      message += `\n`
    })

    const embed = new Discord.RichEmbed()
      .setTitle(`指令列表啦==`)
      .setColor("#0eaa4d") // green
      .setThumbnail('https://assets.birkhoff.me/shepherd.jpg')
      .setDescription(message)

    return m.channel.send({ embed: embed }).catch(logger.error)
  }
}
