const messageSchem = require('./models/messageSchema');
const User = require('./models/userSchema')
const cookieParser = require('cookie-parser');
const passport = require('passport');
const _=require('lodash');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('./config');


function createToken (body) {
    return jwt.sign(
        body,
        config.jwt.secretOrKey,
        {expiresIn: config.expiresIn}
    );
}

function checkAuth (client, next) {
    passport.authenticate('jwt', { session: false }, (err, decryptToken, jwtError) => {
        if(jwtError != void(0) || err != void(0))
         return 'Some error!';
        client.user = decryptToken;
        next();
    })(client, next);
}


let online = 0;

module.exports = io => {
io.on('connection', (client) => {
    //client.join('general')
    let allMessages = messageSchem.find().sort({Addat: 1}).limit(10).lean();//избавляемся от лишней информации, которая к нам приходит
    const allUsers = User.find();
            allMessages.exec(function(err,docs){//.sort('-time').limit(10).
                    if(err) throw err;
                    console.log('Send message from DB');

                    //client.to('general').emit("All-message", docs, 'general');
                    client.emit("All-message", docs);
                    console.log(docs);
                    console.log('Messages from DB');
             })
             allUsers.exec(function(err,users){
                 if(err) throw err;
                 client.emit("All-users", users);
             })
    
    console.log(++online);
    client.broadcast.emit("change-online", online);
   
    client.on('register',async(user) => {
        try {
            let userDB = await User.findOne({email: user.email}).lean().exec();
            if(userDB != void(0)) {message = {message: "User already exist"};
                }
            else

           { userDB = await User.create({
                username: user.username,
                password: user.password,
                email: user.email,
            });
        

            const token = createToken({id: userDB._id, username: userDB.username});

            // client.cookie('token', token, {
            //     httpOnly: true
            // });

            message = {message: "User created.", currentUser: userDB};
        }
        client.emit('register-on-DB', message);
        } catch (e) {
            console.error("E, register,", e);
            message = {message: "some error"};
            client.emit('register-on-DB', message);
        }
    });

    client.on('login', async(user) => {
        try {
            let userDb = await User.findOne({email: user.email}).lean().exec();
            if(userDb!= void(0) && bcrypt.compareSync(user.password, userDb.password)) {
                const token = createToken({id: userDb._id, email: userDb.email});
                // res.cookie('token', token, {
                //     httpOnly: true
                // });

                // res.status(200).send(
                    message = {message: "User login success", currentUser: userDb};
                    client.emit('login-done',message);
            } else {
                if (userDb === void(0)) {
                    message = {message: "User not exist"}
                    client.emit('login-done',message);
                } else {
                 if ((userDb !== void(0) && !bcrypt.compareSync(user.password, userDb.password))) {
                    message = {message: "Password not correct."};
                    client.emit('login-done',message);
                }
            }
            }
            
        } catch (e) {
            console.error("E, login,", e);
            message = {message: "Some error in login"};
                    client.emit('login-done',message);
        }
    });

    client.on("disconnect", () => {
        console.log(--online);
        client.broadcast.emit("change-online", online);
    });
    client.on("message", (message) => {
        messageSchem.create(message, err => {
            if(err) return console.error(err);
            client.broadcast.emit("new-message", message);
        })
    });
    client.on("deletMessage", (messageId) => {
        messageSchem.findOneAndDelete({messId:messageId}, err=> {
            if (err) throw err;
            console.log('message delete')
            client.broadcast.emit("messageWasDeleted", messageId);
        })
    });

    client.on("user-online", (userName)=>{
        client.broadcast.emit("userAddedOnline", userName)
    })

    client.on("editMessage", (id, editMess) => {
        messageSchem.findOneAndUpdate({messId: id}, editMess, err => {
            if (err) throw err
            console.log('Message succsessfully edit!')
            client.broadcast.emit("message-was-edited", editMess);
        })
    })
 
    client.on("typing", (is) => {
        client.broadcast.emit("somebody-typing", is);
    })
});
}
