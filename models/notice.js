const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) =>{
    return sequelize.define('notice',{
        id: {
            autoIncrement: true,
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true
        },
        writer: {
            type: DataTypes.BIGINT,
            allowNull: false,
            comment: "작성자",
            references: {
                models: 'users',
                key: 'id'
            }
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false,
            comment: "제목",
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
            comment: "본문"
        },
        image: {
            type: DataTypes.STRING(255),
            allowNull: true,
            comment: "이미지"
        },
    },{
        sequelize,
        tableName: 'notice',
        timestamps: true,
        indexes: [
            {
                name: "PRIMARY",
                unique: true,
                using: "BTREE",
                fields: [
                    {name: "id"}
                ]
            },
            {
                name: "notice_FK_1",
                using: "BTREE",
                fields: [
                    {name: "writer"}
                ]
            }
        ]
    });
}