FROM node:4.2.1

# Create app directory
RUN mkdir -p /public
WORKDIR /public

# Install app dependencies
COPY package.json /public/
RUN npm install

# Bundle app source
COPY . /public

EXPOSE 3000
CMD [ "npm", "start" ]
