const WebSocket = require('ws');
require('dotenv').config()
const moment = require('moment')

const url = `ws://localhost:${process.env.PORT}`
const ws = new WebSocket(url)

ws.on('open', function open() {
    console.log('connected');
    setInterval(function timeout() {
        console.log('new message', JSON.stringify({ name: 'remind me', time: moment().seconds(0).milliseconds(0).add(1, 'minutes').toISOString() }))
        ws.send(JSON.stringify({ msg: 'remind me', time: moment().seconds(0).milliseconds(0).add(1, 'minutes').toISOString() }));
    }, 1000);
});

ws.on('close', function close() {
    console.log('disconnected');
});

ws.on('message', function incoming(data) {
    console.log(`message: ${data}`);
});