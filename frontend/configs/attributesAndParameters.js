
const data = {

    tcData: {
        Revision: {
            longName: 'Revision',
            shortName: 'rev',
            default: 1,
            values: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
        },
        Priority: {
            longName: 'Priority',
            shortName: 'priority',
            default: 1,
            values: [1,2,3,4]
        },
        'Test type': {
            longName: 'Test type',
            shortName: 'testType',
            default: 'Automation',
            values: ['Acceptance','Automation','End-to-end','Exploratory','Functional','Integration','Perf / Load','Regression','Workflow']
        },
        'Automation status': {
            longName: 'Automation status',
            shortName: 'automationStatus',
            default: 'Not Automated',
            values: ['Not Automated','Planned']
        },
        'Assigned to': {
            longName: 'Assigned to',
            shortName: 'assignedTo',
            default: 'Hurynovich,Karyna',
            values: ['Hurynovich,Karyna','Ochkina,Anastasiya','Karukhina,Elena','Khatskevich,Artsiom']
        },

    }

};

module.exports = data;