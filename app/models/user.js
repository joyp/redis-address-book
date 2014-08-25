'use strict';

var bcrypt  = require('bcrypt'),
    Mongo   = require('mongodb'),
    _       = require('lodash');

function User(){
}

Object.defineProperty(User, 'collection', {
  get: function(){return global.mongodb.collection('users');}
});

User.register = function(o, cb){
  User.collection.findOne({email:o.email}, function(err, user){
    // if email exists in database, callback User.register and redirect
    if(user){return cb();}

    o.password = bcrypt.hashSync(o.password, 10);
    // Mongo calls cb, which is the 'function(err,user)' in the controller
    User.collection.save(o, cb);
  });
};

User.all = function(cb){
  User.collection.find().toArray(cb);
};

User.findById = function(id, cb){
  var _id = Mongo.ObjectID(id);
  User.collection.findOne({_id:_id}, function(err, user){
    cb(err, _.create(User.prototype, user));
  });
};

User.authenticate = function(o, cb){
  User.collection.findOne({email:o.email}, function(err, user){
    // if email doesn't match, we kick you out
    if(!user){return cb();}
    var isOk = bcrypt.compareSync(o.password, user.password);
    // if password doesn't match, we kick you out
    if(!isOk){return cb();}

    // email and password are good
    cb(user);

  });
};

module.exports = User;

