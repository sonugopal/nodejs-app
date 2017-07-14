var express = require('express');
var mongoose=require('mongoose');

var router = express.Router();
var userSchema=new mongoose.Schema({
    name:String,
    email:{type:String,unique:true},
    password:String,
    createdOn:{type:Date, default:Date.now},
    modifiedOn:{type:Date, default:Date.now},
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
        password:req.body.Password,
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
    var Email=req.body.Email;
    var Password=req.body.Password;
    if(req.body.Email){
        Users.findOne({
            "email":Email,
            "password":Password
        },"_id name password email",function (err,user) {
            if(!user){
                res.redirect('/login?404=user');
            }
            else
            {
                req.session.user={
                    "name":user.name,
                    "email":user.email,
                    "password":user.password,
                     "_id":user._id};
                req.session.loggedIn=true;
                console.log("logged in as user"+user);
                res.redirect('/user');            }
        });
    }
    else{
        res.redirect('/login?404=error');
    }
};
module.exports.view=function (req,res) {
    if (req.session.loggedIn!=true)
        res.redirect("/login");
    Users.findOne({
        _id:req.session.user._id
    },function (err,user) {
        res.render("view-user",{user:user});
    })
};
module.exports.edit=function (req,res) {
    if (req.session.loggedIn!=true)
        res.redirect("/login");
    res.render("change-password");
}
module.exports.changePassword=function (req,res) {
    /*var curr_pass=req.body.UserPassword;
    var new_pass=req.body.NewPassword;*/
    if(req.body.Email!=req.session.user.email){
        console.log("invalid email");
        res.redirect("/user?error=invalid_email");
    }
    else {
        if (req.body.UserPassword!=req.session.user.password) {
           console.log("current password wrong");
            res.redirect("/user?error=wrong_password");
        }
        else{
            Users.findOne({_id:req.session.user._id},function (err,user) {
                doChangePass(req,res,err,user);
            });
        }
    }
};
var doChangePass=function (req,res,err,user) {
    console.log(user);
    user.password=req.body.NewPassword;
    user.save(function (err,user) {
        if (!err){
            req.session.user.password=req.body.NewPassword;
            res.redirect("/user");
        }
    })
}
module.exports.delete=function (req,res) {
    var _id=req.session.user._id;
    Users.findByIdAndRemove(_id,function (err,user) {
        if (err){
            console.log("error on deleting user");
            res.redirect("/user?error=delete");
        }
        else{
            console.log("user deleted");
            req.session.destroy();
            res.redirect("/");

        }
    })
}
module.exports.logout=function (req,res) {
    req.session.destroy();
    res.redirect("/");
}



