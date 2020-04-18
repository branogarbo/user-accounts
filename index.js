let express = require('express');
let session = require('express-session');
let bodyParser = require('body-parser');
let path = require('path');
let env = require('dotenv');
let main = require('./routes/main.js');
let users = require('./routes/users.js');

env.config();
let port = process.env.PORT;

let app = express();

app.use(session({
   secret: 'secret',
   resave: true,
   saveUninitialized: true
}));
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,'public')));

app.use('/',main);
app.use('users',users);

app.listen(port, console.log(`listening on port ${port}`));