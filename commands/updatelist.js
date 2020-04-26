const logger = require("../logger")
const config = require('../config')
const Discord = require('discord.js')
const roles = {
  '擁有者': '702410529981071390',
  '經理': '702416943835250688',
  '隊長': '702200813329711132',
  '教練': '702200813329711129',
  '正選': '702200813329711131',
  '後補': '702200813329711130'
}

module.exports = {
	name: 'updatelist',
  permissions: 'staff',
  usage: '',
	description: '更新隊員列表',
	execute(client, message) {
    let guild = client.guilds.get(config.serverGuildID)

    guild.channels.get('702200813451214851').fetchMessages({
      around: '702407531120558171',
      limit: 1
    })
      .then(msg => {
        let guild = client.guilds.get(config.serverGuildID)
        let msgContent = ""

        for (let [roleName, roleID] of Object.entries(roles)) {
            const role = guild.roles.get(roleID)
            let members = Array.from(role.members.values())
            if (members.length == 0) members = ["未定"]

            msgContent += members.map((member, idx, arr) => {
              let order = ""
              if (arr.length > 1) order = ` ${idx + 1}`
              return `${roleName}${order}：${member}`
            }).join(`\n`) + `\n`
        }

        msg.first().edit(new Discord.RichEmbed()
          .setTitle(`目前戰隊人員組成`)
          .setColor("#0eaa4d") // green
          .setThumbnail(config.logoUrl)
          .setDescription(msgContent.slice(0, -1))
          .setTimestamp()
        )
      })
      .then(() => {
        if (message) message.reply("更新完成")
      })
      .catch(logger.error)
  },
};
