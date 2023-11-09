# Use an official Node.js runtime as a parent image
FROM node:20.9-bookworm as build

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the React app
RUN npm run build

# Use Nginx for the production image
FROM nginx:alpine

# Copy the build output from the build stage to the Nginx public directory
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Expose port 80 to the outside world
EXPOSE 80

# Define the command to run Nginx
CMD ["nginx", "-g", "daemon off;"]
