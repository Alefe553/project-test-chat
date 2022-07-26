import { messages } from './src/data/fake_data';
import { MessageModel } from "./src/model/message.model";


const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', (req: any, res:any) => {
    res.render('index.html');
});

io.on('connection', (socket:any) => {
    console.log(`socket conectado: ${socket.id}`);

    socket.emit('previousMessage', messages);

    socket.on('sendMessage', (data:any) => {
        console.log(data);

        var newData:MessageModel = {
            id: socket.id,
            authou: data.authou,
            message: data.message
        };

        messages.push(newData);
        socket.broadcast.emit('recivedMessage', newData);
    })
})

server.listen(3001);