const auth = require ("../middleware/userauth.js")


module.exports = (app) => {
    const controller = require("../controller/invoice_detail.controller.js");
    
    var router = require("express").Router();
    
    router.post     ("/"   ,auth, controller.create); //create invoice_detail
    router.get      ("/:id",auth,controller.findOne); //get invoice_detail by id
    app.use("/api/invoice_detail", router);
};
    