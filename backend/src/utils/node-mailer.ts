import nodemailer from 'nodemailer'
import { env } from '@/config';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: env.NODE_MAILER.MAIL,
        pass: env.NODE_MAILER.PASSWORD
    }
});

export async function sendMail(email: string, subject: string, html: string, callback:any) {
    const mailOptions = {
        from: env.NODE_MAILER.MAIL,
        to: email,
        subject: subject,
        html: html
    }

    transporter.sendMail(mailOptions, function (error: any, info: any) {
        if (error) {
            console.error(error);
            callback(error);
        } else {
            console.log("Email has been sent to user's email");
            callback(null, info);
        }
    });

}
