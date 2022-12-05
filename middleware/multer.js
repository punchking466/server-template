const multer = require('multer');
const path = require('path');
const dayjs = require("dayjs")


const noticeStorage = multer.diskStorage({
    destination : (req, file, cb) =>{
        cb(null, process.env.PWD+ "/uploads/notice");
    },
    filename : function (req, file, cb) {
        let now = dayjs();
        let today =now.format("YYYY-MM-DD HH:mm:ss")
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error("Only image files are allowed!"));
          }
        file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf-8')
        const ext = path.extname(file.originalname);
        cb(null, path.basename(file.originalname,ext)+"-"+today+ext);
    }
})

const uploadNotice = multer({storage : noticeStorage});

module.exports = {
    uploadNotice
}