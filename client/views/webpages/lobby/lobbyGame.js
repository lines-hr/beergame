Template.lobbyGame.events({
    'click .joinRoom': function (e) {
        if (Meteor.apply('Game.lobbyGame.events.joinRoom', [this._id], { returnStubValue: true })) {
            FlowRouter.go('/room/' + this._id);
        }
    }
});