let express = require('express');
let MongoClient = require('mongodb').MongoClient;
let env = require('dotenv');
let bcrypt = require('bcrypt');

env.config();
let dburl = process.env.DB_URL;

let router = express.Router();

router.get('/', (req,res)=>{
   res.redirect('/login');
});

router.get('/login', (req,res)=>{
   res.render('pages/form',{});
});

router.get('/signup', (req,res)=>{
   res.render('pages/form',{});
});

router.post('/login', (req,res)=>{
   ({username,password} = req.body);

   if (username && password) {
      MongoClient.connect(dburl, (err,client)=>{

         client.db('user-accounts').collection('users').find({username:username}).toArray(async (err,result)=>{
            if (results.length == 1) {
               let isMatched = await bcrypt.compare(password, result.password);

               if (isMatched) {
                  req.session.username = username;
                  req.session.loggedin = true;
                  res.redirect('/user/home');
               }
               else {
                  res.send('wrong username or password'); // make this render form with message later.
               }
            }
            else {
               res.send('wrong username or password'); // make this render form with message later.
            }

            client.close();
         });

      });
   }
   else {
      res.send('pls fill both fields'); // make this render form with message later.
   }
});

router.post('/signup', (req,res)=>{
   ({username,password} = req.body);
   
   if (username && password) {
      MongoClient.connect(dburl, (err,client)=>{

         client.db('user-accounts').collection('users').find({username:username}).toArray(async (err,result)=>{
            if (result.length > 0) {
               res.send('this username has already been taken');
            }
            else {
               let hashedPass = await bcrypt.hash(password,10);

               client.db('').collection('').insertOne({username:username, password: hashedPass});

               req.session.username = username;
               req.session.loggedin = true;
               res.redirect('/users/home');
            }
         });

         client.close();
      });
   }
   else {
      res.send('pls fill both fields'); // make this render form with message later.
   }
});

module.exports = router;