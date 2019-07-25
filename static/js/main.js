

function get_ads_from_account_and_display_to_client(){
    


    window.user_name = document.getElementById("username").value;
    window.user_pass = document.getElementById("password").value;
    $(".lds-hourglass").show(function(){
        var jqXHR = $.ajax({
            type: "POST",
            url: "/main",
            async: false,
            data:{ username: window.user_name, password: window.user_pass}
        });
        display_ads_to_client(jqXHR.responseText);
    
    });
    $("#logindiv").hide();
}

function display_ads_to_client(ads){
    ads = JSON.parse(ads);
    jQuery.each(ads, function(i,ad){
        var ad_name = ad.ad_name;
        var ad_next_bounce = ad.ad_next_bounce;
        var ad_status = ad.ad_status;
        var is_bounce_valid = ad.is_bounce_valid;
        var ad_url = ad.ad_url;
        if(!ad_next_bounce && is_bounce_valid)
            ad_next_bounce = "NOW";
        else if(!ad_next_bounce)
            ad_next_bounce = "";
        $('#ads_table tr:last').after('<tr id="'+ad_url+'"><td>'+ad_name+'</td><td>'+ad_status+'</td><td>'+ad_next_bounce+'</td><td><input id="bouncebox'+i+'" type="checkbox" checked/></td></tr>');
    });
    $(".lds-hourglass").hide();
    $("#ads_div").show();
}

function getDiffTime(next_bounce){
    var return_minutes = return_hours = ""
    var next_hour = Number(next_bounce.split(':')[0]);
    var next_minutes = Number(next_bounce.split(':')[1]);
    var today = new Date();
    var now_hour = Number(today.getHours());
    var now_minutes = Number(today.getMinutes());
    actual_minutes = next_minutes - now_minutes;
    actual_hours = next_hour - now_hour
    if(actual_minutes < 0)
        actual_minutes = String(60 + actual_minutes)
    if(actual_hours < 0)
        actual_hours = String(24 + actual_hours)
    return actual_hours+":"+actual_minutes+":00";
}

function start_popping_ads(){
    var arr = {};
    $('#ads_table tr').each(function(){
        if(this.id != "tbl_first_tr"){
            arr[this.id] = [this.children[1].innerHTML, this.children[2].innerHTML, this.children[3].children[0].checked];
            var bounce_time = this.children[2].innerHTML;
            this.children[2].innerHTML = '<p class="countdown-timer">'+getDiffTime(bounce_time)+"</p>";
        }
    });
    start_countdown();
    console.log(arr);

}