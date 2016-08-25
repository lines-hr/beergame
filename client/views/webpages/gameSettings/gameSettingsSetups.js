Template.gameSettingsSetups.events({
    'click .loadSetup': function (e) {
        e.preventDefault();

        var doc = Meteor.apply('Game.createGame', [this], { returnStubValue: true });

        $('#newGameModal').on('hidden.bs.modal', function() {
            FlowRouter.go('/room/' + doc);
        }).modal('hide');
    }
});