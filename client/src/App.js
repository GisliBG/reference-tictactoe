import React from 'react';
import _ from 'lodash';

import logo from './logo.svg';
import './App.css';

export default function(injected){
    const ConnectedClients = injected("ConnectedClients");
    const ConnectedUsers = injected("ConnectedUsers");
    const Chat = injected("Chat");

    class App extends React.Component {
        render() {
            return (
                <div className="App">
                    <div className="App-header">
                        <img src={logo} className="App-logo" alt="logo"/>
                        <h2>Welcome to HGOP 2016 base app</h2>
                    </div>

                    <ConnectedClients></ConnectedClients>

                    <Chat></Chat>

                    <ConnectedUsers></ConnectedUsers>

                    <div className="App-footer">
                        <small>You are running this application in <b>{process.env.NODE_ENV}</b> mode.</small>
                    </div>
                </div>
            );
        }
    }
    return App;
};