import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
});

Accounts.onCreateUser(function(options, user) {
    if (options.profile)
        user.profile = options.profile;

    user.profile.emailHash = CryptoJS.MD5(options.email).toString();

    return user;
});