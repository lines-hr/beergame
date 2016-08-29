var gameId;

Template.gameChat.onCreated(function () {
    var self = this;

    this.getGameId = () => FlowRouter.getParam('gameId');

    gameId = this.getGameId();
});

Template.gameChat.events({
    'click #sendMessage': function (e, t) {
        e.preventDefault();

        var message = t.find('#newMessage').value;
        t.find('#newMessage').value = '';

        if (message) {
            user = Meteor.users.findOne({ _id: Meteor.userId() });

            if (user) {
                Meteor.call('Game.gameChat.events.sendMessage', gameId, user._id, user.username, message);

                $('#chatbox').stop().animate({
                    scrollTop: $('#chatbox')[0].scrollHeight
                }, 800);
            }
        }
    }
});

Template.registerHelper('equals', function (a, b) {
    return a === b;
});

Template.gameChat.helpers({
    listMessages: function () {
        game = Game.findOne({_id: gameId});

        if (game) {
            var messages = new Array();
            var timestamp;
            var intervalType;
            var interval;
            var seconds;
            var userClass;

            game.messages.forEach(function (o) {
                seconds = Math.floor((new Date() - o.timestamp) / 1000);
                interval = Math.floor(seconds / 60);

                if (interval >= 1) {
                    intervalType = "min";
                } else {
                    interval = seconds;
                    intervalType = "sec";
                }

                if (interval === 0) {
                    timestamp = 'Just now';
                } else {
                    timestamp = interval + ' ' + intervalType + ' ago';
                }

                if (o.authorId === Meteor.userId()) {
                    userClass = 'userLogged';
                } else {
                    userClass = 'user';
                }

                messages.push({
                    timestamp: timestamp,
                    authorUsername: o.authorUsername,
                    content: _.unescape(o.content),
                    userClass: userClass
                });

                condition = false;
            });

            return messages;
        }
    }
});