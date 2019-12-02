//Login Page - get and post requests
module.exports = function(){
    var express = require('express');
    var router = express.Router();

     // renders initial login page
	router.get('/', function(req,res){
		res.render('login');
		
	});

     // handles the form input from the user when the user logins
	router.post('/', function(req,res){
          var context = {};
		var mysql = req.app.get('mysql');
		var session = req.app.get('session');
  
          mysql.pool.query('SELECT user_id, diet_id FROM users INNER JOIN diets ON diet=diet_id WHERE email_address=? AND password=?', [req.body.email_address, req.body.password],
               function (error, results, fields) {
               // log query results
               console.log("Login Results\n", results);

			if(error){
				res.write(JSON.stringify(error));
				res.end();
			}
               else {
                    //if the result is the empty set, then we ask the user to login again with the correct email & password
                    if (Array.isArray(results) && results.length <= 0) {
                         context.display_login_error = true;
                         res.render('login', context);
                    }

                    // Otherwise, we direct them to their home page and store their user_id and diet_id in a sessions object
                    else {
                         req.session.user_id = results[0].user_id;
                         req.session.diet_id = results[0].diet_id;
                         res.redirect('/home');
                    }
			}
		});
	});
	
	return router;
}();