//TODO only for delelopment
Template.lobby.onCreated(function () {
    Meteor.subscribe('Game');
    Meteor.subscribe('GameSetup');
});

Template.lobby.events({
    /* New game button in lobby */
    'click #newGameBtn': function(e) {
        e.preventDefault();
        
        $('#newGameModal').modal('show');
    }
});

Template.lobby.helpers({
    /* Redirect to game if 'inProgress'*/
    summon: function () {
        const summon = Meteor.apply('Game.helpers.summon', [], { returnStubValue: true });

        if (summon) {
            FlowRouter.go('/game');
        }
    },

    /* Returning all 'inLobby' games */
    lobbyGames: function () {
        return Meteor.apply('Game.lobby.helpers.lobbyGames', [], { returnStubValue: true });
    },

    /* Conditions for creating game */
    enableCreate: function () {
        return Meteor.apply('Game.helpers.enableUser', [], { returnStubValue: true });
    }
});