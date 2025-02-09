$("#event").change(function() {
   if($(this).val() == "poster"){
    $("#mem3").slideUp()
   }else{
    $("#mem3").slideDown()
   }
});
  let home = $("#home")
  let myacc = $("#myacc")
  let reg = $("#reg")
  let log = $("#logout")
  let myaccAcnt = $("#myacc-cont")
  let formCont = $("#form-cont")
  let homecont = $("#homecont")
  const token = localStorage.getItem("auth-token");

  myacc.click(()=>{
    
    if (!token) {
  window.location.href ="/spave/login"
    }else{
    
    myaccAcnt.slideDown()
    formCont.hide()
    homecont.hide()
    $("#rgbtn").hide()
    }
  })

  reg.click(()=>{
    
    if (!token) {
      window.location.href ="/spave/login"
        }else{
    myaccAcnt.hide()
    formCont.slideDown()
    homecont.hide()
    $("#rgbtn").hide()
        }
  })

  home.click(()=>{
    myaccAcnt.hide()
    formCont.hide()
    homecont.slideDown()
    $("#rgbtn").show()
  })

  $("#rgbtn").click(()=>{
    
    if (!token) {
      window.location.href ="/spave/login"
        }else{
        
    myaccAcnt.hide()
    formCont.slideDown()
    homecont.hide()
    $("#rgbtn").hide()
        }
  })

  $("#techevent").click(()=>{
    
    if (!token) {
      window.location.href ="/spave/login"
        }else{
    myaccAcnt.hide()
    formCont.slideDown()
    homecont.hide()
    $("#rgbtn").hide()
        }
  })
  $("#event2").click(()=>{
    
    if (!token) {
      window.location.href ="/spave/login"
        }else{
    myaccAcnt.hide()
    formCont.slideDown()
    homecont.hide()
    $("#rgbtn").hide()
        }
  })
  $("#event3").click(()=>{
    
    if (!token) {
      window.location.href ="/spave/login"
        }else{
    myaccAcnt.hide()
    formCont.slideDown()
    homecont.hide()
    $("#rgbtn").hide()
        }
  })
