Template.lobby.onCreated(function () {
    Meteor.subscribe("GameSetup");
    Meteor.subscribe("Game");
});

Template.lobby.events({
    'click #newGameBtn': function(e) {
        e.preventDefault();
        
        $('#newGameModal').modal('show');
    }
});

Template.lobby.helpers({
    lobbyGames: function () {
        var games = [];

        Game.find({gameStatus: 'inLobby'}).forEach(function (obj) {
            GameSetup.find({_id: new Mongo.ObjectID(obj.gameSetup)}).forEach(function (obj2) {
                games.push(obj2.title);
            });
        });

        return games;
    },

    forbidCreate: function () {
        if (Session.get("roomActive") === undefined) {
            return true;
        }
        return Session.get("roomActive") === "0";
    }
});