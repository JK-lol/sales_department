const db = require("../models");
const { validationResult } = require("express-validator");


exports.getItemSales = async (req, res) => {
  try {
    const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw { errors: errors.array() };
        }
    var responseData = await db.sequelize.query(`
      SELECT items.item_id, item_name, item_type, SUM(invoice_details.purchase_qty) AS 'Item sold'
      FROM items, invoice_details
      WHERE items.item_id = invoice_details.item_id
      GROUP BY items.item_id
      ORDER BY SUM(invoice_details.purchase_qty) DESC;
    `);
    var result = responseData[0];
    res.status(200).json(result);
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
};

exports.getSalesPerformance = async (req, res) => {
    const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw { errors: errors.array() };
        }
  try {
    var responseData = await db.sequelize.query(`
      SELECT accounts.account_id, name, COUNT(invoices.invoice_id) AS "Invoice created",
      SUM(invoices.invoice_total) AS "Total Sales"
      FROM accounts, invoices
      WHERE accounts.account_id = invoices.account_id
      GROUP BY accounts.account_id
      ORDER BY SUM(invoices.invoice_total) DESC;
    `);
    var result = responseData[0];
    res.status(200).json(result); } 
    catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
};
