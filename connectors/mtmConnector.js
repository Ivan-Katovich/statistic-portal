
const integrator = require('../mtm-integration/main');

exports.getTcData = function(req,res){
    let body = JSON.parse(req.body);
    console.log(body.suiteId);
    integrator.getResponseWithTcData([body.suiteId],['id','testType'],'Automation')
        .then(function (data) {
            let result = JSON.stringify(data);
            res.send(result);
            res.end();
        });
};