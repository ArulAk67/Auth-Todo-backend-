import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';


export const registerMail = async (req, res) => {
    const { username, email, text, subject } = req.body;

    let config = {
        service : 'gmail',
        auth : {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    }

    let transporter = nodemailer.createTransport(config);

    let MailGenerator = new Mailgen({
        theme: "default",
        product : {
            name: "Mailgen",
            link : 'https://mailgen.js/'
        }
    })

    let response = {
        body: {
            name : username,
            intro: text || `Welcome to ${username} We\'re very excited to have you on board.` ,
    
            outro:'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    }

    let mail = MailGenerator.generate(response)

    let message = {
        from : process.env.EMAIL,
        to : email,
        subject: subject || "Signup Successful",
        html: mail
    }

    transporter.sendMail(message).then(() => {
        return res.status(201).json({
            msg: "you should receive an email"
        })
    }).catch(error => {
        return res.status(500).json({ error })
    })

    
}