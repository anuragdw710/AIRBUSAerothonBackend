## Project Links
- [Frontend](https://github.com/altyon-get/flight-dashboard)
- [Backend](https://github.com/anuragdw710/AIRBUSAerothonBackend)
- [Live](https://aeronavigator.vercel.app/)


## Objective: 
- Ensure safe and efficient flight navigation by addressing critical challenges.

## Solution
- For path optimal path finding use the Dijkstra algorithm.
- Weather alert, Find optimal path in case of bad weather in route.
- Find the nearest airport in case of no path exits or system failure.
- No flight should cross each other using  reserve cords.
- Real-time data update using sockit.io.
- Pilat should be able to run multiple airplanes in different systems with real-time updates using socket.io
- Random weather update(Hack)
- Update the weather of a point(Hack)

## DATABASE
![image](https://github.com/anuragdw710/AIRBUSAerothonBackend/assets/78266752/f414e0fd-edae-4141-8877-e49c5263f852)


### Airport

- airPortName
- x
- y

### Airplane

- airPlaneName
- health
- x
- y

### Flight

- departureAirport
- destinationAirport
- airPlaneName
- reserveCord: array of [x,y]
- departureTime
- destinationTime


### Cord

- x
- y
- weather
- reserve

## Socket

![image](https://github.com/anuragdw710/AIRBUSAerothonBackend/assets/78266752/3cb01bb5-770c-40a9-b3f3-108684b00e54)

### Airplane Socket Handler:
- Emits a list of non-reserved airplanes and a confirmation message to the client.

### Airport Socket Handler:
- Emits a list of all airports and a confirmation message to the client.

### Coordinates Socket Handler:
- Emits initial data including coordinates, flights, airports, and non-reserved airplanes. Listens for weather change events to update and emit new coordinates and flight data.

### Flight Socket Handler:
- Emits all flights to the client and listens for flight details requests, flight creation, and flight start events. Manages flight paths, including handling weather conditions and rerouting if necessary.


 To run this application locally, follow these steps:
``
# Clone the repository
git clone https://github.com/anuragdw710/AIRBUSAerothonBackend

# Navigate to the project directory
cd AIRBUSAerothonBackend

# Install dependencies
npm install

# Run the application
npm start
```

