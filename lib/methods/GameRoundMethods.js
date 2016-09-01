Meteor.methods({
    'GameRound.setOrder' (gameId, order) {
        if (Meteor.isServer) {
            if (parseInt(order) >= 0) {
                BeerGame.setOrder(gameId, parseInt(order));
            }
        }
    }
});