import React from 'react';

class Message extends React.Component<any>{
  render(){
    return (
      <div style={{width:"100%", display: "inline-block"}}>
        <div style={{float:'left', paddingRight: '5px', color: "#00aa00"}}>
            {this.props.message.sender}:
        </div>
        <div style={{float:'left'}}>
            {this.props.message.message}
        </div>
      </div>
    );
  }

}

export default Message;
