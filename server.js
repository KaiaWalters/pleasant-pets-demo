const MongoClient = require('mongodb').MongoClient
var mongoose = require('mongoose')
var ObjectId = require('mongodb').ObjectID;
var configDB = require('./config/database.js')

var db

// configuration ===============================================================
mongoose.connect(configDB.url, { useNewUrlParser: true },(err, database) => {
  if (err) return console.log(err)
  db = database
  require('./app.js')(app, db, ObjectId)
});
