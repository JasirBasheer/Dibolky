import winston from 'winston';
import GelfTransport from 'winston-gelf-pro';

const environment = process.env.NODE_ENV || 'development';

const transports: winston.transport[] = [
  new GelfTransport({
    gelfPro: {
      fields: { facility: 'mern-backend', tag: 'backend' },
      adapterName: 'udp',
      adapterOptions: {
        host: process.env.LOGSTASH_HOST || '172.19.0.5',
        port: 12201,
      },
    },
    levelMap: {
      verbose: 'info',
      error: 'error', 
    },
    adapterOptions: {
      messageField: 'full_message',
      errorField: 'stack', 
    },
  }),
];

if (environment === 'development') {
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.errors({stack:true}),
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.errors({stack:true}),
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports,
});

logger.info('Logger initialized', { environment });

export default logger;