//TODO only for delelopment
Template.room.onCreated(function () {
    Meteor.subscribe('Game');
    Meteor.subscribe('GameSetup');
});

Template.room.events({
    'click #startGame': function (e) {

    },

    'click #ready': function (e) {
        //if (status === "ready") {
        //    Meteor.call('Game.room.events.ready', game);
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

    },

    /* Check if game is ready - all players must be ready */
    gameReady: function () {

    },

    /* Check if player is ready */
    ready: function () {

    },

    /* Check if user is in room */
    inRoom: function () {
        return ReactiveMethod.call('Game.room.helpers.inRoom');
    },

    /* Check if user is added */
    added: function () {
        return ReactiveMethod.call('Game.room.helpers.added');
    },

    /* Check if admin */
    admin: function () {
        return ReactiveMethod.call('Game.room.helpers.admin');
    },

    /* Game admin only have option for cancel game */
    //TODO check if needed
    createdGame: function () {
        return ReactiveMethod.call('Game.room.helpers.admin');
    },

    /* Listing observers on game admin side */
    listObservers: function() {
        return ReactiveMethod.call('Game.room.helpers.listObservers');
    },

    /* Listing players on game admin side */
    listPlayers: function() {
        return ReactiveMethod.call('Game.room.helpers.listPlayers');

        //players.push({player: obj2.playerId, position: obj2.id});
        //return players.sort(function(a,b) {return (a.position > b.position) ? 1 : ((b.position > a.position) ? -1 : 0);} );
    },

    /* Players positions */
    positions: function() {
        return ReactiveMethod.call('Game.room.helpers.positions');
    },

    /* Game info in room after game is created */
    getGameSettings: function() {
        return ReactiveMethod.call('Game.room.helpers.getGameSettings');
    }
});
