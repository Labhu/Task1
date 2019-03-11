const _ = require('lodash');
var express = require('express');
var bodyParser = require ('body-parser');

var {First} = require('./task-model');

var {mongodb} =require('./mongodb');
const {authenticate} = require('./authenticate');

var {ObjectID} = require('mongodb'); 

var app =express();

app.use(bodyParser.json());


//  token generate

app.post('/users', (req,res) => { 
    var body = _.pick (req.body , ['email', 'name' , 'address' , 'phone_no' ,'password']);

    console.log(body);
    var tt= new First(body);

    tt.generateAuthToken().then( (result) => {
        res.header('x-auth' ,result).send(tt); 
     }).catch( (err) => {
               res.status(400).send(err)
     })
})


// fetch dataaa......

app.get('/fatch' , authenticate , (req,res) => {

    res.send(req.user);
} );


 
//update data by id ...........
app.patch('/update/:id' , (req,res) => {
    
    var id = req.params.id;
    var body = _.pick(req.body, ['email', 'password']);

    if(!ObjectID.isValid(id)) 
    {
     return res.status(404).send();
    }

First.findByIdAndUpdate(id, {$set : body}, {new: true}).then( (data) => {

    console.log(data);
    if(!data)
     {
         return res.status(404).send();
     }
  res.send({data});

}).catch( (err) => {
    res.status(400).send(); })

});



    
                         

//Log in with authe......

 app.post('/login' , authenticate ,  (req, res) => {

    //console.log("user data" , req.user);

    var body = _.pick( req.body, ['email' , 'password']);

     First.findByCredentials(body.email , body.password).then ((user) => {
      
        res.send(req.user);
        

    }).catch( (e) => {
        console.log( "error in login.." , e)
        res.status(400).send();

    });
})


 // private data

app.get('/private/:id' , authenticate,  (req,res) => {
    
    var id = req.params.id; 

    res.send(req.user);
 } )

 

app.listen(6000 , () => {
    console.log('Server Started up to port 6000');
});