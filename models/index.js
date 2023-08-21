const Sequelize = require("sequelize");
const dbConfig = require("../config/sequelize");
// Create a function to connect to the database and initialize models
function connectToDatabase() {
  // Configure the database connection
  const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD,
    {
      host: dbConfig.HOST,
      port: dbConfig.PORT,
      dialect: dbConfig.dialect,
      dialectOptions: {
        charset: "utf8mb4", // Specify the correct encoding here
      },
      pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle,
      },
    }
  );

  const db = {};

  // Assign the Sequelize and sequelize instances to the db object
  db.Sequelize = Sequelize;
  db.sequelize = sequelize;

  // Create instances of the models and associate them if needed
  db.Log = require("./eventlog.js")(sequelize, Sequelize);
  db.Elevator = require("./elevator.js")(sequelize, Sequelize);
  db.Executed = require("./executedQueries")(sequelize, Sequelize);

  // Authenticate and synchronize the models with the database
  (async () => {
    try {
      await sequelize.authenticate();
      console.log("Connected to the database.");

      // Create the database if it doesn't exist
      await sequelize.query("CREATE DATABASE IF NOT EXISTS beem_project");
      console.log("Database created or already exists.");

      // { force: true } to recreate tables (use with caution)
      await sequelize.sync();
      console.log("Model synchronized successfully.");
    } catch (error) {
      console.error("Error:", error);
    }
  })();

  return db;
}

// Export the db object
module.exports = connectToDatabase();
