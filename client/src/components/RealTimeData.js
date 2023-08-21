import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:3500";

const ClientComponent = () => {
  const [data, setData] = useState([]);
  const divStyle = {
    paddingRight: "20px",
    paddingLeft: "20px",
  };
  const color = {
    color: "blue",
  };

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);

    // Listen for the "initial" event once
    socket.once("initial", (initialData) => {
      setData(initialData.elevators);
    });

    // Listen for the "update" event
    socket.on("update", (update) => {
      setData((prevData) => {
        // Create a copy of the previous data
        const updatedData = [...prevData];

        if (update.type === "INSERT") {
          // Handle INSERT: Add the new objects to the array
          updatedData.push(...update.elevators);
        } else if (update.type === "UPDATE") {
          // Handle UPDATE: Update existing objects based on their IDs
          update.elevators.forEach((updatedElevator) => {
            const index = updatedData.findIndex(
              (elevator) => elevator.id === updatedElevator.id
            );
            if (index !== -1) {
              // Replace the existing object with the updated one
              updatedData[index] = updatedElevator;
            }
          });
        } else if (update.type === "DELETE") {
          // Handle DELETE: Remove objects based on their IDs
          update.elevators.forEach((deletedElevator) => {
            const index = updatedData.findIndex(
              (elevator) => elevator.id === deletedElevator.id
            );
            if (index !== -1) {
              // Remove the object from the array
              updatedData.splice(index, 1);
            }
          });
        }

        return updatedData;
      });
    });

    // CLEAN UP THE EFFECT
    return () => {
      socket.disconnect(); // Disconnect the socket when the component unmounts
    };
  }, []); // Empty dependency array to run this effect only once

  console.log("data,", data);

  return (
    <div>
      <h2>Real-Time Data</h2>
      <ul>
        {data.map((item) => (
          <li key={item.id}>
            <h2>
              <span style={divStyle}>Elevator No.{item.id}:</span>
              <span style={color}>Current Floor:</span>
              {item.currentFloor}
              <span style={divStyle}>
                <span style={color}>Direction:</span>
                {item.direction}
              </span>
              <span>
                <span style={color}>State:</span>
                {item.isMoving === false ? "STATIONARY" : "MOVING"}
              </span>
              <span style={divStyle}>
                <span style={color}>Door Status:</span>
                {item.doorsOpen === false ? "DOOR CLOSED" : "DOOR OPEN"}
              </span>
            </h2>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClientComponent;
