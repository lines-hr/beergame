//meteor npm install --save chart
var Chart = require("chart");

function updateChart(d) {

    var chartData = new Array({x: 0, y: 0});
    $.each(d, function (index, value) {
        if (!value.roundNumber || !value.demand) return false;
        chartData.push({x: value.roundNumber, y: value.demand});
    });
    scatterChart = new Chart($("#demandChart"), {
        type: 'line',
        data: {
            datasets: [{
                label: 'Demand',
                data: chartData,
                lineTension: 0,
                fill: false,
                borderColor: "#F00"
            }]
        },
        options: {
            scales: {
                xAxes: [{
                    type: 'linear',
                    position: 'bottom',
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Game Rounds'
                    },
                    ticks: {
                        min: 0,
                        stepSize: 1
                    }
                }],
                yAxes: [{
                    type: 'linear',
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Demand'
                    },
                    ticks: {
                        min: 0
                    }
                }]
            }
        }
    });
}

Template.gameSettings.onCreated(function () {
    Meteor.subscribe("GameSetup");
});

Template.gameSettings.onRendered(function () {
});

Template.gameSettings.events({
    'click #goRoomBtn': function(e) {
        e.preventDefault();

        FlowRouter.go('/room');
    }
});

AutoForm.addHooks('insertGameSettingsForm', {
    onSubmit: function (insertDoc, updateDoc, currentDoc) {
        console.log(arguments);
        return false;
    },
    onError: function (name, error, template) {
        console.log(name + " error:", error);
    },
    formToDoc: function (doc) {
        demandSetup = doc.setup.initDemand;
        if(demandSetup)
            updateChart(demandSetup);
    }
});

AutoForm.addHooks(null, {
    onError: function (name, error, template) {
        console.log(name + " error:", error);
    }
});

Template.gameSettings.events({
    'submit #insertGameSettingsForm'(e) {
        e.preventDefault();

        const target = e.target;
        const title = target.title.value;
/*        const stock = t.setup.initStock;
        const incomingDelivery = t.setup.initIncomingDelivery;
        const incomingOrder =  t.setup.initIncomingOrder;
        const backorder = t.setup.initBackorder;
        const rounds = t.setup.initRoundLengthShippingDelay;
        const amount = t.setup.initAmountShippingDelay;
        const inventoryCost = t.setup.initInventoryCost;
        const backorderCost = t.setup.initBackorderCost;
        const maxRounds = t.setup.initMaxRounds;
        const visibleShippings = t.setup.visibleShippings;
        const visibleDemands = t.setup.visibleDemands;
        const allowMessaging = t.setup.allowMessaging;
        const demand = t.setup.initDemand;*/

        alert(title);
    }
});

SimpleSchema.debug = true;