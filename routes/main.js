let express = require('express');
let MongoClient = require('mongodb').MongoClient;
let env = require('dotenv');
let bcrypt = require('bcryptjs');

env.config();
let dburl = process.env.DB_URL;

let router = express.Router();

router.get('/', (req,res)=>{
   res.redirect('/login');
});

router.get('/login', (req,res)=>{
   res.render('pages/form',{
      title: 'Log In',
      linkmsg: `Don't have an account? <a href="/signup">Sign Up</a>`,
      postRoute: '/login',
      authmsg: ''
   });
});

router.get('/signup', (req,res)=>{
   res.render('pages/form',{
      title: 'Sign Up',
      linkmsg: `Already have an account? <a href="/login">Log In</a>`,
      postRoute: '/signup',
      authmsg: ''
   });
});

router.post('/login', (req,res)=>{
   ({username,password} = req.body);

   if (username && password) {
      MongoClient.connect(dburl, (err,client)=>{

         client.db('user-accounts').collection('users').find({username:username}).toArray(async (err,results)=>{
            if (results.length == 1) {
               let isMatched = await bcrypt.compare(password, results[0].password);

               if (isMatched) {
                  req.session.username = username;
                  req.session.loggedin = true;
                  res.redirect('/user/home');
               }
               else {
                  res.render('pages/form',{
                     title: 'Log In',
                     linkmsg: `Don't have an account? <a href="/signup">Sign Up</a>`,
                     postRoute: '/login',
                     authmsg: 'Wrong username and/or password'
                  });
               }
            }
            else {
               res.render('pages/form',{
                  title: 'Log In',
                  linkmsg: `Don't have an account? <a href="/signup">Sign Up</a>`,
                  postRoute: '/login',
                  authmsg: 'Wrong username and/or password'
               });
            }

            client.close();
         });

      });
   }
   else {
      res.render('pages/form',{
         title: 'Log In',
         linkmsg: `Don't have an account? <a href="/signup">Sign Up</a>`,
         postRoute: '/login',
         authmsg: 'Please complete the form'
      });
   }
});

router.post('/signup', (req,res)=>{
   ({username,password} = req.body);
   
   if (username && password) {
      MongoClient.connect(dburl, (err,client)=>{

         client.db('user-accounts').collection('users').find({username:username}).toArray(async (err,results)=>{
            if (results.length > 0) {
               res.render('pages/form',{
                  title: 'Sign Up',
                  linkmsg: `Already have an account? <a href="/login">Log In</a>`,
                  postRoute: '/signup',
                  authmsg: 'That username is already taken'
               });
            }
            else {
               let hashedPass = await bcrypt.hash(password,10);

               client.db('user-accounts').collection('users').insertOne({username:username, password: hashedPass});

               req.session.username = username;
               req.session.loggedin = true;
               res.redirect('/users/home');
            }
            client.close();
         });
            
      });
   }
   else {
      res.render('pages/form',{
         title: 'Sign Up',
         linkmsg: `Already have an account? <a href="/login">Log In</a>`,
         postRoute: '/signup',
         authmsg: 'Please complete the form'
      });
   }
});

module.exports = router;