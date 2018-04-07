import * as path from 'path';
import * as express from 'express';
import * as serveIndex from 'serve-index';
import { createServer } from 'http';
import { Server } from 'colyseus';

import { DezurdaRoom } from "./game/room";

const port = Number(process.env.PORT || 2657);
const app = express();

// Attach WebSocket Server on HTTP Server.
const gameServer = new Server({
    server: createServer(app)
});

// Register game room
gameServer.register("dezurda", DezurdaRoom);

app.use(express.static(path.join(__dirname, "static")));
app.use('/', serveIndex(path.join(__dirname, "static"), {'icons': true}))

gameServer.listen(port);
console.log(`Listening on http://localhost:${ port }`);
