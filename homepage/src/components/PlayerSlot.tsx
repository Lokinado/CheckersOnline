import React from 'react';
import '../css/PlayerSlot.css';
import { postBody } from '../utils/Tools';

type PlayerSlotStateT = {
};

class PlayerSlot extends React.Component<any,PlayerSlotStateT>{

    sendCreateGameRequest = () => {
        postBody("creategame",{
            opponent: this.props.name
        });
    }

    render(){
        if( this.props.empty ){
            return (
                <>
                    <div className="empty">
                        There are no players available
                    </div>
                </>
            );
        }

        if( this.props.user.name === this.props.name){
            return (<></>);
        }

        return (
            <div>
                <div className="name" onClick={this.sendCreateGameRequest}> 

                {this.props.name} 
                
                </div>
            </div>
        );
    }
}

export default PlayerSlot;