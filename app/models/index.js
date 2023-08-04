const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  dbConfig.sales.databse,
  dbConfig.sales.user,
  dbConfig.sales.password,
  { ...dbConfig.sales.config }
);
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;


db.account = require("./account.model.js")(sequelize, Sequelize);
db.customer = require("./customer.model.js")(sequelize,Sequelize);
db.invoice = require("./invoice.model.js")(sequelize,Sequelize);
db.item = require("./item.model.js")(sequelize,Sequelize);
db.invoice_detail = require("./invoice_detail.model.js")(sequelize,Sequelize);

module.exports = db;