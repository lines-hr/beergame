Template.score.events({
    'click .lobbyReturn': function (e) {
        e.preventDefault();

        FlowRouter.go('/lobby');
    }
});