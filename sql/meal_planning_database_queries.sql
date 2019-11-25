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
	recipes.recipe_name 
FROM recipes 
INNER JOIN users_recipes ON recipes.recipe_id = users_recipes.recipe 
INNER JOIN users ON users_recipes.user = users.user_id WHERE user_id=?;

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
SELECT * FROM foods WHERE food_name=?;

--Search for recipe
SELECT * FROM recipes WHERE recipe_name=?;

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
DELETE FROM recipes WHERE recipe_name=?;
