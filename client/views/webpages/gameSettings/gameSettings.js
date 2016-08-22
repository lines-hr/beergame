/* TODO
meteor npm install --save chart
var Chart = require('chart');

function updateChart(d) {

    var chartData = new Array({x: 0, y: 0});
    $.each(d, function (index, value) {
        if (!value.roundNumber || !value.demand) return false;
        chartData.push({x: value.roundNumber, y: value.demand});
    });
    scatterChart = new Chart($('#demandChart'), {
        type: 'line',
        data: {
            datasets: [{
                label: 'Demand',
                data: chartData,
                lineTension: 0,
                fill: false,
                borderColor: '#F00'
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
*/

Template.gameSettings.events({
    /* Button for cancel game in creating game settings */
    'click #cancelCreate': function () {
        FlowRouter.go('/lobby');
    }
});

AutoForm.addHooks('insertGameSettingsForm', {
    //TODO yolo in production not needed
    onSubmit: function (insertDoc, updateDoc, currentDoc) {
        /*
        console.log(arguments);
        return false;
        */
    },

    //TODO yolo in production not needed
    onError: function (name, error, template) {
        console.log(name + ' error:', error);
    },

    //TODO yolo
    /*
    formToDoc: function (doc) {
        demandSetup = doc.setup.initDemand;
        if(demandSetup)
            updateChart(demandSetup);
    },
    */

    onSuccess: function(formType, result) {
        Meteor.call('Game.gameSettings.autoform.onSuccess', result);
        FlowRouter.go('/room');
    }
});

//TODO yolo in production not needed
AutoForm.addHooks(null, {
    onError: function (name, error, template) {
        console.log(name + ' error:', error);
    }
});

//TODO yolo in production not needed
SimpleSchema.debug = true;