import db = require('./Database');
import { log } from './Logger';

export async function getPlayerHistory(username: string){
    let history = await db.getHistory(username);
    return { history: history }
}

export async function createGame(req, res){
    return await db.createGame(req.user.username, req.body.opponent);
}

export function parseGameID( url ){
    let splitUrl = url.split('/');
    return splitUrl[4];
}

export function isReqValid(fields:Array<string>) {
    return (req, res, next) => {
        if(!req.hasOwnProperty('params')){
            log.warn("No poperty params");
            res.status(400).send();
            return
        }
        for(const property of fields){
            if(!req.body.hasOwnProperty(property)){
                log.warn("No poperty " + property);
                res.status(400).send();
                return
            }
        }

        next();
    };
}