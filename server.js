var http = require('http');
var faye = require('faye');
var synchronized = require('synchronized');
var readline = require('readline');

var bayeux = new faye.NodeAdapter({
    mount: '/pubsub'
});

var server = http.createServer(function(request, response) {
    response.writeHead(200, {
        'Content-Type': 'text/plain'
    });
    response.end('Hello, non-Bayeux request.');
});

bayeux.attach(server);
server.listen(8000);
var client = bayeux.getClient();

var rl = readline.createInterface(process.stdin, process.stdout);
var lock;

rl.on('line', function(line) {
    synchronized(lock, function(callback) {
        console.log(line);
        client.publish('/messages', {
            text: line
        });
        callback();
    });
});

rl.on('close', function() {
    synchronized(lock, function(callback) {
        console.log('Tearing down.');
        process.exit(0);
    });
});
