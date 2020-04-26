const logger = require("../logger")
const config = require('../config')
const Discord = require('discord.js')
const os = require("os")

module.exports = {
  name: 'info',
  permissions: '',
  usage: '',
  description: '查看機器人狀態',
  execute(client, m) {
    let totalSeconds = (client.uptime / 1000)
    const days = Math.floor(totalSeconds / 86400)
    const hours = Math.floor(totalSeconds / 3600)
    totalSeconds %= 3600
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = Math.floor(totalSeconds % 60)
    const uptime = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`
    const load = os.loadavg().map(n => Math.round((n + Number.EPSILON) * 100) / 100).join(", ")

    const embed = new Discord.RichEmbed()
      .setThumbnail(config.logoUrl)
      .setTimestamp()
      .setTitle(`機器人狀態`)
      .setColor("#0eaa4d") // green
      .setDescription(
        `Name: **${client.user.username}#${client.user.discriminator}**\n` +
        `ID: **${client.user.id}**\n` +
        `Uptime: **${uptime}**\n` +
        `Version: **${config.runtime.version}**\n` +
        `Environment: **${config.runtime.environment}**\n` +
        `Hostname: **${config.runtime.hostname}**\n` +
        `OS platform: **${config.runtime.platform}**\n` +
        `Load average (1m, 5m, 15m): **${load}**\n` +
        `Source code: https://github.com/BirkhoffLee/shepherd-discord-bot\n` +
        `Author: **birkhoff#0001**`)

    return m.channel.send({
      embed: embed
    }).catch(logger.error)
  },
}

