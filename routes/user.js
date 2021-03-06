let express = require('express');
let MongoClient = require('mongodb').MongoClient;

require('dotenv').config();
let dburl = process.env.DB_URL;

let router = express.Router();

router.use((req,res,next)=>{
   if (req.session.loggedin) {
      next();
   }
   else {
      res.redirect('/login');
   }
});

router.get('/', (req,res)=>{
   res.redirect('/user/home');
});

router.get('/home', (req,res)=>{
   MongoClient.connect(dburl, (err,client)=>{

      client.db('user-accounts').collection('users').findOne({username:req.session.username}, (err,user)=>{
         req.session.notes = user.notes;

         res.render('pages/home',{
            session: req.session
         });

         client.close();
      });
      
   });
});

router.post('/notes', (req,res)=>{
   let newNote = req.body;

   if (!newNote.title) {
      newNote.title = "Untitled";
   }
   
   req.session.notes.unshift(newNote);
   
   MongoClient.connect(dburl, (err,client)=>{
      client.db('user-accounts').collection('users').updateOne({username:req.session.username},{
         $set: {notes:req.session.notes}
      }, (err,meta)=>{

         // try to do res.render here if can
         res.end();
         client.close();
      });
   });

});

router.delete('/notes', (req,res)=>{
   let noteNum = req.body.noteNum;

   req.session.notes.splice(noteNum,1);

   MongoClient.connect(dburl, (err,client)=>{
      client.db('user-accounts').collection('users').updateOne({username:req.session.username},{
         $set: {notes:req.session.notes}
      }, (err,meta)=>{
         
         // try to do res.render here if can
         client.close();
         res.end();
      });
   });
});

module.exports = router;