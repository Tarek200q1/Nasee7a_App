import nodemailer from "nodemailer"


export const sendEmail = async(
    {
        to,
<<<<<<< HEAD
        cc = process.env.SEND_EMAIL_CC,
=======
<<<<<<< Updated upstream
        cc = 'fsjuyiobmbjipijmmz@nesopf.com',/** @comment : Don't hard code anything - I were explain the feature not more */
=======
        cc = process.env.SEND_EMAIL_CC,
>>>>>>> Stashed changes
>>>>>>> master
        subject,
        content,
        attachments = []
    }
)=>{

    const transporter =  nodemailer.createTransport({
    host: process.env.TRANSPORT_HOST,
    port:465,
    secure : true,
    auth :{
        user : process.env.USER_EMAIL,
        pass: process.env.USER_PASSWORD
    },
     tls: {
    rejectUnauthorized: false
  }
})

    const info = await transporter.sendMail({
<<<<<<< HEAD
        from: process.env.SEND_EMAIL_FROM,
=======
<<<<<<< Updated upstream
        from : 'tm211270@gmail.com', /** @comment : Get it from the env as you do process.env.USER_EMAIL */
=======
        from : process.env.SEND_EMAIL_FROM,
>>>>>>> Stashed changes
>>>>>>> master
        to,
        cc,
        subject,
        html:content,
        attachments

    })

    return info
}


import { EventEmitter } from 'node:events';

export const emitter = new EventEmitter();


emitter.on('sendEmail' , (args)=>{
    sendEmail(args)
})
