var express = require('express');
var http = require('http');
var faye = require('faye');
var synchronized = require('synchronized');
var readline = require('readline');

var app = express();

var bayeux = new faye.NodeAdapter({
    mount: '/pubsub'
});

var stats = {
    start_time_ms: Date.now(),
    messages_sent: 0,
};

app.get('/', function(request, response) {
    response.send(JSON.stringify({
        uptime_in_seconds: 1e-3 * (Date.now() - stats.start_time_ms),
        messages_sent: stats.messages_sent,
    }));
});

var server = http.createServer(app);

bayeux.attach(server);
server.listen(3506, function() {
    var client = bayeux.getClient();

    var rl = readline.createInterface(process.stdin, process.stdout);
    var lock;

    rl.on('line', function(line) {
        synchronized(lock, function(callback) {
            console.log(line);
            client.publish('/log', {
                text: line
            });
            ++stats.messages_sent;
            callback();
        });
    });

    rl.on('close', function() {
        synchronized(lock, function(callback) {
            console.log('Tearing down.');
            process.exit(0);
        });
    });
});
