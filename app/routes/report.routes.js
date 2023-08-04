const adminauth = require ("../middleware/adminauth.js")

module.exports = (app) => {
    const controller = require("../controller/report.controller.js");
  
    var router = require("express").Router();
  
    router.get("/itemSales", adminauth, controller.getItemSales);  //get item sales
    router.get("/salesPerformance", adminauth, controller.getSalesPerformance);  //get sales performance  
    app.use("/api/report", router);
  };
  