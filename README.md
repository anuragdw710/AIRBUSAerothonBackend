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
  - /api/airplane
- [x] Add airport
  - /api/airport
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
- [x] Start flight-
  - unreserve cord which are reserver by this flight in 5 sec and update cord of flight
- [x] stop flight
- [ ] check near by airport

- [] Randomly update cord weather
- [] Randomly update plane health
