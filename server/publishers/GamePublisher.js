Meteor.publish('GameRoom', function (gameId) {
    return Game.find({_id: gameId});//, gameAdmin: Meteor.userId(), status: 'inLobby'});
});

Meteor.publish('GameLobby', function () {
    return Game.find({status: 'inLobby'}, {fields: {
        _id: 1,
        gameAdmin: 1,
        title: 1,
        observers: 1,
        players: 1,
        status: 1
    }});
});

Game.allow({
    insert: function (userId) {
        var condition = Meteor.apply('Game.helpers.enableUserActions', [], { returnStubValue: true });
        return !!userId && condition;
    },

    update: function (userId, doc){
        var condition = Meteor.apply('Game.helpers.enableUserActions', [], { returnStubValue: true });
        return (userId === doc.gameAdmin) && condition;
    }
});