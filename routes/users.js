var express = require('express');
const { signUp, signIn, findId, findPw, exitUser } = require('../controller/logincontroller');
var router = express.Router();


router.post('/signup/:role', signUp);

router.post('/signin', signIn);

router.get('/findemail', findId);

router.put('/password', findPw);

router.delete('/', exitUser);

module.exports = router;
