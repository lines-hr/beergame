Template.room.onCreated(function () {
    Meteor.subscribe("GameSetup");
});

Template.room.helpers({
    isDefault: function() {
       return Session.get('templateName') !== null && Session.get('templateName') !== undefined;
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
    Session.set('templateName', null);
};

