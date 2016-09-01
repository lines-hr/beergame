GameSetup = new Mongo.Collection('GameSetup');

GameSetup.attachSchema(new SimpleSchema({
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

            /* Not implemented in this version */
            initRoundLengthShippingDelay: {
                type: Number,
                optional: true,
                label: 'Rounds',
                min: 0
            },

            /* Not implemented in this version */
            initAmountShippingDelay: {
                type: Number,
                optional: true,
                label: 'Amount',
                min: 0
            },

            initInventoryCost: {
                type: Number,
                label: 'Per Unit On Stock',
                min: 1
            },

            initBackorderCost: {
                type: Number,
                label: 'Per Unit On Backorder',
                min: 2
            },

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
                type: [new SimpleSchema({
                    roundNumber: {
                        type: Number
                    },

                    demand: {
                        type: Number
                    }
                })],
                label: 'Demand'
            }
        })
    }
}));