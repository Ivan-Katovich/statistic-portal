const fs = require('fs');
// const fs = require('fs-extra');
const xml2js = require('xml2js');
const xml2jsPromise = require('xml2js-es6-promise');
const builder = new xml2js.Builder();
const config = require('./../configs/config');

const xmlUtils = {
    prettyXml: function(uglyXml){
        return xml2jsPromise(uglyXml)
            .then(function (result) {
                let xml = builder.buildObject(result);
                return xml;
            })
    },

    readXml: function(path){
        return fs.readFileSync(path,'utf8');
    },

    readXmlByName: function(name){
        return xmlUtils.readXml('./mtm-integration/xmlFiles/'+name+'.xml');
    },

    setSuitIdToSuitRequest: function(id){
        let strId;
        typeof id === 'number' ? strId = id+'' : strId = id;
        return xml2jsPromise(xmlUtils.readXml('./mtm-integration/xmlFiles/bodyForRequestToGetTCIds.xml'))
            .then(function (result) {
                result['s:Envelope']['s:Body'][0].FetchTestSuites[0].suiteIds[0].IdAndRev[0].$.Id = strId;
                let xml = builder.buildObject(result);
                // console.log(xml);
                return xml;
            });
    },

    getTcIdsFromSuitResponse: function(xml){
        return xml2jsPromise(xml)
            .then(function (result) {
                let ids = {
                    tcIds: [],
                    suitIds: [],
                    deletedIds: []
                };
                let tcs;
                if(result['soap:Envelope']['soap:Body'][0].FetchTestSuitesResponse[0].deletedIds[0]){
                    tcs = result['soap:Envelope']['soap:Body'][0].FetchTestSuitesResponse[0].deletedIds;
                    tcs.forEach(function(tc){
                        ids.deletedIds.push(tc.int[0]);
                    })
                }else{
                    tcs = result['soap:Envelope']['soap:Body'][0].FetchTestSuitesResponse[0].FetchTestSuitesResult[0].ServerTestSuite[0].ServerEntries[0].TestSuiteEntry;
                    if(tcs){
                        tcs.forEach(function(tc){
                            if(result['soap:Envelope']['soap:Body'][0].FetchTestSuitesResponse[0].FetchTestSuitesResult[0].ServerTestSuite[0].ServerEntries[0].TestSuiteEntry[0].PointAssignments){
                                ids.tcIds.push(tc.$.EntryId);
                            }else{
                                ids.suitIds.push(tc.$.EntryId);
                            }
                        });
                    }
                }
                // console.log(ids);
                return ids;
            });
    },

    setIdsToTcRequest: function(ids,attributes){
        let ids200 = [];
        let xmlSplit200Tcs = [];
        let attrCodes = [];
        let promises = [];
        while(ids.length>0){
            ids200.push(ids.slice(0,200));
            ids = ids.slice(200);
        }
        if(attributes){
            attributes.forEach(function (attr) {
                attrCodes.push(config.tcAttributes[attr].c);
            })
        }else{
            attrCodes = [config.tcAttributes.id.c,config.tcAttributes.testType.c];
        }
        ids200.forEach(function(idsPart){
            promises.push(xml2jsPromise(xmlUtils.readXml('./mtm-integration/xmlFiles/bodyForRequestToGetTCAttributes.xml'))
                .then(function (result) {
                    result['s:Envelope']['s:Body'][0].PageWorkitemsByIds[0].columns[0].string = attrCodes;
                    result['s:Envelope']['s:Body'][0].PageWorkitemsByIds[0].ids[0].int = idsPart;
                    let xml = builder.buildObject(result);
                    // console.log(xml);
                    xmlSplit200Tcs.push(xml);
                }))
        });
        return Promise.all(promises)
            .then(function () {
                return xmlSplit200Tcs;
            });
    },

    getCountOfTcsWithGivenAttribute: function(xml,value){
        let counts = {
                tcCount : 0,
                selectedCount : 0,
            };
        return xml2jsPromise(xml)
            .then(function (result) {
                let rows = result['soap:Envelope']['soap:Body'][0].PageWorkitemsByIdsResponse[0].items[0].table[0].rows[0].r;
                // console.log(rows);
                counts.tcCount = rows.length;
                rows.forEach(function(row){
                    if(row.f[1] === value){
                        counts.selectedCount+=1;
                    }
                });
                // console.log(counts);
                return counts
            })
    }





};

module.exports = xmlUtils;

// xmlUtils.setSuitIdToSuitRequest(30146);

// xmlUtils.getTcIdsFromSuitResponse(xmlUtils.readXml('./mtm-integration/xmlFiles/responseWithSuitsIds.xml'));

// let ids = [115967,115961,115966,115960,118395,118398,116543,116626,116683,116813,117746,106497,104588,104637,105138,102946,101075,100916,101206,101197,112487,112610,112708,112718,108025,113200,110925,109525,109549,109697,109698,109699,109700,109701,109704,110152,110178,110221,110222,110223,115336,115341,116726,116810,97656,97796,97798,97799,97800,97801,97802,97803,98495,98499,98873,98268,98272,98275,98278,98282,98350,98401,98641,98804,98872,99620,98502,98504,98508,98629,98642,98643,98644,99112,99296,100771,108314,108460,108517,108527,108528,108529,108733,108734,108735,108744,108794,109049,109234,109240,109249,117931,117933,99375,112217,106911,106914,106915,110579,110590,110681,112938,110581,110582,112484,117919,117927,117744,117026,117361,109715,117840,112966,106506,115008,115855,115859,106509,106505,115140,115141,110889,111211,111220,111221,128998,113189,113190,113191,113192,113193,112465,127582,127583,127586,118411,117506,117604,117649,117650,117651,97012,97013,97014,97015,97079,97183,97185,106344,106501,96773,96859,96872,96891,96963,97170,97176,107389,107720,107903,108876,108390,108392,108394,108457,108458,108633,108634,107816,108395,108402,108407,108865,108539,108540,108541,108455,108456,108640,108725,108451,108452,108552,108553,108554,108555,109355,109356,109357,115012,115015,115011,115010,115186,115278,117204,117259,117267,117270,115306,115368,115369,117044,94726,94727,95132,95134,106332,106389,106495,106516,95144,95145,95255,95285,95749,95762,95764,96192,95303,95304,95640,95645,95646,95650,95743,95867,95167,95312,95314,95316,95319,95380,95854,95367,95371,95378,95563,95745,96606,95372,95579,95581,95852,95860,95978,96263,96193,96195,96265,104557,104598,104675,104763,105473,102642,102714,102715,102731,102737,102934,95850,95866,95851,95856,96202,96204,95853,97089,96276,97422,97534,97646];
// xmlUtils.setIdsToTcRequest(ids);

// xmlUtils.getCountOfTcsWithGivenAttribute(xmlUtils.readXml('./mtm-integration/xmlFiles/responseWithTcAttributes.xml'),'Automation');

