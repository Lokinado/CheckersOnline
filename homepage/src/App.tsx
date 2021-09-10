import React from 'react';
import './App.css';
import "antd/dist/antd.css";
import LoginPage from './components/LoginPage';
import PlayersPanel from './components/PlayersPanel';
import {gameT, userT, dataT} from "./Types"
import { io } from "socket.io-client";
import { postBody, postEmpty } from './utils/Tools';
import { Spin } from 'antd';

let tempURL = new URL(window.location.toString())
let serverURL = tempURL.origin + '/';
let dev = process.env.NODE_ENV;

type AppStateT = {
  loading: boolean
  user: userT | null
  socket: any | null
  data: dataT
};

class App extends React.Component<any, AppStateT>{
  constructor(props: any) {
    super(props);
    this.state = {
      loading: true,
      user: null,
      socket: null,
      data: new dataT()
    };
    this.setCurrentUser = this.setCurrentUser.bind(this);
    this.setSocket = this.setSocket.bind(this);
    this.setData = this.setData.bind(this);
  }

  componentDidMount() {
    ( async () => {
      if(dev === 'development'){
        await this.devLogin();
      } else await this.handleSession();
      if(this.state.user === null) return
      await this.connectWebSocket(this.state.user.name);  
    })();
    this.setState({loading: false})
  }

  handleSession = async () => {
    let result
    result = await postEmpty("session");
    if( result === null ) return
    let user: userT = new userT(result.username, [])
    await this.setState({ user: user })
  }

  devLogin = async () => {    
    let url = window.location.toString();
    let splitUrl = url.split('/');
    if( (splitUrl.length > 3) && (splitUrl[3] !== "game") && (splitUrl[3] !== "")){
      await postBody("login",{
        username: 'Krzychu',
        password: '1234'
      });
      let user: userT = new userT("Krzychu", []);
      await this.setState({ user: user })
      
    } else {
      await postBody("login",{
        username: 'Piter',
        password: '1234'
      });
      let user: userT = new userT("Piter", []);
      await this.setState({ user: user })
    }
  }

  connectWebSocket = async ( username : string ) => {
    let socket = io(serverURL)
    await this.setState( { socket: socket } )

    socket.on('online', ( message ) => {
        this.setData( { online: JSON.parse(message) });
    })

    socket.on('update', ( message ) => {
        if(message[0] === '+'){
            let newOnline = this.state.data.online;
            newOnline.push( message.substring(1) );
            this.setData( { online: newOnline });
        } else {
            let newOnline = this.state.data.online;
            var i = newOnline.indexOf( message.substring(1) );
            newOnline.splice(i, 1);
            this.setData( { online: newOnline });
        }
    })

    socket.on('playerHistory', ( message ) => {
        message = JSON.parse(message);
        
        let history: gameT[];
        history = [];
        for( const game of message.history ){
            history.push( new gameT(game.id, game.host, game.opponent, game.state) );
        }
        this.setCurrentUser( new userT(
            username,
            history
        ));
    })

    socket.on('newgame', ( message ) => {
        let gameObject = JSON.parse(message);
        let newGameHistory = this.state.user.history
        newGameHistory.push( new gameT(gameObject.id, gameObject.host, gameObject.opponent, gameObject.state) );
        this.setCurrentUser( new userT(
            this.state.user.name,
            newGameHistory
        ));
    })
  }

  setCurrentUser = async ( user: userT | null ) => {
    await this.setState({
      user: user
    });
  }

  setSocket = async ( socket: any | null ) => {
    await this.setState({
      socket: socket
    });
  }

  setData = async ( dataObject: any | null ) => {
    await this.setState({
      data: Object.assign(this.state.data , dataObject)
    });
  }

  render(){
    if(this.state.loading){
      return ( 
        <div style={{textAlign: "center"}}>
          <Spin size="large" />
        </div>
      )
    }

    return (
      <div className="App">
        <LoginPage 
        show = {this.state.user === null}
        user = {this.state.user}
        serverURL = {serverURL}
        socket = {this.state.socket}
        data = {this.state.data}
        setCurrentUser = {this.setCurrentUser}
        setSocket = {this.setSocket}
        setData = {this.setData}
        />
        <PlayersPanel
        show = {this.state.user !== null}
        user = {this.state.user}
        socket = {this.state.socket}
        data = {this.state.data}
        setCurrentUser = {this.setCurrentUser}
        setSocket = {this.setSocket}
        serverURL = {serverURL}
        />
      </div>
    );
  }
}

export default App;
