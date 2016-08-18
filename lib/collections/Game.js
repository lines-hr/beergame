//import GameSetup from './GameSetup.js';

Game = new Mongo.Collection("Game");

Game.attachSchema(new SimpleSchema({

    gameSetup: {
        type: String
        //regEx: SimpleSchema.RegEx.Id
        //type: GameSetup,
        //blackbox: true
    },

    gameRounds: {
        optional: true,
        type: [ new SimpleSchema({
            // prepopulate
            gameRound: {
                type: Number
            },

            orders: {
                optional: true,
                type: [ new SimpleSchema({

                    playerOrdered: {
                        type: String,
                        regEx: SimpleSchema.RegEx.Id
                    },

                    // Input order field
                    order: {
                        type: Number
                    },


                    // Calculated fields:

                    incomingDelivery: {
                        type: Number
                    },
                    stockAvailable: {
                        type: Number
                    },
                    incomingOrder: {
                        type: Number
                    },
                    yourDelivery: {
                        type: Number
                    },
                    backorder: {
                        type: Number
                    },
                    inventory: {
                        type: Number
                    },
                    cost: {
                        type: Number
                    }

                }) ]
            }

        }) ]
    },

    players: {
        optional: true,
        type: [ new SimpleSchema({
            playerId: {
                type: String,
                regEx: SimpleSchema.RegEx.Id
            },
            level: {
                type: Number
            },
            isReady: {
                type: Boolean
            }
        }) ]
    },

    observer: {
        optional: true,
        type: [ new SimpleSchema({
            observerId: {
                type: String,
                regEx: SimpleSchema.RegEx.Id
            }
        }) ]
    },

/*    mirko: {
        optional: true,
        type: String
    },*/

    gameAdmins: {
        type: String,
        autoValue: function() {
            return this.userId;
        }
    },

    gameStatus: {
        type: String
    },

    currentRound: {
        type: Number,
        defaultValue: 0
    },

    gameMessages: {
        optional: true,
        type: [ new SimpleSchema({
            timestamp: {
                type: Date
            },

            author: {
                type: String
            },

            content: {
                type: String
            }
        }) ]
    }

}));
