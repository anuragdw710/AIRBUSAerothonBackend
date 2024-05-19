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

- randomly update cord weather
- check for avaibale route from one cord to dest cord
- reserve cord
- check near by airport
- unreverse cord as airplane passby
