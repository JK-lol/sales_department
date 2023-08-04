module.exports = (sequelize, Sequelize) => {
    const Model = sequelize.define("item", {
      item_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      item_name: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      item_type: {
        type: Sequelize.STRING(25),
        allowNull: false,
      },
      item_quantity: {
        type: Sequelize.INTEGER(4),
        allowNull: false,
      },
      item_price: {
        type: Sequelize.DECIMAL(9, 2),
        allowNull: false,
      },
    });

    const createInvoiceDetailTrigger = async () => {
      try {
        const triggerCreateQuery = `
          CREATE TRIGGER IF NOT EXISTS update_item
          AFTER INSERT ON invoice_details
          FOR EACH ROW
          BEGIN
            UPDATE items
            SET item_quantity = item_quantity - NEW.purchase_qty
            WHERE item_id = NEW.item_id;
          END;
        `;
  
        await sequelize.query(triggerCreateQuery);
      } catch (error) {
        console.error('Error creating trigger:', error);
      }
    };
  
    // Check if the trigger already exists before calling the trigger creation function
    const checkAndCreateTrigger = async () => {
      try {
        const triggerCheckQuery = `
          SELECT trigger_name 
          FROM information_schema.triggers 
          WHERE event_object_table = 'invoice_details'
          AND trigger_schema = 'public'
          AND trigger_name = 'update_item'
        `;
  
        const [results] = await sequelize.query(triggerCheckQuery);
        const triggerExists = results.length > 0;
  
        if (!triggerExists) {
          createInvoiceDetailTrigger();
        } else {
          console.log('Trigger already exists.');
        }
      } catch (error) {
        console.error('Error checking trigger:', error);
      }
    };
  
    checkAndCreateTrigger(); // Call the trigger checking and creation function

    return Model;

  
}
