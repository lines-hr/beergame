Meteor.startup(function () {});

/* Added option for username input during registration (obligated) or login */
Accounts.ui.config({
    passwordSignupFields: 'USERNAME_AND_EMAIL'
});