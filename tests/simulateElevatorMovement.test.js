const {
  simulateElevatorMovement,
} = require("../controllers/elevatorController");
const { Elevator, Log } = require("../models");

describe("simulateElevatorMovement", () => {
  it("should simulate elevator movement", async () => {
    jest.setTimeout(100000);
    const elevator = {
      id: 1,
      currentFloor: 3,
      isMoving: true,
      direction: "up",
      update: jest.fn(() => Promise.resolve()),
    };

    const fromFloor = 3;
    const toFloor = 4;

    const setTimeoutPromise = () =>
      new Promise((resolve) => setTimeout(resolve, 0));

    // Mock Elevator.update to return a resolved promise
    Elevator.update = jest.fn(() => Promise.resolve());

    // Mock Log.create to return a resolved promise
    Log.create = jest.fn(() => Promise.resolve());

    await simulateElevatorMovement(elevator, fromFloor, toFloor);

    // Ensure Elevator.update and Log.create are called appropriately
    expect(Elevator.update).toHaveBeenCalledTimes(4); // 4 updates: 2 for moving, 2 for doors
    expect(Log.create).toHaveBeenCalledTimes(2); // 2 log events: doors open/close

    // Ensure Elevator.update is called with the correct parameters for the final update
    expect(Elevator.update).toHaveBeenNthCalledWith(4, {
      currentFloor: toFloor,
      isMoving: false,
      direction: "stopped",
    });

    // Ensure setTimeout was called at least once
    expect(setTimeoutPromise).toHaveBeenCalled();
  });
});
