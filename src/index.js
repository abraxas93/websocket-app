
const server = require('http').createServer(handler);
const fs = require('fs');
const io = require('socket.io').listen(server);
server.listen(3001, () => console.log('app is running on port 3001'));

function handler(req, res) { // just return index.html
    fs.readFile(__dirname + '/index.html',
        function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading index.html');
            }
            
            res.writeHead(200);
            res.end(data);
        });
}

io.sockets.on('connection', function (socket) { // handler for incoming connections
    console.log(socket);
    socket.on('chat', function (data) {
        var msg = JSON.parse(data);
        var reply = JSON.stringify({action: 'message', user: msg.user, msg: msg.msg });
        socket.emit('chat', reply);
        socket.broadcast.emit('chat', reply);
    });

    socket.on('join', function(data) {
        var msg = JSON.parse(data);
        var reply = JSON.stringify({action: 'control', user: msg.user, msg: ' joined the channel' });
        socket.emit('chat', reply);
        socket.broadcast.emit('chat', reply);
    });
});