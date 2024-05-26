![GitHub contributors](https://img.shields.io/github/contributors/anuragdw710/AIRBUSAerothonBackend)
![GitHub issues](https://img.shields.io/github/issues/anuragdw710/AIRBUSAerothonBackend)
![GitHub pull requests](https://img.shields.io/github/issues-pr/anuragdw710/AIRBUSAerothonBackend)
![GitHub last commit](https://img.shields.io/github/last-commit/anuragdw710/AIRBUSAerothonBackend)
![GitHub forks](https://img.shields.io/github/forks/anuragdw710/AIRBUSAerothonBackend)



## Project Links
- [Frontend URL](https://github.com/altyon-get/flight-dashboard)
- [Backend URL](https://github.com/anuragdw710/AIRBUSAerothonBackend)
- [Live ULR](https://aeronavigator.vercel.app/)
- [Demo URL](https://drive.google.com/drive/folders/1br_PotmnpvmjXB-ZQgdEObXPrJHmRIoU?usp=sharing)


## Objective: 
- Ensure safe and efficient flight navigation by addressing critical challenges.

## Solution
- **Optimal Path Finding**: Utilized the Dijkstra algorithm for efficient route planning.
- **Weather Alert**: Developed a mechanism to find optimal paths in case of adverse weather conditions along the route.
- **Emergency Landing**: Implemented functionality to locate the nearest airport if no viable path exists or in case of system failure.
- **Collision Avoidance**: Ensured that no flights cross each other by using reserved coordinates.
- **Real-time Data Update**: Integrated socket.io for real-time data updates.
- **Multiple Systems Management**: Enabled pilots to manage multiple airplanes across different systems with real-time updates via socket.io.
- **Random Weather Update (Hack)**: Incorporated a feature to simulate random weather updates.
- **Weather Point Update (Hack)**: Added the ability to update weather conditions at specific coordinates.


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


## How to Run the Application Locally

To run this application locally, follow these steps:

```bash
# Clone the repository
git clone https://github.com/anuragdw710/AIRBUSAerothonBackend

# Navigate to the project directory
cd AIRBUSAerothonBackend

# Install dependencies
npm install

# Run the application
npm start

