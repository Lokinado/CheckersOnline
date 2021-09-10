import React from 'react';
import '../css/ChatPanel.css';
import { messageT } from "../Types"
import { Input } from 'antd';
import Message from './Message';

const { TextArea } = Input;

type ChatPanelProps = {
  socket: any | null,
  chat: messageT[],
  serverURL: string
};

type ChatPanelStateT = {
  value: string
};

class ChatPanel extends React.Component<any, ChatPanelStateT>{
  constructor(props: ChatPanelProps) {
    super(props);
    this.state = {
      value: ""
    };
  }

  changeValue = (event)=> {
    this.setState({
      value: event.target.value
    })
  }

  sendMessage = (event)=> {
    event.preventDefault()
    this.props.socket.emit("sendMessage", this.state.value);
    this.setState({
      value: ""
    })
  }

  renderMessage( message: messageT, index: Number ){
    return (
      <div key={"message"+index.toString()}>
        <Message  message={message}/>
      </div>
    )
  }

  renderChat(){
    let ret = [];
    for( const [ index, message ] of this.props.chat.entries() ){
      ret.push( this.renderMessage(message, index) );
    }
    return ret;
  }

  render(){
    if(this.props.socket === null) return ( <></> )
    return (
      <>
        <div className="ChatPanel">
          CHAT
          <div className="scrollableBox">
              {this.renderChat()}
          </div>
          <div>
            <TextArea
            onPressEnter={this.sendMessage}
            value={this.state.value}
            onChange={ this.changeValue }
            placeholder="Aa"
            autoSize={{ minRows: 1, maxRows: 2 }}
            />
          </div>
        </div>
      </>
    );
  }

}

export default ChatPanel;
