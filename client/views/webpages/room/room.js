Template.room.onCreated(function () {
    Meteor.subscribe("GameSetup");
    Meteor.subscribe("Game");
});

Template.room.events({
    'click #cancelGame': function () {
        Session.set('roomActive', "0");

        var defaultSetup = "";
        GameSetup.find({title: 'Default Beergame'}).forEach(function (obj) {
            defaultSetup = obj._id._str;
        });

        gameId = "";
        gameStatusId = "";
        Game.find({gameStatus: 'inLobby'}).forEach(function (obj) {
            gameId = obj._id;
            gameStatusId = obj.gameSetup;
        });

        if (defaultSetup !== gameStatusId) {
            GameSetup.remove({_id: gameStatusId});
        }

        Game.remove({_id: gameId});
        delete Session.keys['userGameSettings'];

        Session.set("templateName", '')
        FlowRouter.go('/lobby');
    }
});

Template.room.helpers({
    isDefault: function() {
       return Session.get('templateName') === 'Default Beergame';
    },

    getUserSettings: function() {
        var gameId = Session.get('userGameSettings');
        var userSettings = [];

        GameSetup.find({_id: gameId}).forEach(function (obj) {
            userSettings.push(obj.title);
            if(obj.setup.gamePassword !== "") {
                userSettings.push('Yes');
            } else {
                userSettings.push('No');
            }
            userSettings.push(obj.setup.initMaxRounds);
            userSettings.push(obj.setup.initStock);
            userSettings.push(obj.setup.initIncomingDelivery);
            userSettings.push(obj.setup.initIncomingOrder);
            userSettings.push(obj.setup.initBackorder);
            if(obj.setup.initRoundLengthShippingDelay === undefined) {
                userSettings.push('-');
            } else {
                userSettings.push(obj.setup.initRoundLengthShippingDelay);
            }
            if(obj.setup.initRoundLengthShippingDelay === undefined) {
                userSettings.push('-');
            } else {
                userSettings.push(obj.setup.initAmountShippingDelay);
            }
            userSettings.push(obj.setup.initInventoryCost);
            userSettings.push(obj.setup.initBackorderCost);
            if(obj.setup.visibleShippings === true) {
                userSettings.push('Yes');
            } else {
                userSettings.push('No');
            }
            if(obj.setup.visibleDemands === true) {
                userSettings.push('Yes');
            } else {
                userSettings.push('No');
            }
            if(obj.setup.allowMessaging === true) {
                userSettings.push('Yes');
            } else {
                userSettings.push('No');
            }
        });

        return userSettings;
    }
});

Template.room.destroyed = function(){
    //Session.set('templateName', null);
};

