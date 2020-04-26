const logger = require("../logger")
const config = require('../config')
const Discord = require('discord.js')
const perms = ["READ_MESSAGES", "SEND_MESSAGES"]

module.exports = {
  name: 'add',
  permissions: 'staff',
  usage: '<user1> <user2> <user3> ...',
  description: '加入其他使用者到入團申請頻道',
  execute(_client, m) {
    const ticketCategory = m.guild.channels.find(c =>
      c.type === 'category' && c.name == "入團申請")

    // check if we're in the ticket category
    if (m.channel.parentID != ticketCategory.id) {
      return
    }

    let userAdded = []

    m.mentions.users.forEach(user => {
      // check if valid?
      const userPerms = m.channel.permissionsFor(user)

      if (!userPerms || userPerms.has(perms)) return

      // Add the perms
      logger.debug("Granting access for user " + user.tag)

      m.channel.overwritePermissions(user, {
        READ_MESSAGES: true,
        SEND_MESSAGES: true
      })

      userAdded.push(user)
    })

    // no one was removed
    if (userAdded.length == 0) {
      return m.reply("阿你沒給參數我是要怎麼加人進來")
    }

    const addedList = userAdded
      .join('、')
      .replace(/,(?!.*,)/gmi, ' 跟 ')

    let embed = new Discord.RichEmbed()
      .setThumbnail(config.logoUrl)
      .setTimestamp()
      .setTitle(`已加入使用者`)
      .setColor("#0eaa4d") // green
      .setDescription(
        `已加入 ${addedList} 到此頻道。`)

    return m.channel.send({
      embed: embed
    }).catch(logger.error)
  },
}

