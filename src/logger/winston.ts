import winston from 'winston';
import winstonDaily from 'winston-daily-rotate-file';

const logDir = 'logs'; // log가 저장될 디렉토리
const { combine, timestamp, printf } = winston.format;

// Define log format
const logFormat = printf((info) => {
  return `${info.timestamp} | ${info.level} | ${info.message}`;
});

/*
 * Log Level
 * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
 */
const logger = winston.createLogger({
  format: combine(
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss a',
    }),
    logFormat,
  ),
  transports: [
    // info 레벨 로그를 저장할 파일 설정
    new winstonDaily({
      level: 'http',
      datePattern: 'YYYY-MM-DD',
      dirname: logDir,
      filename: `%DATE%.log`,
      maxFiles: 30, // 30일치 로그 파일 저장
      zippedArchive: true,
    }),
    // error 레벨 로그를 저장할 파일 설정
    new winstonDaily({
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      dirname: logDir + '/error', // error.log 파일은 /logs/error 하위에 저장
      filename: `%DATE%.error.log`,
      maxFiles: 30,
      zippedArchive: true,
    }),
    // Console로 출력
    new winston.transports.Console({
      level: 'http',
      format: winston.format.combine(
        winston.format.colorize(), // 색깔 넣어서 출력
        logFormat,
      ),
    }),
  ],
});

export { logger };
