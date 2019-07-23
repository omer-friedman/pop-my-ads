
 function getUserNameAndPassword() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    run_ads_poping(username,password)
  }


  function run_ads_poping(name,pass){
    var jqXHR = $.ajax({
        type: "POST",
        url: "/main",
        async: false,
        data: { username: name ,password: pass},
        success: function(data){console.log(data)}
    });

    return jqXHR.responseText;
}