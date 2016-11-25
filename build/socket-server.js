const _ = require('lodash');
const gameSetup = require('../game/setup');
const characters = require('../game/characters');

const findUser = function (users, socketId) {
    return users.find((user) => user.id === socketId);
}

const findUsername = function (users, socketId) {
    let user = findUser(users, socketId);

    return user ? user.name : '';
}

const allUserReady = function (users) {
    return _.every(users, (user) => user.isReady) && users.length > 0 && users.length < 11;
}

const setupGame = function (io) {
    const game = _.find(gameSetup, s => s.players === io.participants.length);
    if(!game) return;

    const gameCharacters = _.map(game.characters, function(charId) {
        var temp = _.find(characters, c => c.id === charId);

        return {
            id: charId,
            name: temp.name.en,
            image: temp.image,
            isEvil: temp.isEvil
        }
    });

    const randomeCharacters = _.shuffle(gameCharacters);
    const leaderPos = Math.floor(Math.random() * io.participants.length);
    game.seats = [];

    // Assign characters to participants
    _.each(io.participants, function (p, index) {
        let role = randomeCharacters[index]; ;
        p.character = role;

        game.seats.push({
            id: p.id,
            role: role.id
        });

        if (index === leaderPos) {
            game.leader = p.id;
            io.sockets.sockets[p.id].emit('assignLeader', p.character);
        } else {
            io.sockets.sockets[p.id].emit('assign', p.character);
        }
    });

    io.game = game;
}

const setupServer = function (io) {
    io.participants = [];

    io.on('connection', function (socket) {
        socket.on('chat', function (msg) {
            let name = findUsername(io.participants, socket.id);

            io.emit('chat', {
                text: msg.text,
                user: name
            });
        });

        socket.on('changeName', function (name) {
            let exisiting = findUsername(io.participants, socket.id);

            if (exisiting) {
                socket.emit('duplicateName');
            } else {
                io.participants.push({
                    id: socket.id,
                    name: name
                });

                socket.broadcast.emit('status', `New user "${name}" connected`);
            }
        });

        socket.on('isReady', function () {
            let user = findUser(io.participants, socket.id);

            if (user) {
                user.isReady = true;

                socket.broadcast.emit('status', `User "${user.name}" is ready!`);

                // Check if all users ready, start game
                if (allUserReady(io.participants)) {
                    io.emit('starting', `All users are ready! Game starting...`);

                    // Load game setup and chracters, and randomly assign roles
                    setupGame(io);
                }
            }
        });

        socket.on('disconnect', function () {
            let name = findUsername(io.participants, socket.id);

            socket.broadcast.emit("status", `User ${name} disconnected`);
        });
    });
}

module.exports = setupServer;