import { Room, nosync } from "colyseus";
import Player from './player'
import State from './state'
import config from './config'


export class DezurdaRoom extends Room<State> {
    maxClients = 2;

    // requestJoin (options, isNewRoom: boolean) {
    //     console.log(options)
    //     return isNewRoom || this.clients.length > 0;
    // }

    onInit (options) {
        console.log("StateHandlerRoom created!", options);
        this.setState(new State());
    }

    onJoin (client, options) {
        console.log('Joined');
        this.state.createPlayer(client.sessionId);
    }

    onLeave (client) {
        this.state.removePlayer(client.sessionId);
    }

    onMessage (client, data) {
        console.log("StateHandlerRoom received message from", client.sessionId, ":", data);
        this.state.movePlayer(client.sessionId, data);
    }

    onDispose () {
        console.log("Dispose StateHandlerRoom");
    }

}
