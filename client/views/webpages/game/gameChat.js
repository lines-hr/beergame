var gameId;

Template.gameChat.onCreated(function () {
    var self = this;

    this.getGameId = () => FlowRouter.getParam('gameId');

    gameId = this.getGameId();
});

Template.gameChat.events({
    'click #sendMessage': function (e, t) {
        sendMessage(t);
    },

    'keypress #newMessage': function (e, t) {
        if (e.which === 13) {
            sendMessage(t);
        }
    }
});

function sendMessage (t) {
    var message = t.find('#newMessage').value;
    t.find('#newMessage').value = '';

    if (message) {
        Meteor.call('Game.gameChat.events.sendMessage', gameId, message);

        $('#chatbox').stop().animate({
            scrollTop: $('#chatbox')[0].scrollHeight
        }, 800);
    }
}

Template.registerHelper('equals', function (a, b) {
    return a === b;
});

Template.gameChat.helpers({
    listMessages: function () {
        game = Game.findOne({_id: gameId});

        if (game) {
            var messages = new Array();
            var timestamp;

            // TODO ostaviti ako se bude koristilo
            /*
            var intervalType;
            var interval;
            var seconds;
            */

            var userClass;

            game.messages.forEach(function (o) {

                var user = Meteor.users.findOne({_id: o.authorId});
                if (user && user.profile.emailHash) {

                    // TODO ostaviti ako se bude koristilo
                    /*
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
                    */

                    var h = timeTwoDigits(o.timestamp.getHours());
                    var m = timeTwoDigits(o.timestamp.getMinutes());
                    var s = timeTwoDigits(o.timestamp.getSeconds());

                    timestamp = h + ':' + m + ':' + s;

                    if (o.authorId === Meteor.userId()) {
                        userClass = 'userLogged';
                    } else {
                        userClass = 'user';
                    }

                    messages.push({
                        timestamp: timestamp,
                        authorUsername: o.authorUsername,
                        emailHash: user.profile.emailHash,
                        content: _.unescape(o.content),
                        userClass: userClass
                    });

                    condition = false;
                }
            });

            return messages;
        }
    }
});

function timeTwoDigits (timeUnit) {
    if (timeUnit < 10) {
        return ('0' + timeUnit.toString());
    } else {
        return timeUnit.toString();
    }
}