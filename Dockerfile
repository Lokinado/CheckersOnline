FROM node:12

WORKDIR /CheckersOnline

COPY ./backend/package.json ./
COPY ./backend/tsconfig.json ./
COPY ./backend/main.ts ./
COPY ./backend/assets ./assets
COPY ./backend/src ./src

WORKDIR /CheckersOnline/homepage

COPY ./homepage/package.json ./
COPY ./homepage/tsconfig.json ./
COPY ./homepage/src ./src
COPY ./homepage/public ./public

RUN npm install
RUN npm run build
RUN mv ./build ../homepageBuild

WORKDIR /CheckersOnline/frontend

COPY ./frontend/package.json ./
COPY ./frontend/tsconfig.json ./
COPY ./frontend/src ./src
COPY ./frontend/public ./public

RUN npm install
RUN npm run build
RUN mv ./build ../frontendBuild

WORKDIR /CheckersOnline

RUN rm -rf frontend
RUN rm -rf homepage

RUN ls -la .
RUN npm install

CMD [ "npm" , "start" ]
