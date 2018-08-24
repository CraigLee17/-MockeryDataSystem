# base image
FROM node:8

# set environment variable
ENV mongo=mongo   

# set working directory
WORKDIR /usr/src/app

# Copy dependency definitions
COPY package.json ./ 

# Install dependecies
RUN npm install

# Get all the code needed to run the app
COPY . .

# Expose the port the app runs in
EXPOSE 3000

# Serve the app
CMD ["npm", "start"]