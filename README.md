<p align="center">
  <a href="http://nestjs.com/" target="blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
  </a>
</p>

<h1 align="center">Restaurant Managment API</h1>

<p align="center">
  A production grade Rest API built with NestJS, MongoDB, and TypeScript. Featuring reataurant CRUD, geospatil search, and AI-powered recommendations via a MongoDB aggregation pipeline.
</p>

----

## Features

- **Restaurant Managment:**  Create, list (cuisine filter), fetch by ID or slug, and find nearby restaurants within a configurale radius using MongoDb GeoSpatial queries.
- **User Managment:** Create users with favoutite cuisines and follow restaurants.
- **Smart Recommendations:** MongoDB aggregation pipeline recommending restaurants based on shared cuisine prefrences between users.
- **Full Swagger Docs:** All endpoints documented and testable at '/api'
- **Input Validation:** Every endpoint validated with 'class-validator' and NestJS 'ValidationPipe'

----

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | NestJs + Express|
| Language | TypeScript |
| Database | MongoDB |
| ODM | MongoDB |
| Validation | class-validator + class-transformer |
| Documentation | Swagger / OpenAPI ('@nestjs/swagger') |
| Config | '@nestjs/config' + dotenv |

----

## Getting Started

### Prerequisites

- Node.js >= 18
- MongoDB (local)

### Installation

'''bash
npm install
'''

### ENvironment Setup

Create a '.env' file in the project root

'''dotenv
MONGODB_URI=mongodb://localhost:27017/restaurant-db
PORT=3000
'''

### Running the App

'''bash
# development
npm run start

# watch mode (recommended for development)
npm run start:dev

# production
npm run start:prod
'''

### API Documentation

Once running, open your browser at:

'''
http://localhost:3000/api"
'''

----

## API Endpoints

### Restaurants

| Method | Endpoint| Description |
|---|---|---|
| 'POST' | '/restaurants' | Create a new restaurant |
| 'GET' | '/restaurants' | List all restaurants |
| 'GET' | '/restaurants/nearby' | Find restaurants within radius |
| 'GET' | '/restaurants/:idOrSlug' | Get restaurant by MongoDB ObjectId or slug |

### Users

| Method | Endpoint| Description |
|---|---|---|
| 'POST' | '/users' | Create a new user |
| 'GET' | '/users/:userId/follow' | Follow a restaurant |
| 'GET' | '/users/:userId/recommendations' | Get restaurant recommendations |

----

## Architecture

'''
src/
├── main.ts                          # Bootstrap, global pipes, Swagger setup
├── app.module.ts                    # Root module — MongoDB + env config
├── restaurants/
│   ├── dto/
│   │   ├── create-restaurant.dto.ts # Validated creation payload
│   │   └── query-restaurant.dto.ts  # Validated query params (list + nearby)
│   ├── restaurant.schema.ts         # Mongoose schema + Cuisine enum
│   ├── restaurants.controller.ts    # Route handlers + Swagger decorators
│   ├── restaurants.service.ts       # Business logic
│   └── restaurants.module.ts        # Feature module
└── users/
    ├── dto/
    │   ├── create-user.dto.ts       # Validated user creation payload
    │   └── follow.dto.ts            # Validated follow payload
    ├── user.schema.ts               # User Mongoose schema
    ├── follow.schema.ts             # Follow join-collection schema
    ├── users.controller.ts          # Route handlers + Swagger decorators
    ├── users.service.ts             # Business logic + aggregation pipeline
    └── users.module.ts              # Feature module
'''

### Key Design Decisions 

**Recommendation Pipeline** Implemented as a single MongoDB aggregation pipeline following the exact 3 steps:
1. Find users sharing >= 1 favourite cuisine with the target user.
2. Fetch all Follow records from those similar users -> hydrate Restaurant documents.
3. Project 'similarUsers' + 'recommendedRestaurants' in the response.

**GeoSpatial Search** Uses '$nearSphere' with a '2dsphere' index for accurate spherical distance calculations. Coordinates follow the GeoJSON convention: [longitude, latitude].

**Slug Generation** Auto generated from english name if not supplied, ensuring the slug feild is always populated.

**Follow Collection** Implemented as a join collection for scalability, with a compound unique index on {UserId, restaurantId} to prevent duplicates.

----

## Supported Cuisines

'Fried', 'Asian', 'Burgers', 'Pizza', 'Sushi', 'Mexican', 'Italian', 'Indian', 'Seafood', 'Vegan', and 'Vegetarian'.

----

## Running Tests

'''bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
'''

----