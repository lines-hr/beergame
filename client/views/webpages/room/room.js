//TODO only for delelopment
Template.room.onCreated(function () {
    Meteor.subscribe('Game');
    Meteor.subscribe('GameSetup');
});

Template.room.events({
    'click #startGame': function (e) {
        Meteor.call('Game.room.events.startGame');
    },

    'click #ready': function (e) {
        const status = e.target.value;

        if (status === "ready") {
            Meteor.call('Game.room.events.ready', true);
        } else {
            Meteor.call('Game.room.events.ready', false);
        }
    },

    /*  */
    'click .toObserve': function (e) {
        removedUserId = e.target.value;
        Meteor.call('Game.room.events.toObserver', removedUserId);
    },

    /* Join game */
    'click .toPlay': function (e) {
        addedUserId = e.target.value;
        Meteor.call('Game.room.events.toPlay', addedUserId);
    },

    /* Exiting room for joined user */
    'click #exitRoom': function () {
        Meteor.call('Game.room.events.exitRoom');
        FlowRouter.go('/lobby');
    },

    /* Cancelling game and deleting game */
    'click #cancelGame': function () {
        Meteor.call('GameSetup.room.events.cancelGame');
        Meteor.call('Game.room.events.cancelGame');
        FlowRouter.go('/lobby');
    }
});

Template.room.helpers({
    /* Redirect to game if 'inProgress'*/
    summon: function () {
        const summon = Meteor.apply('Game.helpers.summon', [], { returnStubValue: true });

        if (summon) {
            FlowRouter.go('/game');
        }
    },

    /**/
    allPlayersReady: function () {
        return Meteor.apply('Game.room.helpers.allPlayersReady', [], { returnStubValue: true });
    },

    /* Check if player is ready */
    ready: function () {
        return Meteor.apply('Game.room.helpers.ready', [], { returnStubValue: true });
    },

    /* Check if user is in room */
    inRoom: function () {
        return Meteor.apply('Game.room.helpers.inRoom', [], { returnStubValue: true });
    },

    /* Check if user is added */
    added: function () {
        return Meteor.apply('Game.room.helpers.added', [], { returnStubValue: true });
    },

    /* Check if admin */
    admin: function () {
        return Meteor.apply('Game.room.helpers.admin', [], { returnStubValue: true });
    },

    /* Listing observers on game admin side */
    listObservers: function() {
        return Meteor.apply('Game.room.helpers.listObservers', [], { returnStubValue: true });
    },

    /* Listing players on game admin side */
    listPlayers: function() {
        return Meteor.apply('Game.room.helpers.listPlayers', [], { returnStubValue: true });

        //players.push({player: obj2.playerId, position: obj2.id});
        //return players.sort(function(a,b) {return (a.position > b.position) ? 1 : ((b.position > a.position) ? -1 : 0);} );
    },

    /* Players positions */
    positions: function() {
        return Meteor.apply('Game.room.helpers.positions', [], { returnStubValue: true });
    },

    /* Game info in room after game is created */
    getGameSettings: function() {
        return Meteor.apply('Game.room.helpers.getGameSettings', [], { returnStubValue: true });
    }
});
