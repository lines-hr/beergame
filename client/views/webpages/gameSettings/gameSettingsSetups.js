Template.gameSettingsSetups.events({
    'click .loadSetup': function (e) {
        e.preventDefault();

        const game = {
            gameAdmin: Meteor.userId(),
            status: 'inLobby',
            title: this.title,
            gameSetup: this.setup
        };

        var gameId = Game.insert(game);

        $('#newGameModal').on('hidden.bs.modal', function() {
            FlowRouter.go('/room/' + gameId);
        }).modal('hide');
    }
});