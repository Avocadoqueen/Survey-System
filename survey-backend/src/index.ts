import app from './apps';
import { sequelize } from './model/connection';
import { initModels } from './model';
import { associateModels } from './model/associations';

const PORT = 3000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected');

    // ✅ VERY IMPORTANT
    initModels();        // 1. initialize models
    associateModels();   // 2. setup relationships

    await sequelize.sync({ alter: true });
    console.log('Models synced');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

  } catch (error) {
    console.error('Startup error:', error);
  }
};

startServer();
