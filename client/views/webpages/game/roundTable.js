Template.roundTable.helpers({

    isPlayer: function () {
        if (Meteor.userId()) {

            var gameId = FlowRouter.getParam('gameId');

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

});