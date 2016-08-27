Template.lobbyGame.events({
    'click .joinRoom': function (e) {
        if (Meteor.apply('Game.lobbyGame.events.joinRoom', [this._id], { returnStubValue: true })) {
            FlowRouter.go('/room/' + this._id);
        }
    }
});

Template.lobbyGame.helpers({
});





/*
Template.lobbyObservers.events({
    /!* Joining room/game as observer *!/
    'click .joinRoom': function (e) {
        joinedGameId = e.target.value;
        Meteor.call('Game.lobbyObservers.events.joinRoom', joinedGameId);
        FlowRouter.go('/room/' + joinedGameId);
    }
});

Template.lobbyObservers.helpers({
    /!* Conditions for joining room/game *!/
    enableJoin: function () {
        return Meteor.apply('Game.helpers.enableUser', [], { returnStubValue: true });
    }
});*/
