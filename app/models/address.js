'use strict';

function Address(o,id){
  this.lastName   = o.lastName;
  this.firstName  = o.firstName;
  this.color      = o.contactColor;
  this.twitter    = o.contactTwitter;
  this.userId     = id;
}

Object.defineProperty(Address, 'collection', {
  get: function(){return global.mongodb.collection('addresses');}
});

Address.create = function(o, id, cb){
  var a = new Address(o, id);
  Address.collection.save(a, cb);
  console.log(a);
};

Address.findAllByUserId = function(id, cb){
  Address.collection.find({userId:id}).toArray(cb);
};

module.exports = Address;
