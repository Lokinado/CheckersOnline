import React from 'react';
import '../css/BoardPanel.css';
import {gameT, pawnId} from "../Types"
import { Button } from "antd"
import BoardPawn from './BoardPawn';

type BoardPanelStateT = {
  pawnSize: Number
  selectedPawn: pawnId | null
  hideEndOverlay: boolean
};

type BoardPanelPropsT = {
  game: gameT | null
  socket: any | null
  user: string
  serverURL: string
  setGame: (gameObject: gameT) => void
}

class BoardPanel extends React.Component<any, BoardPanelStateT>{
  onBoardColor: number
  constructor(props: BoardPanelPropsT) {
    super(props);
    this.state = {
      pawnSize: this.calculatePawnSize(),
      selectedPawn: null,
      hideEndOverlay: false
    };
    this.handleResize = this.handleResize.bind(this);
    this.setSelectedPawn = this.setSelectedPawn.bind(this);
    this.setHide = this.setHide.bind(this);
  }

  handleResize() {
    this.setState({
      pawnSize: this.calculatePawnSize()
    })
  }

  setSelectedPawn( pawnId: pawnId | null ){
    this.setState({
      selectedPawn: pawnId
    });
  }

  componentDidMount = () => {
    window.addEventListener('resize', this.handleResize)
  }

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.handleResize);
  }

  calculatePawnSize(){
    //calculations based on css
    let width = window.innerWidth * 0.98;
    let height = window.innerHeight *0.98;
    let boardWidth = ( width * 2 ) / 3;
    let boardHeight = ( height * 3) / 5;
    let pawnSize = Math.min(boardWidth, boardHeight) / 8;
    return pawnSize;
  }

  renderPawn = (x: number, y: number, pawn: any) => {
    return (
      <BoardPawn 
      key={"tile"+x.toString()+":"+y.toString()}
      state={pawn} 
      pawnSize={this.state.pawnSize} 
      pawnId={new pawnId(x,y)}
      gameId={this.props.game.id}
      selectedPawn={this.state.selectedPawn}
      setSelectedPawn={this.setSelectedPawn}
      currentPlayer={this.onBoardColor}
      move={this.props.game.move}
      setGame={this.props.setGame}
      board={this.props.game.board}
      gameState={this.props.game.state}
      />
    )
  }

  renderRow = (y: number, row: any) => {
    let ret = [];
    let board = this.props.game.board[y];
    if(this.onBoardColor === 1){
      for( const [x, pawn] of row.entries() ){
        ret.push( this.renderPawn(x, y, pawn) )
      }
    } else {
      for( let i = board.length - 1; i >= 0 ; i-- ){
        ret.push( this.renderPawn(i, y, board[i]) )
      }      
    }
    return (
      <div key={"row"+y.toString()} style={{lineHeight: "0",whiteSpace: "nowrap"}}>
        {ret}
      </div>
    )
  }

  renderBoard = () => {
    let ret = []
    let board = this.props.game.board;
    if(this.onBoardColor === 1){
      for( const [y ,row] of board.entries() ){
        ret.push(this.renderRow(y, row))
      }
    } else {
      for( let i = board.length - 1; i >= 0 ; i-- ){
        ret.push(this.renderRow(i, board[i]))
      }
    }
    return ret
  }

  setHide(){
    this.setState({
      hideEndOverlay: true
    })
  }

  isWon(): boolean{
    let isHost:boolean = (this.props.game.host === this.props.user)
    let isLostByHost:boolean = Boolean(this.props.game.state)

    return (isHost !== isLostByHost)
  }

  renderTitle(){
    if(this.props.game.state === 3) return "Draw!"
    if(this.isWon()){
      return "You Won!"
    } else {
      return "You Lost"
    }
  }
  
  renderGameEndOverlay(){
    if(this.props.game.state === 2) return <></>
    if(this.state.hideEndOverlay) return <></>
    return (
        <div 
        style={{
            position: "absolute", 
            top: "20%", 
            left: "0", 
            width: "100vw", 
            height: "50vh", 
            textAlign: "center",
            backgroundColor: "rgba(30,30,30,0.8)"}}
        >
          <div className="endGameTtile">
            {this.renderTitle()}
          </div>
          <div className="endGameSubText">
            Check other your games in the main menu 
          </div>
          <Button 
          size="large" 
          type="primary" 
          style={{fontSize:"2em", height: "auto", margin: "15px", lineHeight: "normal"}}
          href={this.props.serverURL}
          >
            Go to menu
          </Button>
          
          <Button
          size="large" 
          type="default" 
          style={{fontSize:"2em", height: "auto"}} 
          onClick={this.setHide}
          >
            close
          </Button>
        </div>
    )
  }

  render(){
    if(this.props.game === null) return (<></>)
    if(this.props.user === null) return (<></>)
    this.onBoardColor = ( (this.props.game.host === this.props.user) ? 1 : 2 )
    return (
      <>
        <div className="boardPlaceholder">
          <div>
            {this.renderBoard()}
          </div>
        </div>
        {this.renderGameEndOverlay()}
      </>
    );
  }

}

export default BoardPanel;