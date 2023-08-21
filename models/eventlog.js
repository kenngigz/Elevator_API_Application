const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const EventLog = sequelize.define("EventLog", {
    event: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  return EventLog;
};
