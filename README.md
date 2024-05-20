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
- [ ] Flight create
  - check for available route from one cord to dest cord- if present return array
- [ ] Start fight-

  - unreserve cord which are reserver by this flight in 2 sec and update cord of flight

- [ ] check near by airport


- [] Randomly update cord weather
- [] Randomly update plane health

