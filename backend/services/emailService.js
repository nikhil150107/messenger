const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

const sendOtpEmail = async (toEmail, otp) => {
    await transporter.sendMail({
        from: `"Messenger" <${process.env.SMTP_USER}>`,
        to: toEmail,
        subject: 'Verify your Messenger account - OTP',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; border: 1px solid #e0f2fe; border-radius: 16px;">
                <h2 style="color: #0ea5e9; margin-bottom: 8px;">Messenger</h2>
                <p style="color: #475569; margin-bottom: 24px;">Use the OTP below to verify your email address. It is valid for <strong>5 minutes</strong>.</p>
                <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
                    <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #0369a1;">${otp}</span>
                </div>
                <p style="color: #94a3b8; font-size: 13px;">If you did not request this, please ignore this email.</p>
            </div>
        `
    });
};

module.exports = { sendOtpEmail };
