// process.env.https_proxy='http://127.0.0.1:8888';
// process.env.http_proxy='http://127.0.0.1:8888';
// process.env.NODE_TLS_REJECT_UNAUTHORIZED=0;

const xmlUtils = require('./utils/xmlUtils');
const helper = require('./utils/helper');
const requestUtils = require('./utils/requestUtils');

async function getResponseWithTcData(startIds,attributes,value){
    let ids = await requestUtils.requestToGetAllIdsFromArrayWithIds2(startIds);
    let xml = await xmlUtils.setIdsToTcRequest(ids,attributes);
    let resp = await requestUtils.requestSetToGetTcs(xml);
    console.log(resp.statusCode+' 444');
    // console.log(resp.data);
    let counts = await xmlUtils.getCountOfTcsWithGivenAttribute(resp.data,value);
    console.log(counts);
    return counts;
}

getResponseWithTcData([29215],['id','testType'],'Automation');



