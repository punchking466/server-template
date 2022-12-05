var express = require('express');
var router = express.Router();
const {getNoticeList, getNotice, createNotice, editNotice, deleteNotice} = require('../controller/noticecontroller');
const authJWT = require('../middleware/authJWT');
const { uploadNotice } = require('../middleware/multer');

router.get('/', getNoticeList);

router.post('/', authJWT, uploadNotice.single('notice'), createNotice);

router.get('/:id', authJWT, getNotice);

router.put('/:id', authJWT, uploadNotice.single('notice'), editNotice);

router.delete('/:id', authJWT, deleteNotice);

module.exports = router;
