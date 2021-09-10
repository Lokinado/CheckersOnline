export class userT{
    name: String
    history: gameT[]
    constructor( name: String, history: gameT[] = [] ){
        this.name = name;
        this.history = history;
    };
}

export class gameT{
    id: String
    host: String
    opponent: String
    state: stateT
    move: number
    board: number[][]
    last_updated: Date
    data_create: Date
    constructor( id: String, host:String, opponent: String, state: stateT, move:number, board: number[][], lu: Date, dc: Date){
        this.id = id
        this.host = host
        this.opponent = opponent
        this.state = state
        this.move = move
        this.board = board
        this.last_updated = lu
        this.data_create = dc
    }
}

export class messageT{
    sender: String
    message: String
    constructor( sender: String, message: String ){
        this.sender = sender;
        this.message = message;
    }
}

export class pawnId{
    x: number
    y: number
    constructor( x: number, y: number ){
        this.x = x;
        this.y = y;
    }

    isEqual(pawnId: pawnId | null): boolean {
        if(pawnId === null) return false;
        if((pawnId.x === this.x) && (pawnId.y === this.y)) return true;
        else return false;
    }
}

export class dataT{
    online: String[]
    constructor(){
        this.online = []
    }
}

export class offsetT{
    x: number // x offset
    y: number // y offset
    constructor( x: number, y: number ){
        this.x = x;
        this.y = y;
    }
}

export enum stateT {
    WON       = 0,
    LOST      = 1,
    ONGOING   = 2,
    DRAW      = 3
}