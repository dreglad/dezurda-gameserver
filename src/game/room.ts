import { Room, nosync } from "colyseus";
import Player from './player'
import State from './state'
import config from './config'
const console = require('better-console');
const print = require('print');


export class DezurdaRoom extends Room<State> {
    maxClients = 2;

    onInit (options) {
        console.log("Room.onInit(), options:", options);
        this.setState(new State());
    }

    requestJoin (options, isNew?: boolean) {
        // print.out("Room.requestJoin(), isNew:", isNew, ', options:', options)
        // Ensure clientId is correctly passed
        return !!options.clientId
    }

    onJoin (client, options) {
        console.debug("Room.requestJoin(), sessionID:", client.sessionId, ', options:', options);
        console.log("State before join:", print(this.state));
        this.state.createPlayer(client.sessionId);
        console.log("State after join:", print(this.state));
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
