const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Executed = sequelize.define("Executed", {
    query: {
      type: DataTypes.TEXT, // Use TEXT or STRING depending on your needs
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });
  return Executed;
};
