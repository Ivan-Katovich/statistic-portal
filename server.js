const express = require('express');
const bodyParser = require('body-parser');
const connector = require('./connectors/mtmConnector');

const app = express();

app.set('port', (process.env.PORT || 3001));

app.use('/', express.static(__dirname));

app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html');
});

app.listen(app.get('port'), function() {
    console.log('Server started: http://localhost:' + app.get('port') + '/');
});

let bodyStringParser = bodyParser.text({type: '*/*'});

app.post('/connector/getTcData', bodyStringParser, connector.getTcData);