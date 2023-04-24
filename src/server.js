import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import fs from 'fs';
import path from 'path';
import routes from './routers';
import checkToken from './routers/verifyToken';
import { notification, createRoom } from './controllers/createRoom.controller';
// import './socket'
const cors = require('cors');

const app = express();
const server = require('http').Server(app);
export const io = require('socket.io')(server);
global.io = io;
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, '../access.log'),
  { flags: 'a' }
);
io.on('connection', socket => {
  socket.on('call-video', (data) => {
    notification();
  });

  socket.on('create-room', (data) => {
    console.log(data)
    createRoom(data);
  });

})

app.use(helmet());
app.use(morgan('combined', { stream: accessLogStream }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors());

//-------------------------Router------------------------------//
app.use('/api/user', checkToken, routes.user);
app.use('/api/role', routes.role);
app.use('/api/auth', routes.auth);
app.use('/api/degree', checkToken, routes.degree);
app.use('/api/workplace', checkToken, routes.workplace);
app.use('/api/doctor', checkToken, routes.doctor);
app.use('/api/bloodGroup', checkToken, routes.bloodGroup);
app.use('/api/patient', checkToken, routes.patient);
app.use('/api/room', checkToken, routes.createRoom);



// app.use((req, res) => {
//   res.status(404).send('404: Page not found');
// });

server.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}!`);
});