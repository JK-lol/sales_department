module.exports = (app) => {
    require("./account.routes")(app);
    require("./item.routes")(app);
    require("./customer.routes")(app);
    require("./invoice_detail.routes")(app);
    require("./invoice.routes")(app);
    require("./report.routes")(app);

};