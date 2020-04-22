const Discord = require('discord.js')
// const moment = require('moment')

const bot = new Discord.Client()
      bot.commands = new Discord.Collection()

const logger = require('./logger')
const config = require('./config.json')
const welcomeHandler = require('./welcomeHandler')
const messageHandler = require('./messageHandler')(bot)

const fs = require('fs')

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
  const command = require(`./commands/${file}`)
  bot.commands.set(command.name, command)
  logger.debug(`Command ${command.name} registered.`)
}

bot.on('uncaughtException', err => {
  logger.error(err)
})

bot.once('ready', () => {
  logger.info(`Successfully logged in as ${bot.user.tag}.`)

  logger.debug("Setting bot status")
  bot.user.setStatus('available')
  bot.user.setActivity(config.activity)

  logger.info("Bot is ready.")
})

bot.on('guildMemberAdd', welcomeHandler)
bot.on('message', messageHandler)

logger.info("Connecting to the Discord servers...")
bot.login(config.token)

process.bot = bot
