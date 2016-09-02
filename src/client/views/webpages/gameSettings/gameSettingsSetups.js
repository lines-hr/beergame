Template.gameSettingsSetups.events({
    'click .loadSetup': function (e) {
        e.preventDefault();

        var gameId = Meteor.apply('Game.loadSetup', [this._id], { returnStubValue: true });

        $('#newGameModal').on('hidden.bs.modal', function () {
            FlowRouter.go('/room/' + gameId);
        }).modal('hide');
    }
});