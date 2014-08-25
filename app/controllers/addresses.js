'use strict';

var Address = require('../models/address');

exports.index = function(req,res){
  Address.findAllByUserId(res.locals.user._id, function(err, addresses){
    console.log('addresses in exports.index', addresses);
    res.render('addresses/index', {addresses:addresses});
  });
};

exports.new = function(req,res){
  res.render('addresses/new');
};

exports.create = function(req,res){
  Address.create(req.body, res.locals.user._id, function(){
    res.redirect('/addresses');
  });
};
