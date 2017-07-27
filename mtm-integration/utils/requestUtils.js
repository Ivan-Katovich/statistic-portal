// process.env.https_proxy='http://127.0.0.1:8888';
// process.env.http_proxy='http://127.0.0.1:8888';
// process.env.NODE_TLS_REJECT_UNAUTHORIZED=0;

const rp = require('request-promise');
const ntlmClient = require('node-ntlm-client');
const xmlUtils = require('./xmlUtils');
const helper = require('./helper');

const url4 = 'http://tfs-app.vertafore.com:8080/tfs/main/Services/v3.0/LocationService.asmx';
const url5 = 'http://tfs-app.vertafore.com:8080/tfs/Main/WorkItemTracking/v4.0/ClientService.asmx';
const url6 = 'http://tfs-app.vertafore.com:8080/tfs/Main/TestManagement/v1.0/TestResults.asmx';

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
                let message3 = ntlmClient.createType3Message(decodedMessage2,'katoviiv','MoveAgain789!',undefined,'vertafore');
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
                let message3 = ntlmClient.createType3Message(decodedMessage2,'katoviiv','MoveAgain789!',undefined,'vertafore');
                return rp(helper.getOptions(url6,helper.includeHeaders,message3,body));
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
                let message3 = ntlmClient.createType3Message(decodedMessage2,'katoviiv','MoveAgain789!',undefined,'vertafore');
                return rp(helper.getOptions(url5,helper.includeHeaders,message3,body));
            })
    },

    ids: {
        tcIds: [],
        suitIds: []
    },

    requestToGetAllIdsFromArrayWithIds: function(ids){
        let suitIdsNew = [];
        let promises = [];
        return Promise.resolve()
            .then(function () {
                ids.forEach(function(id){
                    promises.push(async function(){
                        let body = await xmlUtils.setSuitIdToSuitRequest(id);
                        let resp = await requestUtils.requestSetToGetSuit(body);
                        console.log(message1);
                        // let xml = await xmlUtils.prettyXml(resp.data);
                        // console.log(xml+' !!!!!!!!!!!!!');
                        let newIds = await xmlUtils.getTcIdsFromSuitResponse(resp.data);
                        newIds.suitIds.forEach(function(s){
                            suitIdsNew.push(s);
                        });
                        newIds.tcIds.forEach(function (t) {
                            requestUtils.ids.tcIds.push(t);
                        });
                    }());
                });
                // console.log(promises.length);
                return Promise.all(promises);
            })
            .then(function () {
                if(suitIdsNew.length>0){
                    console.log(suitIdsNew+'');
                    return requestUtils.requestToGetAllIdsFromArrayWithIds(suitIdsNew)
                }else{
                    console.log(requestUtils.ids.tcIds+'');
                    console.log(requestUtils.ids.tcIds.length);
                    return requestUtils.ids.tcIds;
                }
            });
    },

    queue: function(all){
        return new Promise(resolve=>{
            function next() {
                all.splice(0,1)[0]()
                    .then(() => {
                        if ( all.length === 0 ) {
                            return resolve()
                        }
                        next();
                    })
            }
            next();
        })
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
                        // let xml = await xmlUtils.prettyXml(resp.data);
                        // console.log(xml);
                        let newIds = await xmlUtils.getTcIdsFromSuitResponse(resp.data);
                        suitIdsNew = suitIdsNew.concat(newIds.suitIds);
                        requestUtils.ids.tcIds = requestUtils.ids.tcIds.concat(newIds.tcIds);
                    });
                });
                return requestUtils.queue(promises);
            }).catch(function(err){
                console.log(err);
                console.log(suitIdsNew);
            })
            .then(function () {
                if(suitIdsNew.length>0){
                    console.log(suitIdsNew+'');
                    return requestUtils.requestToGetAllIdsFromArrayWithIds2(suitIdsNew)
                }else{
                    console.log(requestUtils.ids.tcIds+'');
                    console.log(requestUtils.ids.tcIds.length);
                    return requestUtils.ids.tcIds
                }
            })
    },

    requestToGetAllIdsFromArrayWithIds3: function(ids){
        let suitIdsNew = [];
        let promisesQueue = [];
        let dividedIds = [];
        let idPart = [];
        ids.forEach(function(id,n,a){
            if(idPart.length<2){
                idPart.push(id);
            }else{
                dividedIds.push(idPart);
                idPart = [];
            }
            if(n === a.length-1){
                dividedIds.push(idPart);
            }
        });
        console.log(dividedIds);
        return Promise.resolve()
            .then(function () {
                dividedIds.forEach(function(idSet){
                    promisesQueue.push(function(){
                        let promisesParallel = [];
                        idSet.forEach(function(id){
                            promisesParallel.push(async function(){
                                let body = await xmlUtils.setSuitIdToSuitRequest(id);
                                let resp = await requestUtils.requestSetToGetSuit(body);
                                console.log(resp.statusCode+' 222');
                                let newIds = await xmlUtils.getTcIdsFromSuitResponse(resp.data);
                                suitIdsNew = suitIdsNew.concat(newIds.suitIds);
                                requestUtils.ids.tcIds = requestUtils.ids.tcIds.concat(newIds.tcIds);
                            }());
                        });
                        return Promise.all(promisesParallel);
                    });
                });
                return requestUtils.queue(promisesQueue);
            })
            .then(function () {
                if(suitIdsNew.length>0){
                    console.log(suitIdsNew+'');
                    return requestUtils.requestToGetAllIdsFromArrayWithIds3(suitIdsNew)
                }else{
                    console.log(requestUtils.ids.tcIds+'');
                    console.log(requestUtils.ids.tcIds.length);
                    return requestUtils.ids.tcIds;
                }
            });
    },
};

module.exports = requestUtils;

requestUtils.requestToGetAllIdsFromArrayWithIds([29651]);
