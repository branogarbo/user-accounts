let express = require('express');
let MongoClient = require('mongodb').MongoClient;
let bcrypt = require('bcrypt');

require('dotenv').config();
let dburl = process.env.DB_URL;

let router = express.Router();

router.get('/', (req,res)=>{
   if (req.session.loggedin) {
      res.redirect('/user/home');
   }
   else {
      res.redirect('/login');
   }
});

router.get('/login', (req,res)=>{
   res.render('pages/form',{
      title: 'Log In',
      postRoute: '/login',
      linkmsg: `Don't have an account? <a href="/signup">Sign Up</a>`,
      authmsg: '',
      emailField: false
   });
});

router.get('/signup', (req,res)=>{
   res.render('pages/form',{
      title: 'Sign Up',
      postRoute: '/signup',
      linkmsg: `Already have an account? <a href="/login">Log In</a>`,
      authmsg: '',
      emailField: true
   });
});

router.post('/login', (req,res)=>{
   ({username,password} = req.body);

   if (username && password) {
      MongoClient.connect(dburl, (err,client)=>{

         client.db('user-accounts').collection('users').findOne({username:username}, async (err,result)=>{
            if (result) {
               let isMatched = await bcrypt.compare(password, result.password);

               if (isMatched) {
                  req.session.username = username;
                  req.session.loggedin = true;
                  res.redirect('/user/home');
               }
               else {
                  res.render('pages/form',{
                     title: 'Log In',
                     postRoute: '/login',
                     linkmsg: `Don't have an account? <a href="/signup">Sign Up</a>`,
                     authmsg: '<img src="/images/warning.svg"> <span>Wrong username and/or password!</span>',
                     emailField: false
                  });
               }
            }
            else {
               res.render('pages/form',{
                  title: 'Log In',
                  postRoute: '/login',
                  linkmsg: `Don't have an account? <a href="/signup">Sign Up</a>`,
                  authmsg: '<img src="/images/warning.svg"> <span>Wrong username and/or password!</span>',
                  emailField: false
               });
            }

            client.close();
         });

      });
   }
   else {
      res.render('pages/form',{
         title: 'Log In',
         postRoute: '/login',
         linkmsg: `Don't have an account? <a href="/signup">Sign Up</a>`,
         authmsg: '<img src="/images/warning.svg"> <span>Please complete the form!</span>',
         emailField: false
      });
   }
});

router.post('/signup', (req,res)=>{
   ({username,password,email} = req.body);
   
   if (username && password) {
      MongoClient.connect(dburl, (err,client)=>{

         client.db('user-accounts').collection('users').findOne({username:username}, async (err,result)=>{
            if (result) {
               res.render('pages/form',{
                  title: 'Sign Up',
                  postRoute: '/signup',
                  linkmsg: `Already have an account? <a href="/login">Log In</a>`,
                  authmsg: '<img src="/images/warning.svg"> <span>That username is already taken!</span>',
                  emailField: true
               });
            }
            else {
               let hashedPass = await bcrypt.hash(password,10);

               client.db('user-accounts').collection('users').insertOne({
                  username: username, 
                  password: hashedPass,
                  emailField: email,
                  notes: []
               });

               req.session.username = username;
               req.session.loggedin = true;
               res.redirect('/user/home');
            }
            client.close();
         });
            
      });
   }
   else {
      res.render('pages/form',{
         title: 'Sign Up',
         postRoute: '/signup',
         linkmsg: `Already have an account? <a href="/login">Log In</a>`,
         authmsg: '<img src="/images/warning.svg"> <span>Please complete the form!</span>',
         emailField: true
      });
   }
});

module.exports = router;