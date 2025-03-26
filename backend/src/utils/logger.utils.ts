import { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import { color } from 'console-log-colors';
import cron from 'node-cron';


interface CustomLocals {
  errorDetails?: string;
}

declare global {
  namespace Express {
    interface Response {
      locals: CustomLocals;
    }
  }
}

const logDirectory = path.join(__dirname, "../../logs");
const filePath = path.join(logDirectory, 'error.log');

if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

morgan.token('error-details', (req: Request, res: Response) => {
  return res.locals.errorDetails || 'No error details';
});

const errorLogFormat = `:remote-addr - :remote-user [:date[clf]] ":method :url" :status  \n Error: :error-details ms \n \n`;

export const logStream = fs.createWriteStream(filePath, { flags: 'a' });
export const errorLogger = morgan(errorLogFormat, {
  stream: logStream,
  skip: (req: Request, res: Response) => res.statusCode < 400
});




const clearLogs = () => {
    fs.writeFile(filePath, "", (err) => {
        if (err) {
            console.error("Failed to clear log file: ", err)
        }
    })
}


export function clearErrorLogsJob() {
    cron.schedule('0 0 */2 * *', async () => {
        clearLogs()
        console.log(color.cyan('🧹 Error logs cleared successfully..'));

    });
}
