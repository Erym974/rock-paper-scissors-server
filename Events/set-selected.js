module.exports = {
    exec: (io, socket, payload, rooms) => {

        if (rooms.find(room => room.id === payload.id)) {
            const room = rooms.find(room => room.id === payload.id);

            if(socket.id == room.host.id) {
                room.host.select = payload.selected;
            } else {
                room.player.select = payload.selected;
            }

            if(room.host?.select && room.player?.select) {

                io.to(room.id).emit("start-game");
                
                let timer = 3;

                const interval = setInterval(() => {
                    io.to(room.id).emit("set-timer", timer);
                    timer--;

                    if(timer < 0) {
                        clearInterval(interval);

                        const host = room.host.select;
                        const player = room.player.select;

                        io.to(room.host.id).emit("set-opponent", room.player.select);
                        io.to(room.player.id).emit("set-opponent", room.host.select);

                        switch (true) {
                            case host === 1 && player === 2:
                              io.to(room.host.id).emit("set-result", "loose");
                              io.to(room.player.id).emit("set-result", "won");
                              break;
                            case host === 1 && player === 3:
                              io.to(room.host.id).emit("set-result", "won");
                              io.to(room.player.id).emit("set-result", "loose");
                              break;
                            case host === 2 && player === 1:
                              io.to(room.host.id).emit("set-result", "won");
                              io.to(room.player.id).emit("set-result", "loose");
                              break;
                            case host === 2 && player === 3:
                              io.to(room.host.id).emit("set-result", "loose");
                              io.to(room.player.id).emit("set-result", "won");
                              break;
                            case host === 3 && player === 1:
                              io.to(room.host.id).emit("set-result", "loose");
                              io.to(room.player.id).emit("set-result", "won");
                              break;
                            case host === 3 && player === 2:
                              io.to(room.host.id).emit("set-result", "won");
                              io.to(room.player.id).emit("set-result", "loose");
                              break;
                            default:
                                io.to(room.id).emit("set-result", "equality")
                                break;
                        }
                    }
                }, 1000);

            }

        }

    }
}