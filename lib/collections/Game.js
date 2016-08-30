
/*
 * -----------------
 * Game collection -
 * -----------------
 */
Game = new Mongo.Collection('Game');

Game.attachSchema(new SimpleSchema ({
    /* User ID of game creator for previously created game in GameSetup collection
     * example: av0p6n24hh4x9u */
    gameAdmin: {
        type: String
    },

    /* Status of game
     * example: inLobby */
    status: {
        type: String
    },

    /* Game title from the game previously created in GameSetup collection
     * example: Game of strong nerves */
    title: {
        type: String
    },

    /* Settings for the game previously created in GameSetup collection */
    gameSetup: {
        type: Object,
        blackbox: true
    },

    numRounds: {
        type: Number
    },

    /* Round currently played
     * example: 5 */
    currentRound: {
        type: Number,
        defaultValue: 0
    },

    /* Players in the game */
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

    /* Observers while game status is 'inLobby' */
    observers: {
        optional: true,
        type: [new SimpleSchema({
            observerId: {
                type: String,
                regEx: SimpleSchema.RegEx.Id
            }
        })]
    },

    /* Messages in the game if allowed */
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
        blackbox: true // OVO PROKETO SMECE MORA BITI BLACKBOX, KO GA MAKNE JEBAT CU MU MATER
    }
}));