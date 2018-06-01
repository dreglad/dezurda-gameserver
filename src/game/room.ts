import { Room, nosync } from "colyseus";
import Player from './player'
import State from './state'
const console = require('better-console');
const print = require('print');


export class DezurdaRoom extends Room<State> {
    maxClients = 2;

    delayed = null;

    onInit (options) {
        console.log("Room.onInit(), options:", options);
        this.setState(new State());

        this.delayed = this.clock.setInterval(() => {
            if (Object.keys(this.state.players).length == 2) {
                console.log('Player turn expired!!!');
                this.state.turns++;
            } else {
                console.log('Timeout skipped')
            }
        }, 30000);
    }

    requestJoin (options, isNew?: boolean) {
        // Ensure clientId is correctly passed
        return !!options.clientId
    }

    onJoin (client, options) {
        console.debug("Room.onJoin(), sessionID:", client.sessionId, ', options:', options);
        this.state.createPlayer(client.sessionId);
        this.delayed.reset();
    }

    onLeave (client) {
        console.log("Room.onLeave(), client:", client.sessionId);
        this.state.removePlayer(client.sessionId);
    }

    onMessage (client, data) {
        console.log("Room.onMessage(), client:", client.sessionId, ", data:", data);
        this.state.executeTurn(client.sessionId, data, this.delayed);
    }

    onDispose () {
        console.log("Room.onDispose()");
    }
}
