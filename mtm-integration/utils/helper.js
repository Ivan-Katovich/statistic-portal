const config = require('./../../globalConfig');

const helper = {
    getOptions: function(url,transform,message,body){
        let opts = {
            method: 'POST',
            username: config.mtmInt.username,
            password: config.mtmInt.password,
            agentClass: require('agentkeepalive'),
            headers:{
                'User-Agent': 'Team Foundation (mtm.exe, 11.0.50727.1, Other, SKU:9)',
                'X-TFS-Version': '1.0.0.0',
                'Accept-Language': 'en-US',
                'Content-Type': 'application/soap+xml; charset=utf-8',
                // 'Host': 'tfs-app.vertafore.com:8080',
            }
        };
        opts.url = url;
        opts.transform = transform;
        opts.body = body;
        opts.headers['Authorization'] = message;
        return opts;
    },

    includeHeaders: function(body, response, resolveWithFullResponse) {
        return {'headers': response.headers, 'data': body, 'statusCode': response.statusCode};
    },

    delay: function(t){
        return new Promise(function(resolve) {
            setTimeout(resolve, t)
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
        });
    },
};

module.exports = helper;