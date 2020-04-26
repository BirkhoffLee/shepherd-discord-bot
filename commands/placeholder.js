const logger = require("../logger")
const Discord = require('discord.js')

module.exports = {
	name: 'placeholder',
  permissions: 'admin',
  usage: '',
	description: 'create a placeholder message',
	execute(client, message) {
    return message.channel.send(new Discord.RichEmbed()
      .setTitle(`Placeholder`)
      .setColor("#0eaa4d")
    ).then(m => {
      m.edit(new Discord.RichEmbed()
        .setTitle(`Placeholder`)
        .setColor("#0eaa4d")
        .setDescription(`Message ID: **${m.id}**\n`)
      )
      message.delete()
    }).catch(logger.error)
  },
};
