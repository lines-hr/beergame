Template.gameSettingsNewGame.onCreated(function () {
    Meteor.subscribe("GameSetup");
    Meteor.subscribe("Game");
});

Template.gameSettingsNewGame.events({
    /*
    * Button for creating a game with custom settings - redirecting
    * */
    'click #newTemplateBtn': function(e) {
        e.preventDefault();

        $('#newGameModal').on('hidden.bs.modal', function() {
            FlowRouter.go('/gameSettings');
        }).modal('hide');
    },

    /*
    * Button for creating a game with default settings
    * */
    'click #defaultTemplateBtn': function(e) {
        e.preventDefault();

        var game = {};

        GameSetup.find({title: "Default Beergame"}).forEach(function (obj) {
            game = {
                setupId: obj._id,
                setupOwner: obj.setupOwner,
                isGlobal: obj.isGlobal,
                title: obj.title,
                gamePassword: obj.gamePassword,
                setup: {
                    initStock: obj.setup.initStock,
                    initIncomingDelivery: obj.setup.initIncomingDelivery,
                    initIncomingOrder: obj.setup.initIncomingOrder,
                    initBackorder: obj.setup.initBackorder,
                    initRoundLengthShippingDelay: obj.setup.initRoundLengthShippingDelay,
                    initAmountShippingDelay: obj.setup.initAmountShippingDelay,
                    initInventoryCost: obj.setup.initInventoryCost,
                    initBackorderCost: obj.setup.initBackorderCost,
                    visibleShippings: obj.setup.visibleShippings,
                    visibleDemands: obj.setup.visibleDemands,
                    allowMessaging: obj.setup.allowMessaging,
                    initDemand: obj.setup.initDemand
                }
            }
        });

        Game.insert({
            gameSetup: game,
            gameAdmins: Meteor.userId(),
            gameStatus: 'inLobby'
        });

        Session.set("roomActive", "1");
        Session.set("templateName", "Default Beergame");
        delete Session.keys['userGameSettings'];

        /*Session.set('templateName', 'Default Beergame');
        Session.set('roomActive', '1');
        delete Session.keys['userGameSettings'];

        var templateId = {
            //title
        };

        //TODO a
        GameSetup.find({title: Session.get('templateName')}).forEach(function (obj) {
            templateId.title = obj.title;

        });

        console.log(templateId);

        Game.insert({
            gameSetup: templateId,
            gameAdmins: Meteor.userId(),
            gameStatus: 'inLobby'
        });*/

        $('#newGameModal').on('hidden.bs.modal', function() {
            FlowRouter.go('/room');
        }).modal('hide');
    }
});