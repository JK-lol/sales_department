module.exports = (sequelize, Sequelize) => {
  const Invoice = sequelize.define("invoice", {
    invoice_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    invoice_total: {
      type: Sequelize.DECIMAL(9, 2),
      allowNull: true,
    },
    account_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "accounts",
        key: "account_id",
      },
    },
    customer_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "customers",
        key: "customer_id",
      },
    },
  });

  const createInvoiceDetailTrigger = async () => {
    try {
        const triggerCreateQuery = `
          CREATE TRIGGER IF NOT EXISTS update_invoice_price
          AFTER INSERT ON invoice_details
          FOR EACH ROW
          BEGIN
            UPDATE invoices
            SET invoice_total = (
              SELECT SUM(purchase_price) 
              FROM invoice_details 
              WHERE invoices.invoice_id = invoice_details.invoice_id
              GROUP BY invoices.invoice_id
            );
          END;
        `;
        await sequelize.query(triggerCreateQuery);
    } catch (error) {
      console.error('Error creating trigger:', error);
    }
  };

  createInvoiceDetailTrigger(); // Call the trigger creation function

  return Invoice;
};
