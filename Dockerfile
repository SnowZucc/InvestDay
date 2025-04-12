FROM node:22.14-alpine


# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
COPY prisma ./prisma/
# Install prisma
RUN npm ci
RUN npm uninstall bcrypt
RUN npm install bcrypt

# Bundle app source
COPY . ./
# Build the app
# RUN npm run build
EXPOSE 3000
# generate prisma client
CMD ["npm", "run", "start"]
