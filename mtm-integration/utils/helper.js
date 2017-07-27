
const helper = {
    getOptions: function(url,transform,message,body){
        let opts = {
            method: 'POST',
            username: 'katoviiv',
            password: 'MoveAgain789!',
            agentClass: require('agentkeepalive'),
            headers:{
                'User-Agent': 'Team Foundation (mtm.exe, 11.0.50727.1, Other, SKU:9)',
                'X-TFS-Version': '1.0.0.0',
                'Accept-Language': 'en-US',
                'Content-Type': 'application/soap+xml; charset=utf-8',
                'Host': 'tfs-app.vertafore.com:8080',
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
};

module.exports = helper;