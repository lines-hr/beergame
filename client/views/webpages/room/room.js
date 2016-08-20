Template.room.onCreated(function () {
    Meteor.subscribe("GameSetup");
    Meteor.subscribe("Game");
});

Template.room.events({
    'click #ready': function (e) {
        var status = e.target.value;
        var game = "";
        var player = {};

        Game.find({"players.playerId": Meteor.userId(), gameStatus: "inLobby"}).forEach(function (obj) {
            game = obj._id;
        });

        if (status === "ready") {
            Game.update({_id: game}, {$pull: {
                    "players": {
                        playerId: Meteor.userId()
                    }
                }
            });

            player = {
                playerId: Meteor.userId(),
                isReady: true
            }

            Game.update({_id: game}, {$push:
                { players: player }
            });
        } else {
            Game.update({_id: game}, {$pull: {
                    "players": {
                        playerId: Meteor.userId()
                    }
                }
            });

            player = {
                playerId: Meteor.userId(),
                isReady: false
            }

            Game.update({_id: game}, {$push:
                { players: player }
            });
        }
    },

    'click .toObserve': function (e) {
        var game = "";
        var playerId = e.target.value;

        Game.find({"players.playerId": playerId, gameStatus: "inLobby"}).forEach(function (obj) {
            game = obj._id;
        });

        Game.update({_id: game}, {$pull: {
            "players": {
                    playerId: playerId
                }
            }
        });

        Game.update({_id: game}, {$push:
            { observers: playerId }
        });
    },

    'click .toPlay': function (e) {
        var game = "";
        var playerId = e.target.value;
        var player = {};

        Game.find({observers: playerId, gameStatus: "inLobby"}).forEach(function (obj) {
            game = obj._id;
        });

        Game.update({_id: game}, {$pull:
            { observers: playerId }
        });

        player = {
            playerId: playerId,
            isReady: false
        }

        Game.update({_id: game}, {$push:
            { players: player }
        });
    },

    /*
    * Exiting room for joined user
    * */
    'click #exitRoom': function () {
        var game = "";
        var game2 = "";

        Game.find({observers: Meteor.userId(), gameStatus: "inLobby"}).forEach(function (obj) {
            game = obj._id;
        });

        Game.find({"players.playerId": Meteor.userId(), gameStatus: "inLobby"}).forEach(function (obj) {
            game2 = obj._id;
        });

        if (Game.find({observers: Meteor.userId(), gameStatus: "inLobby"}).count() === 1) {
            Game.update({_id: game}, {$pull:
                { observers: Meteor.userId() }
            });
        }

        if (Game.find({"players.playerId": Meteor.userId(), gameStatus: "inLobby"}).count() === 1) {
            Game.update({_id: game2}, {$pull: {
                    "players": {
                        playerId: Meteor.userId()
                    }
                }
            });
        }

        FlowRouter.go('/lobby');
    },

    /*
    * Cancelling game and deleting game and setup
    * TODO change function for user's more setups
    * */
    'click #cancelGame': function () {
        var gameId = "";
        var setupId = "";
        var name = "";

        Game.find({gameAdmins: Meteor.userId(), gameStatus: "inLobby"}).forEach(function (obj) {
            gameId = obj._id;
            setupId = obj.gameSetup.setupId;
            name = obj.gameSetup.title;
        });

        if (name !== "Default Beergame") {
            GameSetup.remove(setupId);
        }
        Game.update({_id: gameId}, {$set: {observers: []}});
        Game.update({_id: gameId}, {$set: {players: []}});
        Game.remove(gameId);

        FlowRouter.go('/lobby');
    }
});

Template.room.helpers({
    isReady: function () {
        var status = "";

        Game.find({"players.playerId": Meteor.userId(), gameStatus: "inLobby"}).forEach(function (obj) {
            obj.players.forEach(function (obj2){
                if (obj2.playerId === Meteor.userId()) {
                    status = obj2.isReady;
                }
            })
        });

        if(status === true) {
            return true;
        } else {
            return false;
        }
    },

    /*
    * Observer only have option for exit game
    * */
    joined: function () {
        if(Game.find({observers: Meteor.userId()}).count() === 1) {
            return true;
        } else {
            return false;
        }
    },

    added: function () {
        if(Game.find({"players.playerId": Meteor.userId()}).count() === 1) {
            return true;
        } else {
            return false;
        }
    },

    admin: function () {
        if(Game.find({gameAdmins: Meteor.userId()}).count() === 1) {
            return true;
        } else {
            return false;
        }
    },

    /*
     * Game admin only have option for cancel game
     * */
    createdGame: function () {
        if(Game.find({gameAdmins: Meteor.userId()}).count() === 1) {
            return true;
        }
    },

    /*
    * Listing observers on game admin side
    * TODO add nickname to register and show that nickname
    * */
    listObservers: function() {
        var observers = [];
        var t = [];

        Game.find({gameAdmins: Meteor.userId(), gameStatus: 'inLobby'}).forEach(function (obj) {
            //observers.push({observer: obj.observers});
            observers.push(obj.observers);
        });

        for (var i = 0; i < observers[0].length; i++) {
            t.push(observers[0][i]);
        }

        return t;
    },

    listPlayers: function() {
        var players = [];

        Game.find({gameAdmins: Meteor.userId(), gameStatus: 'inLobby'}).forEach(function (obj) {
            obj.players.forEach(function (obj2) {
                players.push({player: obj2.playerId});
            })
        });

        return players;
    },

    /*
    * Game info in lobby after game is created
    * */
    getUserSettings: function() {
        var userSettings = [];

        if (Game.find({gameAdmins: Meteor.userId(), gameStatus: "inLobby"}).count() === 1) {
            Game.find({gameAdmins: Meteor.userId(), gameStatus: "inLobby"}).forEach(function (obj) {
                userSettings.push(obj.gameSetup.title);
                //TODO bug with password
                if (obj.gameSetup.setup.gamePassword === undefined || obj.gameSetup.setup.gamePassword === "") {
                    userSettings.push('No');
                } else {
                    userSettings.push('Yes');
                }
                userSettings.push(obj.gameSetup.setup.initDemand.length);
                userSettings.push(obj.gameSetup.setup.initStock);
                userSettings.push(obj.gameSetup.setup.initIncomingDelivery);
                userSettings.push(obj.gameSetup.setup.initIncomingOrder);
                userSettings.push(obj.gameSetup.setup.initBackorder);
                if (obj.gameSetup.setup.initRoundLengthShippingDelay === undefined || obj.gameSetup.setup.initRoundLengthShippingDelay === 0) {
                    userSettings.push('-');
                } else {
                    userSettings.push(obj.gameSetup.setup.initRoundLengthShippingDelay);
                }
                if (obj.gameSetup.setup.initRoundLengthShippingDelay === undefined || obj.gameSetup.setup.initRoundLengthShippingDelay === 0) {
                    userSettings.push('-');
                } else {
                    userSettings.push(obj.gameSetup.setup.initAmountShippingDelay);
                }
                userSettings.push(obj.gameSetup.setup.initInventoryCost);
                userSettings.push(obj.gameSetup.setup.initBackorderCost);
                if (obj.gameSetup.setup.visibleShippings === true) {
                    userSettings.push('Yes');
                } else {
                    userSettings.push('No');
                }
                if (obj.gameSetup.setup.visibleDemands === true) {
                    userSettings.push('Yes');
                } else {
                    userSettings.push('No');
                }
                if (obj.gameSetup.setup.allowMessaging === true) {
                    userSettings.push('Yes');
                } else {
                    userSettings.push('No');
                }
            });
        } else if (Game.find({observers: Meteor.userId(), gameStatus: "inLobby"}).count() === 1) {
            Game.find({observers: Meteor.userId(), gameStatus: "inLobby"}).forEach(function (obj) {
                userSettings.push(obj.gameSetup.title);
                //TODO bug with password
                if (obj.gameSetup.setup.gamePassword === undefined || obj.gameSetup.setup.gamePassword === "") {
                    userSettings.push('No');
                } else {
                    userSettings.push('Yes');
                }
                userSettings.push(obj.gameSetup.setup.initDemand.length);
                userSettings.push(obj.gameSetup.setup.initStock);
                userSettings.push(obj.gameSetup.setup.initIncomingDelivery);
                userSettings.push(obj.gameSetup.setup.initIncomingOrder);
                userSettings.push(obj.gameSetup.setup.initBackorder);
                if (obj.gameSetup.setup.initRoundLengthShippingDelay === undefined || obj.gameSetup.setup.initRoundLengthShippingDelay === 0) {
                    userSettings.push('-');
                } else {
                    userSettings.push(obj.gameSetup.setup.initRoundLengthShippingDelay);
                }
                if (obj.gameSetup.setup.initRoundLengthShippingDelay === undefined || obj.gameSetup.setup.initRoundLengthShippingDelay === 0) {
                    userSettings.push('-');
                } else {
                    userSettings.push(obj.gameSetup.setup.initAmountShippingDelay);
                }
                userSettings.push(obj.gameSetup.setup.initInventoryCost);
                userSettings.push(obj.gameSetup.setup.initBackorderCost);
                if (obj.gameSetup.setup.visibleShippings === true) {
                    userSettings.push('Yes');
                } else {
                    userSettings.push('No');
                }
                if (obj.gameSetup.setup.visibleDemands === true) {
                    userSettings.push('Yes');
                } else {
                    userSettings.push('No');
                }
                if (obj.gameSetup.setup.allowMessaging === true) {
                    userSettings.push('Yes');
                } else {
                    userSettings.push('No');
                }
            });
        } else {
            Game.find({"players.playerId": Meteor.userId(), gameStatus: "inLobby"}).forEach(function (obj) {
                userSettings.push(obj.gameSetup.title);
                //TODO bug with password
                if (obj.gameSetup.setup.gamePassword === undefined || obj.gameSetup.setup.gamePassword === "") {
                    userSettings.push('No');
                } else {
                    userSettings.push('Yes');
                }
                userSettings.push(obj.gameSetup.setup.initDemand.length);
                userSettings.push(obj.gameSetup.setup.initStock);
                userSettings.push(obj.gameSetup.setup.initIncomingDelivery);
                userSettings.push(obj.gameSetup.setup.initIncomingOrder);
                userSettings.push(obj.gameSetup.setup.initBackorder);
                if (obj.gameSetup.setup.initRoundLengthShippingDelay === undefined || obj.gameSetup.setup.initRoundLengthShippingDelay === 0) {
                    userSettings.push('-');
                } else {
                    userSettings.push(obj.gameSetup.setup.initRoundLengthShippingDelay);
                }
                if (obj.gameSetup.setup.initRoundLengthShippingDelay === undefined || obj.gameSetup.setup.initRoundLengthShippingDelay === 0) {
                    userSettings.push('-');
                } else {
                    userSettings.push(obj.gameSetup.setup.initAmountShippingDelay);
                }
                userSettings.push(obj.gameSetup.setup.initInventoryCost);
                userSettings.push(obj.gameSetup.setup.initBackorderCost);
                if (obj.gameSetup.setup.visibleShippings === true) {
                    userSettings.push('Yes');
                } else {
                    userSettings.push('No');
                }
                if (obj.gameSetup.setup.visibleDemands === true) {
                    userSettings.push('Yes');
                } else {
                    userSettings.push('No');
                }
                if (obj.gameSetup.setup.allowMessaging === true) {
                    userSettings.push('Yes');
                } else {
                    userSettings.push('No');
                }
            });
        }

        return userSettings;
    }
});
