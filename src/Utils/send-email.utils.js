import nodemailer from "nodemailer"


export const sendEmail = async(
    {
        to,
        cc = process.env.SEND_EMAIL_CC,
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
        from : process.env.SEND_EMAIL_FROM,
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
