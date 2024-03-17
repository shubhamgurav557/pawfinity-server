import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';

export const sendOtpByEmail = async (email, otp, name, surname) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_EMAIL,
                pass: process.env.GMAIL_PASS
            }
        })

        let MailGenerator = new Mailgen({
            theme: 'default',
            product: {
                name: 'Pawfinity',
                link: 'https://mailgen.js/',
                copyright: '© 2024 Pawfinity. All rights reserved.'
            }
        })

        let emailBody = {
            body: {
                greeting: `Dear ${name} ${surname}`,
                intro: "Welcome to Pawfinity!",
                action: {
                    instructions: 'Use the following OTP to verify your account:',
                    button: {
                        text: otp
                    }
                },
                outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.',
                signature: 'Yours Sincerley'
            }
        };

        let emailTemp = MailGenerator.generate(emailBody)
        await transporter.sendMail({
            from: process.env.GMAIL_EMAIL,
            to: email,
            subject: 'OTP Verification',
            html: emailTemp
        });
    } catch (error) {
        console.error('Error sending OTP:', error);
    }
}