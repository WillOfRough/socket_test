const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

router.get('/socket', (req, res) => {
    res.render('socket');
});
// NameSpace 1번
const namespace1 = io.of('/namespace');
// connection을 받으면, news 이벤트에 hello 객체를 담아 보낸다
namespace1.on('connection', (socket) => {
    namespace1.emit('news', {hello: "Someone connected at namespace1"});
});