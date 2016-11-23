const _ = require('lodash');
const gameSetup = require('../game/setup');
const characters = require('../game/characters');

var findUser = function (users, socketId) {
    return users.find((user) => user.id === socketId);
}

var findUsername = function (users, socketId) {
    let user = findUser(users, socketId);

    return user ? user.name : '';
}

var allUserReady = function (users) {
    return _.every(users, (user) => user.isReady) && users.length > 0 && users.length < 11;
}

var setupGame = function (io) {
    let game = _.find(gameSetup, s => s.players === io.participants.length);
    if(!game) return;

    let gameCharacters = _.map(game.characters, function(charId) {
        var temp = _.find(characters, c => c.id === charId);

        return {
            id: charId,
            name: temp.name.zh,
            image: temp.image,
            isEvil: temp.isEvil
        }
    });

    var randomeCharacters = _.shuffle(gameCharacters);

    //console.log(JSON.stringify(randomeCharacters));

    // Assign characters to participants
    _.each(io.participants, function (p, index) {
        p.character = randomeCharacters[index];  

        io.sockets.sockets[p.id].emit('assign', p.character);
    });

    io.game = game;
}

var setupServer = function (io) {
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
            io.participants.push({
                id: socket.id,
                name: name
            });

            socket.broadcast.emit('status', `New user "${name}" connected`);
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