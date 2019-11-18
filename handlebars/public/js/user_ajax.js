//When data submitted
document.addEventListener("submit", function (event) {
	//Prevents submission of the form
	event.preventDefault();
	
	//If the user info form sent the event
	if(event.target.getAttribute('id') == 'user_info') {
		if (document.getElementByName("no_meat_check").checked) {
			document.getElementByName("no_meat").value="true";
		}
		if (document.getElementByName("no_dairy_check").checked) {
			document.getElementByName("no_dairy").value="true";
		}
		if (document.getElementByName("no_nuts_check").checked) {
			document.getElementByName("no_nuts").value="true";
		}
		if (document.getElementByName("no_shellfish_check").checked) {
			document.getElementByName("no_shellfish").value="true";
		}
		if (document.getElementByName(""no_carbs_check").checked) {
			document.getElementByName(""no_carbs").value="true";
		}
		if (document.getElementByName("no_animal_products_check").checked) {
			document.getElementByName("no_animal_products").value="true";
		}
		if (document.getElementByName("no_gluten_check").checked) {
			document.getElementByName("no_gluten").value="true";
		}
		if (document.getElementByName("no_soy_check").checked) {
			document.getElementByName("no_soy").value="true";
		}
	}
	//If the delete user form sent the event
	else if(event.target.getAttribute('id') == 'user_delete') {
		user_delete();
	}
};
