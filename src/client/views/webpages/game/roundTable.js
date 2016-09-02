Template.roundTable.helpers({
    isPlayer: function () {
        if (Meteor.userId()) {
            var gameId = FlowRouter.getParam('gameId');
            var game = Game.findOne({ _id: gameId });

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

    visibleShippings: function () {
        if (Meteor.userId()) {
            var gameId = FlowRouter.getParam('gameId');
            var game = Game.findOne({ _id: gameId });

            if (game) {
                return game.gameSetup.visibleShippings;
            } else {
                return false;
            }
        } else {
            return false;
        }
    },

    visibleDemands: function () {
        if (Meteor.userId()) {
            var gameId = FlowRouter.getParam('gameId');
            var game = Game.findOne({ _id: gameId });

            if (game) {
                return game.gameSetup.visibleDemands;
            } else {
                return false;
            }
        } else {
            return false;
        }
    },



});