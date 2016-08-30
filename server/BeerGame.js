
BeerGame = {

    startGame (gameId) {
        var game = Game.findOne({_id: gameId});
        if(game && Meteor.userId() == game.gameAdmin){
            this.setInitialRound(game);
        }
    },

    setInitialRound(game){

        const customerDemand = _.find(game.__initDemand,function(d){return d.roundNumber == 1}).demand;

        const paramChainOthers = {
            lastInventory: game.gameSetup.initStock,
            lastBackOrder: game.gameSetup.initBackorder,
            incomingDelivery: game.gameSetup.initIncomingDelivery,
            incomingOrder: game.gameSetup.initIncomingOrder,
            backorderCost: game.gameSetup.initBackorderCost,
            inventoryCost: game.gameSetup.initInventoryCost,
            lastCostSum: 0,
            lastMyOrdersSum: 0,
            lastOrder: game.gameSetup.initIncomingOrder + game.gameSetup.initBackorder,
            lastSumIncomingDelivery: 0,
            lastIncomingDelivery: 0
        };

        const paramChainRetailer = {
            lastInventory: game.gameSetup.initStock,
            lastBackOrder: game.gameSetup.initBackorder,
            incomingDelivery: game.gameSetup.initIncomingDelivery,
            incomingOrder: customerDemand,
            backorderCost: game.gameSetup.initBackorderCost,
            inventoryCost: game.gameSetup.initInventoryCost,
            lastCostSum: 0,
            lastMyOrdersSum: 0,
            lastOrder: customerDemand + game.gameSetup.initBackorder,
            lastSumIncomingDelivery: 0,
            lastIncomingDelivery: 0
        };

        var othersData = this.calculate.round(paramChainOthers);
        var retailerData = this.calculate.round(paramChainRetailer);

        /*
        const sharedRetailerWholesaler = {
            upperPreviousOutgoingDelivery: 0,
            lowerPreviousOrder: 0,
        };

        const sharedWholesalerDistributor = {
            upperPreviousOutgoingDelivery: 0,
            lowerPreviousOrder: 0,
        };

        const sharedDistributorFactory = {
            upperPreviousOutgoingDelivery: 0,
            lowerPreviousOrder: 0,
        };
        */


        const gameRound = {
            gameId: game._id,
            gameRound: 1,
            dataRetailer: retailerData,
            //sharedRetailerWholesaler: {},
            dataWholesaler: othersData,
            //sharedWholesalerDistributor: {},
            dataDistributor: othersData,
            //sharedDistributorFactory: {},
            dataFactory: othersData,
        }

        if(GameRound.insert(gameRound)){
           Game.update({_id: game._id}, {$set: { currentRound: 1 }});
        };

    },

    setOrder (gameId, order){
        if(Meteor.userId()){
            var game = Game.findOne({_id: gameId});
            if(game){
                var player = _.find(game.players, function(p){return Meteor.userId() === p.playerId;});
                if(player){

                    var currentRoundData = {};
                    switch ( player.position ) {
                        case "Retailer" :
                            currentRoundData.dataRetailer = {myOrder: order};
                            break;
                        case "Wholesaler" :
                            currentRoundData.dataWholesaler = {myOrder: order};
                            break;
                        case "Distributor" :
                            currentRoundData.dataDistributor = {myOrder: order};
                            break;
                        case "Factory" :
                            currentRoundData.dataFactory = {myOrder: order};
                            break;
                    }
                    var currentRoundId = this.saveRound(game._id, game.currentRound, currentRoundData);

                    this.nextRoundSetup(game._id, currentRoundId);

                    if(this.allPlayed(currentRoundId)){
                        this.increaseRound(currentRoundId);
                    }

                }else{
                    console.log("User" + Meteor.userId() + "trying to hax us!");
                }
            }
        }else{
            console.log("Unknown user trying to hax us!");
        }
    },

    test () {

    },

    saveRound (gameId, roundNumber, data) {
        var gameRound = GameRound.findOne({gameId: gameId, gameRound: roundNumber});
        if (gameRound){
            GameRound.update({_id: gameRound._id}, {$set: {data}});
            return gameRound._id;
        }else{
            data.gameRound = roundNumber;
            return GameRound.insert();
        }
    },

    getCurrentRound (gameId, currentRoundNumber) {
        return GameRound.findOne({gameId: gameId, gameRound: currentRoundNumber});
    },

    nextRoundSetup (gameId, currentRoundId){

        // postaviti vrijednosti za iduce runde ??? KAKO ???
        // ako runda ne postoji, kreirati, inace updateati

    },

    allPlayed (roundId){
        var gameRound = GameRound.findOne({_id: roundId});
        var r = typeof gameRound.dataRetailer.myOrder !== "undefined";
        var w = typeof gameRound.dataWholesaler.myOrder !== "undefined";
        var d = typeof gameRound.dataDistributor.myOrder !== "undefined";
        var f = typeof gameRound.dataFactory.myOrder !== "undefined";
        return r && w && d && f;
    },

    increaseRound (currentRoundId) {
        return GameRound.update({_id: currentRoundId},{$inc: {currentRound: 1}});
    },

    calculate : {

        stockAvailable (lastInventory, incomingDelivery) {
            return lastInventory + incomingDelivery;
        },

        toShip (lastBackOrder, incomingOrder) {
            return lastBackOrder + incomingOrder;
        },

        outgoingDelivery (toShip, stockAvailable) {
            return ( toShip <= stockAvailable ) ? toShip : stockAvailable;
        },

        backorder (toShip, outgoingDelivery) {
            return toShip - outgoingDelivery;
        },

        inventory (stockAvailable, outgoingDelivery) {
            return stockAvailable - outgoingDelivery;
        },

        costRound (backorder, backorderCost, inventory, inventoryCost){
            return backorder * backorderCost + inventory * inventoryCost
        },

        costSum (lastCostSum, costRound) {
            return lastCostSum + costRound;
        },

        sumMyOrders (lastMyOrdersSum, lastOrder){
            return lastMyOrdersSum + lastOrder;
        },

        sumIncomingDelivery (lastSumIncomingDelivery, lastIncomingDelivery){
            return lastSumIncomingDelivery + lastIncomingDelivery;
        },

        pendingDelivery (sumMyOrders, sumIncomingDelivery){
            return sumMyOrders - sumIncomingDelivery;
        },

        round(params) {
            /*
                REQUIRED PARAMS:

                params.lastInventory,
                params.lastBackOrder,
                params.incomingDelivery,
                params.incomingOrder,
                params.backorderCost,
                params.inventoryCost,
                params.lastCostSum,
                params.lastMyOrdersSum,
                params.lastOrder,
                params.lastSumIncomingDelivery,
                params.lastIncomingDelivery

            */

            var stockAvailable = this.stockAvailable(params.lastInventory, params.incomingDelivery);
            var toShip = this.toShip(params.lastBackOrder, params.incomingOrder);
            var outgoingDelivery = this.outgoingDelivery(toShip, stockAvailable);
            var backorder = this.backorder(toShip, outgoingDelivery);
            var inventory = this.inventory(stockAvailable, outgoingDelivery);
            var costRound = this.costRound(backorder, params.backorderCost, inventory, params.inventoryCost);
            var costSum = this.costSum(params.lastCostSum, costRound);
            var sumMyOrders = this.sumMyOrders(params.lastMyOrdersSum, params.lastOrder);
            var sumIncomingDelivery = this.sumIncomingDelivery(params.lastSumIncomingDelivery, params.lastIncomingDelivery);
            var pendingDelivery = this.pendingDelivery(sumMyOrders, sumIncomingDelivery);

            const roundCalculations = {
                incomingDelivery: params.incomingDelivery,
                pendingDelivery: pendingDelivery,
                stockAvailable: stockAvailable,
                incomingOrder: params.incomingOrder,
                __toShip: toShip,
                outgoingDelivery: outgoingDelivery,
                backorder: backorder,
                inventory: inventory,
                costRound: costRound,
                costSum: costSum,
                __sumIncomingDelivery: sumIncomingDelivery,
                __sumMyOrders: sumMyOrders
            };

            return roundCalculations;

        }


    },


};