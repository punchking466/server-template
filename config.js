const dotenv = require("dotenv");
dotenv.config({path: `${process.env.PWD}/.env`});


switch (process.env.NODE_ENV) {
  case "development":
    
    
    break;
    
    default:
      break;
    }
    
// 데이터베이스
const dbConfig = {
  HOST: process.env.DEV_DB_HOST,
  USER: process.env.DEV_DB_USER,
  PASSWORD: process.env.DEV_DB_PASSWORD,
  DB: process.env.DEV_DB_NAME,
  PORT: process.env.DEV_DB_PORT,
  dialect: "mysql",
};

// smtp 설정
const smtpConfig = {
  mailer: {
    service: process.env.MAIL_SERVICE,
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    user: process.env.MAIL_USER,
    password: process.env.MAIL_PASSWORD,
  },
};

const smsConfig = {
  secretKey : process.env.SECRET_KEY,
  accessKey : process.env.ACCESS_KEY,
  serviceId : process.env.SERVICE_ID
}

module.exports = {
  dbConfig,
  smtpConfig,
  smsConfig
};
