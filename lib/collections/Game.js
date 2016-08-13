Game = new Mongo.Collection("Game");

Game.attachSchema(new SimpleSchema({

    gameSetup: {
        type: Object // TODO importati schemu
    },

    gameRounds: {
        type: [ new SimpleSchema({

            gameRound: {
                type: Number
            },

            orders: {
                type: [ new SimpleSchema({

                    playerOrdered: {
                        type: String
                    },

                    order: {
                        type: Number
                    }

                }) ]
            }

        }) ]
    },

    players: {
        type: [ String ]
    },

    gameAdmins: {
        type: [ String ]
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
