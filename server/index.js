import { WebSocketServer } from 'ws';

// const wss = new WebSocketServer({ port: 8080 });
const wss = new WebSocketServer({ port: 5500 });

wss.on('connection', (ws) => {
    console.log('New client is connected.');
    ws.on('error', console.error);

    ws.on('message', message => {
        try {
            const data = JSON.parse(message);
            console.log(`Client has send data: ${data}`);
        } catch (err) {
            console.log(`Something went wrong with the message: ${err.message}`);
        }
    });

    ws.send(`Message from the server: `);
});