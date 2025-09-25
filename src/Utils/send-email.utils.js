import nodemailer from "nodemailer"


export const sendEmail = async(
    {
        to,
        cc = 'fsjuyiobmbjipijmmz@nesopf.com',/** @comment : Don't hard code anything - I were explain the feature not more */
        subject,
        content,
        attachments = []
    }
)=>{

    const transporter =  nodemailer.createTransport({
    host:'smtp.gmail.com',
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
        from : 'tm211270@gmail.com', /** @comment : Get it from the env as you do process.env.USER_EMAIL */
        to,
        cc,
        subject,
        html:content,
        attachments

    })

    console.log(info);
    


    return info
}


import { EventEmitter } from 'node:events';

export const emitter = new EventEmitter();


emitter.on('sendEmail' , (args)=>{
    console.log(`The sending Email event is started`);

    sendEmail(args)
    
})
