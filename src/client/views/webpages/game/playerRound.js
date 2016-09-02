Template.playerRound.helpers({
    roundData: function () {
        if (Meteor.userId()) {
            var gameId = FlowRouter.getParam('gameId');
            var game = Game.findOne({ _id: gameId });
            
            if (game) {
                var player = _.find(game.players, function (p) {
                    return p.playerId === Meteor.userId()
                });
                
                var gameRound = GameRound.findOne({ 'gameId': gameId, 'gameRound': game.currentRound });
                
                if (gameRound){
                    if (player) {
                        var dataProperty = _.intersection(_.keys(gameRound), ['dataRetailer', 'dataWholesaler', 'dataDistributor', 'dataFactory']);
                        gameRound.data = gameRound[dataProperty];
                        gameRound.data.username = Meteor.user().username;
                        gameRound.data.gameRound = gameRound.gameRound;

                        switch (player.position) {
                            case 'Retailer':
                                gameRound.data.playingAs = '<i class="fa fa-home" aria-hidden="true"></i> Retailer';
                                break;

                            case 'Wholesaler':
                                gameRound.data.playingAs = '<i class="fa fa-building" aria-hidden="true"></i> Wholesaler';
                                break;

                            case 'Distributor':
                                gameRound.data.playingAs = '<i class="fa fa-truck" aria-hidden="true"></i> Distributor';
                                break;

                            case 'Factory':
                                gameRound.data.playingAs = '<i class="fa fa-truck" aria-hidden="true"></i> Factory';
                                break;
                        }

                        if (typeof gameRound.data.myOrder !== "undefined") {
                            gameRound.data.playerOrdered = true;
                        } else {
                            gameRound.data.playerOrdered = false;
                        }

                        delete gameRound[dataProperty];

                        return gameRound;
                    }
                }
            }
        }
    }
});