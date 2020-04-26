const fs = require('fs')
const Discord = require('discord.js')
const process = require('process')

const client = new Discord.Client()
client.commands = new Discord.Collection()

const logger = require('./logger')
const config = require('./config')

const welcomeHandler = require('./welcomeHandler')
const messageHandler = require('./messageHandler')(client)

// kill
process.on('SIGTERM', function () {
  logger.error('Exiting on SIGTERM')
  client.destroy()
    .then(() => {
      process.exit(0)
    })
    .catch(logger.error)
})

// ctrl + c
process.on('SIGINT', function () {
  logger.error('Exiting on SIGINT')
  client.destroy()
    .then(() => {
      process.exit(0)
    })
    .catch(logger.error)
})

// nodemon signal
process.on('SIGUSR2', function () {
  logger.error('Exiting on SIGUSR2')
  client.destroy()
    .then(() => {
      process.exit(0)
    })
    .catch(logger.error)
})

const events = {
	MESSAGE_REACTION_ADD: 'messageReactionAdd',
	MESSAGE_REACTION_REMOVE: 'messageReactionRemove',
}

const updateTestChannelTopic = function () {
  let totalSeconds = (client.uptime / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor(totalSeconds / 3600)
  totalSeconds %= 3600
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = Math.floor(totalSeconds % 60)
  const topic = `Bot uptime: ${days}d ${hours}h ${minutes}m ${seconds}s | ${config.runtime.version}-${config.runtime.environment}`

  let guild = client.guilds.get(config.serverGuildID)

  guild.channels.get('702390154400366632')
    .setTopic(topic)
    .catch(logger.error)
}

client.on('uncaughtException', err => {
  logger.error(err)
})

const readyHandler = () => {
  logger.info(`Successfully logged in as ${client.user.tag}.`)

  logger.debug("Setting bot status")
  client.user.setStatus('available')
  client.user.setActivity(config.activity)

  logger.info("Updating reaction roles message")
  client.commands.get("reaction").execute(client)

  logger.info("Updating team list message")
  client.commands.get("updatelist").execute(client)

  logger.info("Updating test channel topic")
  updateTestChannelTopic()
  setInterval(updateTestChannelTopic, 5000)

  logger.info("Bot is ready.")
}

client.on('ready', readyHandler)
client.on('debug', logger.debug)

client.on('guildMemberAdd', welcomeHandler)
client.on('message', messageHandler)

client.on('raw', async event => {
  // `event.t` is the raw event name
  // We don't want this to run on unrelated packets
  if (!Object.prototype.hasOwnProperty.call(events, event.t)) return

  const { d: data } = event

  // if the message is already in the cache, don't re-emit the event
  // if (channel.messages.has(data.message_id)) return

  if (data.message_id != 702461700074635274) return

  const user = client.users.get(data.user_id)
  const channel = client.channels.get(data.channel_id)
  const message = await channel.fetchMessage(data.message_id)
  const member = message.guild.members.get(user.id)

  const emojiKey = (data.emoji.id) ? `${data.emoji.name}:${data.emoji.id}` : data.emoji.name

  const roleName = config.roleNames[config.emojiNames.findIndex(el => el == emojiKey)]

  if (member.id == client.user.id) return

  const selectRole = rN => message.guild.roles.find(r => r.name === rN)
  const guildRole = selectRole(roleName)

  try {
    if (event.t === "MESSAGE_REACTION_ADD") {
      logger.info(`Adding role ${roleName} for user ${user.username}#${user.discriminator}`)
      await member.addRole(guildRole.id)
      await member.addRole(selectRole("Member"))

      if (roleName == "我要入隊") {
        client.commands.get("new").execute(client, message, true, user)
      }
    } else if (event.t === "MESSAGE_REACTION_REMOVE") {
      logger.info(`Removing role ${roleName} for user ${user.username}#${user.discriminator}`)
      await member.removeRole(guildRole.id)
    }
  } catch (e) {
    logger.error(e)
  }
})

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
  const command = require(`./commands/${file}`)
  client.commands.set(command.name, command)
  logger.debug(`Command ${command.name} registered.`)
}

logger.info("Connecting to the Discord servers...")
client.login(config.token)
