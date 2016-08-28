Template.gameSettingsNewGame.onCreated(function () {
    Meteor.subscribe('GameSetup');
});

Template.gameSettingsNewGame.events({
    'click #newTemplateBtn': function (e) {
        e.preventDefault();

        $('#newGameModal').on('hidden.bs.modal', function() {
            FlowRouter.go('/gameSettings');
        }).modal('hide');
    }
});

Template.gameSettingsNewGame.helpers({
    loadSetups: function () {
        return GameSetup.find();
    }
});














/*
Template.gameSettingsNewGame.events({
    /!* Button for creating a game with custom settings and redirecting *!/
    'click #newTemplateBtn': function(e) {
        e.preventDefault();

        $('#newGameModal').on('hidden.bs.modal', function() {
            FlowRouter.go('/gameSettings');
        }).modal('hide');
    },

    /!* Button for creating a game with default settings and redirecting *!/
    'click #defaultTemplateBtn': function(e) {
        e.preventDefault();

        //Meteor.call('Game.gameSettingsNewGame.events.defaultTemplateBtn');
        var gameId = Meteor.apply('Game.gameSettingsNewGame.events.defaultTemplateBtn', [], { returnStubValue: true });

        $('#newGameModal').on('hidden.bs.modal', function() {
            FlowRouter.go('/room/' + gameId);
        }).modal('hide');
    }
});*/
