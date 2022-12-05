var DataTypes = require("sequelize").DataTypes;

var _users = require("./users");
var _role = require("./role");
var _notice = require("./notice")

function initModels(sequelize) {

  var users = _users(sequelize, DataTypes);
  var role = _role(sequelize, DataTypes);
  var notice = _notice(sequelize, DataTypes);

  users.belongsTo(role, { as: "role_role", foreignKey: "role", onDelete: "cascade", onUpdate: "cascade"});
  role.hasMany(users, { as: "users", foreignKey: "role", onDelete: "cascade", onUpdate: "cascade"});
  notice.belongsTo(users, { as: "wrtier_user", foreignKey: "writer", onDelete: "cascade", onUpdate: "cascade"});
  users.hasMany(notice, {as: "notice", foreignKey: "writer", onDelete: "cascade", onUpdate: "cascade"});

  return {
    users,
    role,
    notice
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
