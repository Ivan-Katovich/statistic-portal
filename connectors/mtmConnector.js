
const integrator = require('../mtm-integration/main');
let mtmStore = require('../store/mtmStore');

function nameSpace(parent,str){
    let parts = str.split('.');
    for (let i = 0; i<parts.length; i+=1){
        if (typeof parent[parts[i]] === "undefined") {
            parent[parts[i]] = {};
        }
        parent = parent[parts[i]];
    }
    return parent;
}

exports.getTcData = function(req,res){
    let body = JSON.parse(req.body);
    console.log(body.attribute+' ++++++++++++');
    console.log(body.parameter+' ------------');
    let parent = nameSpace(mtmStore.coverage,body.attribute+'.'+body.parameter);
    console.log(parent);
    if(parent[body.suiteIds]){
        res.send(parent[body.suiteIds]);
    }else{
        integrator.getResponseWithTcData(body.suiteIds,['id',body.attribute],body.parameter)
            .then(function (data) {
                let result = JSON.stringify(data);
                parent[body.suiteIds] = result;
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