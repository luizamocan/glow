const { syncDatabase, sequelize } = require("../src/models");

syncDatabase()
  .then(() => {
    console.log("Database schema synchronized from Sequelize models.");
  })
  .catch((error) => {
    console.error("Database migration failed:", error);
    process.exitCode = 1;
  })
  .finally(() => sequelize.close());
