var express = require('express');
var mongoose=require('mongoose');

var router = express.Router();
var userSchema=new mongoose.Schema({
    name:String,
    email:{type:String,unique:true},
    password:String,
    createdOn:{type:Date, default:Date.now},
    modifiedOn:Date,
    lastLogin:Date
});
var Users=mongoose.model('users',userSchema);
/* GET users listing. */
/*router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});*/

module.exports = router;

module.exports.home=function (req,res) {
    res.render("index");
}

module.exports.create=function (req,res) {
    res.render('user-form',{tittle:'Create User'});

};
module.exports.doCreate=function (req,res) {
    Users.create({
        name:req.body.FullName,
        email:req.body.Email,
        modifiedOn:Date.now(),
        lastLogin:Date.now()
    },function (err,user) {
        if (!err) {

            console.log("user created and save"+user);
            req.session.user={"name":user.name,"email":user.email,"_id":user._id};
            req.session.loggedIn=true;
            res.redirect('/user');
        }
        else{
            console.log(err);
            if (err.code==11000){
                res.redirect('/user/new?exists=true');
            }
            else
                res.redirect('/?error=true');
        }
    });

};
module.exports.index=function (req,res) {
    if(req.session.loggedIn==true){
        res.render('user-page',{
            tittle:req.session.user.name,
            name:req.session.user.name,
            email:req.session.user.email,
            userId:req.session.user._id
        });
    }else{
        res.redirect('/login');
    }
}
module.exports.login=function (req,res) {
    res.render('login-form');
}
module.exports.doLogin=function (req,res) {
    Email=req.body.Email;
    if(req.body.Email){
        Users.findOne({
            "email":Email
        },"_id name email",function (err,user) {
            if(!user){
                res.redirect('/login?404=user');
            }
            else
            {
                req.session.user={
                    "name":user.name,
                    "email":user.email,
                     "_id":user._id};
                req.session.loggedIn=true;
                console.log("logged in as user"+user);
                res.redirect('/user');            }
        });
    }
    else{
        res.redirect('/login?404=error');
    }
}



