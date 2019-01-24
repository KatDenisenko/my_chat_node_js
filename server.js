
const PORT  = process.env.PORT || 3003;
const cors = require('cors');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const {Strategy} = require('passport-jwt');
const {jwt} = require('./config');
const io = require("socket.io")(server, {
   path: '/chat/',
   origins: "*:*"
});

mongoose.Promise = global.Promise;//заменяем промисы mongoose на промисы js Promise
mongoose.set('useNewUrlParser', true);//флаги необходимые для конкретной работы mongo db
mongoose.set('useFindAndModify', false);//флаги необходимые для конкретной работы mongo db
mongoose.set('useCreateIndex', true);//флаги необходимые для конкретной работы mongo db
mongoose.connect('mongodb://Admin:qwerty1@ds157064.mlab.com:57064/sandbox_go_it');//подключаемся к бд

passport.use(new Strategy(jwt, function(jwt_payload, done){
    if(jwt_payload !=void(0)) {
        return done(false, jwt_payload);
    }
    done();
}))
mongoose.set('debug', true);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(cors());
app.options('*',cors());

require('./sockets')(io);

app.use(express.static('./frontend/build'));
server.listen(PORT,()=>(console.log(`Сервер запущен на порту ${PORT}`)));