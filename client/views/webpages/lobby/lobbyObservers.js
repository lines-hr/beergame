Template.lobbyObservers.onCreated(function () {
    Meteor.subscribe("GameSetup");
    Meteor.subscribe("Game");
});

Template.lobbyObservers.events({
    'click .joinRoom': function (e) {
        game = e.target.value;
        user = Meteor.userId();

        Game.update({_id: game}, {$push:
            { "observers": user }
        });

        FlowRouter.go('/room');
    }
});
