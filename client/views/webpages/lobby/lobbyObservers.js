Template.lobbyObservers.onCreated(function () {
    Meteor.subscribe("GameSetup");
    Meteor.subscribe("Game");
});

Template.lobbyObservers.events({
    /*
    * Joining room only if user is not an admin and
    * if there is no password
    * TODO implement password check and input
    * */
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
    /*
     * Condition for joining game. If user created game and didn't cancel it
     * he can't join another game. Also user who joined one game, can't join another
     * if he is already joined.
     * */
    forbidJoin: function () {
        var condition = "";
        var condition2 = "";
        var condition3 = "";

        Game.find({gameAdmins: Meteor.userId(), gameStatus: "inLobby"}).forEach(function (obj) {
            condition = obj._id;
        });

        Game.find({observers: Meteor.userId()}).forEach(function (obj) {
            condition2 = obj._id;
        });

        Game.find({players: Meteor.userId()}).forEach(function (obj) {
            condition3 = obj._id;
        });

        if (condition || condition2 || condition3) {
            return false;
        } else {
            return true;
        }
    }
});
