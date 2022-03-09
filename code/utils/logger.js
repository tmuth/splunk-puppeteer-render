const { createLogger, format, transports } = require('winston');
const logLevel = 'error'; // error | warn | info | debug https://github.com/winstonjs/winston#using-logging-levels
module.exports = createLogger({
    transports: [
        new transports.File({
            level: logLevel,
            filename: 'logs/server.log',
            format:format.combine(
                format.timestamp({format: 'MMM-DD-YYYY HH:mm:ss'}),
                format.align(),
                format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`),
        )}),
        new transports.Console({
            level: logLevel,
            format: format.combine(
                format.colorize(),
                format.simple()
            )
        })
    ]
});