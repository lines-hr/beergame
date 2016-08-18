Template.lobbyObservers.onCreated(function () {
    Meteor.subscribe("GameSetup");
    Meteor.subscribe("Game");
});

Template.lobbyObservers.events({
    'click .joinRoom': function (e) {
        game = e.target.value;
        user = Meteor.userId();

        /*Game.update({_id: game}, {$set:
            { "mirko": user }
        });*/
        Game.update({_id: game}, {$set:
            { "observer.observerId": user }
        });


        //FlowRouter.go('/room');
    }
});
