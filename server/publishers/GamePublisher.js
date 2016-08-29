Meteor.publish('GameRoom', function (gameId) {
    return Game.find(
        {
            _id: gameId
        },
        {
            fields: {
                '__initDemand': 0
            }
        }
    );
});

Meteor.publish('GameAdmin', function (gameId) {
    var game = Game.find({_id: gameId});
    if (game.fetch()[0].gameAdmin === this.userId){
        return game;
    }else{
        return [];
    }
});

Meteor.publish('GameLobby', function () {
    return Game.find({
        $or: [
            {status: 'inLobby'},
            {status: 'inProgress'}
        ]
    }, {
        fields: {
            _id: 1,
            gameAdmin: 1,
            title: 1,
            numRounds: 1,
            observers: 1,
            players: 1,
            status: 1
        }
    });
});

Game.allow({
    insert: function (userId) {
        var condition = Meteor.apply('Game.helpers.enableUserActions', [], {returnStubValue: true});
        return !!userId && condition;
    },

    update: function (userId, doc) {
        var condition = Meteor.apply('Game.helpers.enableUserActions', [], {returnStubValue: true});
        return (userId === doc.gameAdmin) && condition;
    }
});