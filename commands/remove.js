const logger = require("../logger")
const config = require('../config')
const Discord = require('discord.js')
const perms = ["READ_MESSAGES", "SEND_MESSAGES"]

module.exports = {
  name: 'remove',
  permissions: 'staff',
  usage: '<user1> <user2> <user3> ...',
  description: '從入團申請頻道移除使用者',
  execute(_client, m) {
    const ticketCategory = m.guild.channels.find(c =>
      c.type === 'category' && c.name == "入團申請")

    // check if we're in the ticket category
    if (m.channel.parentID != ticketCategory.id) {
      return
    }

    let userRemoved = []

    m.mentions.users.forEach(user => {
      // check if valid?
      const userPerms = m.channel.permissionsFor(user)

      if (!userPerms || !userPerms.has(perms)) return

      // Remove the perms
      logger.debug("Revoking access for user " + user.tag)

      m.channel.overwritePermissions(user, {
        READ_MESSAGES: false,
        SEND_MESSAGES: false
      })

      userRemoved.push(user)
    })

    // no one was removed
    if (userRemoved.length == 0) {
      return m.reply("阿你沒給參數我是要怎麼弄")
    }

    const removedList = userRemoved
      .join('、')
      .replace(/,(?!.*,)/gmi, ' 跟 ')

    let embed = new Discord.RichEmbed()
      .setThumbnail(config.logoUrl)
      .setTimestamp()
      .setTitle(`已從入團申請移除使用者`)
      .setColor("#f04747") // red
      .setDescription(`已移除 ${removedList} 查看這個頻道的權限`)

    return m.channel.send({
      embed: embed
    }).catch(logger.error)
  },
}

