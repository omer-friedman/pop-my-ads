function getUserNameAndPassword(){
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    run_ads_poping(username,password);
}

function run_ads_poping(name,pass){
    var jqXHR = $.ajax({
        type: "POST",
        url: "/main",
        async: false,
        data:{ username: name, password: pass}
    });
    display_ads_to_client(jqXHR.responseText);
}

function display_ads_to_client(ads){
    $("#logindiv").hide();
    ads = JSON.parse(ads);
    console.log(ads);
    jQuery.each(ads, function(i,ad){
        var ad_name = ad.ad_name;
        var ad_next_bounce = ad.ad_next_bounce;
        var ad_status = ad.ad_status;
        var is_bounce_valid = ad.is_bounce_valid;
        if(!ad_next_bounce && is_bounce_valid)
            ad_next_bounce = "NOW"
        else if(!ad_next_bounce)
            ad_next_bounce = ""
        $('#ads_table tr:last').after('<tr><td>'+ad_name+'</td><td>'+ad_status+'</td><td>'+ad_next_bounce+'</td><td><input id="bouncebox'+i+'" type="checkbox"/></td></tr>');
        if(is_bounce_valid){
            document.getElementById("bouncebox"+i).checked = true;
        }
    });
    $("#ads_div").show();
}