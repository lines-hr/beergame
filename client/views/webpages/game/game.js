var gameId;

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