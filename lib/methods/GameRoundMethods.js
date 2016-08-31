
/*
 * -----------------
 * GameRound Methods
 * -----------------
 */

Meteor.methods({

    "GameRound.setOrder" (gameId, order) {
        if(Meteor.isServer){
            BeerGame.setOrder(gameId, parseInt(order));
            // TODO find order input element and set its value to '' after input so it is empty for next order
        }
    }

});