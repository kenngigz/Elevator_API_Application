jest.mock("../models", () => {
  return {
    Elevator: {
      findOne: jest.fn(() =>
        Promise.resolve({ id: 1, currentFloor: 3, isMoving: false })
      ),
      update: jest.fn(() => Promise.resolve()),
    },
    Executed: {
      create: jest.fn(() => Promise.resolve()),
    },
    Log: {
      create: jest.fn(() => Promise.resolve()),
    },
  };
});

const { elevatorController } = require("../controllers/elevatorController");
const { Log, Elevator, ExecutedQuery } = require("../models");

describe("elevatorController", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        toFloor: 1, // Replace with the desired floor value
      },
      ip: "127.0.0.1",
    };
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should handle the case when no available elevators are found", async () => {
    // Mock Elevator.findOne to return null (no available elevators)
    Elevator.findOne = jest.fn(() => Promise.resolve(null));

    await elevatorController.callElevator(req, res);

    expect(Elevator.findOne).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "No available elevators",
    });
  });

  it("should handle errors gracefully", async () => {
    // Mock Elevator.findOne to throw an error
    Elevator.findOne = jest.fn(() => Promise.reject(new Error("Test error")));

    await elevatorController.callElevator(req, res);

    expect(Elevator.findOne).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "An error occurred" });
  });
});
