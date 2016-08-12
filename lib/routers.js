FlowRouter.route('/', {
    name: 'yolo',
    action(params, queryParams) {
    BlazeLayout.render("yoloLayout");
}
});