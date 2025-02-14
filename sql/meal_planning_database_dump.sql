DROP TABLE IF EXISTS users_recipes;
DROP TABLE IF EXISTS foods_recipes;
DROP TABLE IF EXISTS recipes_diets;
DROP TABLE IF EXISTS recipes;
DROP TABLE IF EXISTS foods;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS diets;
	
--
-- Table structure for table `diets`
--

CREATE TABLE `diets` (
	`diet_id` INT(11) NOT NULL AUTO_INCREMENT,
	`diet_no_meat` BOOLEAN NOT NULL DEFAULT 0,
	`diet_no_dairy` BOOLEAN NOT NULL DEFAULT 0,
	`diet_no_nuts` BOOLEAN NOT NULL DEFAULT 0,
	`diet_no_shellfish` BOOLEAN NOT NULL DEFAULT 0,
	`diet_no_carbs` BOOLEAN NOT NULL DEFAULT 0,
	`diet_no_animal_products` BOOLEAN NOT NULL DEFAULT 0,
	`diet_no_gluten` BOOLEAN NOT NULL DEFAULT 0,
	`diet_no_soy` BOOLEAN NOT NULL DEFAULT 0,	
	PRIMARY KEY (`diet_id`)
);

--
-- Dumping data for table `diets`
--

LOCK TABLES `diets` WRITE;
INSERT INTO `diets` 
	(`diet_no_meat`,
	`diet_no_dairy`,
	`diet_no_nuts`,
	`diet_no_shellfish`,
	`diet_no_carbs`,
	`diet_no_animal_products`,
	`diet_no_gluten`,
	`diet_no_soy`) 
VALUES
(TRUE,TRUE,TRUE,TRUE,TRUE,TRUE,TRUE,TRUE),
(FALSE,FALSE,FALSE,FALSE,FALSE,FALSE,FALSE,FALSE),
(FALSE,TRUE,FALSE,FALSE,FALSE,TRUE,FALSE,FALSE),
(FALSE,FALSE,FALSE,FALSE,FALSE,FALSE,TRUE,FALSE),
(FALSE,TRUE,TRUE,FALSE,FALSE,FALSE,TRUE,TRUE);
UNLOCK TABLES;

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
	`user_id` INT(11) NOT NULL AUTO_INCREMENT,
	`first_name` VARCHAR(255) NOT NULL,
	`last_name` VARCHAR(255) NOT NULL,
	`birth_date` DATE NOT NULL,
	`email_address` VARCHAR(255) UNIQUE NOT NULL,
	`password` VARCHAR(255) NOT NULL,
	`max_calories` INT(11) NOT NULL,
	`diet` INT(11),
	PRIMARY KEY (`user_id`),
	FOREIGN KEY (`diet`) REFERENCES diets(`diet_id`)
);

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
INSERT INTO `users` 
	(`first_name`,
	`last_name`,
	`birth_date`,
	`email_address`,
	`password`,
	`max_calories`,
	`diet`) 
VALUES
('Michael', 'Scott', '1967-03-15', 'm.scott@paper.com', 'dundermifflin', '3000', 1),
('Kermit', 'The Frog', '1980-11-14', 'greenboy@yahoo.com', 'noteasybeinggreen', '500', 4),
('Fresh', 'Prince', '1968-09-25', 'belair@gmail.com', 'poppin', '2500', 3),
('April', 'Ludgate', '1994-10-31', 'a.ludgate@parks.com', 'itwasntme', '2000', 2);
UNLOCK TABLES;

--
-- Table structure for table `recipes`
--

CREATE TABLE `recipes` (
	`recipe_id` INT(11) NOT NULL AUTO_INCREMENT,
	`recipe_name` VARCHAR(255) NOT NULL,
	`recipe_no_meat` BOOLEAN NOT NULL DEFAULT 0,
	`recipe_no_dairy` BOOLEAN NOT NULL DEFAULT 0,
	`recipe_no_nuts` BOOLEAN NOT NULL DEFAULT 0,
	`recipe_no_shellfish` BOOLEAN NOT NULL DEFAULT 0,
	`recipe_no_carbs` BOOLEAN NOT NULL DEFAULT 0,
	`recipe_no_animal_products` BOOLEAN NOT NULL DEFAULT 0,
	`recipe_no_gluten` BOOLEAN NOT NULL DEFAULT 0,
	`recipe_no_soy` BOOLEAN NOT NULL DEFAULT 0,	
	PRIMARY KEY (`recipe_id`)
);

--
-- Dumping data for table `recipes`
--

LOCK TABLES `recipes` WRITE;
INSERT INTO `recipes` 
	(`recipe_name`,
	`recipe_no_meat`,
	`recipe_no_dairy`,
	`recipe_no_nuts`,
	`recipe_no_shellfish`,
	`recipe_no_carbs`,
	`recipe_no_animal_products`,
	`recipe_no_gluten`,
	`recipe_no_soy`) 
VALUES
('Spaghetti and Meatballs',FALSE,TRUE,TRUE,TRUE,FALSE,FALSE,FALSE,TRUE),
('Beef Stroganoff',FALSE,TRUE,TRUE,TRUE,FALSE,FALSE,FALSE,TRUE),
('Mac and Cheese',TRUE,FALSE,TRUE,TRUE,FALSE,FALSE,FALSE,TRUE),
('Chicken Pot Pie',FALSE,TRUE,TRUE,TRUE,FALSE,FALSE,FALSE,TRUE),
('Peach Cobbler',TRUE,TRUE,TRUE,TRUE,FALSE,TRUE,FALSE,TRUE),
('Chicken Parmesan',FALSE,FALSE,TRUE,TRUE,FALSE,FALSE,FALSE,TRUE),
('Walnut Brownies',TRUE,TRUE,FALSE,TRUE,FALSE,TRUE,FALSE,TRUE),
('Vegetarian Lentil Soup',TRUE,TRUE,TRUE,TRUE,TRUE,TRUE,TRUE,TRUE),
('Tofu Stir Fry',TRUE,TRUE,TRUE,TRUE,TRUE,TRUE,TRUE,FALSE);
UNLOCK TABLES;

--
-- Table structure for table `foods`
--

CREATE TABLE `foods` (
	`food_id` INT(11) NOT NULL AUTO_INCREMENT,
	`food_name` VARCHAR(255) NOT NULL,
	`calories_ounce` INT(11),
	`contains_meat` BOOLEAN NOT NULL DEFAULT 0,
	`contains_dairy` BOOLEAN NOT NULL DEFAULT 0,
	`contains_nuts` BOOLEAN NOT NULL DEFAULT 0,
	`contains_shellfish` BOOLEAN NOT NULL DEFAULT 0,
	`contains_carbs` BOOLEAN NOT NULL DEFAULT 0,
	`contains_animal_products` BOOLEAN NOT NULL DEFAULT 0,
	`contains_gluten` BOOLEAN NOT NULL DEFAULT 0,
	`contains_soy` BOOLEAN NOT NULL DEFAULT 0,	
	PRIMARY KEY (`food_id`)
);

--
-- Dumping data for table `foods`
--

LOCK TABLES `foods` WRITE;
INSERT INTO `foods` 
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
VALUES
('Chicken Breast',50,TRUE,FALSE,FALSE,FALSE,FALSE,TRUE,FALSE,FALSE),
('Cheese',100,FALSE,TRUE,FALSE,FALSE,FALSE,TRUE,FALSE,FALSE),
('Ground Beef 80% Lean',71,TRUE,FALSE,FALSE,FALSE,FALSE,TRUE,FALSE,FALSE),
('Pasta',35,FALSE,FALSE,FALSE,FALSE,TRUE,FALSE,TRUE,FALSE),
('Flour',103,FALSE,FALSE,FALSE,FALSE,TRUE,FALSE,TRUE,FALSE),
('Walnuts',185,FALSE,FALSE,TRUE,FALSE,FALSE,FALSE,FALSE,FALSE),
('Butter',204,FALSE,TRUE,FALSE,FALSE,FALSE,TRUE,FALSE,FALSE),
('Peaches',11,FALSE,FALSE,FALSE,FALSE,TRUE,FALSE,FALSE,FALSE),
('Lentils',116,FALSE,FALSE,FALSE,FALSE,FALSE,FALSE,FALSE,FALSE);
UNLOCK TABLES;

--
-- Table structure for table `users_recipes`
--

CREATE TABLE `users_recipes` (
	`user` INT(11),
	`recipe` INT(11),
	FOREIGN KEY (`user`) 
	REFERENCES users(`user_id`)
	ON DELETE CASCADE,
	FOREIGN KEY (`recipe`) 
	REFERENCES recipes(`recipe_id`)
	ON DELETE SET NULL
);

--
-- Dumping data for table `users_recipes`
--

LOCK TABLES `users_recipes` WRITE;
INSERT INTO `users_recipes` (`user`,`recipe`) VALUES
(1,8),
(2,8),
(2,9),
(3,5),
(3,7),
(4,6),
(4,4),
(4,3);
UNLOCK TABLES;

--
-- Table structure for table `recipes_diets`
--


CREATE TABLE `recipes_diets` (
	`recipe` INT(11),
	`diet` INT(11),
	FOREIGN KEY (`recipe`) 
	REFERENCES recipes(`recipe_id`)
	ON DELETE SET NULL,
	FOREIGN KEY (`diet`) 
	REFERENCES diets(`diet_id`)
);

--
-- Dumping data for table `recipes_diets`
--

LOCK TABLES `recipes_diets` WRITE;
INSERT INTO `recipes_diets` (`recipe`,`diet`) VALUES
(8,4),
(9,4),
(8,1),
(1,2),
(2,2),
(3,2),
(4,2),
(5,2),
(6,2),
(7,2),
(8,2),
(9,2),
(5,3),
(7,3),
(8,3),
(9,3);
UNLOCK TABLES;

--
-- Table structure for table `foods_recipes`
--

CREATE TABLE `foods_recipes` (
	`food` INT(11),
	`recipe` INT(11),
	FOREIGN KEY (`food`) 
	REFERENCES foods(`food_id`)
	ON DELETE SET NULL,
	FOREIGN KEY (`recipe`) 
	REFERENCES recipes(`recipe_id`)
	ON DELETE SET NULL
);

--
-- Dumping data for table `foods_recipes`
--

LOCK TABLES `foods_recipes` WRITE;
INSERT INTO `foods_recipes` 
	(`food`,
	`recipe`) 
VALUES
(1,4),
(1,6),
(2,3),
(2,6),
(4,1),
(4,2),
(4,3),
(4,6),
(9,8);
UNLOCK TABLES;