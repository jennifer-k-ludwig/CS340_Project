function send_info() {
	
	if(document.getElementById("first_name").value == "")
		alert("Please fill out the entire form.");
	
	else {
		var request = new XMLHttpRequest();

		var formData = { "first_name":null, 
		"last_name":null,
		"birth_date":null,
		"max_calories":null,
		"email_address":null,
		"password":null,
		"no_meat":null,
		"no_dairy":null,
		"no_nuts":null,
		"no_shellfish":null,
		"no_carbs":null,
		"no_animal_products":null,
		"no_gluten":null,
		"no_soy":null
		};

		formData.first_name = document.getElementById("first_name").value;
		formData.last_name = document.getElementById("last_name").value;
		formData.birth_date = document.getElementById("birth_date").value;
		formData.max_calories = document.getElementById("max_calories").value;
		formData.email_address = document.getElementById("email_address").value;
		formData.password = document.getElementById("password").value;
		formData.no_meat = document.getElementById("no_meat").value;
		formData.no_dairy = document.getElementById("no_dairy").value;
		formData.no_nuts = document.getElementById("no_nuts").value;
		formData.no_shellfish = document.getElementById("no_shellfish").value;
		formData.no_carbs = document.getElementById("no_carbs").value;
		formData.no_animal_products = document.getElementById("no_animal_products").value;
		formData.no_gluten = document.getElementById("no_gluten").value;		
		formData.no_soy = document.getElementById("no_soy").value;
		
		// Define what happens on successful data submission
		request.addEventListener("load", function(event) {
			alert('Data sent');		
		});
		
		// Define what happens in case of error
		request.addEventListener("error", function(event) {
			alert('Something went wrong.');
		});

		// Set up our request
		request.open("POST", "http://flip3.engr.oregonstate.edu:7296/user", true);

		request.setRequestHeader('Content-Type', 'application/json');

		// The data sent is what the user provided in the form
		request.send(JSON.stringify(formData));
	}
}

window.addEventListener("DOMContentLoaded", function () {
	
	//When data submitted
	document.addEventListener("submit", function (event) {
		//Prevents submission of the form
		event.preventDefault();
		
		//If the user info form sent the event
		if(event.target.getAttribute('id') == 'user_info') {
			send_info();
		}
		//If the delete user form sent the event
		else if(event.target.getAttribute('id') == 'user_delete') {
			user_delete();
		}
});