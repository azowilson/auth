const express = require('express');
const session = require('express-session');
const MongoDBSession = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./database/models/user');
const AppResponse = require('./common/appResponse');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;
//database connection
const connectionString = 'mongodb://localhost:27017/auth';
mongoose.connect(connectionString, {
    useNewUrlParser: true,
    //useCreateIndex: true,
    useUnifiedTopology: true
}).then((result) => {
    console.log('database connected successfully');
}).catch((err) => console.log("connection database fail with exception: ", err.message));

const store = new MongoDBSession({
    uri: connectionString,
    collection: 'UserSession'
});

app.use(session({
    secret: 'test secret',
    resave: false,
    saveUninitialized: false,
    store: store
}));

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.listen(PORT, () => console.log(`listen port ${PORT}`));

app.get('/', (req, res) => {
    req.session.isAuth = true;
    res.send('<h1>hello world</h1>');
});

//register
app.get('/register', (req, res) => {
    res.render("register");
});
app.post('/register', async (req, res) => {
    //console.log(req);
    const existUser = await User.findOne({ email: req.body.email });
    if (existUser) {
        return res.redirect('/register');
    }
    //console.log(req.body);
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
            console.log('hashed password: ', hash);
            const user = new User({
                email: req.body.email,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                password: hash
            }).save();
        })
    })


    return res.redirect('/login');
});

//login
//new change
app.get('/login', async (req, res) => {

    const { password } = req.body;
    const hash = await bcrypt.hash(password, 12);

    return res.send(AppResponse.builder('1000', 'sucess', hash));
})

// app.post('/login', async (req, res) => {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     const checkAuth = await bcrypt.compare(password, user.password);
//     console.log('checkAuth: ', checkAuth);
//     if (!checkAuth) {
//         return res.send('wrong password');
//     }
//     return res.redirect('dashboard')
// });
app.get('/dashboard', (req, res) => {
    return res.render('dashboard');
})