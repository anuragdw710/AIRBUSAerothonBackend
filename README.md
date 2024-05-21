# Airport

#### DATABASE:

- airPortName
- x
- y

#### Service

- [x] Add airport

  - URL endpoint: /api/airport
  - verb: post
  - payload:

  ```
  {
    "airPortName":"",
    "x":"",
    "y":""
  }
  ```

  ![alt text](/img/image.png)

- [x] Get all airport

  - URL endpoint: /api/airPort
  - payload:

  ```

  ```

  ![alt text](/img/image2.png)

# Airplane

#### DATABASE

- airPlaneName
- health
- x
- y

#### Service

- [x] Add airplane
  - URL endpoint: /api/airplane
    -Verb:post
    -payload:
  ```
  {
    "airPlaneName":"",
    "x":"",
    "y":""
  }
  ```
  ![alt text](/img/image3.png)
- [x] getAllAirPlane

  - URL endpoint: /api/airplane
    -Verb:get
    -payload:

  ```
  {

  }
  ```

  ![alt text](/img/image4.png)

- [x] Find Nearest Airport(Not complete)

  - URL endpoint: /api/findNearestAirport
  - Verb: Get
  - Payload:

  ```
  {

  }
  ```

# Flight

#### DATABASE

- departureAirport
- destinationAirport
- airPlaneName
- reserveCord: array of [x,y]
- departureTime
- destinationTime

#### Services

- [x] createflight

  - URL endpoint: /api/flight
  - Verb: post
  - Payload:

  ```
  {
    "departureAirport":"",
    "destinationAirport":"",
    "airPlaneName":"",
    "departureTime":"",
    "destinationTime":""
  }

  ```

  ![alt text](/img/image6.png)

- [x] getAllFlights

  - URL endpoint: /api/flight
  - Verb: get
  - Payload:

  ```
  {

  }
  ```

  ![alt text](/img/image7.png)

- [x] startFlight

  - URL endpoint: /api/startFlight
  - Verb: post
  - Payload:

  ```
  {
    "flightId":""
  }

  ```

- [x] stopFlight

  - URL endpoint: /api/stopFlight
  - Verb: post
  - Payload:

  ```
  {
    "flightId":""
  }

  ```

# Cord

#### DATABASE

- x
- y
- weather
- reserve

#### Services

- [x] createCord

  - URL endpoint: /api/cord
  - Verb: post
  - Payload:

  ```
  {
    "x":"",
    "y":"",
    "weather":"",
    "reserve":""
  }

  ```

- [x] getAllCords

  - URL endpoint: /api/cord
  - Verb: get
  - Payload:

  ```
  {
  }

  ```

# V2

- [] Randomly update cord weather
- [] Randomly update plane health
