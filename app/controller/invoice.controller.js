const db = require("../models");

const MODEL = "invoice"

exports.trace = async (req, res) => {

  try {
      var responseData = await db.sequelize.query(`
      SELECT COUNT(*) AS total_rows
      FROM invoices;
    `);

    var result = responseData[0];

  res.status(200).json(result); // Include rowCount in the response
} catch (e) {
  console.log(e);
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
}

exports.findAll = async (req, res) => { //find all account with selected attributes
  try {
    const allData = await db[MODEL].findAll();
    if (allData.length === 0) throw "No Data Found";
    res.status(200).json(allData);
  } catch (e) {
    res.status(400).json(e);
  }
};