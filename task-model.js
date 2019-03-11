const mongoose =require ('mongoose');
const {database} = require ('./db');
const _= require ('lodash');
const bcrypt= require('bcrypt');

const jwt =require('jsonwebtoken');

const validator=require('validator');


var UserSchema = new mongoose.Schema({


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
   return _.pick(Objectuser, ['_id','email']);
}


//token generate........

UserSchema.methods.generateAuthToken = function() {
  var tt =this;
  var access= 'auth';
  var token = jwt.sign({ _id: tt._id.toHexString(), access} ,'abc123').toString();

  tt.tokens.push({ access , token});

  return tt.save().then( () => {
    return token;
  }) 
};

// find token...

UserSchema.statics.findByToken = function(token) {
  var First=this;
  var decoded;

  try{
   decoded= jwt.verify(token , '123abc');
  }catch(e) {

  }
  return First.findOne({
    //'_id': decoded._id,
    'tokens.token' : token,
    'tokens.access' : 'auth'
  });
};




// hashing password...........


UserSchema.pre('save',function(next) {
  var tt=this;

  if(tt.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(tt.password ,salt, (err ,hash) => {
         tt.password=hash;
         next();
      })
    })

  }else{
    next();
  }
});

//logging in post..........

UserSchema.statics.findByCredentials =  function (email, password) {

  var First= this;
   

   return  First.findOne( {email} ).then ( (user) => {
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





var First =mongoose.model('First', UserSchema);
   
module.exports ={
    First
}; 