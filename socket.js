const SocketIO = require('socket.io');

module.exports = (server) => {
  const io = SocketIO(server, { path: '/socket.io' });

  io.on('connection', (socket) => { // 웹소켓 연결 시
    const req = socket.request;
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log('새로운 클라이언트 접속!', ip, socket.id, req.ip);
    socket.on('disconnect', () => { // 연결 종료 시
      console.log('클라이언트 접속 해제', ip, socket.id);
      clearInterval(socket.interval);
    });
    socket.on('error', (error) => { // 에러 시
      console.error(error);
    });
    socket.on('reply', (data) => { // 클라이언트로부터 메시지
      console.log(data);
    });
  });


  let room = ['room1', 'room2'];
  let a = 0;

  const namespace = io.of('/namespace');
  namespace.on('connection', (socket) => {
    console.log("space1 conntect");

    socket.on('close', (data) => { // 연결 종료 시
      console.log('종료됨')
      socket.disconnect();
    });

    socket.on('leaveRoom', (num, name) => {
      socket.leave(room[num], () => {
        console.log(name + ' leave a ' + room[num]);
        namespace.to(room[num]).emit('leaveRoom', num, name);
      });
    });

    socket.on('joinRoom', (num, name) => {
      socket.join(room[num], () => {
        console.log(name + ' join a ' + room[num]);
        namespace.to(room[num]).emit('joinRoom', num, name,socket.id);
      });
    });

    socket.on('roomList', (num, name) => {
      var roomClient = io.nsps['namespace'].adapter.rooms[room].sockets;
      namespace.to(room[num]).emit('roomList', roomClient);
    });

    socket.on('chat message', (num, name, msg) => {
      namespace.to(room[num]).emit('chat message', name, msg);
    });
  });


  const namespace1 = io.of('/namespace1');
  namespace1.on('connection', (socket) => {
    console.log("space1 conntect");
    namespace1.emit('news', { hello: "Someone connected at Namespace2" });

    socket.on('close', (data) => { // 연결 종료 시
      console.log('종료됨')
      socket.disconnect();
    });
  });





// NameSpace 2번
  const namespace2 = io.of('/namespace2');
  namespace2.on('connection', (socket) => {
    console.log("space2 conntect");
    namespace2.emit('news', { hello: "Someone connected at Namespace2" });

    socket.on('close', (data) => { // 연결 종료 시
      console.log('종료됨')
      socket.disconnect();
    });
  });
};
