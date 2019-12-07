--
--Login page
--

--Hitting the "Login" button will query the database for the user's id and associate it with the session.
req.session.user_id = SELECT user_id FROM users WHERE email_address=? AND password=?;

--
--Home page
--

--Pull the user's first name from the database.
SELECT 
	first_name 
FROM users 
WHERE user_id=?;

--Pull the user's dietary preferences from the database.
SELECT 
	diet_no_meat,
	diet_no_dairy,
	diet_no_nuts,
	diet_no_shellfish,
	diet_no_carbs,
	diet_no_animal_products,
	diet_no_gluten,diet_no_soy 
FROM diets
INNER JOIN users ON users.diet=diets.diet_id AND user_id=?;

--Pull the user's current recipe selection from the database.
SELECT 
	recipes.recipe_name, recipes.recipe_id 
FROM recipes 
INNER JOIN users_recipes ON recipes.recipe_id = users_recipes.recipe 
INNER JOIN users ON users_recipes.user = users.user_id WHERE user_id=?;

--Match recipe with user diet
SELECT
	*
FROM
	recipes
INNER JOIN diets
ON recipe_no_meat=diet_no_meat 
AND recipe_no_dairy=diet_no_dairy
AND recipe_no_nuts=diet_no_nuts
AND recipe_no_shellfish=diet_no_shellfish
AND recipe_no_carbs=diet_no_carbs
AND recipe_no_animal_products=diet_no_animal_products
AND recipe_no_gluten=diet_no_gluten
AND recipe_no_soy=diet_no_soy
WHERE diet_id=?
AND recipe_name LIKE;

--Match food with user diet
SELECT
	*
FROM
	foods
INNER JOIN diets
ON contains_meat<>diet_no_meat 
AND contains_dairy<>diet_no_dairy
AND contains_nuts<>diet_no_nuts
AND contains_shellfish<>diet_no_shellfish
AND contains_carbs<>diet_no_carbs
AND contains_animal_products<>diet_no_animal_products
AND contains_gluten<>diet_no_gluten
AND contains_soy<>diet_no_soy
WHERE diet_id=?
AND food_name LIKE;

--
--New User page
--

--"Save Changes" will insert the new user and their diet into the database on first click.
INSERT INTO `diets`
	(`diet_no_meat`,
	`diet_no_dairy`,
	`diet_no_nuts`,
	`diet_no_shellfish`,
	`diet_no_carbs`,
	`diet_no_animal_products`,
	`diet_no_gluten`,
	`diet_no_soy`) 
VALUES (?,?,?,?,?,?,?,?);

INSERT INTO `users`
	(`first_name`,
	`last_name`,
	`birth_date`,
	`email_address`,
	`password`,
	`max_calories`,
	`diet`) 
VALUES (?,?,?,?,?,?,?);

--
--Update User page
--

--"Save Changes" will update the user info.
UPDATE 
	diets
SET 
	diet_no_meat=?,
	diet_no_dairy=?,
	diet_no_nuts=?,
	diet_no_shellfish=?,
	diet_no_carbs=?,
	diet_no_animal_products-=?,
	diet_no_gluten=?,
	diet_no_soy=? 
WHERE diets.diet_id=req.session.diet_id;

UPDATE 
	users
SET 
	first_name=?,
	last_name=?,
	birth_date=?,
	email_address=?,
	password=?,
	max_calories=?,
	diet=? 
WHERE users.user_id=req.session.user_id;

--"Delete Account" will delete the user from the database.
DELETE FROM users WHERE users.user_id=req.session.user_id;

--
--Search page
--

--Search for food
SELECT * FROM foods WHERE foods.food_name LIKE " + mysql.pool.escape('%' + user_search_text + '%')

--Search for recipe
SELECT * FROM recipes WHERE recipes.recipe_name LIKE " + mysql.pool.escape('%' + user_search_text + '%')

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

--Deleting recipe from database
DELETE FROM recipes WHERE recipe_id=?;

--Delete a user to recipe relationship
DELETE FROM users_recipes WHERE recipe = ? AND user = ?;

--Updating a recipe's properties
UPDATE recipes SET recipe_no_meat=?, recipe_no_dairy=?, recipe_no_nuts=?, recipe_no_shellfish=?, recipe_no_carbs=?, recipe_no_animal_products=?, recipe_no_gluten=?, recipe_no_soy=?  WHERE recipe_id=?

--Show a recipe's relationship with its associated foods
SELECT food_name, recipe_name, calories_ounce FROM (recipes INNER JOIN (SELECT * FROM foods_recipes INNER JOIN foods ON foods_recipes.food = foods.food_id) as t1 ON t1.recipe = recipes.recipe_id) where recipe_id = ?
