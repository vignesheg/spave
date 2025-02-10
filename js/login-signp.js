//user login register toggle
$("#reg-form").click(function() {
    $("#log-form-div").slideUp();
    $("#reg-form-div").slideDown();
});

$("#login-form").click(function() {
    $("#log-form-div").slideDown();
    $("#reg-form-div").slideUp();
});

