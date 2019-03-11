var{First} = require('./task-model');

var authenticate = (req,res,next) => {
     var token =req.header('x-auth');

    // var token= req.query.xAuth;

  console.log('authenticate...', token);

First.findByToken(token).then ((user) => {

    if(!user)
    {
        return Promise.reject();
  
    }

    req.user=user;
    req.token =token;
    next();

}).catch((e) => {
    console.log("error", e)
    res.status(400).send(e);
})
}

module.exports= {
    authenticate 
}