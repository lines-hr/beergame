Template.lobbyObservers.events({
    /* Joining room as observer */
    //TODO
    'click .joinRoom': function (e) {
        var game = e.target.value;
        var user = Meteor.userId();
        var admin = "";
        var password = "";

        Game.find({_id: game, gameStatus: "inLobby"}).forEach(function (obj) {
            admin = obj.gameAdmins;
            password = obj.gameSetup.gamePassword;
        });

        if (admin !== user) { //&& password === "" || password === undefined) {
            Game.update({_id: game}, {$push:
                { "observers": user }
            });

            FlowRouter.go('/room');
        }
    }
});

Template.lobbyObservers.helpers({
    /* Conditions for joining game */
    forbidJoin: function () {
        return ReactiveMethod.call('Game.lobby.helpers.forbidUser');
    }
});