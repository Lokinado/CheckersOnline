const mysql = require('mysql2');
import { log } from './Logger';
import { readFileSync } from 'fs';
import { stateT, gameT } from './Types';

let user = process.env.DB_USER || "root"
let host = process.env.DB_HOST || "localhost"
let database = process.env.DB_NAME || "CheckersOnline"
let password = process.env.DB_PASS || "password"
let port = process.env.DB_PORT || 3306

const con = mysql.createConnection({
    user: user,
    host: host,
    password: password,
    port: port,
    multipleStatements: true,
});

function getId(): string {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return Math.random().toString(36).substr(2, 9);
};

async function makeQuery(queryString, args) {
    let result;

     let formatedQuery = queryString;
    // for (var i = 0; i < args.length; i++) todo
    //     formatedQuery = formatedQuery.replace("$"+(i+1).toString(), "'" + args[i] + "'");

    try {
        log.db(formatedQuery);
        result = await con.promise().query(queryString, args);
    } catch (error) {
        log.error("DB: " + error);
    }
    return result[0];
}
  
export async function init() {
    try{
        await con.connect();
    } catch (err) {
        if (err) {
            log.error(err);
            return;
        }
    }
    log.db("Database connected");
    let result = await makeQuery("SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?;", [database]);
    if( result.length === 0 ){

        log.db("There is no database, creating structure...");
        let sqlBuffer = readFileSync("assets/dbStructure.sql");
        let sqlString = sqlBuffer.toString();
        await con.promise().query("CREATE DATABASE " + database + "; use " + database +";");
        log.db("Database created and set!");
        await con.promise().query(sqlString);
        log.db("Structure created!");

    } else {

        await con.promise().query("use " + database + ";");
        log.db("Database set!");

    }
}

export function addUser(username: string, hashedPassword: string) {
    let query = "INSERT INTO user (name, pass) VALUES ( ? , ? );"
    let args = [username, hashedPassword];
    makeQuery(query , args);
}

export async function getUser(username: string) {
    let query = "SELECT * FROM user WHERE name = ?;"
    let args = [username];
    let result = await makeQuery(query , args);
    return result;
}

export async function getPlayers(username: string) {
    let query = "SELECT name FROM user WHERE name!=?;"
    let args = [username];
    let result = await makeQuery(query , args);
    return result;
}

export async function getHistory(username: string) {
    let query = "SELECT id, host, opponent, state, data_created FROM game WHERE host=? OR opponent=?"
    let args = [username, username];
    let result = await makeQuery(query , args);
    return result;
}

export async function getUserId(username: string) {
    let query = "SELECT id FROM user WHERE name=?"
    let args = [username];
    let result = await makeQuery(query , args);
    return result[0].id;
}

export async function createGame(username: string, opponent: string) {
    let gameId = getId();
    let query = "INSERT INTO game (id, host, opponent) VALUES ( ? , ? , ? );"
    let args = [ gameId , username, opponent];
    await makeQuery(query , args);
    return gameId;
}

export async function getGameById(id: string, user: string): Promise<gameT> {
    let query = "select * from game where id=? AND (host=? OR opponent=?)";
    let args = [id,user,user];
    let result = await makeQuery(query , args);
    if( result.length == 0 ){
        throw "Empty Set";
    }
    let gameObject: gameT = new gameT(
        result[0].id,
        result[0].host,
        result[0].opponent,
        result[0].state,
        result[0].move,
        JSON.parse(result[0].board),
        new Date(result[0].last_updated),
        new Date(result[0].data_created)
    );
    return gameObject;
}

export async function updateGameObject(gameId:string, gameObject: gameT) {
    let query = "UPDATE game SET board=?, state=?, move=? WHERE id=?";
    let args = [
        JSON.stringify(gameObject.board),
        gameObject.state,
        gameObject.move,
        gameId
    ];
    await makeQuery(query , args);
}

export async function updateGameState(gameId:string, state: stateT) {
    let query = "UPDATE game SET state=? WHERE id=?";
    let args = [
        state,
        gameId
    ];
    await makeQuery(query , args);
}
