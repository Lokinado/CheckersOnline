import React from 'react';
import { Layout } from 'antd';
import '../css/PlayersPanel.css';
import {gameT, userT} from "../Types"
import { postEmpty } from '../utils/Tools';
import PlayerSlot from './PlayerSlot';
import GamePanel from './GamePanel';

const { Header, Content, Sider } = Layout;

type PlayersPanelPropsT = {
    show: boolean
    user: userT
    socket: any
    data: any
    serverURL: string
    setCurrentUser: (user: userT | null) => void
    setSocket: (socket: any | null) => void
};

type PlayersPanelStateT = {
    loading: boolean //useless
};

class PlayersPanel extends React.Component<any, PlayersPanelStateT>{
    constructor(props: PlayersPanelPropsT) {
        super(props);
        this.state = {
          loading: false
        };
    }

    logOut = () => {
        postEmpty("logout");
        this.props.setCurrentUser( null );
        this.props.socket.disconnect();
        this.props.setSocket(null);
    }

    renderUser = (name: string, index: number) => {
        return (
            <PlayerSlot key={index.toString()} name={name} user={this.props.user}/>
        );
    }

    renderGame = (game: gameT, index: number) => {
        return (
            <GamePanel key={index.toString()} game={game} user={this.props.user.name} serverURL={this.props.serverURL}/>
        );
    }


    renderUsers = () => {
        let ret = []

        if(this.props.data.online.length <= 1 ){
            return(
                <PlayerSlot key={"nouser"} empty/>
            )
        }

        for( const [index, player] of this.props.data.online.entries() ){
            ret.push( this.renderUser(player, index) );
        }
        return ret;
    }

    renderGames = () => {
        let ret = []

        if(this.props.user.history.length === 0){
            return (
                <GamePanel key={"nogame"} empty/>
            )
        }

        for( const [index, game] of this.props.user.history.entries() ){
            ret.push( this.renderGame(game, index) );
        }
        return ret;
    }

    render(){
        if (!this.props.show) {
            return (<></>);
        }

        return (
            <div key={"main"}>
                <Layout style={{ minHeight: '100vh' }}>
                    <Sider collapsible collapsed={false} onCollapse={this.logOut}>
                        <div className="PlayerPanelTitle">CheckersOnline</div>
                        <div style={{overflowY: "auto", maxHeight: "75vh"}}>
                            {this.renderUsers()}
                        </div>
                    </Sider>
                    <Layout className="site-layout">
                        <Header className="site-layout-background" style={{ padding: 0 }}>
                        <div className="WelcomeMessage"> user: {this.props.user.name}</div>
                        </Header>
                        <Content style={{ margin: '0 16px' }}>
                        <div className="site-layout-background" style={{ padding: 24, minHeight: '100%', backgroundColor: 'white', overflowY: "auto", maxHeight: "60vh"}}>
                            <div className="SectionTitle"> Your Games </div>
                            {this.renderGames()}
                        </div>
                        </Content>
                    </Layout>
                </Layout>
            </div>
        )
    }
}

export default PlayersPanel;