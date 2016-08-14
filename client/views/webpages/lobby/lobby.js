Template.lobby.events({
    'click #newGameBtn': function(e) {
        e.preventDefault();

        $('#newGameModal').modal('show');
    }
});
