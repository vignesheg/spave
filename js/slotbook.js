//checking is there session or not
let sess = localStorage.getItem("spave-email");
if(sess == null){
    window.location.href = "../login-signup"
}