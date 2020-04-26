const logger = require("../logger")
const config = require('../config')
const Discord = require('discord.js')

module.exports = {
	name: 'reaction',
  permissions: 'admin',
  usage: '',
	description: '',
	execute(client, message) {
    let guild = client.guilds.get(config.serverGuildID)

    guild.channels.get('702209314408103957').fetchMessages({
      around: '702461700074635274',
      limit: 1
    })
    .then(async msg => {
      const emojiNames = config.emojiNames
      let description = ""

      msg = msg.first()

      for (let i = 0; i < emojiNames.length; i++) {
        description += `${emojiNames[i]} ${config.roleNames[i]}\n`
        await msg.react(emojiNames[i])
      }

      msg.edit(new Discord.RichEmbed()
        .setColor("#4bb4d6") // green
        .setDescription(`請選擇你的身份組：\n\n${description.slice(0,-1)}`)
      )
    })
    .then(() => {
      if (message) message.reply("更新完成")
    })
    .catch(logger.error)
  },
};
