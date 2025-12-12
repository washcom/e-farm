import Nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const Transporter = Nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,  // TLS
    secure: false,  // TLS connection
    auth: {
        user: process.env.SMTP_USER,  // Brevo SMTP User
        pass: process.env.SMTP_PASS,  // Brevo SMTP Password
    },
    tls: {
        rejectUnauthorized: false,  // Prevent SSL certificate errors
    }
});

export default Transporter;
