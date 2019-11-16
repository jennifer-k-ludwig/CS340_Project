
function login() {
	
	if(document.getElementById("username").value == "" || document.getElementById("password").value == "")
		alert("Please enter a valid username and password, or create a new account.");
	
	else {
		var request = new XMLHttpRequest();

		var formData = { "email_address":null, "password":null };

		formData.email_address = document.getElementById("username").value;
		formData.password = document.getElementById("password").value;
		
		// Define what happens on successful data submission
		request.addEventListener("load", function(event) {
			window.location.href = "http://flip3.engr.oregonstate.edu:7296/home";		
		});
		
		// Define what happens in case of error
		request.addEventListener("error", function(event) {
			alert('Please enter a valid username and password, or create a new account.');
		});

		// Set up our request
		request.open("POST", "http://flip3.engr.oregonstate.edu:7296/login", true);

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
		
		//If the login form sent the event
		if(event.target.getAttribute('id') == 'login_form') {
			login();
			event.target.reset();
		}
});