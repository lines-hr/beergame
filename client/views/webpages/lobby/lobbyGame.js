Template.lobbyGame.events({
    'click .joinRoom': function (e) {
        Meteor.call('Game.lobbyGame.events.joinRoom', this._id);
        FlowRouter.go('/room/' + this._id);
    }
});

Template.lobbyGame.helpers({
    enableJoin: function () {
        return Meteor.apply('Game.helpers.enableUser', [], { returnStubValue: true });
    }
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
