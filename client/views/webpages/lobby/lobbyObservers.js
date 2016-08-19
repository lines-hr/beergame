Template.lobbyObservers.onCreated(function () {
    Meteor.subscribe("GameSetup");
    Meteor.subscribe("Game");
});

Template.lobbyObservers.events({
    'click .joinRoom': function (e) {
/*        var game = e.target.value;
        var user = Meteor.userId();
        var gameSetup = "";
        var gamePassword = "";

        Game.find({_id: game}, {fields: {gameSetup: 1}}).forEach(function (obj) {
            gameSetup = obj.gameSetup;
        });

        GameSetup.find({_id: new Mongo.ObjectID(gameSetup)}, {fields: {gamePassword: 1}}).forEach(function (obj) {
            gamePassword = obj.gamePassword;
        });

        if (gamePassword === "") {
            Game.update({_id: game}, {$push:
                { "observers": user }
            });

            FlowRouter.go('/room');
        } else {

        }*/
    }
});
