Template.lobby.events({
    /* New game button in lobby */
    'click #newGameBtn': function(e) {
        e.preventDefault();
        
        $('#newGameModal').modal('show');
    }
});

Template.lobby.helpers({
    /* Returning all 'inLobby' games */
    lobbyGames: function () {
        return ReactiveMethod.call('Game.lobby.helpers.lobbyGames');
    },

    /* Conditions for creating game */
    forbidCreate: function () {
        return ReactiveMethod.call('Game.lobby.helpers.forbidUser');
    }
});