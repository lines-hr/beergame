/*
 * Methods for working with Game collection
 */
Meteor.methods({
    // TODO
    'Game.room.events.ready' (gameId) {
        Game.update({_id: gameId, 'players.playerId': Meteor.userId()}, {$set:
            {'players.$.isReady': true}
        });
    },

    /* Adding game setup to newly created custom game */
    'Game.gameSettings.autoform.onSuccess' (gameSetupId) {
        const gameSetup = GameSetup.findOne({_id: gameSetupId});

        const game = {
            gameAdmin: Meteor.userId(),
            status: 'inLobby',
            title: gameSetup.title,
            gameSetup: gameSetup.setup
        };

        Game.insert(game);
    },

    /* Adding game setup to newly created default game */
    'Game.gameSettingsNewGame.events.defaultTemplateBtn' () {
        const gameSetupDefault = GameSetup.findOne({setupOwner: '0v0j3n3k1h4x0r'});

        const game = {
            gameAdmin: Meteor.userId(),
            status: 'inLobby',
            title: gameSetupDefault.title,
            gameSetup: gameSetupDefault.setup
        };

        Game.insert(game);
    },

    /* Getting all 'inLobby' games for listing in template
     * Additionally, return is limited with only three values - game id, username and game title */
    'Game.lobby.helpers.lobbyGames' () {
        var lobbies = [];

        Game.find({status: 'inLobby'}, {fields:
            {_id: 1, gameAdmin: 1, title: 1 }}).forEach(function (obj) {
                var user = Meteor.users.findOne(obj.gameAdmin);
                lobbies.push({gameId: obj._id, admin: user.username, title: obj.title});
        });

        return lobbies;
    },

    /* Checking for condition for user
     * If user created game and did not cancel it he can not create new game
     * If user joined game and did not cancel it he can not join other games */
    'Game.lobby.helpers.forbidUser' () {
        const userAdmin = Game.find({gameAdmin: Meteor.userId(), status: 'inLobby'}).count();
        const userObserver = Game.find({'observers.observerId': Meteor.userId(), status: 'inLobby'}).count();
        const userPlayer = Game.find({'players.playerId': Meteor.userId(), status: 'inLobby'}).count();

        if (userAdmin > 0 || userObserver > 0 || userPlayer > 0) {
            return false;
        } else {
            return true;
        }
    }
});

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

    /* Fields for the game when playing */
    gameRounds: {
        optional: true,
        type: [new SimpleSchema({
            gameRound: {
                type: Number
            },

            orders: {
                type: [ new SimpleSchema({
                    playerOrdered: {
                        type: String,
                        regEx: SimpleSchema.RegEx.Id
                    },

                    order: {
                        type: Number
                    },

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
        })]
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
                type: Number
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

            author: {
                type: String
            },

            content: {
                type: String
            }
        })]
    }
}));