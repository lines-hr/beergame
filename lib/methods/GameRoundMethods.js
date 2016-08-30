
/*
 * -----------------
 * GameRound Methods
 * -----------------
 */

Meteor.methods({

    "GameRound.setOrder" (gameId, order) {
        if(Meteor.isServer){
            BeerGame.setOrder(gameId, order);
            //BeerGame.test();
        }
    }

});