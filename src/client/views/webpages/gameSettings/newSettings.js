Template.newSettings.onCreated(function () {
    Meteor.subscribe('GameSetup');
});

Template.newSettings.events({
    'click .cancelSettings' : function (e) {
        e.preventDefault();
        FlowRouter.go('/lobby');
    }
});

Template.newSettings.helpers({
    loadSetups: function () {
        return GameSetup.find();
    }
});

AutoForm.addHooks('insertNewSettingsForm', {
    onSuccess: function(formType, result) {
        var gameId = Meteor.apply('Game.loadSetup', [result], { returnStubValue: true });

        FlowRouter.go('/room/' + gameId);
    }
});