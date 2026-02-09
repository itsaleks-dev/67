## HOME WORH 64

Authorization using Passport.js (Express)

Project description

This project is a server application on Node.js + Express.js,
implementing session-based user authorization using Passport Local Strategy
(login via email and password).

The project was created for educational purposes to study:
• how Passport.js works
• session authorization
• cookies (httpOnly)
• route protection in Express

Technologies used
• Node.js
• Express.js
• Passport.js
• passport-local
• express-session
• bcrypt
• dotenv
• nodemon
• Thunder Client (for testing)

Functionality

Authorization
• User registration (email + password)
• Password hashing using bcrypt
• User login via Passport Local Strategy
• Session authorization via express-session

Cookies
• Cookie sid
• httpOnly: true
• sameSite: “lax”

Protected route
• The /protected route is only accessible to authorized users
• Verification is performed via ensureAuth middleware

Logout
• End of session
• Cookie clearing
• Repeated access to protected routes is prohibited

The training version uses the default session secret.
In production, it is moved to environment variables.

## HOME WORK 65

This project is a server application based on Node.js and Express.js
with authorization implemented via Passport.js and connection to MongoDB Atlas.

The main objectives of this stage are:
• Connecting MongoDB Atlas to the Express server
• Implementing data read operations from the database
• Transferring the received data to the client via an HTTP route

Technologies used
• Node.js
• Express.js
• MongoDB Atlas
• Mongoose
• Passport.js (Local Strategy)
• express-session
• dotenv

The Mongoose library is used for connection.
const mongoose = require("mongoose");

async function connectMongo() {
await mongoose.connect(process.env.MONGO_URI);
console.log("MongoDB connected");
}

• Reading data from the database has been implemented
• Data is transferred to the client via HTTP route
• Authorization via Passport is saved

## HOME WORK 66

CRUD operations with MongoDB Atlas

At this stage, the project was expanded with full support for CRUD operations
(Create, Read, Update, Delete) for working with the MongoDB Atlas database.

Technologies used
• Node.js
• Express.js
• MongoDB Atlas
• Mongoose
• Passport.js
• express-session

• models/User.js — user model
• controllers/users.controller.js — CRUD business logic
• routes/users.routes.js — routes
• middleware/ensureAuth.js — route protection

Implemented routes
CREATE
READ
UPDATE
DELETE

All routes are protected by ensureAuth middleware.
Access is only possible after user authorization via Passport.

• Full CRUD implemented for MongoDB Atlas
• insertOne, insertMany, find, updateOne, updateMany, replaceOne, deleteOne, deleteMany used
• Code structured according to the MVC principle
• All routes tested via Thunder Client

## HOME WORK 67

Cursor-based data processing and aggregation in MongoDB

At this stage, the project was extended to optimize data handling
when working with large collections in MongoDB Atlas.

The main objectives of this stage are:
• Using cursors to iterate over documents without loading all data into memory
• Implementing aggregation queries to collect statistical data
• Demonstrating efficient data processing for large datasets

Technologies used
• Node.js
• Express.js
• MongoDB Atlas
• Mongoose
• Passport.js
• express-session

Cursor-based data access

To optimize reading large amounts of data, a cursor-based pagination mechanism was implemented.

Implemented route:
• GET /users/cursor

Features:
• Cursor pagination based on \_id
• No usage of skip, which improves performance on large collections
• Data is returned in small portions (pages)
• Sensitive fields (passwordHash, \_\_v) are excluded from responses
• Route is protected by ensureAuth middleware

Example query parameters:
• pageSize — number of documents per page
• after — cursor value (last \_id from the previous page)

Aggregation query

An aggregation pipeline was implemented to collect statistical data from the users collection.

Implemented route:
• GET /users/stats

Aggregation includes:
• Total number of users
• Number of unique email domains
• First and last user creation dates
• Top email domains by number of users

MongoDB aggregation operators used:
• $project
• $group
• $facet
• $sort
• $limit

Result

• Cursor-based pagination implemented for efficient data processing
• Aggregation pipeline implemented for collecting complex statistics
• Server optimized for working with large datasets
• All new routes are protected by authorization middleware
• Functionality tested via Thunder Client and curl

## HOME WORK 68

Dockerization of Express application with MongoDB using Docker Compose

At this stage, the existing Express application was containerized using Docker
and integrated with MongoDB via Docker Compose.

Technologies used

• Docker
• Docker Compose
• Node.js (node:lts)
• Express.js
• MongoDBё

Dockerfile

• Created a Dockerfile based on the node:lts image
• Set the working directory to /app
• Copied project files into the container
• Installed project dependencies
• Exposed port 3000
• Defined the application startup command

Docker Compose

• Created a docker-compose.yml file
• Added an Express application service
• Added a MongoDB service using the official mongo image
• Configured the MONGODB_URI environment variable
• Used depends_on to manage service dependencies
• Configured volumes for live code synchronization

⸻

Testing and Result

• Containers were started using docker-compose up
• Application is accessible at http://localhost:3000
• MongoDB connection is established successfully
• Code changes are applied automatically using volumes


## HOME WORK 69

Basic Mongo Shell operations, aggregation, and indexes

At this stage, the project focused on strengthening practical skills
in working directly with MongoDB using Mongo Shell (mongosh).

The main objectives of this stage are:
• Learning basic Mongo Shell commands
• Managing databases, collections, and documents
• Practicing CRUD operations directly in the shell. 
• Using aggregation pipelines for data analysis
• Creating and testing indexes for query optimization

Technologies used
• MongoDB
• Mongo Shell (mongosh)
• Docker (MongoDB container)

⸻

Database and collection management

• Created a new database studentDB using Mongo Shell
• Created a collection assignments
• Inserted multiple documents using insertMany

Each document contains:
• name — student name
• subject — subject name
• score — student score

⸻

Basic queries and document operations

Implemented the following operations in Mongo Shell:

• find() — retrieving all documents
• Filtering documents using comparison operators ($gt, $lt)
• Updating documents using:
• updateOne
• $inc operator to increase numeric values
• Deleting documents using:
• deleteOne
• Projection in find() to return only selected fields

⸻

Aggregation operations

Aggregation pipelines were implemented to analyze data from the assignments collection.

Aggregation tasks included:
• Grouping documents by subject
• Calculating the average score per subject
• Filtering aggregation results by average score

MongoDB aggregation operators used:
• $group
• $avg
• $match

⸻

Indexes and query optimization

To practice query optimization, indexes were introduced:

• Created a unique index on the name field
• Executed search queries using regular expressions
• Verified index usage using explain("executionStats")

Execution plan analysis confirmed:
• Index scan (IXSCAN) is used instead of collection scan (COLLSCAN)
• Queries are optimized through the created index

⸻

Result

• Practical Mongo Shell skills strengthened
• CRUD operations successfully performed directly in Mongo Shell
• Aggregation pipelines applied for data analysis
• Indexes created and validated for performance optimization
• Understanding of how MongoDB executes and optimizes queries improved