from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import re
# from tkinter import *


class Advertisment:
    def __init__(self, ad_name, ad_url, ad_next_bounce, is_bounce_valid=False):
        self.ad_name = ad_name
        self.ad_url = ad_url
        self.ad_next_bounc = ad_next_bounce
        self.is_bounce_valid = is_bounce_valid

    def print_me(self):
        print("ad name:       "+self.ad_name.__str__())
        print("ad url:       "+self.ad_url.__str__())
        print("next bounce:  "+self.ad_next_bounc.__str__())
        print("is_bouncable: "+self.is_bounce_valid.__str__())


def login_to_yad2(username, password):
    browser = webdriver.Chrome("chromedriver")
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


def get_next_bounce_time(browser, ad_url):
    browser.get(ad_url)
    desc = browser.find_element_by_xpath("//div[@class='desc orange']").text
    match = re.search('([0-9][0-9]:[0-9][0-9])', desc)
    time = ""
    if match:
        time = match.group(1)
    return time


def get_ad_name(browser, ad_url):
    browser.get(ad_url)
    try:
        ad_name = browser.find_element_by_id("info_title").text
    except Exception:
        ad_name = browser.find_element_by_id("info").text
    ad_name = ad_name[ad_name.find(":")+1:].strip()
    return ad_name


def get_ads_from_category_url(browser, category_url, ads):
    browser.get(category_url)
    ads_element = browser.find_elements_by_xpath("//*[@id='feed']/tbody/tr[@data-frame]")
    urls = []

    for ad_element in ads_element:
        urls.append("http:"+ad_element.get_attribute("data-frame"))

    for ad_url in urls:
        next_bounce_time = get_next_bounce_time(browser, ad_url)
        ad_name = get_ad_name(browser, ad_url)
        ad = Advertisment(ad_name, ad_url, next_bounce_time, False if next_bounce_time else True)
        ads.append(ad)


# def handle_active_ads(browser, active_ads):
#     urls = []
#     for ad in active_ads:
#         urls.append("http:"+ad.get_attribute("data-frame"))
#     for url in urls:
#         browser.get(url)
#         bounce_btn = browser.find_element_by_xpath("//*[@id='bounceRatingOrderBtn']")
#         bounce_btn.click()


def create_ad_list(browser):
    active_categories_url = get_active_categories_url(browser)
    ads = []
    for category_url in active_categories_url:
        get_ads_from_category_url(browser, category_url, ads)

    return ads


def main():
    browser = login_to_yad2("omerf31@gmail.com", "Bbamba!YAD2")
    advertisement = create_ad_list(browser)
    for ad in advertisement:
        print("-"*80)
        print(ad.print_me())
    print("-"*80)


if __name__ == "__main__":
    main()


#     active_ads = browser.find_elements_by_xpath(("//tr[@class='item item-color-1']"))
#     for ad in active_ads:
#         ad.click()
#         print(ad)
#     browser.back()

# loginWin = Tk()
# lblLogin = Label(loginWin, text="Yad2 Login")
# lblUsr = Label(loginWin, text="User Name: ")
# lblPass = Label(loginWin, text="Password: ")
# entry_usr = Entry(loginWin)
# entry_pass = Entry(loginWin)
#
# lblLogin.grid(row=0, columnspan=2)
# lblUsr.grid(row=1, sticky=E)
# lblPass.grid(row=2, sticky=E)
# entry_usr.grid(row=1, column=1)
# entry_pass.grid(row=2, column=1)
# loginWin.mainloop
