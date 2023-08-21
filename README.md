# Node.js CRUD API overview

Methods => Urls =>Actions

1. POST => /elevator => Call the elevator from any floor to any other floor
2. GET => /log => get log information about events

Finally, we’re gonna test the Rest Apis using Postman.

## Preparations

1. Install Postman: https://www.postman.com/downloads/
2. install MySQL:https://dev.mysql.com/downloads/
3. Create a database e.g elevatorapi- You could use MySQL Workbench or run "CREATE DATABASE mydb" in the command line client.
4. note down the database name and other credentials such as username and password

## Clone The App, install dependencies and create tables

1. Clone the Repository:https://github.com/kenngigz/Elevator_API_Application.git
2. cd Elevator_API_Application
3. npm install
4. cd client
5. npm install

=> Go to the config folder
=> Go to sequilize.js file
=> Add your database details, including the database name you created.

6. cd ..
7. npm start

Once complete, three new tables should be created in the database: elevators, eventlogs and executeds.

=> elevators === contains elevator details such as the current floor, direction, state, and door status
=> eventlogs === contains log information about the event: "Elevator called from floor 0 to floor 5"
=> executeds === contains every SQL query which gets executed into the database

INSERT INTO the elevators tables 5 Elevators, each with a unique id. You can do this from the MySQL Workbench or
run command on MySQL command client.

initialize default values i.e currentFloor:0, direction:stopped, isMoving:0, doorsOpen:0 , createdAt:2023/09/19 and updateddAt:2023/09/19

8. Open a new terminal
9. cd client
10. npm start

A list of the 5 Elevators you created earlier should reflect on the webpage with the following intial details:

=> Current Floor:
=> Direction:
=> State:
=> Door Status:

## Testing the app

1. Open Postman and your browser side by side
2. open a new POST request with a "/elevator" endpoint-- http://localhost:3500/elevator
3. add payload with the name "toFloor" and the value of the floor you want to get to. And "fromFloor" which is your location e.g {"fromFloor":"1","toFloor":"4"}
4. click send

You should see real-time update of the following details depending on the elevator taken:

=> Current Floor:
=> Direction:
=> State:
=> Door Status:

ASSUMPTIONS:
=> Elevator moves 1 floor every 5 seconds
=> Doors open/close within 5 seconds after the elevator arrives at its destination

## Getting the logs

1. open a new GET request with a "/log" endpoint -- http://localhost:3500/log
2. You will get records of every single action by each elevator.

## Unit Tests

1. go into the home folder in the terminal : ../Elevator_API_Application
2. to run UNIT tests using JEST run: npm test
