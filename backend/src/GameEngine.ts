import { pawnId, offsetT, gameT, stateT } from './Types';
import { log } from './Logger';
import db = require('../src/Database');
import exp = require('constants');

export async function isMoveValid (req, res , next) {
    const PROPERTYNAME = ["host", "opponent"]
    let gameObject: gameT = await db.getGameById(req.body.gameId, req.user.username)
    req.board = gameObject.board;
    req.isPawnRemoved = false;
    let sp: pawnId = req.body.selectedPawn;
    let cp: pawnId = req.body.clickedPawn;
    try { //add check if game is ongoing
        if(req.user.username !== gameObject[PROPERTYNAME[gameObject.move-1]]){
            throw "Wrong users move"
        }

        if( !(inRange(sp) && inRange(cp)) ){
            throw "wrong range"
        }

        if(gameObject.board[cp.y][cp.x] !== 0){
            throw "Wrong pawn placement"
        }

        let pawnType: number = req.board[sp.y][sp.x];
        if( pawnType === 0){
            throw "Not a pawn"
        }

        if( pawnType % 2 !== gameObject.move % 2){
            throw "Wrong users pawn"
        }

        if( pawnType <= 2) {

            let moveDirection = (gameObject.move === 1) ? 1 : -1;
            let a = sp.x-cp.x;
            let b = sp.y-cp.y;
            if( a*a + b*b === 2 ){  
                if( b !== moveDirection ) {
                    throw "Wrong move" 
                }         
            } else {
                if(a*a + b*b === 8){
                    if( b !== 2*moveDirection ) {
                        throw "Wrong move"
                    } else {
                        let sr: pawnId;
                        sr = new pawnId( (sp.x + cp.x)/2, (sp.y + cp.y)/2 );
                        if( req.board[sr.y][sr.x] === 0) throw "Jump over empty field"
                        if( req.board[sr.y][sr.x] % 2 != gameObject.move % 2){
                            req.board[sr.y][sr.x] = 0
                            req.isPawnRemoved = true;
                        } else {
                            throw "Jump over own pawn"
                        }
                    }
                } else throw "Wrong move"
            }

        } else {

            let p;
            let k;
            let h = 0;
            let nd;
            if( sp.x !== cp.x ){
                if( sp.y !== cp.y ){
                    throw "Wrong move"
                } else {
                    p = sp.x
                    k = cp.x
                    nd = sp.y
                }
            } else {
                p = sp.y
                k = cp.y
                h = 1
                nd = sp.x;
            }

            if( k < p ) [ k , p ] = [ p , k ];
            for(let i = p+1 ; i < k ; i++){
                if(h){
                    if(req.board[i][nd] === 0) continue;
                    if(req.board[i][nd]%2 !== gameObject.move % 2){
                        req.board[i][nd] = 0;
                        req.isPawnRemoved = true;
                    }
                } else {
                    if(req.board[nd][i] === 0) continue;
                    if(req.board[nd][i]%2 !== gameObject.move % 2){
                        req.board[nd][i] = 0;
                        req.isPawnRemoved = true;
                    }
                }
            }

        }
    } catch (err) {
        log.warn( err );
        res.status(400).send();
        return;
    }

    next()
}

function inRange(value: pawnId): boolean{
    if( (value.x < 0) || (value.x > 7) ) return false;
    if( (value.y < 0) || (value.y > 7) ) return false;
    return true;
}

export function isGameFinished( io: any ) {
    return async (req, res) => {
        let fieldsToCheck: offsetT[] = [];
        fieldsToCheck.push( new offsetT( 1 , 1 ) )
        fieldsToCheck.push( new offsetT( -1 , 1 ) )
        let movesCount: number[] = [ 0 , 0 ];
        let pawnsCount: number[] = [ 0 , 0 ];
        let queenCount: number[] = [ 0 , 0 ];
        let result: stateT = 2;

        let board = req.board;
        for( const [ y , row ] of board.entries() ){
            for( const [ x , value ] of row.entries() ){
                if( value === 0 ) continue
                if( (value >= 3) ) {
                    movesCount[value-3]++
                    queenCount[value-3]++
                    continue
                }
                let moveDirection = (value === 1) ? -1 : 1;
                pawnsCount[value-1]++
                for( const field of fieldsToCheck){
                    let ref: pawnId;
                    ref = new pawnId(x + field.x, y + moveDirection * field.y);
                    if(!inRange(ref)) continue
                    if(board[ref.y][ref.x] === 0) movesCount[value-1]++;
                    else if(board[ref.y][ref.x] % 2 !== value % 2){
                        ref = new pawnId(x + 2*field.x, y + 2*moveDirection * field.y);
                        if(!inRange(ref)) continue
                        if(board[ref.y][ref.x] === 0) movesCount[value-1]++;
                    }
                }
            }
        }
        for( const [ player, pawns ] of pawnsCount.entries()){
            if(result !== 2) continue;
            if(pawns === 0){
                if(queenCount[player] === 0){
                    result = Number(!player);
                }
            }
        }
        for( const [ player, moves ] of movesCount.entries()){
            if(result !== 2) continue;
            if(moves === 0){
                if(queenCount[player] === 0){
                    result = Number(!player);
                }
            }
        }
        if(( pawnsCount[0] === 0 ) && (pawnsCount[1] === 0) ){
            if( (queenCount[0] > 0) && (queenCount[1] > 0) ){
                result = 3;
            }
        }
        if(result === 2) return
        log.info("I END GAME WITH RESULT " + result)
        io.of("/game").to(req.body.gameId).emit("gameFinish", result)
        await db.updateGameState(req.body.gameId, result)
    }
}

export function executeMove( io: any ) {
    return async (req, res, next) => {
        let gameObject: gameT = await db.getGameById(req.body.gameId, req.user.username)
        let sp: pawnId = req.body.selectedPawn;
        let cp: pawnId = req.body.clickedPawn;
        let b = req.board;
        if( b[sp.y][sp.x] <= 2 ){
            if(gameObject.move === 1){
                if(cp.y === 0){
                    b[sp.y][sp.x] += 2
                }
            } else {
                if(cp.y === 7){
                    b[sp.y][sp.x] += 2
                }
            }
        }
        [ b[sp.y][sp.x], b[cp.y][cp.x] ] = [ b[cp.y][cp.x], b[sp.y][sp.x] ]
        gameObject.board = b;
        req.board = b;
        if( !req.isPawnRemoved ){
            gameObject.move = (gameObject.move % 2) + 1;            
        }
        await db.updateGameObject(req.body.gameId, gameObject);
        res.send( "OK" );
        io.of("/game").to(req.body.gameId).emit("gameUpdate", JSON.stringify(gameObject))
        next()
    }
}