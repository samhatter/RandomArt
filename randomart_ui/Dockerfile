FROM node:21-alpine3.18
WORKDIR /app
COPY . ./
EXPOSE 8080
RUN npm set progress=false
RUN npm install
CMD npm run start
