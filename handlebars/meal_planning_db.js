var express = require('express');
var mysql = require('./dbcon.js');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var session = require('express-session');
var bodyParser = require('body-parser');
var request = require('request');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({secret:'SuperSecretPassword'}));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 7296);
app.use(express.static('public'));
app.use(express.urlencoded())

//Login Page - get and post requests
app.get('/login', function(req,res,next){
	
	res.render('login');
	
});

app.post('/login', function(req,res,next){
	
	req.session.id = mysql.pool.query('SELECT user_id FROM users WHERE email_address=? AND password=?', [req.body.email_address, req.body.password], 
		function(err, result){
			if(err){
				next(err);
				return;
			}
	});	

});

//Home Page get and post requests
app.get('/home', function(req,res,next){
	
	context = {};
	
	context.user = mysql.pool.query('SELECT first_name FROM users WHERE user_id=?', [req.session.id], function(err, result){
			if(err){
				next(err);
				return;
			}
	});	
	
	res.render('home', context);
	
});


//Search Page get and post requests
app.get('/search', function(req,res,next){
	
	res.render('search');
	
});



//User Page get and post requests
app.get('/user', function(req,res,next){
	
	res.render('user');
	
});

app.post('/user', function(req,res,next){
	
	//Inserts user entered values into the diets table
	mysql.pool.query('INSERT INTO `diet` (`diet_no_meat`,`diet_no_dairy`,`diet_no_nuts`,`diet_no_shellfish`,`diet_no_carbs`,`diet_no_animal_products`,`diet_no_gluten`,`diet_no_soy`) VALUES (?,?,?,?,?,?,?,?)', 
	[req.body.no_meat,req.body.no_dairy,req.body.no_nuts,req.body.no_shellfish,req.body.no_carbs,req.body.no_animal_products,req.body.no_gluten,req.body.no_soy], 
		function(err, result){
			if(err){
				next(err);
				return;
			}
	});	
	
	//Inserts user info into the user table
	mysql.pool.query('INSERT INTO `users` (`first_name`,`last_name`,`birth_date`,`email_address`,`password`,`max_calories`,`diet`) VALUES (?,?,?,?,?,?,?)', 
	[req.body.first_name,req.body.last_name,req.body.birth_date,req.body.email_address,req.body.password,req.body.max_calories,req.session.diet], 
		function(err, result){
			if(err){
				next(err);
				return;
			}
	});	
	
});

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