var faye = require('faye');

var client = new faye.Client('http://localhost:8000/pubsub');

client.subscribe('/messages', function(message) {
    console.log('Got a message: ' + message.text);
});
