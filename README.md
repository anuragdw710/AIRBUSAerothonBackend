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

- Add airplane [x]
- Add airport [x]
- Add cord [x]
- Add airplane [x]

- Get cord [x]
- Get flight info [x]

- Flight create-check for avaibale route from one cord to dest cord- if present return array
- Start flght- unreserve corinate which are reserver by this flight in 2 sec and update cordinate of flight

- check near by airport

- Randomly update cord weather
- Randomly update plane health
