
/*
 * ----------------------
 * GameRounds collection
 * ----------------------
 */


GameRound = new Mongo.Collection('GameRound');

var gameRoundChainSchema = new SimpleSchema({

    incomingDelivery: {
        type: Number
    },

    __sumIncomingDelivery: {
        type: Number
    },

    pendingDelivery: {
        type: Number
    },

    stockAvailable: {
        type: Number
    },

    incomingOrder: {
        type: Number
    },

    __toShip: {
        type: Number
    },

    outgoingDelivery: {
        type: Number
    },

    backorder: {
        type: Number
    },

    inventory: {
        type: Number
    },

    costRound: {
        type: Number
    },

    costSum: {
        type: Number
    },

    myOrder: {
        type: Number,
        optional: true
    },

    __sumMyOrders: {
        type: Number
    }

});

/*
var sharedChainDataSchema = new SimpleSchema({
    upperPreviousOutgoingDelivery: {
        type: Number,
        optional: true
    },
    lowerPreviousOrder: {
        type: Number,
        optional: true
    }
});
*/

GameRound.attachSchema(new SimpleSchema({

    gameId: {
        type: String
    },

    gameRound: {
        type: Number
    },

    dataRetailer: {
        type: gameRoundChainSchema,
        optional: true
    },

    /*
    sharedRetailerWholesaler: {
        type: sharedChainDataSchema,
        optional: true
    },
    */

    dataWholesaler: {
        type: gameRoundChainSchema,
        optional: true
    },

    /*
    sharedWholesalerDistributor: {
        type: sharedChainDataSchema,
        optional: true
    },
    */

    dataDistributor: {
        type: gameRoundChainSchema,
        optional: true
    },

    /*
    sharedDistributorFactory: {
        type: sharedChainDataSchema,
        optional: true
    },
    */

    dataFactory: {
        type: gameRoundChainSchema,
        optional: true
    }

}));