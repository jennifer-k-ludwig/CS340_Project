var express = require('express');
var app = express();

var mysql = require('./dbcon.js');
var bodyParser = require('body-parser');
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var session = require('express-session');

app.engine('handlebars', handlebars.engine);
app.use(bodyParser.urlencoded({extended:true}));
app.use(session({secret:'SuperSecretPassword',resave:true,saveUninitialized: true}));
app.use('/static', express.static('public'));

app.set('view engine', 'handlebars');
app.set('port', 7298);
app.set('mysql', mysql);

app.use('/login', require('./login.js'));
app.use('/search', require('./search.js'));
app.use('/home', require('./home.js'));
app.use('/user', require('./user.js'));
app.use('/new_user', require('./new_user.js'));
app.use('', require('./home.js'));

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
