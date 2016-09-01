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

            var cursorGame = Game.find({"_id": gameId}, {fields: {currentRound: 1}});
            var observeHandle;
            if (cursorGame) {
                observeHandle = cursorGame.observeChanges({
                    changed: function (id, fields) {
                        if (!_.isNaN(fields.currentRound)){
                            $("#order").val("");
                            toastr["info"]("Round " + fields.currentRound + " started");
                        }
                    }
                });
            }

            self.autorun(function (c) {
                var game = Game.findOne({"_id": gameId});
                if (game) {
                    if (game.status === "cancelled") {
                        c.stop();
                        observeHandle.stop();
                        FlowRouter.go("/lobby");
                    }else{
                        if (game.status === "finished") {
                            c.stop();
                            observeHandle.stop();
                            FlowRouter.go("/score/" + game._id);
                        }
                    }
                } else {
                    c.stop();
                    observeHandle.stop();
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
        if (!_.isNaN(order) && order >= 0) {
            Meteor.call("GameRound.setOrder", Template.instance().getGameId(), order);
        }
    },

    'keypress #order': function (e) {
        if (e.which === 13) {
            var order = parseInt($("#order").val());
            if (!_.isNaN(order) && order >= 0) {
                Meteor.call("GameRound.setOrder", Template.instance().getGameId(), order);
            }
        }
    },

    'click #cancelGame': function () {
        Meteor.call('Game.room.events.cancelGame' ,gameId);
        FlowRouter.go('/lobby');
    },

    'click #exitRoom': function () {
        Meteor.call('Game.room.events.exitRoom', gameId);
        FlowRouter.go('/lobby');
    },

});

Template.game.helpers({
    clock: function () {
        return Session.get('time');
    },

    isPlayer: function () {
        if (Meteor.userId()) {
            var game = Game.findOne({_id: gameId});
            if (game) {
                var player = _.find(game.players, function (p) {
                    return Meteor.userId() === p.playerId;
                });
                return player;
            } else {
                return false;
            }
        } else {
            return false;
        }
    },

    isObserver: function () {
        if (Meteor.userId()) {
            var game = Game.findOne({_id: gameId});
            if (game) {
                var observer = _.find(game.observers, function (o) {
                    return Meteor.userId() === o.observerId;
                });
                return observer;
            } else {
                return false;
            }
        } else {
            return false;
        }
    },

    isGameAdmin: function () {
        if (Meteor.userId()) {
            var game = Game.findOne({_id: gameId});
            if (game) {
                return game.gameAdmin === Meteor.userId();
            } else {
                return false;
            }
        } else {
            return false;
        }
    }


});