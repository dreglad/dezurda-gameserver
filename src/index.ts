import * as path from 'path';
import * as express from 'express';
import { createServer } from 'http';
import { Server, RedisPresence } from 'colyseus';

import { DezurdaRoom } from "./game/room";

const port = Number(process.env.APP_PORT || 2657);
const app = express();

// Attach WebSocket Server on HTTP Server.
const gameServer = new Server({
    server: createServer(app),
    presence: new RedisPresence({ host: process.env.REDIS_HOST || 'redis' })
});

// Register game room
gameServer.register("dezurda", DezurdaRoom);

app.use(express.static(path.join(__dirname, "client")));

gameServer.listen(port);

console.log(`Listening on http://${process.env.LISTEN_HOSTNAME || 'localhost'}:${ port }`);
