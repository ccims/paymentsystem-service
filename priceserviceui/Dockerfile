FROM node

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
RUN npm install -g @angular/cli@latest

COPY . .

EXPOSE 4300

CMD [ "ng","serve","--host", "0.0.0.0","--port","4300","--disableHostCheck"]
