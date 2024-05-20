## DATABASE:

cord/Mess

- cord[x,y]
- weather
- reserve

airplane

- id,
- heath:
- cord[x,y]

airport

- id
- cord[x,y]

flight

- id
- departureAirportId
- destinationAirportId
- reserveCord=[]

Service:

- [x] Add airplane
      -- /api/airplane
- [x] Add airport
      -- /api/airport
- [x] Add cord
      -- /api/cord
- [x] Add airport
      -- /api/airport

- [x] Get cord
      -- /api/cord
- [x] Get flight info
      -- /api/flight

- [] Flight create-check for avaibale route from one cord to dest cord- if present return array
- [] Start flght- unreserve corinate which are reserver by this flight in 2 sec and update cordinate of flight

- [] check near by airport

- [] Randomly update cord weather
- [] Randomly update plane health
