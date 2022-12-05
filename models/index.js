const Sequelize = require('sequelize');
const initModels = require('./init-models');
const fs = require("fs");
const path = require("path");
const {dbConfig} = require('../config');

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host : dbConfig.HOST,
    dialect : dbConfig.dialect,
    timezone : "Asia/Seoul"
});



const db = {}

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.models = initModels(sequelize);

// db.sequelize.sync({
//     alter : true,
//     force : false,
// })
//   .then(() => {
//     console.log("Synced db.");
//   })
//   .catch((err) => {
//     console.log("Failed to sync db: " + err.message);
//   });

module.exports = db;
