const Discord = require('discord.js')
const config = require('./config')

module.exports = member => {
  const channel = member.guild.channels.find(ch => ch.id == '702200813329711134')
  if (!channel) return

  channel.send(new Discord.RichEmbed()
    .setColor('#0099ff')
    .setTitle('Team Shepherd')
    .setDescription(`歡迎 ${member} 來到 Team Shepherd\n\n**資訊**\n目前正在招收團員，請先至 <#702209314408103957> 選擇\n身份組，然後查看 <#702200813451214851> 與 <#702205926202933348>`)
    .setThumbnail(config.logoUrl)
  )
}
