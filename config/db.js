const Sequelize = require("sequelize");

const dbName = process.env.database;
const dbUser = process.env.user;
const dbPassowrd = process.env.password;

const sequelize = new Sequelize(dbName, dbUser, dbPassowrd, {
  host: process.env.host,
  port: 3306,
  dialect: "mysql",
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Models-table
db.blogs = require("../models/personalBolgModel")(sequelize, Sequelize);
db.users = require("../models/userModel")(sequelize, Sequelize);

module.exports = db;
