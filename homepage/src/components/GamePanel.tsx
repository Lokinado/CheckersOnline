import React from 'react';
import {gameT} from "../Types"
import '../css/GamePanel.css';

type GamePanelPropsT = {
    serverURL: string
    user: string
    empty: boolean
    game: gameT
};

type GamePanelStateT = {
};

class GamePanel extends React.Component<any, GamePanelStateT>{
    constructor(props: GamePanelPropsT) {
        super(props);
        this.state = {
        };
        this.handleClick = this.handleClick.bind(this);
    }

    isWon(): boolean{
        let isHost:boolean = (this.props.game.host === this.props.user)
        let isLostByHost:boolean = Boolean(this.props.game.state)
    
        return (isHost !== isLostByHost)
    }

    getStyle(){
        if( this.props.game.state === 3) return [ "draw", "#eee8AA" ]
        else if( this.props.game.state === 2) return [ "in progress", "#eeeeee" ]
        else if( this.isWon() ) return [ "won" , "#99ffcc"]
        else return [ "lost" ,  "#cd5c5c"]        
    }

    handleClick(){
        let url = this.props.serverURL + "game/" + this.props.game.id;
        window.open(url, '_blank').focus();
    }

    render(){
        if( this.props.empty ){
            return(
                <>
                    <div style={{ backgroundColor: "#eeeeee", textAlign: "center"}}>
                        <div className="GameTitle" style={{fontWeight: 100, color: 'verydarkgray'}}>
                            There are no games. Press on a player to start game!
                        </div> 
                    </div>
                </>
            );   
        }

        let scheme = this.getStyle();
        return(
            <div style={{marginTop: "5px"}}>
                <div className="GameTile" onClick={this.handleClick} style={{ backgroundColor: scheme[1] }}>
                    <div className="GameTitle">
                        game #{this.props.game.id}: {this.props.game.host} vs {this.props.game.opponent}
                    </div> 
                    <div className="GameStatus">
                        game status: {scheme[0]}
                    </div>
                </div>
            </div>
        );
    }
}

export default GamePanel;