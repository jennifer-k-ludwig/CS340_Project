--
--------------------------------------------- Login page -----------------------------------------------------------------
--

	-- select userID and dietID
	SELECT user_id, diet_id FROM users INNER JOIN diets ON diet=diet_id WHERE email_address=? AND password=?;
	

--
--------------------------------------------- New User page -----------------------------------------------------------------
--

	-- select a diet based on a user's choices
	SELECT diet_id FROM diets 
	WHERE diet_no_meat=? 
	AND diet_no_dairy=? 
	AND diet_no_nuts=? 
	AND diet_no_shellfish=? 
	AND diet_no_carbs=? 
	AND diet_no_animal_products=? 
	AND diet_no_gluten=? AND diet_no_soy=?;

	-- select a user given their email
	SELECT user_id FROM users WHERE email_address=?;
	
	-- insert into diet
	INSERT INTO `diets` 
	(`diet_no_meat`,`diet_no_dairy`,`diet_no_nuts`,`diet_no_shellfish`,`diet_no_carbs`,`diet_no_animal_products`,`diet_no_gluten`,`diet_no_soy`) 
	VALUES (?,?,?,?,?,?,?,?);

	-- insert into users
	INSERT INTO `users` 
	(`first_name`,`last_name`,`birth_date`,`email_address`,`password`,`max_calories`,`diet`) 
	VALUES (?,?,?,?,?,?,?)
--
--------------------------------------------- User page (updating user info) -------------------------------------------------
--

	-- Deleting a user
	DELETE FROM users WHERE user_id=?;

	-- Selecting a diet for a user via their dietary preferences
	SELECT diet_id FROM diets 
	WHERE diet_no_meat=? 
	AND diet_no_dairy=? 
	AND diet_no_nuts=? 
	AND diet_no_shellfish=? 
	AND diet_no_carbs=? 
	AND diet_no_animal_products=? 
	AND diet_no_gluten=? 
	AND diet_no_soy=?;

	-- Inserting a diet into the diets table
	INSERT INTO `diets` 
	(`diet_no_meat`,`diet_no_dairy`,`diet_no_nuts`,`diet_no_shellfish`,`diet_no_carbs`,`diet_no_animal_products`,`diet_no_gluten`,`diet_no_soy`) 
	VALUES (?,?,?,?,?,?,?,?);

	-- Updating user info into user's table
	UPDATE users SET first_name=?,last_name=?,birth_date=?,email_address=?,password=?,max_calories=?,diet=? WHERE users.user_id=?;

	-- Select the current user info
	SELECT * FROM users INNER JOIN diets on diet=diet_id WHERE user_id=?;



--
--------------------------------------------- Home page -----------------------------------------------------------------
--
	--Delete a user to recipe relationship
	DELETE FROM users_recipes WHERE recipe = ? AND user = ?;

	-- Selecting a user's diet
	SELECT diet_no_meat,diet_no_dairy,diet_no_nuts,diet_no_shellfish,diet_no_carbs,diet_no_animal_products,diet_no_gluten,diet_no_soy 
	FROM diets 
	INNER JOIN users 
	ON users.diet=diets.diet_id WHERE user_id=?

	-- Selecting a user's recipe
	SELECT recipes.recipe_name, recipes.recipe_id FROM recipes 
	INNER JOIN users_recipes ON recipes.recipe_id = users_recipes.recipe 
	INNER JOIN users ON users_recipes.user = users.user_id 
	WHERE user_id=?



--
--------------------------------------------- Search page -----------------------------------------------------------------
--

	--We use two queries to build our search results on our main search page
	SELECT * FROM diets WHERE diet_id=?;

	-- Depending on the results of the above we build a query for a food search or a recipe search
	-- by doing some javascript to determine if we want a 0 for the attributes. All attributes may not
	-- appear in a certain query
	SELECT * FROM foods WHERE 
		(contains_meat=0 AND contains_dairy=0 AND contains_nuts=0 AND contains_shellfish=0
		AND contains_carbs=0 AND contains_animal_products=0 AND contains_gluten=0 AND contains_soy=0 AND
		AND food_name LIKE + mysql.pool.escape('%' + user_search_text + '%');

	SELECT * FROM recipes WHERE 
		(recipe_no_meat=1 AND recipe_no_dairy=1 AND recipe_no_nuts=1 AND recipe_no_shellfish=1 AND recipe_no_carbs=1 
		AND recipe_no_animal_products=1 AND recipe_no_gluten=1 AND recipe_no_soy=1 AND
		AND recipe_name LIKE + mysql.pool.escape('%' + user_search_text + '%');

	-- query to select the foods that are already associated with the specific recipe the user is interested in
	SELECT food_name, recipe_name, calories_ounce, food_id, contains_meat, contains_dairy, contains_nuts, contains_shellfish, contains_carbs, contains_animal_products, contains_gluten, contains_soy 
	FROM 
	(recipes INNER JOIN (SELECT * FROM foods_recipes INNER JOIN foods ON foods_recipes.food = foods.food_id) as t1 ON t1.recipe = recipes.recipe_id) 
	where recipe_id = ?;

	-- Grab a recipe's name for HTML/Handlebars purposes
	SELECT recipe_name FROM recipes where recipe_id = ?;

	-- Grabs recipe properties for use in HTML/Handlerbars
	SELECT * from recipes where recipe_id = ?;

	-- We also have a search query for the update Ingredients page (which is part of the search.js node).
	-- query code to select all foods from the foods table such that each food is not associated with a recipe
	-- We do this by selecting all the foods that are related to the recipe. Then we select all the foods from the food_table that
	-- are not in the first subquery. Then we select all rows filtering by the user's search.
	SELECT * FROM (SELECT * FROM foods WHERE food_id NOT IN (SELECT food FROM foods_recipes WHERE recipe = ? AND food IS NOT NULL)) as t1 
	WHERE food_name LIKE  + mysql.pool.escape('%' + search_text + '%');



	--Adding food to database
	INSERT INTO foods 
		(`food_name`,
		`calories_ounce`,
		`contains_meat`,
		`contains_dairy`,
		`contains_nuts`,
		`contains_shellfish`,
		`contains_carbs`,
		`contains_animal_products`,
		`contains_gluten`,
		`contains_soy`) 
	VALUES (?,?,?,?,?,?,?,?,?,?);

	--Adding recipe to database
	INSERT INTO recipes 
		(`recipe_name`,
		`recipe_no_meat`,
		`recipe_no_dairy`,
		`recipe_no_nuts`,
		`recipe_no_shellfish`,
		`recipe_no_carbs`,
		`recipe_no_animal_products`,
		`recipe_no_gluten`,
		`recipe_no_soy`) 
	VALUES (?,?,?,?,?,?,?,?,?);

	--Updating a recipe's properties
	UPDATE recipes SET 
	recipe_no_meat=?, 
	recipe_no_dairy=?, 
	recipe_no_nuts=?, 
	recipe_no_shellfish=?, 
	recipe_no_carbs=?, 
	recipe_no_animal_products=?, 
	recipe_no_gluten=?, 
	recipe_no_soy=?  
	WHERE recipe_id=?;

	-- Associate a food with a recipe
	INSERT INTO foods_recipes (food, recipe) VALUES (?,?);

	-- Associate a recipe to a user
	INSERT INTO users_recipes (user, recipe) VALUES (?,?);

	--Deleting recipe from database
	DELETE FROM recipes WHERE recipe_id=?;

	-- Deleting a food from database
	DELETE FROM foods WHERE food_id = ?;

	-- Delete a foods and recipe relationship
	DELETE FROM foods_recipes WHERE food = ? AND recipe = ?;

