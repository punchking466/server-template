var express = require('express');
const {sendEmail, validation, smsSend} = require('../controller/validationcontroller');
const refresh = require('../utils/refresh');
var router = express.Router();

router.get('/', validation);

router.post('/mail', sendEmail);

router.post('/sms', smsSend);

router.post('/refresh', refresh);

module.exports = router;
