const express = require('express');
const bodyParser = require('body-parser');
const connector = require('./connectors/mtmConnector');
const config = require('./globalConfig');

const app = express();

app.set('port', (process.env.PORT || config.frontend.port));

app.use('/', express.static(__dirname));

app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html');
});

app.listen(app.get('port'), function() {
    console.log('Server started:'+config.frontend.baseUrl+':' + app.get('port') + '/');
});

let bodyStringParser = bodyParser.text({type: '*/*'});

app.post('/connector/getTcData', bodyStringParser, connector.getTcData);