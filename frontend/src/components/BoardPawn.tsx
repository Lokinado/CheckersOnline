import React from 'react'
import { pawnId, gameT } from '../Types';
import '../css/BoardPawn.css';
import { postBody } from '../utils/Tools';

type BoardPawnStateT = {
}

type BoardPawnPropsT = {
    pawnId: pawnId
    gameId: string
    state: Number
    pawnSize: Number
    selectedPawn: pawnId | null
    currentPlayer: number
    move: number
    board: number[][]
    gameState: number
    setSelectedPawn: (pawnId: pawnId | null) => void
    setGame: (gameObject: gameT) => void
}

class BoardPawn extends React.Component<any, BoardPawnStateT>{
    isValid: boolean
    constructor(props: BoardPawnPropsT){
        super(props);
        this.isValid = false;
        this.handleClick = this.handleClick.bind(this);
    }

    renderPawn(){
        if(this.props.state === 0) return;
        let backgroundColor;
        let boxShadow;
        let border;
        let innerText = "";
        let color;

        if(this.props.state % 2 === 1){
            backgroundColor = "white";
            boxShadow = "5px 5px 0px 0px lightGray";
            border = "2px solid #aaaaaa";
            if(this.props.state > 2){
                innerText = "♕"
                color = "lightGray"
            }
        } else {
            backgroundColor = "black"
            boxShadow = "5px 5px 0px 0px darkGray"
            border = "2px solid #888888"
            if(this.props.state > 2){
                innerText = "♛"
                color = "dimgray"
            }
        }

        return (
            <div style={{
                position: "absolute", 
                top: 0, 
                left: 0, 
                width: "90%", 
                height: "90%", 
                borderRadius: "50%", 
                fontSize: 0.85*this.props.pawnSize,
                textAlign: 'center',
                paddingTop: 0.40*this.props.pawnSize,
                paddingLeft: 1,
                color: color,
                backgroundColor: backgroundColor, 
                boxShadow: boxShadow, 
                border: border,
                cursor: 'default'}}
            >
                {innerText}
            </div>
        )
    }

    tryToMovePawn = async () => {
        let result;
        try{
            result = await postBody("move", {
                gameId: this.props.gameId,
                selectedPawn: this.props.selectedPawn,
                clickedPawn: this.props.pawnId
            })  
        } catch(err){
            return;
        }
        if( result.status === 200){
            this.props.setSelectedPawn(null)
        }
    }

    handleClick(){
        if( this.props.gameState !== 2 ) return
        let sp: pawnId | null = this.props.selectedPawn
        let tp: pawnId = this.props.pawnId
        if(sp === null){
            this.props.setSelectedPawn(tp)
            return
        }

        if(tp.isEqual(sp)){
            this.props.setSelectedPawn(null)
            return
        }

        this.tryToMovePawn()
    }

    Overlay(){
        this.isValid = true;
        return (
            <div 
            style={{
                position: "absolute", 
                top: "50%", 
                left: "50%", 
                width: "30%", 
                height: "30%", 
                borderRadius: "50%", 
                marginLeft:"-15%",
                marginTop:"-15%",
                backgroundColor: "rgba(180,180,180,0.45)"}}
            />
        )
    }

    renderOverlay(){
        if( this.props.gameState !== 2 ) return (<></>)
        this.isValid = false;
        let sp: pawnId | null = this.props.selectedPawn
        let tp: pawnId = this.props.pawnId
        let moveDirection = (this.props.currentPlayer === 1) ? 1 : -1;

        if(this.props.move !== this.props.currentPlayer) return (<></>)

        if(sp === null) return (<></>)

        if(tp.isEqual(sp)) return this.Overlay();

        if( this.props.board[sp.y][sp.x] <= 2 ){
            let a = sp.x-tp.x;
            let b = sp.y-tp.y;
            if( a*a + b*b === 2 ){  
                if(this.props.state === 0){
                    if( b === moveDirection ) 
                        return this.Overlay();          
                } 
            }    
            if( this.checkEncounterForNormalPawn() ) return this.Overlay();
        } else {
            if(this.props.state !== 0) return <></>;
            if( sp.x === tp.x ) return this.Overlay(); 
            else if( sp.y === tp.y ) return this.Overlay();
        }

        return(<></>)
    }

    checkEncounterForNormalPawn(){
        let sp: pawnId | null = this.props.selectedPawn
        let tp: pawnId = this.props.pawnId
        let a = sp.x-tp.x;
        let b = sp.y-tp.y;
        let moveDirection = (this.props.currentPlayer === 1) ? 1 : -1;
        if( a*a + b*b === 8 ){  
            if( b !== 2*moveDirection ) return false;
            if( this.props.state !== 0) return false;
            let sr: pawnId;
            sr = new pawnId( (sp.x + tp.x)/2, (sp.y + tp.y)/2 );
            if( this.props.board[sr.y][sr.x] === 0 ) return false;
            if( this.props.board[sr.y][sr.x] % 2 !== this.props.currentPlayer % 2)
                return true;
        }
        return false;
    }

    isPressable(){
        if( this.props.gameState !== 2 ) return false 
        let sp: pawnId | null = this.props.selectedPawn
        let tp: pawnId = this.props.pawnId
        let moveDirection = (this.props.currentPlayer === 1) ? 1 : -1;

        if(this.props.move !== this.props.currentPlayer) return false;
        if(tp.isEqual(sp)) return true

        if(sp !== null){
            if(this.props.board[sp.y][sp.x] <= 2){
                let a = sp.x-tp.x;
                let b = sp.y-tp.y;
                if( a*a + b*b === 2 ){  
                    if(this.props.state === 0) 
                        if( b === moveDirection ) {
                            return true
                        }
                }
                if( this.checkEncounterForNormalPawn() ) return this.Overlay();
            } else {
                if(this.props.state !== 0) return false;
                if( sp.x === tp.x ) return true
                else if( sp.y === tp.y ) return true;
            }
        } else {
            if( this.props.state === 0 ) return false
            if( this.props.state % 2 === this.props.move % 2) return true
        }

        return false
    }

    boardColoringLogic(): boolean{
        let isXEven = (this.props.pawnId.x % 2);
        let isYEven = (this.props.pawnId.y % 2);
        return (isXEven !== isYEven) //xor
    }

    render(){
        let backgroundColor = "white"
        if( this.boardColoringLogic() ) backgroundColor = "#355E3E";
        let sizeString = this.props.pawnSize.toString() + 'px'
        return(
            <>
                <div 
                onClick={ (this.isPressable()) ? this.handleClick : null }
                className={ (this.isPressable()) ? 'pressable' : null } 
                style={{
                width: sizeString,
                height: sizeString,
                backgroundColor: backgroundColor, 
                position:"relative", 
                display: "inline-block", 
                border: "1px solid black" }}>
                    {this.renderPawn()}
                    {this.renderOverlay()}
                </div>
            </>
        )
    }
}

export default BoardPawn;