Template.room.onCreated(function () {
    Meteor.subscribe("GameSetup");
});

Template.room.helpers({
    isDefault: function() {
       return Session.get('templateName') !== null;
    }
    /* TODO trenutno je hardcodeano, no za ispis defaultnog templatea mi se čini
       TODO da ne će ni trebati jer ionako tek kad se ude u igru se dodaju vrijednosti,
       TODO koje jednostavno dodamo tako da appendamo cijeli Default Beergame
    ,

    defaultTemplate: function() {
        var defaultSettings = [];

        GameSetup.find({title: "Default Beergame"}).forEach(function (obj) {
            defaultSettings.push(obj.title);
            defaultSettings.push(obj.setup.initMaxRounds);
            defaultSettings.push(obj.setup.initStock);
            defaultSettings.push(obj.setup.initIncomingDelivery);
            defaultSettings.push(obj.setup.initIncomingOrder);
            defaultSettings.push(obj.setup.initBackorder);
            defaultSettings.push(obj.setup.initRoundLengthShippingDelay);
            defaultSettings.push(obj.setup.initAmountShippingDelay);
            defaultSettings.push(obj.setup.initInventoryCost);
            defaultSettings.push(obj.setup.initBackorderCost);
            defaultSettings.push(obj.setup.visibleShippings);
            defaultSettings.push(obj.setup.visibleDemands);
            defaultSettings.push(obj.setup.allowMessaging);
            defaultSettings.push(obj.setup.initDemand);
        })

        return defaultSettings;
    }*/
});

Template.room.destroyed = function(){
    Session.set('templateName', null);
};

