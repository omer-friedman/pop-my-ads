var check_boxes_counter = 0;

function handel_check_box_click(source) {
    if ($(source).attr("name" ) == "select_all") {
        check_boxes = document.getElementsByName('popis');
        for (var i = 0, n = check_boxes.length; i < n; i++){
            if(check_boxes[i].disabled)
                continue;
            check_boxes[i].checked = source.checked;
        }
        if(source.checked)
            check_boxes_counter = check_boxes.length;
        else
            check_boxes_counter = 0;
    }
    else if ($(source).attr("name" ) == "popis") {
        check_boxes = document.getElementsByName('popis');
        select_all_check_box = document.getElementsByName('select_all');
        if(source.checked == true) {
            check_boxes_counter++;
            if(check_boxes_counter == check_boxes.length)
                select_all_check_box[0].checked = source.checked;
        }
        else {
            check_boxes_counter--;
            select_all_check_box[0].checked = source.checked;
        }
    }
}

function back_to_login() {
    $("#logindiv").show();
    $(".lds-hourglass").hide(); 
    $("#ads_div").hide();}

function get_ads_from_account_and_display_to_client() {
    window.user_name = document.getElementById("username").value;
    window.user_pass = document.getElementById("password").value;
    $(".lds-hourglass").show(function () {
        var jqXHR = $.ajax({
            type: "POST",
            url: "/main",
            async: false,
            data: { username: window.user_name, password: window.user_pass }
        });
        console.log(jqXHR.responseText);
//       jqXHR="{\"0\": {\"ad_name\": \"\u05de\u05e8\u05d0\u05d4 \u05e2\u05e0\u05e7\u05d9\u05ea \u05de\u05d1\u05d9\u05ea\u05d9\u05dc\u05d9\", \"ad_next_bounce\": \"03:58\", \"ad_status\": \"\u05de\u05d5\u05d3\u05e2\u05d4 \u05e4\u05e2\u05d9\u05dc\u05d4\", \"ad_url\": \"http://my.yad2.co.il/newOrder/index.php?action=personalAreaViewDetails&CatID=3&SubCatID=0&OrderID=39228500\", \"is_bounce_valid\": false, \"num_watched\": \"6\"}, \"1\": {\"ad_name\": \"\u05e4\u05e1\u05e0\u05ea\u05e8 Charis ah-20 \u05d1\u05de\u05e6\u05d1 \u05d7\u05d3\u05e9\", \"ad_next_bounce\": \"03:58\", \"ad_status\": \"\u05de\u05d5\u05d3\u05e2\u05d4 \u05e4\u05e2\u05d9\u05dc\u05d4\", \"ad_url\": \"http://my.yad2.co.il/newOrder/index.php?action=personalAreaViewDetails&CatID=3&SubCatID=0&OrderID=38866433\", \"is_bounce_valid\": false, \"num_watched\": \"69\"}, \"2\": {\"ad_name\": \"\u05e4\u05d9\u05e0\u05ea \u05d0\u05d5\u05db\u05dc \u05de\u05e2\u05d5\u05dc\u05d4 \u05de\u05ea\u05e7\u05e4\u05dc\u05ea\", \"ad_next_bounce\": \"03:58\", \"ad_status\": \"\u05de\u05d5\u05d3\u05e2\u05d4 \u05e4\u05e2\u05d9\u05dc\u05d4\", \"ad_url\": \"http://my.yad2.co.il/newOrder/index.php?action=personalAreaViewDetails&CatID=3&SubCatID=0&OrderID=39246095\", \"is_bounce_valid\": false, \"num_watched\": \"7\"}, \"3\": {\"ad_name\": \"\u05d7\u05d3\u05e8 \u05e9\u05d9\u05e0\u05d4 - \u05de\u05d9\u05d8\u05d4, \u05de\u05d6\u05e8\u05d5\u05df \u05d5\u05e9\u05d9\u05d3\u05d5\u05ea\", \"ad_next_bounce\": \"02:56\", \"ad_status\": \"\u05de\u05d5\u05d3\u05e2\u05d4 \u05e4\u05e2\u05d9\u05dc\u05d4\", \"ad_url\": \"http://my.yad2.co.il/newOrder/index.php?action=personalAreaViewDetails&CatID=3&SubCatID=0&OrderID=39246136\", \"is_bounce_valid\": true, \"num_watched\": \"1\"}, \"4\": {\"ad_name\": \"\u05de\u05ea\u05e7\u05df \u05d4\u05d0\u05db\u05dc\u05d4 \u05dc\u05db\u05dc\u05d1\u05d9\u05dd \u05de\u05e2\u05e5 \u05d1\u05e9\u05dc\u05d5\u05e9\u05d4 \u05d2\u05d3\u05dc\u05d9\u05dd, \u05e2\u05d1\u05d5\u05d3\u05ea \u05d9\u05d3\", \"ad_next_bounce\": \"\", \"ad_status\": \"\u05e4\u05d2 \u05ea\u05d5\u05e7\u05e3\", \"ad_url\": \"http://my.yad2.co.il/newOrder/index.php?action=personalAreaViewDetails&CatID=5&SubCatID=0&OrderID=38221325\", \"is_bounce_valid\": false, \"num_watched\": \"152\"}}"
//        display_ads_to_client(jqXHR);
        display_ads_to_client(jqXHR.responseText);
    });
    $("#logindiv").hide();
}

function display_ads_to_client(ads) {
    ads = JSON.parse(ads);
    jQuery.each(ads, function (i, ad) {
        var ad_name = ad.ad_name;
        var ad_next_bounce = ad.ad_next_bounce;
        var ad_status = ad.ad_status;
        var is_bounce_valid = ad.is_bounce_valid;
        var ad_url = ad.ad_url;
        var num_watched = ad.num_watched;
        if (!ad_next_bounce && is_bounce_valid)
            ad_next_bounce = "NOW";
        else if (!ad_next_bounce)
            ad_next_bounce = "";
        $('#ads_table').append('<tr id="' + ad_url + '"><td>' + ad_name + '</td><td>' + num_watched + '</td><td>' + ad_status + '</td><td>' + ad_next_bounce + '</td><td><label class="my_checkbox"><input id="bouncebox' + i + '" type="checkbox" name="popis" onClick="handel_check_box_click(this)"><span class="checkmark"></span></label></td></tr>');
        if (ad_status != "מודעה פעילה" && ad_status != "פג תוקף")
            document.getElementById("bouncebox" + i).disabled = true;
    });
    $(".lds-hourglass").hide();
    $("#ads_div").show();
}

function getDiffTime(next_bounce) {
    if (!next_bounce.includes(':'))
        return next_bounce;
    var return_minutes = return_hours = "";
    var next_hour = Number(next_bounce.split(':')[0]);
    var next_minutes = Number(next_bounce.split(':')[1]);
    var today = new Date();
    var now_hour = Number(today.getHours());
    var now_minutes = Number(today.getMinutes());
    actual_minutes = next_minutes - now_minutes;
    actual_hours = (next_hour - now_hour);
    if (actual_minutes < 0){
        actual_minutes = String(60 + actual_minutes);
        actual_hours -= 1;
    }
    if (actual_hours < 0)
        actual_hours = String(24 + actual_hours);
    return actual_hours + ":" + actual_minutes + ":00";
}

function start_popping_ads(urls_properties_dict) {
    is_send_checkbox_checked = String(document.getElementById("email_checkbox").checked);
    if(!urls_properties_dict){
        document.getElementById("btn_popstop").disabled = false;
        return;
    }
    var pop_ads_str = $.ajax({
        type: "POST",
        url: "/pop_ads",
        async: true,
        data: {advertisements: JSON.stringify(urls_properties_dict), username: window.user_name, password: window.user_pass, send_email: is_send_checkbox_checked},
        success: function(response_data){
            pop_ads_json = JSON.parse(response_data);
            update_table(pop_ads_json);
            document.getElementById("btn_popstop").disabled = false;
        }
    });
}

function get_ads_dict_to_pop(){
    console.log("get_ads_dict_to_pop()");
    var urls_properties_dict = {};
    $('#ads_table tr').each(function () {
        var status = this.children[2].innerHTML;
        var next_bounce = this.children[3].innerHTML;
        var pop_ad_checked = this.children[4].children[0].children[0].checked;
        console.log(status+", "+next_bounce+", "+pop_ad_checked);
        if (pop_ad_checked) {
            if (!next_bounce.includes(':')){
                console.log("IM IN");
                urls_properties_dict[this.id] = status;
                this.children[3].innerHTML = '<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>';
            }
            if(!next_bounce.includes("countdown-timer"))
                update_td_table(this.id, "next_bounce", next_bounce);
        }
    });
    return urls_properties_dict;
}

function update_table(pop_ads_json){
    jQuery.each(pop_ads_json, function(url, prop){
        var status = prop[0]
        var next_bounce = prop[1]
        var pop_succeeded = prop[2]
        if(status=="פג תוקף" && pop_succeeded)
            update_td_table(url, "status", "מודעה פעילה");
        if(pop_succeeded)
            update_td_table(url, "next_bounce", next_bounce);
    });
}

function update_td_table(tr_id, td_name, value){
    var tr_elem = document.getElementById(tr_id);
    if(td_name == "status")
        tr_elem.children[2].innerHTML = value
    else if(td_name == "next_bounce" && value.includes(':')){
        tr_elem.children[3].innerHTML = '<label class="countdown-timer">'+value+'</label>';
        start_countdown(tr_elem.children[3].children[0]);
    }
}

function handle_pop_or_stop_button() {
    var button_content = document.getElementById("btn_popstop");
    if (button_content.innerHTML == "POP MY ADS!") {
        button_content.innerHTML = "STOP";
        $(".my_checkbox > input").each(function(){this.disabled = true;});
        var ads_to_pop = get_ads_dict_to_pop();
        document.getElementById("btn_popstop").disabled = true;
        start_popping_ads(ads_to_pop);
    }
    else {
        button_content.innerHTML = "POP MY ADS!";
        $(".my_checkbox > input").each(function(){this.disabled = false;});
    }
}