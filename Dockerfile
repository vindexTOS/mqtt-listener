# FROM node:20-alpine AS builder

# WORKDIR /app

 
# COPY package.json yarn.lock ./

# # Install dependencies
# RUN yarn install --legacy-peer-deps

#  COPY . .

 
# RUN yarn build

# FROM node:20-alpine AS runner

# WORKDIR /app

# COPY package.json ./

# EXPOSE 3000
 
# COPY --from=builder /app ./

# # Command to run the application
# CMD ["yarn", "start:dev"]


# with pm2 

FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json and yarn.lock first to leverage Docker cache
COPY package.json yarn.lock ./

# Install dependencies with legacy peer deps option
RUN yarn install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Build the NestJS application
RUN yarn build

FROM node:20-alpine AS runner

WORKDIR /app

# Copy package.json for production dependencies or scripts
COPY package.json ./

# Install PM2 globally using Yarn
RUN yarn global add pm2

EXPOSE 3000

# Copy the built application and other files from the builder stage
COPY --from=builder /app ./

# Use PM2 to run the application in production mode with the script "start:prod"
CMD ["pm2-runtime", "start", "yarn", "--", "start:prod"]
