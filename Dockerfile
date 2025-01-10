#e the official Node.js LTS image as the base image
FROM node:18.18.2

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Copy the entire project to the working directory
COPY . .

# Copy the .env file to the working directory (if needed)
COPY .env .env

# Install project dependencies
RUN npm install --legacy-peer-deps
# RUN npm install

# Build the NestJS application
RUN npm run build

# Expose the port your NestJS application is running on
EXPOSE 3000

# Start the NestJS application
# CMD npm run start:prod --dotenv_config_path .env
CMD npm run start:prod
# CMD ["npm", "start"]
