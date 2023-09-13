module.exports = {
    exec: (io, socket, payload, rooms) => {

        if (rooms.find(room => room.id === payload.id)) {
            const room = rooms.find(room => room.id === payload.id);
            room.host.select = null;
            if(room.player) room.player.select = null;

            io.to(room.id).emit("game-restart");
        }

    }
}