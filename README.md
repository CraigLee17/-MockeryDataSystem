# Mockery Data System

## Outline
This system is used to mock your back-end API by providing realistic data and endpoint access.

## Why you need this?
* Test data is a vital requirement throughout the entire development of any web application.
* The data must be real; not in the sense of the data having any type of semantic correlation to the external world; but real in the sense of its syntactic structure and internal references.
* Generating this data can be a time-consuming process that is subject to a great deal of change, especially early in the software development cycle.
* This tool provides you real supported back-end.
* It lets you focusing on developing UI prototype more faster and interacting with mock data much simpler.
* By making real requests to mock back-end, you'll uncover problems with application flow, timing, and API design early, improving the quality of both API and the user experience. 

## Tech Stack: [MEAN](https://en.wikipedia.org/wiki/MEAN_(software_bundle))
* [**M**ongoose.js](http://www.mongoosejs.com) ([MongoDB](https://www.mongodb.com)): database
* [**E**xpress.js](http://expressjs.com): backend framework
* [**A**ngular 5+](https://angular.io): frontend framework
* [**N**ode.js](https://nodejs.org): runtime environment

Other tools and technologies used:
* [Mocker-data-generator](https://github.com/danibram/mocker-data-generator) data generator
* [Bootstrap 4](http://www.getbootstrap.com): layout and styles
* [Passport.js](http://passportjs.org/docs): user authentication
* [Bcrypt-nodejs](https://github.com/kelektiv/node.bcrypt.js): password encryption

## Prerequisites
* Install [Node.js](https://nodejs.org)
* Install [MongoDB](https://www.mongodb.com)

## Running in Docker Container
* Install git
* Clone the Project to your local machine: `git clone https://github.com/CraigLee17/mockeryData.git`
* Install [Docker](https://docs.docker.com/)
* Run the following commands from project root directory
* `cd server`
* `docker-compose up`

## Future thoughts:
* Mix user data with mock data. Alow users to append data with Mockery data. (In Machine learning area, mock data can be used to test/validate model.)
* Derive metadata of the mock data with Spark. (Provide deeper insight into the data to users)
* Retrieve mock data via REST endpoints without pre-defined schemas for visitors. e.g. /api/v1/visitors/{dataTypeName}?amount=100

## Advanced Topics
* **Scaling**: [PM2](https://www.npmjs.com/package/pm2), a handy process manager to spin up multiple node instances in a multiple-cores machine. Out of the box, PM2 includes supports for load-balancing, monitoring and log managment.
* **In-memory Cache**: [Redis](https://redis.io), frequent use sample data can be stored in memory.

## Please open an issue if
* you have any suggestion to improve this project
* you notice any problems or errors

## Author
* Author: [Zhiyuan Li](https://craiglee17.github.io)
* Tutor: [Kenny Hunt](http://charity.cs.uwlax.edu/)
