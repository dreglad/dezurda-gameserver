import { Room, nosync } from "colyseus";
import Player from './player'
import State from './state'
const console = require('better-console');
const print = require('print');


export class DezurdaRoom extends Room<State> {
    maxClients = 2;

    onInit (options) {
        console.log("Room.onInit(), options:", options);
        this.setState(new State());
    }

    requestJoin (options, isNew?: boolean) {
        // Ensure clientId is correctly passed
        return !!options.clientId
    }

    onJoin (client, options) {
        console.debug("Room.onJoin(), sessionID:", client.sessionId, ', options:', options);
        this.state.createPlayer(client.sessionId);
    }

    onLeave (client) {
        console.log("Room.onLeave(), client:", client.sessionId);
        this.state.removePlayer(client.sessionId);
    }

    onMessage (client, data) {
        console.log("Room.onMessage(), client:", client.sessionId, ", data:", data);
        this.state.executeTurn(client.sessionId, data);
    }

    onDispose () {
        console.log("Room.onDispose()");
    }
}
