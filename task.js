const _ = require('lodash');
var express = require('express');
var bodyParser = require ('body-parser');

var {First} = require('./task-model');
var {mongodb} =require('./mongodb');
const {authenticate} = require('./authenticate');

var {ObjectID} = require('mongodb'); 

var app=express();

app.use(bodyParser.json());

app.post('/data', (req, res) => {
    //     console.log(req.body);
    // });
        var tt = new First( {

          name : req.body.name,
          email : req.body.email,

          address : req.body.address,
          phone_no : req.body.phone_no,
          password  : req.body.password
        
         });
    
        tt.save().then ((doc) => {
            res.send(doc);
        }, (err) => {
        res.status(400).send(err);
    });
    }); 


 //Logging in post.....
 app.post('/post/login' ,authenticate, (req, res) => {

    var body= _.pick(req.body, ['email' , 'password']);
    
    First.findByCredentials(body.email, body.password).then ((user) => {
 //console.log(user);
        res.send(req.body);
        

    }).catch( (e) => {
 
        res.status(400).send();

    });
})




app.listen(3000, () => {
    console.log('Server Started up to port ');
});