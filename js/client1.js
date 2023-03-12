import WebSocket from "ws";

// const ws = new WebSocket('ws://localhost:8080/');
const ws = new WebSocket('ws://localhost:5500/'); // With Live Server
//Трябва да се разкоментира в index.html !!!

ws.on('open', async () => {
  console.log('We are connected.');
  let response = await fetch('../input1.json');
  let data = await response.json();
  ws.send(JSON.stringify(data));
});

ws.on('error', console.error);

ws.on('message', (message) => {
  try {
    const data = JSON.parse(message);
    console.log(data);
  } catch (err) {
    console.log(`Something went wrong with the message: ${err.message}`);
  }
});
