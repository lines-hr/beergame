Meteor.publish('User', function () {
    return Meteor.users.find({}, { fields: {
        '_id': 1,
        'username': 1,
        'profile': 1
    }});
})

Meteor.publish('RoomUser', function (gameId) {
    var game = Game.findOne({_id: gameId, status: 'inLobby'});

    if (!game) return false;

    var userIds = [];

    if (typeof game.gameAdmin !== 'undefined') {
        userIds.push(game.gameAdmin);
    }

    if (typeof game.observers !== 'undefined') {
        game.observers.forEach(function (obj) {
            userIds.push(obj.observerId);
        });
    }

    if (typeof game.players !== 'undefined') {
        game.players.forEach(function (obj) {
            userIds.push(obj.playerId);
        });
    }

    return Meteor.users.find({
        _id:
        {
            $in: userIds
        }
    });
});

Meteor.publish('LobbyUser', function () {
    var adminIds = [];

    Game.find({status: 'inLobby'}).forEach(function (obj) {
        adminIds.push(obj.gameAdmin);
    });

    return Meteor.users.find({
        _id:
        {
            $in: adminIds
        }
    });
});