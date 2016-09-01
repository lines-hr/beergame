Meteor.methods({
    'Game.loadSetup' (gameSetupId) {
        var setup = GameSetup.findOne({ _id: gameSetupId });
        var gameSetup = {};
    
        for(var property in setup.setup){
            if(property !== 'initDemand'){
                gameSetup[property] = setup.setup[property];
            }
        }

        const game = {
            'gameAdmin': Meteor.userId(),
            'status': 'inLobby',
            'title': setup.title,
            'gameSetup': gameSetup,
            '__initDemand': setup.setup.initDemand,
            'numRounds': _.size(setup.setup.initDemand)
        };

        var gameId = Game.insert(game);

        return gameId;
    },

    /* ---------------------
     * Events
     * ---------------------*/

    'Game.gameChat.events.sendMessage' (gameId, message) {
        cleanedMessage = _.escape(message);

        Game.update(
            { _id: gameId },
            {
                $push: {
                    messages: {
                        timestamp: new Date(),
                        authorId: Meteor.userId(),
                        authorUsername: Meteor.user().username,
                        content: cleanedMessage
                    }
                }
            }
        );
    },

    'Game.lobbyGame.events.joinRoom' (gameId) {
        var condition = Meteor.apply('Game.helpers.enableUserActions', [], { returnStubValue: true });

        if (condition === true) {
            Game.update(
                { _id: gameId },
                {
                    $push: {
                        observers: { observerId: Meteor.userId() }
                    }
                }
            );

            return true;
        }

        return false;
    },

    'Game.room.events.cancelGame' (gameId) {
        var game = Game.findOne({ '_id': gameId });

        if (game && game.gameAdmin === Meteor.userId()) {
            Game.update({ '_id': gameId },{
                $set: { status: 'cancelled', observers: [], players: [] }
            });
        }
    },

    'Game.room.events.exitRoom' (gameId) {
        const game = Game.findOne({ _id: gameId });

        if (game) {
            if (_.find(game.observers, function (obj) {
                    return obj.observerId === Meteor.userId()
                })) {
                Game.update({_id: gameId},
                    {
                        $pull: {
                            observers: {observerId: Meteor.userId()}
                        }
                    });
            } else {
                Game.update({_id: gameId},
                    {
                        $pull: {
                            players: {playerId: Meteor.userId()}
                        }
                    });
            }
        }
    },

    'Game.room.events.toggleReady' (gameId) {
        const game = Game.findOne({ _id: gameId, 'players.playerId': Meteor.userId(), status: 'inLobby' });

        var player = _.find(game.players, function(p){
            return p.playerId === Meteor.userId();
        });

        Game.update(
            {
                _id: game._id,
                'players.playerId': Meteor.userId()
            },
            {
                $set: {
                    'players.$.isReady': !player.isReady
                }
            }
        );
    },

    'Game.room.events.startGame' (gameId) {
        if(Game.update(
            {
                _id: gameId,
                gameAdmin: Meteor.userId(),
                status: 'inLobby'
            },
            {
                $set: {
                    status: 'inProgress',
                }
            }
        )){
            if(Meteor.isServer){
                BeerGame.startGame(gameId);
            }
        };
    },

    /* ---------------------
     * Helpers
     * ---------------------*/

    'Game.helpers.enableUserActions' () {
        const enable = Game.find(
            {
                $and: [
                    {
                        $or: [
                            { gameAdmin: Meteor.userId() },
                            { 'observers.observerId': Meteor.userId() },
                            { 'players.playerId': Meteor.userId() }
                        ]
                    },
                    {
                        $or: [
                            { status: 'inLobby' },
                            { status: 'inProgress' }
                        ]
                    }
                ]
            }).count();

        if (enable > 0) {
            return false;
        } else {
            return true;
        }
    },

    'Game.room.events.toPlayer' (userId, position) {
        const game = Game.findOne({ 'observers.observerId': userId, status: 'inLobby' });

        if (game.gameAdmin === Meteor.userId()) {
            Game.update({ _id: game._id },
                {
                    $pull: {
                        observers: { observerId: userId }
                    }
                });

            Game.update(
                { _id: game._id },
                {
                    $push: {
                        players: {
                            playerId: userId,
                            position: position,
                            isReady: false
                        }
                    }
                }
            );
        }
    },

    'Game.room.events.toObserver' (userId) {
        const game = Game.findOne({ 'players.playerId': userId, status: 'inLobby' });

        if (game.gameAdmin === Meteor.userId()) {
            Game.update({ _id: game._id },
                {
                    $pull: {
                        players: { playerId: userId }
                    }
                });

            Game.update(
                { _id: game._id },
                {
                    $push: {
                        observers: {
                            observerId: userId
                        }
                    }
                }
            );
        }
    }
});