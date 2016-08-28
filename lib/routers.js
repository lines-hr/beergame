Accounts.onLogout(function(){
    FlowRouter.go('index');
});

/*
 * ---------------
 * Public routes -
 * ---------------
 */
const publicRoutes = FlowRouter.group({
    name: 'public'
});

publicRoutes.route('/', {
    name: 'index',
    action(params, queryParams) {
        BlazeLayout.render('mainLayout', {main: 'index'});
    }
});

/*
 * ----------------
 * Private routes -
 * ----------------
 */
const privateRoutes = FlowRouter.group({
    name: 'private',
    triggersEnter: [
        function (ctx, redirect) {
            if (!Meteor.userId()) {
                FlowRouter.go('index');
            }
        }
    ]
});

privateRoutes.route('/newSettings', {
    name: 'newSettings',
    action(params, queryParams) {
        BlazeLayout.render('mainLayout', {main: 'newSettings'});
    }
});

privateRoutes.route('/lobby', {
    name: 'lobby',
    action(params, queryParams) {
        BlazeLayout.render('mainLayout', {main: 'lobby'});
    }
});

privateRoutes.route('/room/:gameId', {
    name: 'roomId',
    action(params, queryParams) {
        BlazeLayout.render('mainLayout', {main: 'room'});
    }
});

privateRoutes.route('/room', {
    name: 'room',
    action(params, queryParams) {
        BlazeLayout.render('mainLayout', {main: 'room'});
    }
});

privateRoutes.route('/game', {
    name: 'game',
    action(params, queryParams) {
        BlazeLayout.render('mainLayout', {main: 'game'});
    }
});

privateRoutes.route('/game/:gameId', {
    name: 'gameId',
    action(params, queryParams) {
        BlazeLayout.render('mainLayout', {main: 'game'});
    }
});

privateRoutes.route('/editSettings/:setupId', {
    name: 'editSettings',
    action(params, queryParams) {
        BlazeLayout.render('mainLayout', {main: 'editSettings'});
    }
});