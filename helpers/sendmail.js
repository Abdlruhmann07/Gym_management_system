const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// (not tested yet)
const sendmail = async (option) => {
    const { EMAIL_USER, EMAIL_PASSWORD, EMAIL_HOST, EMAIL_PORT } = process.env
    // CREATE A TRANSPORTER
    const transporter = nodemailer.createTransport({
        host: EMAIL_HOST,
        port: EMAIL_PORT,
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASSWORD
        }
    })
    // EMAIL OPTIONS
    const emailOptions = {
        from: 'Abdlruhman Sheerif <dodgersherif127@gmail.com>',
        to: option.email,
        subject: option.subject,
        text: option.message
    }
    await transporter.sendMail(emailOptions)
}
module.exports = sendmail;