const db = require('../models/index');
const models = db.models;
const { messages } = require('../utils/messages');
const { pagingServer } = require('../utils/paging');
const fs = require('fs');

const getNoticeList = async (req, res) => {
    const { curPage, pageSize, orderCol, orderVal, filterCol, filterVal } = req.query;

    try {
        filterCol ? cntAll = await models.notice.count({
            where: { [filterCol]: filterVal }
        })
            : cntAll = await models.notice.count();

        if (curPage - 1 > Math.round(cntAll / pageSize)) {
            throw 'end of raw';
        }

        const paging = pagingServer(curPage, pageSize, orderCol, orderVal, filterCol, filterVal);

        const noticeList = await models.notice.findAll(await paging);

        res.json({
            status: "OK",
            cntAll: cntAll,
            noticeList
        });
    } catch (error) {
        res.json(error);
    }

};

const getNotice = async (req, res) => {
    const { id } = req.params;

    try {
        const data = await models.notice.findOne({
            raw: true,
            where: { id }
        })
        res.json({
            status: "OK",
            data
        })
    } catch (error) {
        res.json(error);
    }
}

const createNotice = async (req, res) => {
    const writer = req.id;
    const { title, content } = req.body;
    let image

    if (req.file != undefined) {
        image = `/notice/${req.file.filename}`;
    }

    try {
        await models.notice.create({
            title: title,
            content: content,
            image: image,
            writer: req.id,
        });

        res.json({ status: "OK" });
    } catch (error) {
        res.json(error);
    }
};

const editNotice = async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    let image;

    req.file != undefined ? image = `/notice/${req.file.filename}`
        : image = null;

    try{
        const existImage = await models.notice.findOne({
            raw : true,
            attributes : ['image'],
            where : {id}
        });

        if(existImage.image != null){
            fs.unlinkSync('./uploads'+ existImage.image);
        };

        await models.notice.update(
            {
                title : title,
                image : image,
                content : content
            },
            {where : {id}}
            );

        res.json({status:"OK"});

    } catch(error){
        res.json(error);
    }
}

const deleteNotice = async (req, res) => {
    const {id} = req.params;

    try{
        const existImage = await models.notice.findOne({
            raw : true,
            attributes : ['image'],
            where : {id}
        });

        if(existImage.image != null){
            fs.unlinkSync('./uploads'+ existImage.image);
        };

        await models.notice.destroy({
            where: {id}
        });

        res.json({status : "OK"});
    } catch(error){
        res.json(error);
    }
}

module.exports = {
    getNoticeList,
    getNotice,
    createNotice,
    editNotice,
    deleteNotice
}