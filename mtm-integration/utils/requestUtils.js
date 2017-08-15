// process.env.https_proxy='http://127.0.0.1:8888';
// process.env.http_proxy='http://127.0.0.1:8888';
// process.env.NODE_TLS_REJECT_UNAUTHORIZED=0;

const rp = require('request-promise');
const ntlmClient = require('node-ntlm-client');
const xmlUtils = require('./xmlUtils');
const helper = require('./helper');
const config = require('./../../globalConfig');

const url5 = config.mtmInt.baseUrl+':'+config.mtmInt.port+'/tfs/Main/WorkItemTracking/v4.0/ClientService.asmx';
const url6 = config.mtmInt.baseUrl+':'+config.mtmInt.port+'/tfs/Main/TestManagement/v1.0/TestResults.asmx';

const requestUtils = {

    message1: ntlmClient.createType1Message('','vertafore'),

    requestToGetMessage3: function(){
        return Promise.resolve()
            .then(function () {
                return rp(helper.getOptions(url6,helper.includeHeaders,requestUtils.message1));
            })
            .catch(function (err) {
                console.log(err.statusCode+ ' 111');
                let message2 = err.response.headers['www-authenticate'];
                let decodedMessage2 = ntlmClient.decodeType2Message(message2);
                let message3 = ntlmClient.createType3Message(decodedMessage2,config.mtmInt.username,config.mtmInt.password,undefined,config.mtmInt.domain);
                return message3;
            })
    },

    requestToGetSuitData: function(body,message3){
        return rp(helper.getOptions(url6,helper.includeHeaders,message3,body));
    },

    requestSetToGetSuit: function(body){
        return Promise.resolve()
            .then(function () {
                return rp(helper.getOptions(url6,helper.includeHeaders,requestUtils.message1));
            })
            .catch(function (err) {
                console.log(err.statusCode+ ' 111');
                let message2 = err.response.headers['www-authenticate'];
                let decodedMessage2 = ntlmClient.decodeType2Message(message2);
                let message3 = ntlmClient.createType3Message(decodedMessage2,config.mtmInt.username,config.mtmInt.password,undefined,config.mtmInt.domain);
                return rp(helper.getOptions(url6,helper.includeHeaders,message3,body))
            })
    },

    requestSetToGetTcs: function(body){
        return Promise.resolve()
            .then(function () {
                return rp(helper.getOptions(url5,helper.includeHeaders,requestUtils.message1));
            })
            .catch(function (err) {
                console.log(err.statusCode+ ' 333');
                let message2 = err.response.headers['www-authenticate'];
                let decodedMessage2 = ntlmClient.decodeType2Message(message2);
                let message3 = ntlmClient.createType3Message(decodedMessage2,config.mtmInt.username,config.mtmInt.password,undefined,config.mtmInt.domain);
                return rp(helper.getOptions(url5,helper.includeHeaders,message3,body));
            })
    },

    ids: {
        tcIds: [],
        suitIds: []
    },

    requestToGetAllIdsFromArrayWithIds2: function(ids){
        let suitIdsNew = [];
        let promises = [];
        return Promise.resolve()
            .then(function () {
                ids.forEach(function(id){
                    promises.push(async function(){
                        let body = await xmlUtils.setSuitIdToSuitRequest(id);
                        let resp = await requestUtils.requestSetToGetSuit(body);
                        let newIds = await xmlUtils.getTcIdsFromSuitResponse(resp.data);
                        suitIdsNew = suitIdsNew.concat(newIds.suitIds);
                        requestUtils.ids.tcIds = requestUtils.ids.tcIds.concat(newIds.tcIds);
                    });
                });
                return helper.queue(promises);
            })
            .then(function () {
                if(suitIdsNew.length>0){
                    console.log(suitIdsNew+'');
                    return requestUtils.requestToGetAllIdsFromArrayWithIds2(suitIdsNew)
                }else{
                    console.log(requestUtils.ids.tcIds+'');
                    console.log(requestUtils.ids.tcIds.length);
                    let total = requestUtils.ids.tcIds;
                    requestUtils.ids = {
                        tcIds: [],
                        suitIds: []
                    };
                    console.log(total+'');
                    console.log(total.length);
                    return total;
                }
            })
    },

    requestWithDbCall: function(body){
        return Promise.resolve()
            .then(function () {
                return rp(helper.getOptions(url6,helper.includeHeaders,requestUtils.message1));
            })
            .catch(function (err) {
                console.log(err.statusCode+ ' 111');
                let message2 = err.response.headers['www-authenticate'];
                let decodedMessage2 = ntlmClient.decodeType2Message(message2);
                let message3 = ntlmClient.createType3Message(decodedMessage2,config.mtmInt.username,config.mtmInt.password,undefined,config.mtmInt.domain);
                return rp(helper.getOptions(url6,helper.includeHeaders,message3,body));
            })
    }
};

module.exports = requestUtils;

// requestUtils.requestToGetAllIdsFromArrayWithIds([29651]);

// requestUtils.requestWithDbCall(xmlUtils.readXml('./mtm-integration/xmlFiles/bodyForRequestWithDbCall.xml'))
//     .then(function (resp) {
//         console.log(resp.data);
//     });

// requestUtils.requestSetToGetTcs(xmlUtils.readXmlByName('xmlWithIdsAndFail'))
//     .then(function (resp) {
//         console.log(resp.data);
//     })
//     .catch(function(err){
//         // console.log(err);
//     });

// xmlUtils.setSuitIdToSuitRequest('5')
//     .then(function (body) {
//         console.log(body);
//         return requestUtils.requestSetToGetSuit(body)
//     })
//     .then(function (resp) {
//         return xmlUtils.getTcIdsFromSuitResponse(resp.data);
//     })
//     .then(function (ids) {
//         console.log(ids);
//     });
