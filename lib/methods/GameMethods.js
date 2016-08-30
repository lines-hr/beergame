
/*
 * -----------------
 * Game Methods
 * -----------------
 */


Meteor.methods({
    'Game.loadSetup' (gameSetupId) {
        var setup = GameSetup.findOne({ _id: gameSetupId });

        var gameSetup = {};
        for(var property in setup.setup){
            if(property !== "initDemand"){
                gameSetup[property] = setup.setup[property];
            }
        }

        const game = {
            "gameAdmin": Meteor.userId(),
            "status": 'inLobby',
            "title": setup.title,
            "gameSetup": gameSetup,
            "__initDemand": setup.setup.initDemand,
            "numRounds": _.size(setup.setup.initDemand)
        };

        var gameId = Game.insert(game);

        return gameId;
    },

    /* ---------------------
     * Events
     * ---------------------*/

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

    'Game.room.events.cancelGame' () {
        Game.update({ gameAdmin: Meteor.userId(), status: 'inLobby' },{
            $set: { status: 'cancelled', observers: [], players: [] }
        });
    },

    'Game.room.events.exitRoom' (gameId) {
        const game = Game.findOne({ _id: gameId, status: 'inLobby' });

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
                    observers: []
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



/*/!*
 * Methods for working with Game collection
 *!/
 Meteor.methods({
 'Game.room.events.startGame' () {
 Game.update(
 {
 gameAdmin: Meteor.userId(),
 status: 'inLobby'
 },
 {
 $set: {
 status: 'inProgress',
 observers: []
 }
 }
 );
 },

 'Game.room.events.ready' (status) {
 const game = Game.findOne({ 'players.playerId': Meteor.userId(), status: 'inLobby' });

 Game.update(
 {
 _id: game._id,
 'players.playerId': Meteor.userId()
 },
 {
 $set: {
 'players.$.isReady': status
 }
 }
 );
 },

 /!* Adding game setup to newly created custom game *!/
 'Game.gameSettings.autoform.onSuccess' (gameSetupId) {
 const gameSetup = GameSetup.findOne({ _id: gameSetupId });

 const game = {
 gameAdmin: Meteor.userId(),
 status: 'inLobby',
 title: gameSetup.title,
 gameSetup: gameSetup.setup
 };

 Game.insert(game);
 },

 /!* Adding game setup to newly created default game *!/
 'Game.gameSettingsNewGame.events.defaultTemplateBtn' () {
 const gameSetupDefault = GameSetup.findOne({ setupOwner: '0v0j3n3k1h4x0r' });

 const game = {
 gameAdmin: Meteor.userId(),
 status: 'inLobby',
 title: gameSetupDefault.title,
 gameSetup: gameSetupDefault.setup
 };

 return Game.insert(game);
 },

 /!* Getting all 'inLobby' games for listing in template
 * Additionally, return is limited with only three values - game id, username and game title *!/
 'Game.lobby.helpers.lobbyGames' () {
 const lobbies = [];

 Game.find(
 { status: 'inLobby' },
 {
 fields: {
 _id: 1,
 gameAdmin: 1,
 title: 1
 }
 }
 ).forEach(function (obj) {
 //if (Meteor.users.findOne(obj.gameAdmin)) {
 //    const admin = Meteor.users.findOne(obj.gameAdmin);
 //    lobbies.push({gameId: obj._id, admin: admin.username, title: obj.title});
 //}
 lobbies.push({gameId: obj._id, admin: 'yolo', title: obj.title});
 });

 return lobbies;
 },

 /!* Checking for condition for user
 * If user created game and did not cancel it he can not create new game
 * If user joined game and did not cancel it he can not join other games *!/
 'Game.helpers.enableUser' () {
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

 /!* User entering room/game as observer *!/
 'Game.lobbyObservers.events.joinRoom' (gameId) {
 Game.update(
 { _id: gameId },
 {
 $push: {
 observers: { observerId: Meteor.userId() }
 }
 }
 );
 },

 /!**!/
 'Game.room.events.toObserver' (userId) {
 const game = Game.findOne({ 'players.playerId': userId, status: 'inLobby' });

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
 },

 /!**!/
 'Game.room.events.toPlay' (userId) {
 const game = Game.findOne({ 'observers.observerId': userId, status: 'inLobby' });

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
 position: 0,
 isReady: false
 }
 }
 }
 );
 },

 /!* User exiting room/game *!/
 'Game.room.events.exitRoom' () {
 const observeGame = Game.findOne({ 'observers.observerId': Meteor.userId(), status: 'inLobby' });
 const playGame = Game.findOne({ 'players.playerId': Meteor.userId(), status: 'inLobby' });

 if (observeGame) {
 Game.update({_id: observeGame._id},
 {
 $pull: {
 observers: {observerId: Meteor.userId()}
 }
 });
 } else {
 Game.update({ _id: playGame._id },
 {
 $pull: {
 players: { playerId: Meteor.userId() }
 }
 });
 }
 },

 /!* Admin cancelling room/game *!/
 'Game.room.events.cancelGame' () {
 Game.remove({ gameAdmin: Meteor.userId(), status: 'inLobby' });
 },

 /!**!/
 'Game.helpers.summon' () {
 const summon = Game.find(
 {
 $and: [
 {
 $or: [
 { gameAdmin: Meteor.userId() },
 { 'players.playerId': Meteor.userId() }
 ]
 },
 {
 status: 'inProgress'
 }
 ]
 }).count();

 if (summon > 0) {
 return true;
 } else {
 return false;
 }
 },

 /!**!/
 'Game.room.helpers.allPlayersReady' () {
 if (Game.findOne({ gameAdmin: Meteor.userId(), status: 'inLobby' })) {
 const game = Game.findOne({ gameAdmin: Meteor.userId(), status: 'inLobby' });
 var len = 0;
 var condition = 0;

 if (game.players !== undefined) {
 len = game.players.length;

 condition = Game.find(
 {
 'players.isReady':
 {
 $in: [ false ]
 }
 }
 ).count();
 }

 if (len === 1 && condition === 0) {
 return true;
 } else {
 return false;
 }
 }

 return false;
 },

 /!**!/
 'Game.room.helpers.ready' () {
 const userReady = Game.find({ 'players.playerId': Meteor.userId(), 'players.isReady': true, status: 'inLobby' }).count();

 if (userReady > 0) {
 return true;
 } else {
 return false;
 }
 },

 /!* Checking if admin *!/
 'Game.room.helpers.admin' () {
 const userAdmin = Game.find({ gameAdmin: Meteor.userId(), status: 'inLobby' }).count();

 if (userAdmin > 0) {
 return true;
 } else {
 return false;
 }
 },

 /!**!/
 'Game.room.helpers.inRoom' () {
 const inRoom = Game.find(
 {
 $and: [
 {
 $or: [
 { 'observers.observerId': Meteor.userId() },
 { 'players.playerId': Meteor.userId() }
 ]
 },
 {
 status: 'inLobby'
 }
 ]
 }).count();

 if (inRoom > 0) {
 return true;
 } else {
 return false;
 }
 },

 /!* Checking if user added by admin *!/
 'Game.room.helpers.added' () {
 const userAdded = Game.find({ 'players.playerId': Meteor.userId(), status: 'inLobby' }).count();

 if (userAdded > 0) {
 return true;
 } else {
 return false;
 }
 },

 /!* Getting specific game data for joined users *!/
 'Game.room.helpers.getGameSettings' () {
 const game = Game.findOne(
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
 status: 'inLobby'
 }
 ]
 },
 {
 _id: 1
 }
 );

 if (game) {
 const gameSettings = [];

 gameSettings.push(game.title);
 //if (Meteor.users.findOne(game.gameAdmin)) {
 //    const admin = Meteor.users.findOne(game.gameAdmin);
 //    gameSettings.push(admin.username);
 //}
 gameSettings.push('yolo');
 gameSettings.push(game.gameSetup.initDemand.length);
 gameSettings.push(game.gameSetup.initStock);
 gameSettings.push(game.gameSetup.initIncomingDelivery);
 gameSettings.push(game.gameSetup.initIncomingOrder);
 gameSettings.push(game.gameSetup.initBackorder);
 gameSettings.push(game.gameSetup.initInventoryCost);
 gameSettings.push(game.gameSetup.initBackorderCost);
 if (game.gameSetup.visibleShippings === true) {
 gameSettings.push('Yes');
 } else {
 gameSettings.push('No');
 }
 if (game.gameSetup.visibleDemands === true) {
 gameSettings.push('Yes');
 } else {
 gameSettings.push('No');
 }
 if (game.gameSetup.allowMessaging === true) {
 gameSettings.push('Yes');
 } else {
 gameSettings.push('No');
 }

 return gameSettings;
 }
 },

 'Game.room.helpers.listObservers' () {
 const observersList = [];

 Game.find({ gameAdmin: Meteor.userId(), status: 'inLobby' }).forEach(function (obj) {
 if (obj.observers) {
 obj.observers.forEach(function (obj2) {
 //if (Meteor.users.findOne(obj2.observerId)) {
 //    const observer = Meteor.users.findOne(obj2.observerId);
 //    observersList.push({user: observer.username, userId: obj2.observerId});
 //}
 observersList.push({user: 'yolo', userId: obj2.observerId});
 })
 }
 });

 return observersList;
 },

 'Game.room.helpers.listPlayers' () {
 const playersList = [];

 Game.find({ gameAdmin: Meteor.userId(), status: 'inLobby' }).forEach(function (obj) {
 if (obj.players) {
 obj.players.forEach(function (obj2) {
 //if (Meteor.users.findOne(obj2.playerId)) {
 //    const player = Meteor.users.findOne(obj2.playerId);
 //    playersList.push({user: player.username, userId: obj2.playerId});
 //}
 playersList.push({user: 'yolo', userId: obj2.playerId});
 })
 }
 });

 return playersList;
 },

 'Game.room.helpers.positions' () {
 return [{position: 'Retailer'}, {position: 'Wholesaler'}, {position: 'Distributor'}, {position: 'Factory'}];
 }
 });*/
