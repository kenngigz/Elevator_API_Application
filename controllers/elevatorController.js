const Log = require("../models").Log;
const Elevator = require("../models").Elevator;
const ExecutedQuery = require("../models").Executed; // Corrected the model name
const { Op, fn, col, literal } = require("sequelize");

const elevatorController = {
  callElevator: async (req, res) => {
    try {
      const { toFloor, fromFloor } = req.body;

      // Find an available elevator (for example, the one closest to the calling floor)
      const elevator = await Elevator.findOne({
        where: {
          isMoving: false,
        },
        order: [
          //   // Order the results by the absolute difference in ascending order
          [literal(`ABS(currentFloor - ${fromFloor})`), "ASC"],
        ],
      });

      if (!elevator) {
        return res.status(400).json({ message: "No available elevators" });
      }

      // Update elevator status to indicate it's moving and its direction
      //console.log("toFloor:", toFloor);
      // console.log("fromFloor:", fromFloor);

      const direction = Number(toFloor) > Number(fromFloor) ? "up" : "down";

      // console.log("Direction:", direction);
      await elevator.update({
        isMoving: true,
        direction,
      });

      // Log the elevator update SQL query
      const updateQuery = `UPDATE "Elevators" SET "isMoving" = true, "direction" = '${direction}' WHERE "id" = ${elevator.id}`;
      await ExecutedQuery.create({
        query: updateQuery,
        createdBy: req.body ? "user" : req.ip, // Log who made the call using request IP
      });

      // Simulate elevator movement asynchronously
      simulateElevatorMovement(elevator, fromFloor, toFloor);

      // Log the elevator call event
      await Log.create({
        event: `Elevator called from floor ${fromFloor} to floor ${toFloor}`,
      });

      return res.status(200).json({ message: "Elevator called successfully" });
    } catch (error) {
      return res.status(500).json({ error: "An error occurred" });
    }
  },
  getElevatorStatus: async (req, res) => {
    try {
      // Fetch elevator status from the database
      const elevatorStatus = await Elevator.findAll();

      return res.status(200).json(elevatorStatus);
    } catch (error) {
      // console.error("Error in callElevator:", error);
      return res.status(500).json({ error: "An error occurred" });
    }
  },
  // ... (other controller functions)
};

// Simulate elevator movement asynchronously
async function simulateElevatorMovement(elevator, fromFloor, toFloor) {
  const distance = Math.abs(fromFloor - toFloor);
  const travelTime = distance * 5000; // 1 floor every 5 seconds

  let intervalId; // Variable to hold the interval ID
  // Function to open and close doors
  async function openAndCloseDoors() {
    await elevator.update({ doorsOpen: true }); // Open doors
    await Log.create({
      event: `Elevator doors opened at floor ${elevator.currentFloor}`,
    });
    await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for 5 seconds
    await elevator.update({ doorsOpen: false }); // Close doors
    await Log.create({
      event: `Elevator doors closed at floor ${elevator.currentFloor}`,
    });
  }
  async function changeValue() {
    // Update the variable's value
    fromFloor < toFloor ? fromFloor++ : fromFloor--;

    // Log the updated value
    //console.log("New value:", fromFloor + 2);
    await elevator.update({
      currentFloor: fromFloor,
    });
    // Check the condition
    if (elevator.direction === "stopped") {
      clearInterval(intervalId); // Stop the interval when the condition is met
      // console.log("Condition met. Stopping the interval.");

      // Call the function to open and close doors
      await openAndCloseDoors();
    }
  }

  // Start the interval and store the interval ID
  intervalId = setInterval(changeValue, 5000); // 5000 milliseconds = 5 seconds

  await new Promise((resolve) => {
    setTimeout(async () => {
      // Update elevator status after reaching the destination
      await elevator.update({
        currentFloor: toFloor,
        isMoving: false,
        direction: "stopped",
      });
    }, travelTime);
  });
}

module.exports = {
  elevatorController,
  simulateElevatorMovement,
};
