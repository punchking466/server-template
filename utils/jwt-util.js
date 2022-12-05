const jwt = require('jsonwebtoken');
const redisClient = require('./redis');
const messages = require('../utils/messages');
const dotenv = require('dotenv');
dotenv.config({path: `${process.env.PWD}/.env`});

const secret = process.env.SECRET;

module.exports = {
    sign : (user) => {
        const payload = {
            id : user.id,
            signname : user.signname,
            role : user.role
        }
        
        return jwt.sign(payload, secret, {
            algorithm : 'HS256',
            expiresIn : '2h',
        });
    },

    verify : (token) =>{
        let decoded = null;
        try{
            decoded = jwt.verify(token, secret);
            return {
                ok : true,
                id : decoded.id,
                signname : decoded.signname,
                role : decoded.role
            };
        } catch (err) {
            return{
                ok : false,
                message : err.message,
            };
        }
    },

    refresh : () => {
        return jwt.sign({}, secret, {
            algorithm : 'HS256',
            expiresIn : '14d',
        });
    },

    refreshVerify : async (token, signname) => {
        try {
            const data = await redisClient.get(signname);
            if (token === data) {
                try {
                    jwt.verify(token, secret);
                    return true;
                } catch (err) {
                    return false;
                }
            } else { 
                return false;
            }
        } catch (err) {
            return false;
        }
    },
};
