module.exports = (sequelize, Sequelize) => {
  const Model = sequelize.define(
    "invoice_detail",
    {
      invoice_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        references: {
          model: "invoices",
          key: "invoice_id",
        },
      },
      item_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "items",
          key: "item_id",
        },
      },
      purchase_qty: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      purchase_price: {
        type: Sequelize.DECIMAL(9, 2),
        allowNull: true,
      },
    },
    {}
  );


Model.beforeSave((invoiceDetail, options) => {
    const quantity = invoiceDetail.purchase_qty;
    const Item = sequelize.models.item; // Assuming "item" is the name of the Item model
    return Item.findByPk(invoiceDetail.item_id).then((item) => {
      if (item) {
        invoiceDetail.purchase_price = quantity * item.item_price;
      }
    });
  });

  return Model;
};
