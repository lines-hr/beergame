Template.gameSettingsSetups.events({
    'click .loadSetup': function (e) {
        e.preventDefault();

        var initDemand = this.setup.initDemand;

        console.log(this.setup.initDemand);
        delete this.setup.initDemand;

        const game = {
            gameAdmin: Meteor.userId(),
            status: 'inLobby',
            title: this.title,
            gameSetup: this.setup,
            numRounds: _.size(initDemand),
            __initDemand: initDemand
        };

        var gameId = Game.insert(game);

        $('#newGameModal').on('hidden.bs.modal', function() {
            FlowRouter.go('/room/' + gameId);
        }).modal('hide');


    },

    'click .removeSetup': function (e) {
        e.preventDefault();

        GameSetup.remove({ _id: this._id });
    }
});

Template.gameSettingsSetups.helpers({
    isOwner: function () {
        if (this.gameOwner === Meteor.userId()) {
            return true;
        } else {
            return false;
        }
    },

    isGlobal: function () {
        if (this.isGlobal) {
            return true;
        } else {
            return false;
        }
    }
});