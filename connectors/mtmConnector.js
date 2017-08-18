
const integrator = require('../mtm-integration/main');
let mtmStore = require('../store/mtmStore');

exports.getTcData = function(req,res){
    let body = JSON.parse(req.body);
    console.log(body.suiteIds);
    if(mtmStore.coverage[body.suiteIds]){
        res.send(mtmStore.coverage[body.suiteIds]);
    }else{
        integrator.getResponseWithTcData(body.suiteIds,['id','testType'],'Automation')
            .then(function (data) {
                let result = JSON.stringify(data);
                mtmStore.coverage[body.suiteIds] = result;
                res.send(result);
                res.end();
            })
            .catch(function(err){
                res.send({tcCount: 0, selectedCount: 0});
                res.end();
            });
    }
};

exports.getSuitChildrenData = function(req,res){
    let body = JSON.parse(req.body);
    console.log(body.suiteId);
    if(mtmStore.suits[body.suiteId]){
        res.send(mtmStore.suits[body.suiteId]);
    }else{
        integrator.getChildrenSuits(body.suiteId)
            .then(function (suits) {
                let result = JSON.stringify(suits);
                mtmStore.suits[body.suiteId] = result;
                res.send(result);
                res.end();
            })
    }
};

exports.storeCleaner = function(req,res){
    mtmStore = {
        coverage:{},
        suits:{}
    };
    res.send(true);
};