Template.gameSettingsNewGame.events({
    /* Button for creating a game with custom settings and redirecting */
    'click #newTemplateBtn': function(e) {
        e.preventDefault();

        $('#newGameModal').on('hidden.bs.modal', function() {
            FlowRouter.go('/gameSettings');
        }).modal('hide');
    },

    /* Button for creating a game with default settings and redirecting */
    'click #defaultTemplateBtn': function(e) {
        e.preventDefault();

        Meteor.call('Game.gameSettingsNewGame.events.defaultTemplateBtn');

        $('#newGameModal').on('hidden.bs.modal', function() {
            FlowRouter.go('/room');
        }).modal('hide');
    }
});