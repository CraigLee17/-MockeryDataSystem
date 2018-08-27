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
* [Angular CLI](https://cli.angular.io): frontend scaffolding
* [Bootstrap 4](http://www.getbootstrap.com): layout and styles
* [Passport.js](http://passportjs.org/docs): user authentication
* [Bcrypt-nodejs](https://github.com/kelektiv/node.bcrypt.js): password encryption

## Prerequisites
* Install [Node.js](https://nodejs.org)
* Install [MongoDB](https://www.mongodb.com)

## Running in docker container
* Install [Docker](https://docs.docker.com/)
* Run the following commands from project root directory
* `cd server`
* `docker-compose up`

## Please open an issue if
* you have any suggestion to improve this project
* you notice any problems or errors

## Author
* Author: [Zhiyuan Li](https://craiglee17.github.io/)
* Tutor: [Kenny Hunt](http://charity.cs.uwlax.edu/)
