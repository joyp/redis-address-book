'use strict';

var morgan         = require('morgan'),
    bodyParser     = require('body-parser'),
    methodOverride = require('express-method-override'),
    less           = require('less-middleware'),
    session        = require('express-session'),
    RedisStore     = require('connect-redis')(session),
    security       = require('../lib/security'),
    home           = require('../controllers/home'),
    users          = require('../controllers/users'),
    addresses      = require('../controllers/addresses');

module.exports = function(app, express){
  app.use(morgan('dev'));
  app.use(less(__dirname + '/../static'));
  app.use(express.static(__dirname + '/../static'));
  app.use(bodyParser.urlencoded({extended:true}));
  app.use(methodOverride());
  app.use(session({store:new RedisStore(),
    // password that helps unencrypt the cookie
    secret:'a1a',
    resave:true,
    saveUninintialized:true,
    // 3600 only good for one hour, 86400 is one day, null is forever
    cookie:{maxAge:null}
  }));
  app.use(security.authenticate);

  app.get('/', home.index);
  app.get('/register', users.new);
  app.post('/register', users.create);
  app.get('/login', users.login);
  app.post('/login', users.authenticate);

  app.use(security.bounce);

  app.delete('/logout', users.logout);
  app.get('/addresses', addresses.index);
  app.post('/addresses', addresses.create);
  app.get('/addresses/new', addresses.new);

  console.log('Express: Routes Loaded');
};

