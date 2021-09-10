import React from 'react';
import './App.css';
import {gameT, messageT} from "./Types"
import BoardPanel from './components/BoardPanel';
import ChatPanel from './components/ChatPanel';
import "antd/dist/antd.css";
import { Button } from "antd"
import { postBody, postEmpty } from "./utils/Tools"
import { io } from "socket.io-client";

let tempURL = new URL(window.location.toString())
let serverURL = tempURL.origin + '/';
let dev = process.env.NODE_ENV;

type AppStateT = {
  user: string
  gameId: string | null
  game: gameT | null
  chat: messageT[]
  socket: any | null
};

class App extends React.Component<any, AppStateT>{  
  constructor(props: any) {
    super(props);
    this.state = {
      user: "",
      gameId: null,
      game: null,
      chat: [],
      socket: null
    };
  }

  componentDidMount() {
    ( async () => {
      if(dev === 'development'){
        await this.devLogin();
      } else await this.handleSession();
      if(this.state.user === "") return;
      console.log("SESSION/LOGIN DONE!");
      await this.parseGameId();
      if( this.state.gameId === null ) return;
      console.log("PARSING DONE!");
      await this.sendInitPost();
      if(this.state.game === null) return;
      console.log("INIT POST DONE!");
      await this.connectWebSocket();  
      console.log("WEBSOCKET CONNECT DONE!");
    })();
  }

  parseGameId = async ()=> {
    let url = window.location.toString();
    console.log(url);
    let splitUrl = url.split('/');
    console.log(splitUrl);
    let newGameId = null;
    if(splitUrl[3] === "game") newGameId = splitUrl[4]; 
    console.log("GM ID:", newGameId);
    await this.setState({
      gameId: newGameId
    })
    console.log("STATE FIN:", this.state.gameId);
  }

  sendInitPost = async ()=> {
    console.log("BREAKPOINT 1");
    let command =  'game/' + this.state.gameId;
    console.log(command, this.state.gameId);
    let result = await postEmpty(command)
    console.log("result:", JSON.stringify(result));
    if(result === null) return;
    let newGame: gameT = new gameT(
      result.id,
      result.host,
      result.opponent,
      result.state,
      result.move,
      result.board,
      result.last_updated,
      result.data_created
    )
    await this.setState( { game: newGame } );
  }

  handleSession = async () => {
    let result = await postEmpty("session");
    console.log("SESSION RESULT:", result);
    if(result === null) return;
    await this.setState({ user: result.username })
    console.log("USERNAME:", this.state.user);
  }
  
  connectWebSocket = async () => {
    let socket = io(serverURL + 'game');

    socket.on("chatMessage", (message)=>{
      let msgObject = JSON.parse(message);
      let newChat = this.state.chat;
      newChat.push( new messageT(msgObject.sender, msgObject.message) );
      this.setState( { chat: newChat } );
    })

    socket.on("gameUpdate", (gameObjectJSON)=>{
      let gameObject = JSON.parse(gameObjectJSON);
      this.setGame(gameObject);
    })

    socket.on("gameFinish", (gameResult)=>{
      let newGame: gameT = this.state.game
      newGame.state = gameResult
      this.setGame(newGame);
    })

    await this.setState( { 
      socket: socket
    } );
  }

  setGame = (gameObject: gameT) => {
    this.setState({
      game: gameObject
    })
  }

  devLogin = async () => {    
    let url = window.location.toString();
    let splitUrl = url.split('/');
    if( splitUrl.length > 5){
      await postBody("login",{
        username: 'Krzychu',
        password: '1234'
      });
      await this.setState({ user: "Krzychu" })
    } else {
      await postBody("login",{
        username: 'Piter',
        password: '1234'
      });
      await this.setState({ user: "Piter" })
    }
  }

  renderErrorMessage(){
    return (
      <>
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
          <div className="noGameTitle">
            Oh no! There is nothing for you!
          </div>
          <div className="noGameText">
            Go back to the main menu to find a game
          </div>
          <Button 
          size="large" 
          type="primary" 
          style={{fontSize:"4em", height: "auto", margin: "15px", lineHeight: "normal"}}
          href={serverURL}
          >
            Go to menu
          </Button>
        </div>
      </>
    )
  }

  render(){
    if( this.state.gameId === null ) { 
      console.log("GAMEID NULL!")
      return this.renderErrorMessage()
    }
    if( this.state.game === null ) { 
      console.log("GAME OBJECT NULL!")
      return this.renderErrorMessage() 
    }
    return (
      <>
        <div className="HorizontalPlaceholder">
          <div/>
          
          <div>
            <div className="VerticalPlaceholder">
              <div>
                <BoardPanel 
                key="bp0"
                user={this.state.user}
                socket={this.state.socket} 
                game={this.state.game}
                setGame={this.setGame}
                serverURL={serverURL}
                />
              </div>
              <div>
                <ChatPanel
                key="cp0" 
                socket={this.state.socket} 
                chat={this.state.chat}
                serverURL={serverURL}
                />
              </div>
            </div>
          </div>

          <div/>
        </div>
      </>
    );
  }

}

export default App;
