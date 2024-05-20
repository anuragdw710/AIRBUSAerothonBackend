## DATABASE:

cord/Mess

- id
- cord[x,y]
- weather(good,bad)
- reserve(True,False)

airplane

- id,
- heath(good,bad)
- cord[x,y]

airport

- id
- cord[x,y]

flight

- id
- departureAirport(Cord)
- destinationAirport(Cord)
- reserveCord=[]
- departureTime
- destinationTime

## Service:

- [x] Add airplane
  - URL Endpoint : /api/airplane
  - verb: post
  - payload:
  ```
  {
    "position":"65e72adb1a811501c45afd72"
  }
  ```
- [x] Add airport
  - URL endpoint: /api/airport
  - verb: post
  - payload:
  ```
  {
    "airportCord":"65e72adb1a811501c45afd72"
  }
  ```
- [x] Add cord
  - /api/cord
- [x] Add airport
  - /api/airport
- [x] Get cord
  - /api/cord
- [x] Get flight info
  - /api/flight
- [x] Flight create
  - check for available route from one cord to dest cord- if present return array
  - Method: post
  - /api/flight
- [x] Start flight-
  - unreserve cord which are reserver by this flight in 5 sec and update cord of flight
  - /api/startFlight
- [x] stop flight
  - /api/stopFlight
- [x] check near by airport
  - /api/findNearestAirport
- [] Randomly update cord weather
- [] Randomly update plane health
