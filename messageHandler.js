const logger = require('./logger')
const config = require('./config.json')

module.exports = client => m => {
  // ignoring messages from bots
  if (m.author.bot) return
  // ignoring DMs
  if (m.guild === null) return

  // logger.debug(`Message received: ${m.content}`)

  // only process commands
  if (!m.content.startsWith(config.prefix)) return

  const args = m.content.slice(config.prefix.length).split(/ +/)
  const command = args.shift().toLowerCase()

  logger.debug(`Command parsed: ${command}`)

  if (!client.commands.has(command)) {
    return
  }

  // if (m.author.id != '244277877485469698') return

  let cmd = client.commands.get(command)

  /*
    empty - everyone can use
    staff - helper to srmod can use (has Staff role)
    admin - admin to owner can use (has Administration role)
  */
  let permissions = cmd.permissions

  if (permissions == "staff") {
    if (!m.member.roles.find(r => r.name === "核心成員")) {
      return m.reply(`你權限不夠啦幹`)
    }
  } else if (permissions == "admin") {
    if (!m.member.roles.find(r => r.name === "DC管理員")) {
      return m.reply(`你權限不夠啦幹`)
    }
  }

  logger.debug(`Dispatching command ${command}`)

  try {
    cmd.execute(client, m, args)
    logger.info(`[${m.author.tag}] ${m.content} (dispatched)`)
  } catch (error) {
    logger.error(error)
    console.trace(error)
    m.reply('我他媽短路')
  }
}
