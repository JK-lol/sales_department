const db = require("../models");
const { validationResult } = require("express-validator");

const MODEL = "invoice_detail";

const jwt = require('jsonwebtoken');

const secretKey = process.env.SECRET_KEY;


exports.create = async (req, res) => {
  
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw { errors: errors.array() };
    }

    const { invoice_id, item_id, purchase_qty,customer_email } = req.body;

    // Decode JWT token and extract the ID
    const token = req.headers.authorization.split(' ')[1]; 
    const decodedToken = jwt.verify(token, secretKey);

    const account_id = decodedToken.id; 

    // Retrieve the customer_id based on customer_contact and customer_email
    const customer = await db.customer.findOne({
      where: {customer_email },
    });

    const item = await db.item.findOne({
      where: { item_id },
    });

    if (!item) {
      throw { errors: [{ msg: 'Item not found' }] };
    }

    if (!customer) {
      throw { errors: [{ msg: 'Customer not found' }] };
    }

    let insertedInvoice;
    const existingInvoice = await db.invoice.findOne({
      where: { invoice_id, account_id, customer_id: customer.customer_id },
    });

    if (!existingInvoice) {
      insertedInvoice = await db.invoice.create({ invoice_id, account_id, customer_id: customer.customer_id });
    } else {
      insertedInvoice = existingInvoice;
    }

    const checkItem = await db.item.findOne({ where: { item_id } });
    if (checkItem.item_quantity < purchase_qty) {
      throw { errors: [{ msg: 'Insufficient stock' }] };
    }

    const payload = {
      invoice_id: insertedInvoice.invoice_id,
      account_id: insertedInvoice.account_id,
      customer_id: insertedInvoice.customer_id,
      item_id: item_id,
      purchase_qty: purchase_qty,
    };

    const createdInvoiceDetail = await db.invoice_detail.create(payload);

    res.status(200).json(createdInvoiceDetail);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};


exports.findOne = async (req, res) => {
  try {
    const id = req.params.id;
    let eachData = await db[MODEL].findByPk(id);
    if (eachData == null) throw "Invalid Data";
    res.status(200).json(eachData);
  } catch (error) {
    res.status(400).json(error);
  }
};
