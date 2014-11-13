FORMAT: 1A
HOST: http://blog.acme.com

# UTT Arena Intranet API
Cette API est faite pour communiquer facilement depuis l'application qui sera disponible lors de UTT Arena 
et la base de données.


## Group Tournament

## Tournament collection [/tournaments]
A collection of Tournament
### List all Tournament [GET]
Retrive all tournaments with all data
+ Response 200 (application/json)

        [{
          "id": "42", 
          "title": "H2G2", 
          "owner": "UNG", 
          "description": "Ultimate Question of Life, the Universe, and Everything",
          "capacity" : "16",
          "teamSize" : "1"
        }, {
          "id": "43", 
          "title": "Jogging in park", 
          "owner": "Me", 
          "description": "Bravely Default",
          "capacity" : "8",
          "teamSize" : "3"
        }]

### Create a Tournament [POST]
Create a new Tournament
+ Request (application/json)

        {
          "title": "H2G2", 
          "owner": "UNG", 
          "description": "Ultimate Question of Life, the Universe, and Everything",
          "capacity" : "16",
          "teamSize" : "1"
        }

+ Response 201 (application/json)

        {
          "id": "42", 
          "title": "H2G2", 
          "owner": "UNG", 
          "description": "Ultimate Question of Life, the Universe, and Everything",
          "capacity" : "16",
          "teamSize" : "1"
        }

+ Response 403 (application/json)

        {
          "error" : "Unauthorizd action"
        }
        
## Tournament [/tournaments/{id}]
A single Tournament object with all its details

+ Parameters
    + id (required, number, `1`) ... Id of the tournament


### Retrieve a Tournament [GET]
Retrive a single Tournament
+ Response 200 (application/json)

        {
          "id": "42", 
          "title": "H2G2", 
          "owner": "UNG", 
          "description": "Ultimate Question of Life, the Universe, and Everything",
          "capacity" : "16",
          "teamSize" : "1"
        }
        
### Update a Tournament [PUT]
Update a single Tournament
+ Request (application/json)

        {
          "id": "42", 
          "title": "H2G2", 
          "owner": "UNG", 
          "description": "Ultimate Question of Life, the Universe, and Everything",
          "capacity" : "16",
          "teamSize" : "1"
        }
        
+ Response 204

+ Response 403 (application/json)

        {
          "error" : "Unauthorizd action"
        }
        
+ Response 404 (application/json)

        {
          "error" : "Tournament not found"
        }
        
### Remove a Tournament [DELETE]
Remove a single Tournament
+ Response 204

+ Response 403 (application/json)

        {
          "error" : "Unauthorizd action"
        }
    
+ Response 404 (application/json)

        {
          "error" : "Tournament not found"
        }
        
## Group Event

## Event collection [/events]
A collection of Event
### List all Event [GET]
Retrive all events with all data
+ Response 200 (application/json)

        [{
          "id": "42", 
          "title": "H2G2", 
          "date": Tue, 11 Nov 2014 19:35:14 GMT, 
          "description": "Ultimate Question of Life, the Universe, and Everything"
        }, {
          "id": "42", 
          "title": "UA", 
          "date": Tue, 11 Nov 2014 19:35:14 GMT, 
          "description": "Amusez-vous !"
        }]

### Create a Event [POST]
Create a new Event
+ Request (application/json)

        {
          "title": "H2G2", 
          "date": Tue, 11 Nov 2014 19:35:14 GMT, 
          "description": "Ultimate Question of Life, the Universe, and Everything"
        }

+ Response 201 (application/json)

        {
          "id": "42", 
          "title": "H2G2", 
          "date": Tue, 11 Nov 2014 19:35:14 GMT, 
          "description": "Ultimate Question of Life, the Universe, and Everything"
        }

+ Response 403 (application/json)

        {
          "error" : "Unauthorizd action"
        }
        
## Event [/events/{id}]
A single Event object with all its details

+ Parameters
    + id (required, number, `1`) ... Id of the event


### Retrieve a Event [GET]
Retrive a single Event
+ Response 200 (application/json)

        {
          "id": "42", 
          "title": "H2G2", 
          "date": Tue, 11 Nov 2014 19:35:14 GMT, 
          "description": "Ultimate Question of Life, the Universe, and Everything"
        }
        
### Update a Event [PUT]
Update a single Event
+ Request (application/json)

        {
          "id": "42", 
          "title": "H2G2", 
          "date": Tue, 11 Nov 2014 19:35:14 GMT, 
          "description": "Ultimate Question of Life, the Universe, and Everything"
        }
        
+ Response 204

+ Response 403 (application/json)

        {
          "error" : "Unauthorizd action"
        }
        
+ Response 404 (application/json)

        {
          "error" : "Event not found"
        }
        
### Remove a Event [DELETE]
Remove a single Event
+ Response 204

+ Response 403 (application/json)

        {
          "error" : "Unauthorizd action"
        }
    
+ Response 404 (application/json)

        {
          "error" : "Event not found"
        }

