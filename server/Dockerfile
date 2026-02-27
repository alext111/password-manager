FROM node:20-alpine

WORKDIR /app

# Copy only backend dependencies
COPY package*.json ./

RUN npm install --production

# Copy backend source
COPY . .

EXPOSE 3001

# Run the server
CMD ["node", "index.js"]