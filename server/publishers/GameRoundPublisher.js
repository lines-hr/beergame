Meteor.publish('GameRound', function (gameId) {
    var game = Game.findOne({_id: gameId});
    var userId = this.userId;

    if(game && userId){
        //ili gameAdmin ili player ili observer

        if(_.find(game.observers, function(o){return o.observerId === userId})){
            return GameRound.find({gameId: gameId});
        }

        var player = _.find(game.players, function(p){return p.playerId === userId});
        if (player){
            switch ( player.position ) {
                case "Retailer" :
                    return GameRound.find({gameId: gameId}, {fields: {
                        "_id": 1,
                        "gameId": 1,
                        "gameRound": 1,
                        "dataRetailer": 1
                    }});
                    break;
                case "Wholesaler" :
                    return GameRound.find({gameId: gameId}, {fields: {
                        "_id": 1,
                        "gameId": 1,
                        "gameRound": 1,
                        "dataWholesaler": 1
                    }});
                    break;
                case "Distributor" :
                    return GameRound.find({gameId: gameId}, {fields: {
                        "_id": 1,
                        "gameId": 1,
                        "gameRound": 1,
                        "dataDistributor": 1
                    }});
                    break;
                case "Factory" :
                    return GameRound.find({gameId: gameId}, {fields: {
                        "_id": 1,
                        "gameId": 1,
                        "gameRound": 1,
                        "dataFactory": 1
                    }});
                    break;
            }
        }


        if (game.gameAdmin === userId){
            return GameRound.find({gameId: gameId});
        }

    }
    return [];
});

GameSetup.allow({
    insert: function (userId, doc) {
        return userId;
    },

    remove: function(userId, doc) {
        return userId;
    },

    update: function(userId, doc) {
        return userId;
    }
});