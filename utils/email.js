const nodemailer = require('nodemailer');
const smtpPool = require('nodemailer-smtp-pool');
const { smtpConfig } = require('../config');
const ejs = require('ejs');
const moment = require("moment");
const { messages } = require('./messages');
require('moment-timezone');
const date = moment();
const now = date.format("YYYY-MM-DD hh:mm:ss")

const verifyMail = async (email, verifyCode) => {
    let emailForm;

    ejs.renderFile("views/verifyMail.ejs", { verifyCode }, (error, data) => {
        if (error) console.log(error);

        emailForm = data;
    })
    console.log("eamil : ", email);
    const from = `이메일 인증 <${smtpConfig.mailer.user}>`;
    const to = `${email}`;
    const subject = '이메일 인증코드 전달';
    const html = emailForm;

    const mailOptions = {
        from,
        to,
        subject,
        html,
    };

    const transporter = nodemailer.createTransport(smtpPool({
        service: smtpConfig.mailer.service,
        host: smtpConfig.mailer.host,
        port: smtpConfig.mailer.port,
        auth: {
            user: smtpConfig.mailer.user,
            pass: smtpConfig.mailer.password,
        },
        tls: {
            rejectUnauthorized: false,
        },
        maxConnections: 5,
        maxMessages: 10,
    }));

    // 메일 발송        
    transporter.sendMail(mailOptions, (error) => {
        if (error) {
            console.log(error);
        }
        transporter.close();
    })
}

const signUpMail = async (user) => {
    let emailForm;
    try {
        ejs.renderFile("views/signUp.ejs", { user, now }, (err, data) => {
            if (err) console.log(err);

            emailForm = data;
        })

        const from = `누리글로벌 <${smtpConfig.mailer.user}>`;
        const to = `${user.signname}`;
        const subject = '누리글로벌서비스 회원가입을 축하합니다!';
        const html = emailForm;

        const mailOptions = {
            from,
            to,
            subject,
            html,
        };

        const transporter = nodemailer.createTransport(smtpPool({
            service: smtpConfig.mailer.service,
            host: smtpConfig.mailer.host,
            port: smtpConfig.mailer.port,
            auth: {
                user: smtpConfig.mailer.user,
                pass: smtpConfig.mailer.password,
            },
            tls: {
                rejectUnauthorized: false,
            },
            maxConnections: 5,
            maxMessages: 10,
        }));

        // 메일 발송        
        transporter.sendMail(mailOptions, (error) => {
            if (error) {
                console.log(error);
            }
        })
    } catch (error) {
        console.log(error);
    }

}

const resetPwMail = (user, password) => {
    let emailForm;

    ejs.renderFile("views/resetPwd.ejs", { user, password }, (err, data) => {
        if (err) console.log(err);

        emailForm = data;
    })

    const from = `누리글로벌 <${smtpConfig.mailer.user}>`;
    const to = `${user.signname}`;
    const subject = '임시 비밀번호 전달';
    const html = emailForm;

    const mailOptions = {
        from,
        to,
        subject,
        html,
        attachments: [
            {
                filename: "resetImage.png",
                path: process.env.PWD + "/image/resetImage.png",
                cid: "resetImage",
            }
        ]
    };

    const transporter = nodemailer.createTransport(smtpPool({
        service: smtpConfig.mailer.service,
        host: smtpConfig.mailer.host,
        port: smtpConfig.mailer.port,
        auth: {
            user: smtpConfig.mailer.user,
            pass: smtpConfig.mailer.password,
        },
        tls: {
            rejectUnauthorized: false,
        },
        maxConnections: 5,
        maxMessages: 10,
    }));

    //메일 발송
    transporter.sendMail(mailOptions, (err) => {
        if (err) {
            return console.log(err);
        }
        transporter.close();
    });
}

module.exports = {
    verifyMail,
    signUpMail,
    resetPwMail,
}