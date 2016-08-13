GameSetup = new Mongo.Collection("GameSetup");

export const GameSetupSchema = new SimpleSchema({

    setupOwner: {
        type: String,
        regEx: SimpleSchema.RegEx.Id
    },

    isGlobal: {
        type: Boolean,
        defaultValue: false
    },

    title: {
        type: String
    },

    setup: {
        type: new SimpleSchema({
            initStock: {
                type: Number
            },
            initIncomingDelivery: {
                type: Number
            },
            initIncomingOrder: {
                type: Number
            },
            initBackorder: {
                type: Number
            },
            initRoundLengthShippingDelay: {
                type: Number
            },
            initAmountShippingDelay: {
                type: Number
            },
            initInventoryCost: {
                type: Number
            },
            initBackorderCost: {
                type: Number
            },
            initMaxRounds: {
                type: Number
            },
            initDemand: {
                type: new SimpleSchema({
                    roundNumber: {
                        type: Number
                    },
                    demand: {
                        type: Number
                    }
                })
            },
            visibleShippings: {
                type: Boolean
            },
            visibleDemands: {
                type: Boolean
            },
            allowMessaging: {
                type: Boolean
            }

        })
    }
});

GameSetup.attachSchema(GameSetupSchema);
