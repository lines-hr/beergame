Template.gameSettingsNewGame.onCreated(function () {
    Meteor.subscribe("GameSetup");
    Meteor.subscribe("Game");
});

Template.gameSettingsNewGame.events({
    'click #newTemplateBtn': function(e) {
        e.preventDefault();

        $('#newGameModal').on('hidden.bs.modal', function() {
            FlowRouter.go('/gameSettings');
        }).modal('hide');
    },

    'click #defaultTemplateBtn': function(e) {
        e.preventDefault();

        Session.set('templateName', 'Default Beergame');
        Session.set('roomActive', '1');
        delete Session.keys['userGameSettings'];

        var templateId = "";

        GameSetup.find({title: Session.get('templateName')}).forEach(function (obj) {
            templateId = obj._id._str;
        });

        Game.insert({
            gameSetup: templateId,
            gameAdmins: Meteor.userId(),
            gameStatus: 'inLobby'
        });

        $('#newGameModal').on('hidden.bs.modal', function() {
            FlowRouter.go('/room');
        }).modal('hide');
    }
});