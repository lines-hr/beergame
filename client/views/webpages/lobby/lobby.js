Template.lobby.onCreated(function () {
    Meteor.subscribe("GameSetup");
    Meteor.subscribe("Game");
});

Template.lobby.events({
    /*
    * New game button in lobby
    * */
    'click #newGameBtn': function(e) {
        e.preventDefault();
        
        $('#newGameModal').modal('show');
    }
});

Template.lobby.helpers({
    lobbyGames: function () {
        var games = [];
        var gameSetup = [];

        Game.find({gameStatus: 'inLobby'}).forEach(function (obj) {
            gameSetup.push({setupId: obj.gameSetup});
        });

        // solving problem with _id { _str } in default, and _id in custom created games
        for (var i = 0; i < gameSetup.length; i++) {
            if (gameSetup[i].setupId === "57b1f3b48497292bf6a16906") {
                GameSetup.find({_id: new Mongo.ObjectID(gameSetup[i].setupId)}).forEach(function (obj) {
                    games.push({title: obj.title, gameId: obj._id});
                });
            } else {
                GameSetup.find({_id: gameSetup[i].setupId}).forEach(function (obj) {
                    games.push({title: obj.title, gameId: obj._id});
                });
            }
        }

        return games;
    },

    /*
    * Condition for creating new game. If user created game and didn't cancel it
    * he can't create new game.
    * */
    forbidCreate: function () {
        var condition = "";

        Game.find({gameAdmins: Meteor.userId(), gameStatus: "inLobby"}).forEach(function (obj) {
            condition = obj._id;
        });

        if (condition) {
            return false;
        } else {
            return true;
        }
    }
});