import fs from 'fs'
import path from 'path'
import cron from 'node-cron';
import { color } from 'console-log-colors';


const filePath = path.join(__dirname,"../../../logs/error.log")

const logError = (message:any) => {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n \n`;
    
    fs.appendFile(filePath, logMessage, (err) => {
        if (err) {
            console.error("Failed to write to log file:", err);
        }
    });
};

export default logError

const clearLogs = () =>{
    fs.writeFile(filePath,"",(err)=>{
        if(err){
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





