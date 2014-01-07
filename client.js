var faye = require('faye');

var client = new faye.Client('http://localhost:3506/pubsub');

client.subscribe('/log', function(message) {
    console.log('Got a message: ' + JSON.stringify(message));
});
