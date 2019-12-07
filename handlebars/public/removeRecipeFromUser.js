$(document).ready(function(){
    
    // delete request from user to remove a recipe from their personal list
    $(".removeRecipeFromUserList").click(function(){
        $.ajax({
        url: '/home/' + $(this).attr('value'),
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
    });
});