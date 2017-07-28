// process.env.https_proxy='http://127.0.0.1:8888';
// process.env.http_proxy='http://127.0.0.1:8888';
// process.env.NODE_TLS_REJECT_UNAUTHORIZED=0;

const xmlUtils = require('./utils/xmlUtils');
const helper = require('./utils/helper');
const requestUtils = require('./utils/requestUtils');

async function getResponseWithTcData(startIds,attributes,value){
    let commonCounts = {
        tcCount : 0,
        selectedCount : 0
    };
    let ids = await requestUtils.requestToGetAllIdsFromArrayWithIds2(startIds);
    let xmlSet = await xmlUtils.setIdsToTcRequest(ids,attributes);
    for(let i = 0;i<xmlSet.length;i++){
        let resp = await requestUtils.requestSetToGetTcs(xmlSet[i]);
        console.log(resp.statusCode+' 444');
        // console.log(resp.data);
        let counts = await xmlUtils.getCountOfTcsWithGivenAttribute(resp.data,value);
        commonCounts.tcCount = commonCounts.tcCount + counts.tcCount;
        commonCounts.selectedCount = commonCounts.selectedCount + counts.selectedCount;
    }
    console.log(commonCounts);
    return commonCounts;
}

getResponseWithTcData([4189],['id','testType'],'Automation');



