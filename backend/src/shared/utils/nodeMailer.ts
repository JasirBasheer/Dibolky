import nodemailer from 'nodemailer'

export async function sendMail(email:string,subject:any,data:any) {
    console.log(process.env.NODEMAILER_USER)
    console.log(process.env.NODEMAILER_PASS)
    
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth:{
            user:process.env.NODEMAILER_USER,
            pass:process.env.NODEMAILER_PASS
        }
    });
    
    const mailOptions = {
        from: process.env.NODEMAILER_USER,
        to:email,
        subject:subject,
        html:data

    }
    try {
        const info = await transporter.sendMail(mailOptions)
        console.log('Email sent : ',info.response)
        
    } catch (error) {
        console.error('Error sending mail',error)
    }
    
}














/////datas

export const createClientMailData = (email:string,name:string,password:string)=>{
    return`<p>Hey ${name},</p>

        <p>A very warm Welcome ! We’re thrilled to have you on board and are excited to help grow your company to new heights.</p>
        
        <p><strong>Here are your login details to access the interface:</strong></p>
        
        <div style="background-color: #f3f3f3; padding: 10px; border-radius: 5px;">
            <p><strong>Email ID:</strong> ${email}</p>
            <p><strong>Password:</strong> ${password}</p>
        </div>

        <p>Feel free to explore the platform and stay updated on our progress. We’re confident that this partnership will bring immense value to your company.</p>

        <p>Remember, we are here for you whenever you need support. Wishing you and your company all the best!</p>

        <p>Warm regards,<br>The Dibolky Team</p>
`}


export const createForgotPasswordData = (name: string, email: string, resetLink: string): string => {
    return `
        <p>Hey ${name},</p>

        <p>We received a request to reset the password for your account associated with ${email}.</p>
        
        <p>If you made this request, please click the link below to reset your password:</p>
        
        <div style="background-color: #f3f3f3; padding: 10px; border-radius: 5px; text-align: center;">
            <a href="${resetLink}" target="_blank" rel="noopener noreferrer" 
               style="display: inline-block; background-color: #007bff; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                Reset Password
            </a>
        </div>

        <p>If you did not request to reset your password, you can safely ignore this email. Your password will not change unless you access the link above and create a new one.</p>

        <p>For any further assistance, feel free to reach out to our support team.</p>
        
        <p>Warm regards,<br>The Dibolky Team</p>
    `;
};
