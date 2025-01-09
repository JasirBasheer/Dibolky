import nodemailer from 'nodemailer'

export async function sendMail(email:string,name:string,password:string) {
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
        subject:"Welcome to Vicigrow! Excited to Partner with You",
        html:`<p>Hey ${name},</p>

        <p>Welcome to Dibolky! We’re thrilled to have you on board and are excited to help grow your company to new heights.</p>
        
        <p><strong>Here are your login details to access the interface:</strong></p>
        
        <div style="background-color: #f3f3f3; padding: 10px; border-radius: 5px;">
            <p><strong>Email ID:</strong> ${email}</p>
            <p><strong>Password:</strong> ${password}</p>
        </div>

        <p>Feel free to explore the platform and stay updated on our progress. We’re confident that this partnership will bring immense value to your company.</p>

        <p>Remember, we are here for you whenever you need support. Wishing you and your company all the best!</p>

        <p>Warm regards,<br>The Dibolky Team</p>
`

    }
    try {
        const info = await transporter.sendMail(mailOptions)
        console.log('Email sent : ',info.response)
        
    } catch (error) {
        console.error('Error sending mail',error)
    }
    
}