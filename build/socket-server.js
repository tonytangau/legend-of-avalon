var _ = require('lodash');

var findUser = function (users, socketId) {
    return users.find((user) => user.id === socketId);
}

var findUsername = function (users, socketId) {
    let user = findUser(users, socketId);

    return user ? user.name : '';
}

var allUserReady = function (users) {
    return _.every(users, (user) => user.isReady) && users.length > 1;
}

var setupServer = function (io) {
    io.activeUsers = [];

    io.on('connection', function (socket) {
        socket.on('chat', function (msg) {
            let name = findUsername(io.activeUsers, socket.id);

            io.emit('chat', {
                text: msg.text,
                user: name
            });
        });

        socket.on('changeName', function (name) {
            io.activeUsers.push({
                id: socket.id,
                name: name
            });
            //console.log(JSON.stringify(io.activeUsers))

            socket.broadcast.emit('status', `New user "${name}" connected`);
        });

        socket.on('isReady', function () {
            let user = findUser(io.activeUsers, socket.id);

            if (user) {
                user.isReady = true;

                socket.broadcast.emit('status', `User "${user.name}" is ready!`);

                // Check if all users ready, start game
                if (allUserReady(io.activeUsers)) {
                    io.emit('status', `All users are ready! Game starting...`);
                    io.emit('startGame');
                }
            }
        });

        socket.on('disconnect', function () {
            let name = findUsername(io.activeUsers, socket.id);

            socket.broadcast.emit("status", `User ${name} disconnected`);
        });
    });
}

module.exports = setupServer;