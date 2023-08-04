module.exports = (sequelize, Sequelize) => {
    const Model = sequelize.define("customer", {
      customer_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      customer_name: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      customer_contact:{
        type: Sequelize.STRING(11),
        allowNull: false,
      },
      customer_email: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      customer_sales: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: true,
      }
    });

    const createCustomerTrigger = async () => {
      try {
          const triggerCreateQuery = `
            CREATE TRIGGER IF NOT EXISTS update_customer_sales
            AFTER UPDATE ON invoices
            FOR EACH ROW
            BEGIN
              UPDATE customers
              SET customer_sales = (
                SELECT SUM(invoice_total) 
                FROM invoices 
                WHERE invoices.customer_id = customers.customer_id
                GROUP BY customers.customer_id
              );
            END;
          `;
          await sequelize.query(triggerCreateQuery);
      } catch (error) {
        console.error('Error creating trigger:', error);
      }
    };
  
    createCustomerTrigger(); // Call the trigger creation function

  
    return Model;
  };
  