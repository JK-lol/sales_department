const auth = require ("../middleware/userauth.js")


module.exports = (app) => {
    const controller = require("../controller/invoice.controller.js");
    
    var router = require("express").Router();
    
    router.get      ("/:id",auth,controller.findOne); //get invoice by id
    router.get      ("/",controller.trace);    
    app.use("/api/invoice", router);
};
    