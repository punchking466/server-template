const axios = require("axios");
const cryptojs = require("crypto-js");
const crypto = require("crypto");
const { messages } = require("../utils/messages");
const {smsConfig} = require("../config")
const { verifyMail } = require("../utils/email");
const redisClient = require('../utils/redis');

const smsSend = async (req, res) => {
  const { phone } = req.body;
  const date = Date.now().toString();
  const uri = smsConfig.serviceId;
  const secretKey = smsConfig.secretKey;
  const accessKey = smsConfig.accessKey;

  const method = "POST";
  const space = " ";
  const newLine = "\n";
  const url = `https://sens.apigw.ntruss.com/sms/v2/services/${uri}/messages`;
  const url2 = `/sms/v2/services/${uri}/messages`;
  const hmac = cryptojs.algo.HMAC.create(cryptojs.algo.SHA256, secretKey);

  hmac.update(method);
  hmac.update(space);
  hmac.update(url2);
  hmac.update(newLine);
  hmac.update(date);
  hmac.update(newLine);
  hmac.update(accessKey);

  const hash = hmac.finalize();
  const signature = hash.toString(cryptojs.enc.Base64);
  const verifyCode = Math.floor(Math.random() * (99999 - 10000)) + 100000;

  await redisClient.set(phone, verifyCode.toString(), {'EX': 60*3});

  try {
    await axios({
      method: method,
      json: true,
      url: url,
      headers: {
        "Content-Type": "application/json",
        "x-ncp-iam-access-key": accessKey,
        "x-ncp-apigw-timestamp": date,
        "x-ncp-apigw-signature-v2": signature,
      },
      data: {
        type: "SMS",
        contentType: "COMM",
        contryCode: "82",
        from: "01062957071",
        content: `[본인 확인] 인증번호 [${verifyCode}]를 입력해주세요.`,
        messages: [
          {
            to: `${phone}`,
          },
        ],
      },
    });

    res.json({
       status: "OK" 
      });
  } catch (error) {
    res.json(error);
  }
};

const sendEmail = async (req, res) => {
  const { email } = req.body;
  const authCode = crypto.randomBytes(3).toString('hex');

  await redisClient.set(email, authCode, {'EX': 60*3});

  try {
    await verifyMail(email, authCode);

    res.json({ status: "OK" });
  } catch (error) {
    res.json(error);
  }
};

const validation = async (req, res) => {
  const { authKey, authCode } = req.query;

  const data = await redisClient.get(authKey);

  if (!data) {
    return res.json({ status: "ERR", msg: messages.MSG_ARGMISSING });
  }

  if (data !== authCode) {
    return res.json({ status: "ERR", msg: messages.MSG_VERIFYFAIL });
  }

  await redisClient.del(authKey);

  res.json({ status: "OK" });
};

module.exports = {
  smsSend,
  sendEmail,
  validation,
};
