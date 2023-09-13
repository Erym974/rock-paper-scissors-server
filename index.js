const express = require('express')
const app = express()
const http = require('http')
const { Server } = require("socket.io");
const cors = require('cors');

const fs = require('fs');

app.use(cors())

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://127.0.0.1:5173',
        methods: ['GET', 'POST']
    },
});

const events = fs.readdirSync(__dirname + '/events').map((file) => file.replace('.js', ''));

const Rooms = [];

io.on('connection', async (socket) => {
    events.forEach(eventName => {
        let event = require(__dirname + `/Events/${eventName}.js`);
        socket.on(eventName, (payload) => {
            event.exec(io, socket, payload, Rooms)
        })
    })
})

server.listen(3001, () => {
    console.log('listening on *:3001');
})