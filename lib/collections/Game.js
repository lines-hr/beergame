Game = new Mongo.Collection('Game');

Game.attachSchema(new SimpleSchema ({
    gameAdmin: {
        type: String
    },

    status: {
        type: String
    },

    title: {
        type: String
    },

    gameSetup: {
        type: Object,
        blackbox: true
    },

    numRounds: {
        type: Number
    },

    currentRound: {
        type: Number,
        defaultValue: 0
    },

    players: {
        optional: true,
        type: [new SimpleSchema({
            playerId: {
                type: String,
                regEx: SimpleSchema.RegEx.Id
            },

            position: {
                type: String
            },

            isReady: {
                type: Boolean
            }
        })]
    },

    observers: {
        optional: true,
        type: [new SimpleSchema({
            observerId: {
                type: String,
                regEx: SimpleSchema.RegEx.Id
            }
        })]
    },

    messages: {
        optional: true,
        type: [new SimpleSchema({
            timestamp: {
                type: Date
            },

            authorId: {
                type: String
            },

            authorUsername: {
                type: String
            },

            content: {
                type: String
            }
        })]
    },

    __initDemand: {
        type: [Object],
        blackbox: true
    }
}));