# Use an official Node.js runtime as a parent image
FROM node:20.9-bookworm

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Make port 3000 available to the world outside this container
EXPOSE 3000

RUN npm run build

# Define the command to run your application
CMD ["node", "./dist/app.js"]
