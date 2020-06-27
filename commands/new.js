const logger = require("../logger")
const config = require('../config')
const Discord = require('discord.js')
const moment = require('moment')

const roleWrapper = m => role => m.guild.roles.find(r => r.name === role)

module.exports = {
  name: 'new',
  permissions: '',
  usage: '',
  description: '建立入團申請',
  execute(_client, m, auto, user) {
    // auto is that if this is triggered automatically without user input
    if (!user) user = m.author

    let ticketName = `application-${user.username}`

    const selectRole = roleWrapper(m)
    const ticketCategory = m.guild.channels.find(c =>
      c.type === 'category' && c.name == "入團申請")

    if (m.guild.channels.some(el => el.name == ticketName)) {
      if (!auto) return m.channel.send(`你的申請已經在進行中了`)
      return
    }

    const perms = ["READ_MESSAGES", "SEND_MESSAGES"]

    let permissionOverwrites = [
      { id: user, allowed: perms },
      { id: selectRole("@everyone"), denied: perms },
      { id: selectRole("幹你媽的機器人"), allowed: perms },
      { id: selectRole("核心成員"), allowed: perms }
    ]

    return m.guild.createChannel(ticketName, {
      type: 'text',
      topic: `${user.tag} 在 ${moment().format()} 遞交申請`,
      parent: ticketCategory,
      permissionOverwrites: permissionOverwrites
    }).then(channel => {
      if (!auto) m.channel.send(`:white_check_mark: 入隊申請建立成功：${channel}`)

      let embed = new Discord.RichEmbed()
        .setTitle(`入隊申請建立完成`)
        .setColor("#7289da") // blue
        .setThumbnail(config.logoUrl)
        .setTimestamp()
        .setDescription(
          `感謝你申請加入 Team Shepherd，${user}\n` +
          `請先填寫以下資訊：\n\n` +
          "Uplay ID：\n" +
          "年齡：\n" +
          "簡短自介：\n" +
          "前戰隊名：\n" +
          "目前排位：\n" +
          "最高排位：\n" +
          "什麼時候開始玩 R6 的：\n" +
          "最常玩的三個**進攻方**幹員：\n" +
          "最常玩的三個**防守方**幹員：\n" +
          "最喜歡的地圖：\n" +
          "最討厭的地圖：\n" +
          "隊伍位置（support、突破、打野等）：\n\n" +
          `資料送出後我們將儘快處理你的申請並安排考試，請耐心等待。\n` +
          `請注意，沒有符合**入團硬性需求者**將不會被通過！請前往查看 <#702205926202933348>。`)

      channel.send({
        embed: embed
      })
    }).catch(logger.error)
  },
}
