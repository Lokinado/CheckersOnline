<!--
+++
author = "Krzysztof Borowski"
title = "Checkers Online"
date = "2021-09-10"
description = "A simple full stack web application"
summary = "Checkers Online is a demo fullstack project showing how would i implement complex webapp."
draft="false"
tags = [
    "typescript", 
    "react",
    "node",
]
categories = [
    "webdev",
    "full stack",
]
+++
-->

![GitHub](https://img.shields.io/github/license/Lokinado/CheckersOnline?style=for-the-badge)
![GitHub language count](https://img.shields.io/github/languages/count/Lokinado/CheckersOnline?style=for-the-badge)
![GitHub top language](https://img.shields.io/github/languages/top/Lokinado/CheckersOnline?style=for-the-badge)

<p align="center">
    <h1 align="center" style="border-bottom: none; margin-bottom: 0">
        <strong>
            CheckersOnline
        </strong>
    </h1>

  <p align="center">
    Full stack web platform for connecting players to numerous concurrent games. Its robust architecture ensures reliable performance allowing players to play checkers with ease.
    <br />
    <!--
    <a href="DEMO LINK"><strong>View Demo»</strong></a>
    -->
  </p>
</p>

<br><br>

# About The Project
Checkers Online is a demo fullstack project showing how would i implement complex webapp. The main goal was to create consistent ecosystem to handle many games of many users at once with minimal overhead. 

Have Fun! 😄
[Github Repo](https://github.com/Lokinado/CheckersOnline)

<br>

## Build With
The most noteworthy frameworks and technologies.
* [React](https://reactjs.org/)
* [Express](https://expressjs.com/)
* [TypeScript](https://www.typescriptlang.org/)
* [Socket.io](https://socket.io/)
* [Docker](https://www.docker.com/)
* [Passport](http://www.passportjs.org/)
* [Mysql](https://www.mysql.com/)
* [AntDesign](https://ant.design/)
* [NodeJs](https://nodejs.org/)

<br>

# Getting Started
CheckersOnline is completely dockerized so production build can be created and run with one clean line in terminal.

<br>

## Prerequisites
* Docker [Docker Installation Page](https://docs.docker.com/engine/install/)
* Docker-compose  [Docker-compose Installation Page](https://docs.docker.com/compose/install/)

<br>

## Build & Run
1. Clone the repo
```sh
git clone https://github.com/Lokinado/CheckersOnline
```
2. Run docker compose in main directory. ( first launch may take a while )
```sh
docker-compose up
```
3. App should run on localhost on port 80. Can be changed in .env file.
```env
ADDRESS=localhost
PORT=80
```

<br>

# Usage
Go to localhost in your browser and sign up. You may need to open second session in "incognito" window in your browser with second account to invite for a game. 

After inviting for a game players can play game in seperate window and place moves when they want. Communication bettwen players can be done using built in chat.

<br>

## Game rules
1. Host account always starts with white pawns
2. Opponent always plays with black pawns
3. pawns can move one field diagonally ( indicated by the dots )
4. pawns capture other pawn jumping over pawn of other color diagonally
5. when pawn reaches last row on a board, becomes queen.
6. queen moves freely verticaly or horizontally
7. queen can capture multiple pawns at once
8. queen can jump over pawns of her own color
9. if pawn captures a pawn of diffrent color player can move again
10. game ends if all pawns are captured or when all pawns of one player cant move
11. game results in draw when there are only queens on board

<br>

# Roadmap
No updates are planned in the near future.

<br>

# Licence
Distributed under the MIT License. See `LICENSE` for more information.

<br>

# Contact
Made with love by Krzysztof Borowski - krzysztofborowski02@gmail.com
<br>
Project Link: https://github.com/Lokinado/CheckersOnline
