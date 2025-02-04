$("#event").change(function () {
    if ($(this).val() != "poster") {
        $("#mem3").slideDown(); // Show form with animation
    } else {
        $("#mem3").slideUp(); // Hide form if no value is selected
    }
});


  let home = $("#home")
  let myacc = $("#myacc")
  let reg = $("#reg")
  let log = $("#logout")
  let myaccAcnt = $("#myacc-cont")
  let formCont = $("#form-cont")
  let homecont = $("#homecont")

  myacc.click(()=>{
    if(localStorage.getItem("spave-email") == null){
  window.location.href ="../login"
    }else{
    
    myaccAcnt.slideDown()
    formCont.hide()
    homecont.hide()
    }
  })

  reg.click(()=>{
    if(localStorage.getItem("spave-email") == null){
      window.location.href ="../login"
        }else{
    myaccAcnt.hide()
    formCont.slideDown()
    homecont.hide()
        }
  })

  home.click(()=>{
    myaccAcnt.hide()
    formCont.hide()
    homecont.slideDown()
  })