
const integrator = require('../mtm-integration/main');

exports.getTcData = function(req,res){
    let body = JSON.parse(req.body);
    console.log(body.suiteIds);
    integrator.getResponseWithTcData(body.suiteIds,['id','testType'],'Automation')
        .then(function (data) {
            let result = JSON.stringify(data);
            res.send(result);
            res.end();
        })
        .catch(function(err){
            res.send({tcCount: 0, selectedCount: 0});
            res.end();
        });
};

exports.getSuitChildrenData = function(req,res){
    let body = JSON.parse(req.body);
    console.log(body.suiteId);
    integrator.getChildrenSuits(body.suiteId)
        .then(function (suits) {
            let result = JSON.stringify(suits);
            res.send(result);
            res.end();
        })
};