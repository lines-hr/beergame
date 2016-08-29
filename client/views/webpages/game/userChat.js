Template.userChat.helpers({
    gravatar: function () {
        user = Meteor.users.findOne({_id: Meteor.userId()});

        if (user) {
            return CryptoJS.MD5(user.emails.address).toString();
        }
    }
});