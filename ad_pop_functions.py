from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from flask import Flask, render_template, redirect, url_for,request
from flask import make_response
import re
app = Flask(__name__, template_folder='.', static_url_path='')


class Advertisment:
    def __init__(self, ad_name, ad_url, ad_next_bounce, ad_status, is_bounce_valid=False):
        self.ad_name = ad_name
        self.ad_url = ad_url
        self.ad_next_bounc = ad_next_bounce
        self.ad_status = ad_status
        self.is_bounce_valid = is_bounce_valid

    def print_me(self):
        print("ad name:       "+self.ad_name.__str__())
        print("ad url:       "+self.ad_url.__str__())
        print("next bounce:  "+self.ad_next_bounc.__str__())
        print("is_bouncable: "+self.is_bounce_valid.__str__())
        print("ad status: "+self.ad_status.__str__())


def login_to_yad2(username, password):
    browser = webdriver.Chrome("chromedriver75win")
    browser.get("https://my.yad2.co.il/login.php")
    if not browser.current_url == "https://my.yad2.co.il/login.php":
        return browser
    user_elem = browser.find_element_by_id("userName")
    pass_elem = browser.find_element_by_id("password")
    user_elem.send_keys(username)
    pass_elem.send_keys(password)
    pass_elem.send_keys(Keys.ENTER)
    return browser


def get_active_categories_url(browser):
    active_categories_urls = []
    active_categories_elements = browser.find_elements_by_xpath("//a[@target='_self']")
    for category in active_categories_elements:
        active_categories_urls.append(category.get_attribute("href"))
    return active_categories_urls


def get_next_bounce_time(browser):
    desc = browser.find_element_by_xpath("//div[@class='desc orange']").text
    match = re.search('([0-9][0-9]:[0-9][0-9])', desc)
    time = ""
    if match:
        time = match.group(1)
    return time


def get_ad_name(browser):
    try:
        ad_name = browser.find_element_by_id("info_title").text
    except Exception:
        ad_name = browser.find_element_by_id("info").text
    ad_name = ad_name[ad_name.find(":")+1:].strip()
    return ad_name


def rerun_expired_ad(browser, ad_url):
    browser.get(ad_url)
    expired_msg_xpath = "//div[@class='desc orange']/div[@class='expired_msg']/a[@href]"
    expired_url = browser.find_element_by_xpath(expired_msg_xpath).get_attribute('href')
    if not expired_url:
        pass
    browser.get(expired_url)


def get_ads_from_category_url(browser, category_url, ads):
    browser.get(category_url)
    ads_url_element = browser.find_elements_by_xpath("//*[@id='feed']/tbody/tr[@data-frame]")
    ads_details_element = browser.find_elements_by_xpath("//*[@id='feed']/tbody/tr[@class='item item-color-1']/td[contains(@class, 'status_wrapper')]/div")
    url_and_status = []
    for i in range(0, len(ads_url_element)):
        url = "http:"+ads_url_element[i].get_attribute("data-frame")
        status = ads_details_element[i].text
        url_and_status.append((url, status))

    for ad_url, ad_status in url_and_status:
        browser.get(ad_url)
        if "מודעה פעילה" in ad_status:
            next_bounce_time = get_next_bounce_time(browser)
            is_bouncable = False if next_bounce_time else True
        else:
            next_bounce_time = ""
            is_bouncable = False
        ad_name = get_ad_name(browser)
        ad = Advertisment(ad_name, ad_url, next_bounce_time, ad_status, is_bouncable)
        ads.append(ad)


def handle_active_ads(browser, advertisments):
    for ad in advertisments:
        browser.get(ad.ad_url)
        bounce_btn = browser.find_element_by_xpath("//*[@id='bounceRatingOrderBtn']")
        bounce_btn.click()


def create_ad_list(browser):
    active_categories_url = get_active_categories_url(browser)
    ads = []
    for category_url in active_categories_url:
        get_ads_from_category_url(browser, category_url, ads)
    return ads


@app.route("/")
@app.route("/index.html")
def index():
    return render_template('index.html')


@app.route('/main', methods=['GET', 'POST'])
def main():
    if request.method == 'POST':
        user_name = request.form['username']
        password = request.form['password']
        browser = login_to_yad2(user_name, password)
    else:
        browser = login_to_yad2("omerf311111@gmail.com", "Bbamba!YAD2")
    advertisements = create_ad_list(browser)
    # reorder_expired_ads
    # for ad in advertisements:
    #     print("-"*80)
    #     ad.print_me()
    # print("-"*80)


# if __name__ == "__main__":
#     app.run(debug=True)
