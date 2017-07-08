var express = require('express');
var mongoose=require('mongoose');

var router = express.Router();
var projectSchema=new mongoose.Schema({
    projectName:String,
    createdBy:String,
    createdOn:{type:Date, default:Date.now},
    task:String,
    contributors:String,
    modifiedOn:Date

});
var Project=mongoose.model('project',projectSchema);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



module.exports = router;

module.exports.create=function (req,res) {
    res.render('create-project');
};
module.exports.doCreate=function (req,res) {
    Project.create({
        projectName:req.body.ProjectName,
        createdBy:req.session.user._id,
        task:req.body.Task,
        contributors:req.body.Contributors,
        modifiedOn:Date.now()
        },function (err,project) {
        if (!err){
            console.log("NEw project saved"+project);
            res.redirect("/user");
        }
        else{
            console.log(err);
            if (err.code==11000){
                res.redirect('/project/new?exists=true');
            }
            else
                res.redirect('/?error=true');
        }
        }
    );
};
module.exports.viewProjects=function (req, res) {
    console.log(req.params.id);

    if (req.params.id){
       Project.find({
           "createdBy":req.params.id
       },function (err,project) {
           if (!err){
               console.log(project);
               res.render("view-projects",{project:project});
           }
       })
    }
};


