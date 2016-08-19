GameSetup = new Mongo.Collection('GameSetup');

export const GameSetupSchema = new SimpleSchema({

    setupOwner: {
        type: String,
        autoValue: function () {
            return this.userId
        }
    },

    isGlobal: {
        type: Boolean,
        defaultValue: false
    },

    title: {
        type: String,
        label: ' ',
        unique: true
    },

    gamePassword: {
        type: String,
        optional: true,
        label: ' '
    },

    setup: {
        type: new SimpleSchema({
            initStock: {
                type: Number,
                label: 'Stock',
                min: 0
            },
            initIncomingDelivery: {
                type: Number,
                label: 'Incoming Delivery',
                min: 0
            },
            initIncomingOrder: {
                type: Number,
                label: 'Incoming Order',
                min: 0
            },
            initBackorder: {
                type: Number,
                label: 'Backorder',
                min: 0
            },
            initRoundLengthShippingDelay: {
                type: Number,
                optional: true,
                label: 'Rounds',
                min: 0
            },
            initAmountShippingDelay: {
                type: Number,
                optional: true,
                label: 'Amount',
                min: 0
            },
            initInventoryCost: {
                type: Number,
                label: 'Per Unit On Stock',
                min: 0.1
            },
            initBackorderCost: {
                type: Number,
                label: 'Per Unit On Backorder',
                min: 0.2
            },
            /*initMaxRounds: {
                optional: true,
                type: Number,
                label: 'Maximum Rounds'
            },*/
            visibleShippings: {
                type: Boolean,
                defaultValue: false,
                label: 'Visible Shippings'
            },
            visibleDemands: {
                type: Boolean,
                defaultValue: false,
                label: 'Visible Demands'
            },
            allowMessaging: {
                type: Boolean,
                defaultValue: false,
                label: 'Allow Messaging'
            },
            initDemand: {
                type: [Number],
                label: "Initial Demands",
                minCount: 1 //TODO for testing only
            }
            /*initDemand: {
                type: [ new SimpleSchema({
                    roundNumber: {
                        type: Number
                    },
                    demand: {
                        type: Number
                    }
                }) ],
                label: 'Demand'
            }*/
        })
    }
});

GameSetup.attachSchema(GameSetupSchema);
