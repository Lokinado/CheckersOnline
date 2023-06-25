<!--
+++
author = "Krzysztof Borowski"
title = "Checkers Online"
date = "2021-09-10"
description = "Prosta aplikacja internetowa fullstack"
summary = "Checkers Online to przykładowa aplikacja fullstack pokazująca jak zaimplementował bym złożony serwis internetowy."
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
    Prosta aplikacja internetowa stworzona przez Krzysztofa Borowskiego
    <br />
    <!--
    <a href="DEMO LINK"><strong>View Demo»</strong></a>
    -->
  </p>
</p>

<br><br>

# O Projekcie [Github](https://github.com/Lokinado/CheckersOnline)
Checkers Online to przykładowa aplikacja fullstack pokazująca jak zaimplementował bym złożony serwis internetowy. Głównym celem było stworzenie ekosystemu który był by w stanie prowadzić wiele gier wielu użytkowników w tym samym czasie z minimalnym wykorzystaniem zasobów.

Miłej rozgrywki! 😄

<br>

## Stworzono Przy Użyciu
Frameworki i technologie warte wspomnienia.
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

# Pierwsze kroki
CheckersOnline wykorzystuje kontenery dockera więc build może zostać stworzony i zhostowany korzystając z jednej linijki w terminalu.

<br>

## Wymagania wstępne
* Docker [Strona instalacyjna Dockera](https://docs.docker.com/engine/install/)
* Docker-compose  [Strona instalacyjna Docker-Compose](https://docs.docker.com/compose/install/)

<br>

## Budowanie i uruchamianie
1. Sklonuj repozytorium
```sh
git clone https://github.com/Lokinado/CheckersOnline
```
2. Uruchom docker compose w głównym katalogu. ( Pierwsze uruchomienie może chwilkę zająć )
```sh
docker-compose up
```
3. Aplikacja powinna się uruchomić na localhost na porcie 80. Może zostać to zmienione w pliku .env.
```env
ADDRESS=localhost
PORT=80
```

<br>

# Użytkowanie
Wejdź na localhost w swojej przeglądarce i stwórz konto. Koniecznością będzie uruchomienie drugiej sesji w karcie "incognito" aby zalogować się na drugie konto i zaprosić do gry.

Po zaproszeniu na grę, gracze mogą zagrać w oddzielnych oknach i mogą stawiać ruchy kiedy tylko mają na to ochotę. Komunikacja między graczami została rozwiązana korzystając z wbudowanego czatu.

<br>

## Zasady gry
1. Host zawsze zaczyna rozgrywkę z białymi pionkami.
2. Oponent zawsze gra z czarnymi pionkami.
3. pionki mogą poruszać się tylko po ukosie ( oznaczone przez kropki na planszy )
4. pionki mogą zbić pionki przeciwnika przeskakując je po ukosie.
5. kiedy pionek dojdzie do ostatniego pola na planszy zostaje damą.
6. dama porusza się dowolnie ale tylko vertykalnie lub horyzontalnie. 
7. dama może przechwycić wiele pionków na raz.
8. dama może przeskakiwać pionki własnego koloru.
9. jeżeli gracz zbije inny pionek może wykonać kolejny ruch w swojej turze.
10. gra kończy się gdy wszystkie pionki zostają zbite lub gdy wszystkie pionki danego gracza nie mogą się ruszyć.
11. gra kończy się remisem gdy na planszy zostają tylko damy.

<br>

# Ścieżka rozwoju
Nie ma zaplanowanych uaktualnień w najbliższej przyszłości.

<br>

# Licencja
Dystrybuowane pod Licencją MIT. Zobacz `LICENSE` po więcej informacji.

<br>

# Kontakt
Stworzone prze Krzysztof Borowski - krzysztofborowski02@gmail.com
<br>
Link do projektu: https://github.com/Lokinado/CheckersOnline
