Template.gameSettingsSetups.events({
    'click .loadSetup': function (e) {
        e.preventDefault();

        //var old =
        var gameSetup = {};

        this.setup.forEach(function(value, index){
            if (index !== "initDemand") {
                gameSetup.push({index: value});
            }
        });

        const game = {
            gameAdmin: Meteor.userId(),
            status: 'inLobby',
            title: this.title,
            gameSetup: gameSetup,
            numRounds: _.size(this.setup.initDemand),
            __initDemand: this.setup.initDemand
        };

        var gameId = Game.insert(game);

        $('#newGameModal').on('hidden.bs.modal', function() {
            FlowRouter.go('/room/' + gameId);
        }).modal('hide');
    }
});