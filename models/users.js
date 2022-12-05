const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('users', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    role: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "유저구분",
      references: {
        model: 'role',
        key: 'id'
      }
    },
    signname: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "이메일",
      unique: "users_UN"
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "비밀번호"
    },
    user_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "이름"
    },
    user_phone: {
      type: DataTypes.STRING(13),
      allowNull: false,
      comment: "휴대전화",
      unique: "users_UN_2"
    },
    zip_code: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "주소"
    },
    detail_address: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "상세주소"
    },
  }, {
    sequelize,
    tableName: 'users',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "users_UN",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "signname" },
        ]
      },
      {
        name: "users_UN_2",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "user_phone" },
        ]
      },
      {
        name: "users_FK_1",
        using: "BTREE",
        fields: [
          { name: "role" },
        ]
      }
    ]
  });
};
