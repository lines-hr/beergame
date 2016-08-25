Meteor.publish('GameAdmin', function (gameId) {
    return Game.find({_id: gameId});//, gameAdmin: Meteor.userId(), status: 'inLobby'});
});

Meteor.publish('GameUser', function (gameId) {
    return Game.find({_id: gameId, status: 'inLobby'});
});

Meteor.publish('GameLobby', function () {
    return Game.find({status: 'inLobby'}, {fields: {
        _id: 1,
        gameAdmin: 1,
        title: 1
    }});
});

Game.allow({
    insert: function (userId, doc) {
        return userId;
    },

    remove: function (userId){
        return userId;
    },

    update: function (userId){
        return userId;
    }
});