import React from 'react';
import "antd/dist/antd.css";
import { Form, Input, Button } from 'antd';
import '../css/LoginPage.css';
import { gameT, userT } from '../Types';
import { postBody } from '../utils/Tools';
import { io } from "socket.io-client";

type LoginPagePropsT = {
    show: boolean,
    user: userT,
    serverURL: String,
    socket: any,
    setCurrentUser: (user: userT) => void,
    setSocket: (socket: any | null) => void,
    setData: (dataObject: any | null) => void
};

type LoginPageStateT = {
    loading: boolean, //useless
    isSignupError: boolean,
    isLoginError:boolean
};

class LoginPage extends React.Component<any, LoginPageStateT>{
    constructor(props: LoginPagePropsT) {
        super(props);
        this.state = {
          loading: false,
          isSignupError: false,
          isLoginError: false
        };
    }

    connectWebSocket = ( username : string ) => {
        this.props.setSocket( io(this.props.serverURL) );

        this.props.socket.on('online', ( message ) => {
            console.log("GOT ONLINE REQ");
            this.props.setData( { online: JSON.parse(message) });
        })

        this.props.socket.on('update', ( message ) => {
            console.log("GOT UPDATE REQ");
            if(message[0] === '+'){
                //add user when +
                let newOnline = this.props.data.online;
                newOnline.push( message.substring(1) );
                this.props.setData( { online: newOnline });
            } else {
                //remove user when -
                let newOnline = this.props.data.online;
                var i = newOnline.indexOf( message.substring(1) );
                newOnline.splice(i, 1);
                this.props.setData( { online: newOnline });
            }
        })

        this.props.socket.on('playerHistory', ( message ) => {
            message = JSON.parse(message);
            console.log(message);
            
            let history: gameT[];
            history = [];
            for( const game of message.history ){
                history.push( new gameT(game.id, game.host, game.opponent, game.state) );
            }
            this.props.setCurrentUser( new userT(
                username,
                history
            ));
        })

        this.props.socket.on('newgame', ( message ) => {
            console.log("GOT NEWGAME REQ");
            let gameObject = JSON.parse(message);
            console.log(gameObject);
            let newGameHistory = this.props.user.history
            newGameHistory.push( new gameT(gameObject.id, gameObject.host, gameObject.opponent, gameObject.state) );
            this.props.setCurrentUser( new userT(
                this.props.user.name,
                newGameHistory
            ));
        })
    }

    onSignup = ( values : any ) => {
        console.log(values);
        ( async ()=>{
            let res = await postBody("signup",values);
            if( res.status === 200 ){
                this.props.setCurrentUser( new userT(values.username, []) );
                this.connectWebSocket(values.username);
            } else {
                this.setState({
                    isSignupError: true
                })
            }
        })();
    }

    onLogin = ( values : any ) => {
        console.log(values);
        ( async ()=>{
            let res = await postBody("login",values);
            if( res.status === 200 ){
                this.props.setCurrentUser( new userT(values.username, []) );
                this.connectWebSocket(values.username);
            } else {
                this.setState({
                    isLoginError: true
                })
            }
        })();
    }

    onError = ( err : any ) => {
        console.log('Error:', err);
    }

    renderSignupErrorMessage(){
        if( this.state.isSignupError ){
            return (
                <div className="errorText">
                    this username is already taken
                </div>
            );
        }
    }

    renderLoginErrorMessage(){
        if( this.state.isLoginError ){
            return (
                <div className="errorText">
                    username or password is incorrect
                </div>
            );
        }
    }

    render(){
        if (!this.props.show) {
            return (<></>);
        }

        return(
        <div>
            <div className="title"> CheckersOnline </div>
            <div className="subtitle"> Simple webapp by Krzysztof Borowski </div>
            <div className="container">
                <div> 
                <div className="sectionName"> Sign up!</div>
                <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                initialValues={{ remember: true }}
                onFinish={this.onSignup}
                onFinishFailed={this.onError}
                >

                    <Form.Item
                    label="Username"
                    name="username"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                    <Input />
                    </Form.Item>

                    <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                    <Input.Password />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        Sign up
                    </Button>
                    </Form.Item>

                    {this.renderSignupErrorMessage()}
                </Form>  
                </div>
                <div> 
                <div className="sectionName"> Login!</div>
                <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                initialValues={{ remember: true }}
                onFinish={this.onLogin}
                onFinishFailed={this.onError}
                >

                    <Form.Item
                    label="Username"
                    name="username"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                    <Input />
                    </Form.Item>

                    <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                    <Input.Password />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        Login
                    </Button>
                    </Form.Item>
                    {this.renderLoginErrorMessage()}
                </Form>  
                </div>
            </div>
        </div>
        )
    }
}

export default LoginPage;