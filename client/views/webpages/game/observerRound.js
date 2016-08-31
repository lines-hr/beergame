Template.observerRound.helpers({

    roundData: function () {
        if (Meteor.userId()) {

            var gameId = FlowRouter.getParam('gameId');

            var game = Game.findOne({_id: gameId});
            if (game) {
                var gameRound = GameRound.findOne({"gameId": gameId, "gameRound": game.currentRound});
                if (gameRound){
                    game.players.forEach(function (p) {
                        var user = Meteor.users.findOne({"_id": p.playerId});
                        switch (p.position) {
                            case "Retailer" :
                                gameRound.dataRetailer.username = user.username;
                                gameRound.dataRetailer.gameRound = gameRound.gameRound;
                                gameRound.dataRetailer.playingAs = '<i class="fa fa-home" aria-hidden="true"></i> Retailer';
                                break;
                            case "Wholesaler" :
                                gameRound.dataWholesaler.username = user.username;
                                gameRound.dataWholesaler.gameRound = gameRound.gameRound;
                                gameRound.dataWholesaler.playingAs = '<i class="fa fa-building" aria-hidden="true"></i> Wholesaler';
                                break;
                            case "Distributor" :
                                gameRound.dataDistributor.username = user.username;
                                gameRound.dataDistributor.gameRound = gameRound.gameRound;
                                gameRound.dataDistributor.playingAs = '<i class="fa fa-truck" aria-hidden="true"></i> Distributor';
                                break;
                            case "Factory" :
                                gameRound.dataFactory.username = user.username;
                                gameRound.dataFactory.gameRound = gameRound.gameRound;
                                gameRound.dataFactory.playingAs = '<i class="fa fa-truck" aria-hidden="true"></i> Factory';
                                break;
                        }

                    });
                    return gameRound;
                }

            }
        }
    }

});