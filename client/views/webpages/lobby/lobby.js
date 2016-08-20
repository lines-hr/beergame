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
    /*
    * Returning all inLobby games where fields gameId, password and title
    * are used for lobbyObservers template
    * */
    lobbyGames: function () {
        var games = [];

        Game.find({gameStatus: 'inLobby'}).forEach(function (obj) {
            if (obj.gameSetup.gamePassword) {
                games.push({gameId: obj._id, password: "Yes", title: obj.gameSetup.title});
            } else {
                games.push({gameId: obj._id, password: "No", title: obj.gameSetup.title});
            }
        });

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