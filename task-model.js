const mongoose =require ('mongoose');
const {database} = require ('./db');
const _= require ('lodash');
const bcrypt= require('bcryptjs');

const jwt =require('jsonwebtoken');

const validator=require('validator');

var UserSchema = new database.Schema({


    name :{ 
        type : String,
      required : true, 
      minlength : 3,
      trim : true

    },

    email :{
      type : String,
      required : true, 
      minlength : 3,
      trim : true,
      unique : true,
      validator: {
          validate : validator.isEmail,
          message : '{value} is not valid email'
      }
  },

    address : {
        type : String,
      required : true, 
      minlength : 7,
      trim : true

    },

    phone_no : { type : Number,
        required : true, 
        minlength : 10,
        trim : true

    },
  
  password : {
  type : String,
  required : true,
   minlength : 5
  },
  
  tokens : [
  { access : { type : String,  required: true } ,
    token : { type: String , required: true }
  }]
  });


  


UserSchema.methods.toJSON = function() {
  var tt= this;
  var Objectuser =tt.toObject();
   return _.pick(Objectuser, ['_id' , 'email']);
}


UserSchema.methods.generateAuthToken = function() {
  var tt =this;
  var access= 'auth';
  var token = jwt.sign({ _id: user._id.toHexString(), access} ,'abc123').toString();

  tt.tokens.push({ access , token});

  return tt.save().then( () => {
    return token;
  }) 
};


//logging in post..........

UserSchema.statics.findByCredentials =  function(email, password) {
  var First=this;
   

   return  First.findOne({email}).then ( (user) => {
   if(!user) {
           
      return  Promise.reject(); 
  }

    return new Promise( (resolve, reject) => { 
      bcrypt.compare(password, user.password, (err,res) => {

        if(res) {
          resolve(First);

        } else{ reject (); }

      })

    });

  })

}




var First =database.model('First', UserSchema);
   
module.exports ={
    First
}; 