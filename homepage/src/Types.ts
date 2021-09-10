export class userT{
    name: string
    history: gameT[]
    constructor( name: string, history: gameT[] = [] ){
        this.name = name;
        this.history = history;
    };
}

export class gameT{
    id: String
    host: String
    opponent: String
    state: stateT
    board: Number[][]
    constructor( id: String, host:String, opponent: String, state: stateT){
        this.id = id
        this.host = host
        this.opponent = opponent
        this.state = state
    }
}

export class dataT{
    online: string[]
    constructor( online: string[] = []){
        this.online = online
    }
}

enum stateT {
    WON       = 0,
    LOST      = 1,
    ONGOING   = 2,
    DRAW      = 3
}