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

        $('#newGameModal').on('hidden.bs.modal', function() {
            FlowRouter.go('/room');
        }).modal('hide');
    }
});