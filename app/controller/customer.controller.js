const db = require("../models");
const Op = db.Sequelize.Op;
const { validationResult } = require("express-validator");

const PRIMARY_KEY = "customer_id"
const MODEL = "customer"

exports.create = async (req, res) => {

    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw { errors: errors.array() };
        }
        const { customer_name, customer_contact, customer_email} = req.body;
        const payload = {
            customer_name: customer_name,
            customer_contact: customer_contact,
            customer_email: customer_email,
          };
        var responseData = await db.customer.create(payload);

        res.status(200).json(responseData);
    } catch (e) {
        console.log(e)
        res.status(400).json(e);   
    }
};

exports.findOne = async (req, res) => {
    try {
        const id = req.params.id;
        let eachData = await db[MODEL].findByPk(id);
        if (eachData == null) throw "Invalid Data";
        res.status(200).json(eachData);
        } catch (e) {
      res.status(400).json(e);
}
};

exports.findAll = async (req, res) => {
  try {
    const allData = await db[MODEL].findAll();
    if (allData.length === 0) throw "No Data Found";
    res.status(200).json(allData);
  } catch (e) {
    res.status(400).json(e);
  }
};

exports.findbyContact = async (req, res) => {
    try {
      const customer_contact = req.params.customer_contact;
      // const payload = {
      //   customer_contact: customer_contact,
      // };
    
      let eachData = await db[MODEL].findAll({ where: { customer_contact } });
      if (eachData.length===0) throw "Invalid Data";
      res.status(200).json(eachData);
    } catch (e) {
      res.status(400).json(e);
    }
  };