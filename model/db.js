/**
 * Created by sonu on 1/7/17.
 */
var mongoose=require('mongoose');
var dbURI= 'mongodb://localhost/demo';
mongoose.connect(dbURI);
mongoose.connection.on('connected',function () {
    console.log('mongoose connected to'+dbURI);

});
mongoose.connection.on('error',function () {
    console.log("mongoose connection error");
});
mongoose.connection.on('disconnect',function () {
    console.log("mongoose disconnected");
});
process.on('SIGINT',function () {
    mongoose.connection.close(function () {
        console.log("mongoose disconnected through app termination");
        process.exit(0);
    });
});

