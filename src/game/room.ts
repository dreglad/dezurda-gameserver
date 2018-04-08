import { Room, nosync } from "colyseus";
import Player from './player'
import State from './state'
import config from './config'


export class DezurdaRoom extends Room<State> {
    maxClients = 2; 

    onInit (options) {
        console.log("Room.onInit() with options,", options);
        this.setState(new State());
    }

    requestJoin (options, isNew?: boolean) {
        console.log("Room.requestJoin. isNew:", isNew)
        return true
    }

    onJoin (client, options) {
        console.log("Room.onJoin(", client.sessionId, ')');
        this.state.createPlayer(client.sessionId);
    }

    onLeave (client) {
        console.log("Room.onLeave((", client.sessionId, ')');
        this.state.removePlayer(client.sessionId);
    }

    onMessage (client, data) {
        console.log("Room.onMessage(", client.sesisonId, ",", data, ')');
        this.state.executeTurn(client.sessionId, data);
    }

    onDispose () {
        console.log("Dispose Room");
    }

}
