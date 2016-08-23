Template.lobbyObservers.events({
    /* Joining room/game as observer */
    'click .joinRoom': function (e) {
        joinedGameId = e.target.value;
        Meteor.call('Game.lobbyObservers.events.joinRoom', joinedGameId);
        FlowRouter.go('/room');
    }
});

Template.lobbyObservers.helpers({
    /* Conditions for joining room/game */
    enableJoin: function () {
        return ReactiveMethod.call('Game.helpers.enableUser');
    }
});