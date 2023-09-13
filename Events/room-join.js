module.exports = {
    exec: (io, socket, payload, rooms) => {

        if (rooms.find(room => room.id === payload)) {
            const room = rooms.find(room => room.id === payload);

            console.log(room);

            if(room.host.id == socket.id || room.player?.id == socket.id) return

            if(room.vacant) {
                console.log(`Room ${room.id} joined`);
                room.player = { id: socket.id, select: null };
                room.vacant = false;
                socket.join(payload)
                
                io.to(payload).emit("has-opponent")

            } else {
                console.log(`Room ${room.id} is full`);
            }

        } else {
            const room = { id: payload, host: { id: socket.id, select: null }, player: null, vacant: true };
            console.log(`Room ${room.id} created`);
            socket.join(payload)
            rooms.push(room);
            io.to(payload).emit("room-updated", room);
        }

    }
}