const Validators = require("../middleware/requestValidate.js");
const auth = require ("../middleware/userauth.js")

module.exports = (app) => {
  const controller = require("../controller/customer.controller.js");

  var router = require("express").Router();

  router.post("/", Validators.new_customer,auth, controller.create); //create customer
  router.get("/:id",auth, controller.findOne); //get customer by id
  router.get("/",auth, controller.findAll); //get all customer
  router.get("/contact/:customer_contact",auth, controller.findbyContact); //get account by customer contact

  app.use("/api/customer", router);
};
