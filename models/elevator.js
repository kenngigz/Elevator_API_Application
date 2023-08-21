// const { DataTypes, Model } = require("sequelize");
// const sequelize = require("../config/sequelize"); // Adjust the path as needed

// class Elevator extends Model {}

// Elevator.init(
//   {
//     currentFloor: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//     },
//     direction: {
//       type: DataTypes.ENUM("up", "down", "stopped"),
//       allowNull: false,
//     },
//     isMoving: {
//       type: DataTypes.BOOLEAN,
//       allowNull: false,
//       defaultValue: false,
//     },
//     doorsOpen: {
//       type: DataTypes.BOOLEAN,
//       allowNull: false,
//       defaultValue: false,
//     },
//     // Add other relevant fields
//   },
//   {
//     sequelize, // Pass your Sequelize instance here
//     modelName: "Elevator",
//     // Other model options
//     timestamps: false, // Disable automatic timestamps
//     // Other model options
//   }
// );

// module.exports = Elevator;

const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Elevator = sequelize.define("Elevator", {
    currentFloor: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    direction: {
      type: DataTypes.ENUM("up", "down", "stopped"),
      allowNull: false,
    },
    isMoving: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    doorsOpen: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false, // Doors are initially closed
    },
  });
  return Elevator;
};
