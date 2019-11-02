DROP TABLE IF EXISTS `users`, `diets`, `recipes`, `foods`, `users_recipes`, `recipes_diets`, `foods_recipes`;

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
	`user_id` INT(11) NOT NULL AUTO_INCREMENT,
	`first_name` VARCHAR(255) NOT NULL,
	`last_name` VARCHAR(255) NOT NULL,
	`birth_date` DATE NOT NULL,
	`email_address` VARCHAR(255) NOT NULL,
	`password` VARCHAR(255) NOT NULL,
	`max_calories` INT(11) NOT NULL,
	`diet` INT(11),
	PRIMARY KEY (`user_id`),
	FOREIGN KEY (`diet`) REFERENCES diets(`diet_id`) ON DELETE CASCADE
)

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
INSERT INTO `users` VALUES;
UNLOCK TABLES;

--
-- Table structure for table `diets`
--
	
CREATE TABLE `diets` (
	`diet_id` INT(11) NOT NULL AUTO_INCREMENT,
	`diet_no_meat` BOOLEAN,
	`diet_no_dairy` BOOLEAN,
	`diet_no_nuts` BOOLEAN,
	`diet_no_shellfish` BOOLEAN,
	`diet_no_carbs` BOOLEAN,
	`diet_no_animal_products` BOOLEAN,
	`diet_no_gluten` BOOLEAN,
	`diet_no_soy` BOOLEAN,	
	PRIMARY KEY (`diet_id`),
)

--
-- Dumping data for table `diets`
--

LOCK TABLES `diets` WRITE;
INSERT INTO `diets` VALUES;
UNLOCK TABLES;

--
-- Table structure for table `recipes`
--

CREATE TABLE `recipes` (
	`recipe_id` INT(11) NOT NULL AUTO_INCREMENT,
	`recipe_name` VARCHAR(255) NOT NULL,
	`recipe_no_meat` BOOLEAN,
	`recipe_no_dairy` BOOLEAN,
	`recipe_no_nuts` BOOLEAN,
	`recipe_no_shellfish` BOOLEAN,
	`recipe_no_carbs` BOOLEAN,
	`recipe_no_animal_products` BOOLEAN,
	`recipe_no_gluten` BOOLEAN,
	`recipe_no_soy` BOOLEAN,	
	PRIMARY KEY (`recipe_id`),
)

--
-- Dumping data for table `recipes`
--

LOCK TABLES `recipes` WRITE;
INSERT INTO `recipes` VALUES;
UNLOCK TABLES;

--
-- Table structure for table `foods`
--

CREATE TABLE `foods` (
	`food_id` INT(11) NOT NULL AUTO_INCREMENT,
	`food_name` VARCHAR(255) NOT NULL,
	`calories_ounce` INT(11),
	PRIMARY KEY (`food_id`),
)

--
-- Dumping data for table `foods`
--

LOCK TABLES `foods` WRITE;
INSERT INTO `foods` VALUES;
UNLOCK TABLES;

-- Dumping data for table `recipes`
--

LOCK TABLES `recipes` WRITE;
INSERT INTO `recipes` VALUES;
UNLOCK TABLES;

--
-- Table structure for table `users_recipes`
--

CREATE TABLE `foods` (
	`user` INT(11),
	`recipe` INT(11),
	FOREIGN KEY (`user`) REFERENCES users(`user_id`),
	FOREIGN KEY (`recipe`) REFERENCES recipes(`recipe_id`)
)

--
-- Table structure for table `recipes_diets`
--

CREATE TABLE `recipes_diets` (
	`recipe` INT(11),
	`diet` INT(11),
	FOREIGN KEY (`recipe`) REFERENCES recipes(`recipe_id`),
	FOREIGN KEY (`diet`) REFERENCES diets(`diet_id`)
)

--
-- Table structure for table `foods_recipes`
--

CREATE TABLE `foods_recipes` (
	`food` INT(11),
	`recipe` INT(11),
	FOREIGN KEY (`food`) REFERENCES foods(`food_id`),
	FOREIGN KEY (`recipe`) REFERENCES recipes(`recipe_id`)
)

