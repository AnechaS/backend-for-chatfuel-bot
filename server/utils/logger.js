const config = require('config');
const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');

// Ignore log messages if they have { private: true }
const ignorePrivate = winston.format((info, opts) => {
  if (info.private) {
    return false;
  }
  return info;
});

function configureLogger({
  logsFolder,
  jsonLogs = false,
  logLevel = winston.level,
  silent,
  maxFiles,
}) {
  const options = {};

  if (logsFolder) {
    if (!path.isAbsolute(logsFolder)) {
      options.dirname = path.resolve(process.cwd(), logsFolder);
    }
  }

  options.level = logLevel;
  options.silent = silent;

  if (maxFiles) {
    options.maxFiles = maxFiles;
  }

  if (jsonLogs) {
    options.json = true;
    options.stringify = true;
  }

  const transports = [];

  if (options.dirname) {
    const server = new DailyRotateFile({
      filename: './server.info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.splat(),
        winston.format.json()
      ),
      ...options,
    });
    server.name = 'server';
    transports.push(server);

    const serverError = new DailyRotateFile(
      Object.assign({
        name: 'server-error',
        filename: './server.err',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.splat(),
          winston.format.json()
        ),
        ...options,
        level: 'error',
      })
    );
    serverError.name = 'server-error';
    transports.push(serverError);
  }

  const consoleOptions = {
    colorize: true,
    name: 'console',
    format: options.json ? winston.format.json() : winston.format.simple(),
    ...options,
  };

  transports.push(new winston.transports.Console(consoleOptions));
  const logger = winston.createLogger({
    format: winston.format.combine(
      ignorePrivate(),
    ),
    transports,
  });

  return logger;
}

const loggerOptions = {
  logsFolder: process.env.NODE_ENV === 'test' ? './test_logs/' : './logs/',
  ...(config.has('logsFolder') && { logsFolder: config.get('logsFolder') }),
  ...(config.has('logLevel') && { logLevel: config.get('logLevel') }),
  ...(config.has('jsonLogs') && { jsonLogs: config.get('jsonLogs') }),
  ...(config.has('silent') && { silent: config.get('silent') }),
  ...(config.has('maxLogFiles') && { maxFiles: config.get('maxLogFiles') }),
};

module.exports = configureLogger(loggerOptions);
