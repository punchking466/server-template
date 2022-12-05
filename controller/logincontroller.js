const db = require('../models/index');
const models = db.models;
const bcrypt = require('bcrypt');
const { messages } = require('../utils/messages');
const jwt = require('../utils/jwt-util');
const redisClient = require('../utils/redis');
const { signUpMail } = require('../utils/email');


//sign up
const signUp = async (req, res) => {
    const user = req.body;
    const role = req.params;

    user.password = await bcrypt.hash(user.password, 10);
    data = { ...user, ...role }

    try {
        await models.users.create(
            data
        )
        await signUpMail(user);
        res.json({ status: "OK" });
    } catch (error) {
        res.json(error);
    }
}

//sign in
const signIn = async (req, res) => {
    const { signname, password } = req.body;

    try {
        const user = await models.users.findOne({
            raw: true,
            where: { signname: signname }
        });

        if (user) {
            const success = await bcrypt.compare(password, user.password);

            if (!success) {
                throw { msg: "signname or password incorrect" }
            }

            const accessToken = jwt.sign(user);
            const refreshToken = jwt.refresh();

            await redisClient.set(user.signname, refreshToken, {'EX': 60*60*24*14});

            res.json({
                ok: true,
                accessToken,
                refreshToken,
            });
        } else{
            throw {msg: messages.MSG_DATANOTFOUND}
        }
    } catch (error) {
        res.json(error);
    }
}

const findId = async (req, res) => {
    const { phone } = req.query;

    try {
        const result = await models.users.findOne({
            raw: true,
            attributes: ['signname'],
            where: { user_phone: phone }
        });

        res.json({
            status: "OK",
            signname: result.signname
        });
    } catch (error) {
        res.json(error);
    }
}

const findPw = async (req, res) => {
    const { signname, password } = req.body;
    try {
        
        const user = await models.users.findOne({
            where: { signname: signname }
        });

        
        if (!user) {
            throw messages.MSG_EMAIL_NOTSET
        }
        
        const newPassword = await bcrypt.hash(password, 10);

        await models.users.update(
            { password: newPassword },
            { where: { signname: signname } }
        );

        res.json({
            status: "OK"
        });

    } catch (error) {
        res.json(error);
    }
}

const exitUser = async(req, res) => {
    const {signname} = req.body;

    try{
        await models.users.destroy({
            where : {signname : signname}
        });
        
        res.json({
            status: "OK"
        });

    } catch(error){
        res.json(error);
    }
}

module.exports = {
    signUp,
    signIn,
    findId,
    findPw,
    exitUser,
}