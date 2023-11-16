const nodemailer = require("nodemailer");
require("dotenv").config();

class MailService {
    async sendActivationMail(email, link) {
        try {
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT,
                secure: true,
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASSWORD,
                },
            });

            const mailOptions = {
                from: process.env.SMTP_USER,
                to: email,
                subject: "Account activation on site.com",
                text: "",
                html: `
                    <div>
                        <h1>Follow the link below to activate your account</h1>
                        <a href="${link}">Click to activate!</a>
                    </div>
                `,
            };

            await transporter.sendMail(mailOptions);
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new MailService();
