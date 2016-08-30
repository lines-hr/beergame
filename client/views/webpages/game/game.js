var gameId;

setInterval(function () {
    Session.set('time', (new Date).toTimeString().substr(0, 8));
}, 500);

Template.game.onCreated(function () {
    var self = this;

    this.getGameId = () => FlowRouter.getParam('gameId');

    gameId = this.getGameId();

    this.autorun(() => {
        this.subscribe('GameRoom', this.getGameId(), function () {
            self.autorun(function (c) {
                var game = Game.find({"_id": gameId, status: 'inProgress'}).count();
                if (game === 0) {
                    c.stop();
                    FlowRouter.go("/lobby");
                }
            });
        });

        this.subscribe('User');
        this.subscribe('GameRound', this.getGameId(), function () {

        });
    });
});

Template.registerHelper('allowedMessaging', function () {
    var game = Game.findOne({_id: gameId});

    if (game) {
        if (game.gameSetup.allowMessaging === true) {
            return true;
        } else {
            return false;
        }
    }
});

Template.game.events({

    "click #orderButton" () {
        var order = parseInt($("#order").val());
        if (!_.isNaN(order)) {
            Meteor.call("GameRound.setOrder", Template.instance().getGameId(), order);
        }
    }

});

Template.game.helpers({
    clock: function () {
        return Session.get('time');
    },

    playerOrdered: function () {

        if (Meteor.userId()) {
            var game = Game.findOne({_id: gameId});
            if (game) {
                var player = _.find(game.players, function (p) {
                    return Meteor.userId() === p.playerId;
                });
                if (player) {

                    var gameRound = GameRound.findOne({gameId: game._id, gameRound: game.currentRound});

                    if (gameRound) {
                        switch (player.position) {
                            case "Retailer" :
                                return typeof gameRound.dataRetailer.myOrder !== "undefined";
                                break;
                            case "Wholesaler" :
                                return typeof gameRound.dataWholesaler.myOrder !== "undefined";
                                break;
                            case "Distributor" :
                                return typeof gameRound.dataDistributor.myOrder !== "undefined";
                                break;
                            case "Factory" :
                                return typeof gameRound.dataFactory.myOrder !== "undefined";
                                break;
                        }
                    }

                } else {
                    return false;
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    },

    roundData: function () {
        var game = Game.findOne({_id: gameId});
        if (game) {
            var player = _.find(game.players, function (p) {
                return p.playerId === Meteor.userId()
            });
            if (player) {
                var gameRound = GameRound.findOne({"gameId": gameId, "gameRound": game.currentRound});
                if (gameRound) {

                    gameRound.position = player.position;
                    gameRound.username = Meteor.user().username;

                    var dataProperty = _.intersection(_.keys(gameRound), ["dataRetailer", "dataWholesaler", "dataDistributor", "dataFactory"]);
                    gameRound.data = gameRound[dataProperty];
                    delete gameRound[dataProperty];

                    return gameRound;
                }
            }
        }
    }
});