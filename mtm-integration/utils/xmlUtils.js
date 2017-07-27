const fs = require('fs');
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
        let attrCodes = [];
        if(attributes){
            attributes.forEach(function (attr) {
                attrCodes.push(config.tcAttributes[attr].c);
            })
        }else{
            attrCodes = [config.tcAttributes.id.c,config.tcAttributes.testType.c];
        }
        return xml2jsPromise(xmlUtils.readXml('./mtm-integration/xmlFiles/bodyForRequestToGetTCAttributes.xml'))
            .then(function (result) {
                result['s:Envelope']['s:Body'][0].PageWorkitemsByIds[0].columns[0].string = attrCodes;
                result['s:Envelope']['s:Body'][0].PageWorkitemsByIds[0].ids[0].int = ids;
                let xml = builder.buildObject(result);
                // console.log(xml);
                return xml;
            })
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
                    if(row.f[1].toUpperCase() === value.toUpperCase()){
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

// xmlUtils.setIdsToTcRequest([1,2,3])

// xmlUtils.getCountOfTcsWithGivenAttribute(xmlUtils.readXml('./mtm-integration/xmlFiles/responseWithTcAttributes.xml'),'Automation');

