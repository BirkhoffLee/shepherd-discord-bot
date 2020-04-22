const { createLogger, format, transports } = require('winston')
const path = require('path')
const logLevel = (process.env.NODE_ENV == "production") ? "info" : "debug"

const formatLog = info => {
  if (logLevel == 'debug') {
    return `${info.level} ${info.message}`
  }

  // heroku log already contains timestamp
  return `${info.level} ${info.message}`
}

/**
 * Attempts to add file and line number info to the given log arguments.
 */
function formatLogArguments (args) {
  // we don't want to print "filename:line" in production env
  if (logLevel == "info") {
    return args
  }

  args = Array.prototype.slice.call(args)

  var stackInfo = getStackInfo(1)

  if (stackInfo) {
    // get file path relative to project root
    var calleeStr = '(' + stackInfo.relativePath + ':' + stackInfo.line + ')'

    if (typeof (args[0]) === 'string') {
      args[0] = calleeStr + ' ' + args[0]
    } else {
      args.unshift(calleeStr)
    }
  }

  return args
}

/**
 * Parses and returns info about the call stack at the given index.
 */
function getStackInfo (stackIndex) {
  // get call stack, and analyze it
  // get all file, method, and line numbers
  var stacklist = (new Error()).stack.split('\n').slice(3)

  // stack trace format:
  // http://code.google.com/p/v8/wiki/JavaScriptStackTraceApi
  // do not remove the regex expresses to outside of this method (due to a BUG in node.js)
  var stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/gi
  var stackReg2 = /at\s+()(.*):(\d*):(\d*)/gi

  var s = stacklist[stackIndex] || stacklist[0]
  var sp = stackReg.exec(s) || stackReg2.exec(s)

  if (sp && sp.length === 5) {
    return {
      method: sp[1],
      relativePath: path.relative(__dirname, sp[2]),
      line: sp[3],
      pos: sp[4],
      file: path.basename(sp[2]),
      stack: stacklist.join('\n')
    }
  }
}

const logger = createLogger({
  level: logLevel,
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.printf(formatLog)
  ),
  transports: [
    new transports.Console({
      level: logLevel,
      format: format.combine(
        format.colorize(),
        format.printf(formatLog)
      )
    }),
  ]
})

module.exports.debug = module.exports.log = function () {
  logger.debug.apply(logger, formatLogArguments(arguments))
}

module.exports.info = function () {
  logger.info.apply(logger, formatLogArguments(arguments))
}

module.exports.warn = function () {
  logger.warn.apply(logger, formatLogArguments(arguments))
}

module.exports.error = function () {
  logger.error.apply(logger, formatLogArguments(arguments))
}
