module.exports = {
    exec: (io, socket, payload, rooms) => {
        
        rooms.forEach(room => {
            if(room.host.id == socket.id || room.player?.id == socket.id) {
                if(room.host.id == socket.id) {
                    io.to(room.player?.id).emit("room-closed");
                } else {
                    io.to(room.host.id).emit("room-closed");
                }
                rooms.splice(rooms.indexOf(room), 1);
                console.log(`Room ${room.id} closed`);
            }
        });

    }
}