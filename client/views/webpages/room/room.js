Template.room.onCreated(function () {
    Meteor.subscribe("GameSetup");
    Meteor.subscribe("Game");
});

Template.room.events({
    /*
    * Exiting room for joined user
    * */
    'click #exitRoom': function () {
        game = "";

        Game.find({observers: Meteor.userId()}).forEach(function (obj) {
            game = obj._id;
        });

        Game.update({_id: game}, {$pull:
            { observers: Meteor.userId() }
        });

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
        Game.remove(gameId);

        FlowRouter.go('/lobby');
    }
});

Template.room.helpers({
    /*
    * Observer only have option for exit game
    * */
    joined: function () {
        if(Game.find({observers: Meteor.userId()}).count() === 1) {
            return true;
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
    * */
    listObservers: function() {
        var observers = [];

        Game.find({gameAdmins: Meteor.userId(), gameStatus: 'inLobby'}).forEach(function (obj) {
            observers.push({observer: obj.observers});
        });

        return observers;
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
        } else {
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
        }

        return userSettings;
    }
});
