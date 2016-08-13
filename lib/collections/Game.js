Game = new Mongo.Collection("Game");

Game.attachSchema(new SimpleSchema({

    gameSetup: {
        type: Object // TODO importati schemu
    },

    gamePassword: {
        type: String,
        optional: true
    },

    gameRounds: {
        type: [ new SimpleSchema({

            gameRound: {
                type: Number
            },

            orders: {
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
                    incomingDelivery: {
                        type: Number
                    },

                }) ]
            }

        }) ]
    },

    players: {
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
        type: [ new SimpleSchema({
            observerId: {
                type: String,
                regEx: SimpleSchema.RegEx.Id
            }
        }) ]
    },

    gameAdmins: {
        type: String,
        regEx: SimpleSchema.RegEx.Id
    },

    gameStatus: {
        type: String
    },

    currentRound: {
        type: Number
    },

    gameMessages: {
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
