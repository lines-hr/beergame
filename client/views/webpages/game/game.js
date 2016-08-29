var gameId;

setInterval(function () {
    Session.set('time', (new Date).toTimeString().substr(0, 8));
}, 500);

Template.game.onCreated(function () {
    var self = this;

    this.getGameId = () => FlowRouter.getParam('gameId');

    gameId = this.getGameId();

    this.autorun(() => {
        this.subscribe('GameRoom', this.getGameId(), function () {
            self.autorun(function (c) {
                var game = Game.find({"_id": gameId, status: 'inProgress'}).count();
                if (game === 0){
                    c.stop();
                    FlowRouter.go("/lobby");
                }
            });
        });

        this.subscribe('User');
    });
});

Template.registerHelper('allowedMessaging', function () {
    var game = Game.findOne({ _id: gameId });

    if (game) {
        if (game.gameSetup.allowMessaging === true) {
            return true;
        } else {
            return false;
        }
    }
});

Template.game.helpers({
    clock: function () {
        return Session.get('time');
    }
});