import { Room, nosync } from "colyseus";
import Player from './player'
import State from './state'
import config from './config'


export class DezurdaRoom extends Room<State> {
    maxClients = 2; 

    onInit (options) {
        console.log("Room.onInit(), options:", options);
        this.setState(new State());
    }

    requestJoin (options, isNew?: boolean) {
        console.log("Room.requestJoin(), isNew:", isNew, ', options:', options)
        // Ensure clientId is correctly passed
        return !!options.clientId
    }

    onJoin (client, options) {
        console.log("Room.requestJoin(), sessionID:", client.sessionId, ', options:', options);
        console.log("State before join:", this.state);
        this.state.createPlayer(client.sessionId);
        console.log("State after join:", this.state);
    }

    onLeave (client) {
        console.log("Room.onLeave(), client:", client);
        this.state.removePlayer(client.sessionId);
    }

    onMessage (client, data) {
        console.log("Room.onMessage(), client:", client, ", data:", data);
        this.state.executeTurn(client.sessionId, data);
    }

    onDispose () {
        console.log("Room.onDispose()");
    }
}
