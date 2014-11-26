FORMAT: 1A
HOST: http://intranet.arena.utt.fr

# UTT Arena Intranet API
Cette API est faite pour communiquer facilement depuis l'application qui sera disponible lors de UTT Arena 
et la base de données.

## Group User

## Authentication [/auth]

### Authenticate [POST]
+ Response 200

        {
            "id" : 50,
            "isAdmin": true,
            "token": ""
        }


+ Response 401

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

+ Response 400 (application/json)
Returned if the tournament creation fails due to validation

    + Body
    
                {
                    "errors": {
                        "date": [
                            "is not a valid datetime"
                        ],
                        "title": [
                            "is already taken"
                        ]
                    }
                }

+ Response 403 (application/json)

        {
          "error" : "Unauthorizd action"
        }
        
## Tournament [/tournaments/{id}]
A single Tournament object with all its details

+ Parameters
    + id (required, string, `1`) ... Id of the tournament


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
Returned if the user is not authorized to delete the Tournament

    + Body
    
            {
              "error" : "Unauthorizd action"
            }
    
+ Response 404 (application/json)
Returned if the Tournament not found

    + Body
    
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
Returned if the user is not authoried to create an Event

    + Body

            {
               "error" : "Unauthorizd action"
            }
        
## Event [/events/{id}]
A single Event object with all its details

+ Parameters
    + id (required, string, `1`) ... Id of the event


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
Returned if is not authorized to update the Event

    + Body
    
            {
              "error" : "Unauthorizd action"
            }
        
+ Response 404 (application/json)
    Returned if the Event is not found

    + Body
    
            {
              "error" : "Event not found"
            }
        
### Remove a Event [DELETE]
Remove a single Event
+ Response 204

+ Response 403 (application/json)
    Returned if the user is not authorized to delete the Event

    + Body
    
            {
              "error" : "Unauthorizd action"
            }
    
+ Response 404 (application/json)
    Returned if the Event is not found

    + Body
    
            {
              "error" : "Event not found"
            }
            
## Group Challenge

## Challenge collection [/challenges]
A collection of Challenge

### List all Challenge [GET]
Retrive all challenges with all data
+ Response 200 (application/json)

        [{
          "id": "42", 
          "title": "H2G2", 
          "description": "Ultimate Question of Life, the Universe, and Everything",
          "tokens" : [
                       {
                         "value" : "plop", 
                         "challenge": "42", 
                         "position": 1, 
                         "price": 5
                       },
                       {
                         "value" : "plor", 
                         "challenge": "42", 
                         "position": 1, 
                         "price": 5
                       },
                       {
                         "value" : "plot", 
                         "challenge": "42", 
                         "position": 1, 
                         "price": 5
                       },
                     ]
        },{
          "id": "43", 
          "title": "H2G2", 
          "description": "Ultimate Question of Life, the Universe, and Everything",
          "tokens" : [
                       {
                         "value" : "plop", 
                         "challenge": "43", 
                         "position": 1, 
                         "price": 5
                       },
                       {
                         "value" : "plor", 
                         "challenge": "43", 
                         "position": 1, 
                         "price": 5
                       },
                       {
                         "value" : "plot", 
                         "challenge": "43", 
                         "position": 1, 
                         "price": 5
                       },
                     ]
        }]

### Create a Challenge [POST]
Create a new Challenge
+ Request (application/json)

        {
          "title": "H2G2", 
          "description": "Ultimate Question of Life, the Universe, and Everything",
          "tokens" : [
                       {
                         "value" : "plop", 
                         "challenge": "42", 
                         "position": 1, 
                         "price": 5
                       },
                       {
                         "value" : "plor", 
                         "challenge": "42", 
                         "position": 1, 
                         "price": 5
                       },
                       {
                         "value" : "plot", 
                         "challenge": "42", 
                         "position": 1, 
                         "price": 5
                       },
                     ]
        }

+ Response 201 (application/json)

        {
          "id": "42", 
          "title": "H2G2", 
          "description": "Ultimate Question of Life, the Universe, and Everything",
          "tokens" : [
                       {
                         "value" : "plop", 
                         "challenge": "42", 
                         "position": 1, 
                         "price": 5
                       },
                       {
                         "value" : "plor", 
                         "challenge": "42", 
                         "position": 1, 
                         "price": 5
                       },
                       {
                         "value" : "plot", 
                         "challenge": "42", 
                         "position": 1, 
                         "price": 5
                       },
                     ]
        }

+ Response 403 (application/json)
Returned if the user is not authoried to create an Challenge

    + Body

            {
               "error" : "Unauthorizd action"
            }
        
## Challenge [/challenges/{id}]
A single Challenge object with all its details

+ Parameters
    + id (required, string, `1`) ... Id of the challenge


### Retrieve a Challenge [GET]
Retrive a single Challenge
+ Response 200 (application/json)

        {
          "id": "42", 
          "title": "H2G2", 
          "description": "Ultimate Question of Life, the Universe, and Everything",
          "tokens" : [
                       {
                         "value" : "plop", 
                         "challenge": "42", 
                         "position": 1, 
                         "price": 5
                       },
                       {
                         "value" : "plor", 
                         "challenge": "42", 
                         "position": 1, 
                         "price": 5
                       },
                       {
                         "value" : "plot", 
                         "challenge": "42", 
                         "position": 1, 
                         "price": 5
                       },
                     ]
        }
        

### Update a Challenge [PUT]
Update a single Challenge setting its challenge tokens
+ Request (application/json)

        {
          "id": "42", 
          "title": "H2G2", 
          "description": "Ultimate Question of Life, the Universe, and Everything",
          "tokens" : [
                       {
                         "value" : "plop", 
                         "challenge": "42", 
                         "position": 1, 
                         "price": 5
                       },
                       {
                         "value" : "plor", 
                         "challenge": "42", 
                         "position": 1, 
                         "price": 5
                       },
                       {
                         "value" : "plot", 
                         "challenge": "42", 
                         "position": 1, 
                         "price": 5
                       }
                     ]
        }
        
+ Response 204

+ Response 403 (application/json)
Returned if is not authorized to update the Challenge

    + Body
    
            {
              "error" : "Unauthorizd action"
            }
        
+ Response 404 (application/json)
    Returned if the Challenge is not found

    + Body
    
            {
              "error" : "Challenge not found"
            }
        
### Remove a Challenge [DELETE]
Remove a single Challenge
+ Response 204

+ Response 403 (application/json)
    Returned if the user is not authorized to delete the Challenge

    + Body
    
            {
              "error" : "Unauthorizd action"
            }
    
+ Response 404 (application/json)
    Returned if the Challenge is not found

    + Body
    
            {
              "error" : "Challenge not found"
            }


## Group Challenge Token

## Challenge Token collection [/challenges/{id}/token]
A collection of Challenge Token

### List all Challenge Token [GET]
Retrive all challenges tokens with all data for the given challenge
+ Response 200 (application/json)

        [
         {
           "value" : "plop", 
           "challenge": "42", 
           "position": 1, 
           "price": 5
         },
         {
           "value" : "plor", 
           "challenge": "42", 
           "position": 1, 
           "price": 5
         },
         {
           "value" : "plot", 
           "challenge": "42", 
           "position": 1, 
           "price": 5
         }
        ]

### Create a Challenge Token [POST]
Create a new Challenge Token
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
Returned if the user is not authoried to create an Challenge Token

    + Body

            {
               "error" : "Unauthorizd action"
            }
        
## Challenge Token [/challenges/{id}/tokens/{value}]
A single Challenge Token object with all its details

+ Parameters
    + id (required, string, `1`) ... Id of the challenge


### Retrieve a Challenge Token [GET]
Retrive a single Challenge Token
+ Response 200 (application/json)

        {
          "id": "42", 
          "title": "H2G2", 
          "date": Tue, 11 Nov 2014 19:35:14 GMT, 
          "description": "Ultimate Question of Life, the Universe, and Everything"
        }
        
### Update a Challenge Token [PUT]
Update a single Challenge Token
+ Request (application/json)

        {
          "id": "42", 
          "title": "H2G2", 
          "date": Tue, 11 Nov 2014 19:35:14 GMT, 
          "description": "Ultimate Question of Life, the Universe, and Everything"
        }
        
+ Response 204

+ Response 403 (application/json)
Returned if is not authorized to update the Challenge Token

    + Body
    
            {
              "error" : "Unauthorizd action"
            }
        
+ Response 404 (application/json)
    Returned if the Challenge Token is not found

    + Body
    
            {
              "error" : "Challenge Token not found"
            }
        
### Remove a Challenge Token [DELETE]
Remove a single Challenge Token
+ Response 204

+ Response 403 (application/json)
    Returned if the user is not authorized to delete the Challenge Token

    + Body
    
            {
              "error" : "Unauthorizd action"
            }
    
+ Response 404 (application/json)
    Returned if the Challenge Token is not found

    + Body
    
            {
              "error" : "Challenge Token not found"
            }


