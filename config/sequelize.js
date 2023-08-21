module.exports = {
  HOST: "localhost",
  USER: "root", // add user here
  PASSWORD: "root", // add password here
  DB: "elevatorapidb", // add database name here
  dialect: "mysql",
  dialectOptions: {
    charset: "utf8mb4", // Specify the correct encoding here
  },

  pool: {
    max: 1,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
