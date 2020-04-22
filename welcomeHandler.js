const Discord = require('discord.js')

module.exports = member => {
  const channel = member.guild.channels.find(ch => ch.id == '702200813329711134')
  if (!channel) return

  channel.send(new Discord.RichEmbed()
    .setColor('#0099ff')
    .setTitle('Team Shepherd')
    .setDescription(`歡迎 ${member} 來到 Team Shepherd\n\n**資訊**\n目前正在招收團員，請先至 #身份組選擇 選擇\n身份組，然後查看 #招生公告 與 #對外公告`)
    .setThumbnail('https://assets.birkhoff.me/shepherd.jpg')
  )
}
