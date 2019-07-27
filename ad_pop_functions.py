#!/usr/bin/env python
# -*- coding: utf-8 -*-
import os
import re
import json
import smtplib, ssl
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from flask import Flask, render_template, request, send_from_directory
app = Flask(__name__, template_folder='.', static_url_path='')


class Advertisment:
    def __init__(self, ad_name, ad_url, ad_next_bounce, ad_status, is_bounce_valid=False):
        self.ad_name = ad_name
        self.ad_url = ad_url
        self.ad_next_bounce = ad_next_bounce
        self.ad_status = ad_status
        self.is_bounce_valid = is_bounce_valid

    def print_me(self):
        print("ad name:       "+self.ad_name.__str__())
        print("ad url:       "+self.ad_url.__str__())
        print("next bounce:  "+self.ad_next_bounce.__str__())
        print("is_bouncable: "+self.is_bounce_valid.__str__())
        print("ad status: "+self.ad_status.__str__())


def login_to_yad2(username, password):
    try:
        chrome_options = webdriver.ChromeOptions()
        chrome_options.binary_location = os.environ.get("GOOGLE_CHROME_BIN")
        chrome_options.add_argument('--disable-dev-shm-usage')
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--headless')
        browser = webdriver.Chrome(executable_path=os.environ.get("CHROMEDRIVER_PATH"), chrome_options=chrome_options)
    except:
        browser = webdriver.Chrome("chromedriver75win")
    browser.get("https://yad2.co.il/login.php")
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
    except:
        ad_name = browser.find_element_by_id("info").text
    ad_name = ad_name[ad_name.find(":")+1:].strip()
    return ad_name


def rerun_expired_ad(browser, ad_url):
    browser.get(ad_url)
    expired_msg_xpath = "//div[@class='desc orange']/div[@class='expired_msg']/a[@href]"
    expired_url = browser.find_element_by_xpath(expired_msg_xpath).get_attribute('href')
    if not expired_url:
        return [browser, False]
    browser.get(expired_url)
    return [browser, True]


def pop_active_ad(browser, ad_url):
    browser.get(ad_url)
    bounce_btn = browser.find_element_by_xpath("//*[@id='bounceRatingOrderBtn']")
    if not bounce_btn:
        return [browser, False]
    bounce_btn.click()
    return [browser, True]


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
        ads[str(len(ads))] = ad.__dict__


def send_email(ads,reciver_email):
    smtp_server = "smtp.gmail.com"
    port = 587  # For starttls
    sender_email = "popmyads2@gmail.com"
    password = "Bbamba!YAD2"
    # Create a secure SSL context
    context = ssl.create_default_context()
    subject = "אל תדאג נשמה של ברבור הקפצנו לך!"
    ad = ""
    for url, add_prop in ads.items():
        ad = "מודעתך \""
        ad = u' '.join((ad,add_prop[3]))
        ad = u' '.join((ad,"\" הוקפצה"))
        ad = u' '.join((ad,"בכתובת"))
        ad = u' '.join((ad,url))
    try:
        server = smtplib.SMTP(smtp_server, port)
        server.ehlo()
        server.starttls(context=context)
        server.ehlo()
        server.login(sender_email, password)
        msg = "Subject: {}\n\n{}".format(subject, ad)
        server.sendmail(sender_email, reciver_email, msg.encode('utf-8'))
    except Exception as e:
        print(e)
        return "False"

    server.quit()
    return "True"


@app.route('/pop_ads', methods=['POST'])
def pop_ads():
    advertisements = request.form['advertisements']
    username = request.form['username']
    password = request.form['password']
    need_to_send_email = request.form['send_email']
    need_to_send_email = bool(need_to_send_email) 
    advertisements = json.loads(advertisements)
    if not advertisements:
        return "{}"
    browser = login_to_yad2(username, password)
    for ad_url, status in advertisements.items():
        if status == "מודעה פעילה":
            browser, pop_succeeded = pop_active_ad(browser, ad_url)
        else:
            browser, pop_succeeded = rerun_expired_ad(browser, ad_url)
        next_bounce = get_next_bounce_time(browser)
        ad_name = get_ad_name(browser)
        advertisements[ad_url] = [status, next_bounce, pop_succeeded, ad_name]
    if need_to_send_email :
        send_email(advertisements, username)
    browser.close()
    return json.dumps(advertisements)


def create_ad_dict(browser):
    active_categories_url = get_active_categories_url(browser)
    ads = {}
    for category_url in active_categories_url:
        get_ads_from_category_url(browser, category_url, ads)
    return ads


@app.route("/")
@app.route("/index.html")
def index():
    return render_template('index.html')


@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'), 'favicon.ico', mimetype='image/vnd.microsoft.icon')


@app.route('/main', methods=['POST'])
def main():
    user_name = request.form['username']
    password = request.form['password']
    browser = login_to_yad2(user_name, password)
    advertisements = create_ad_dict(browser)
    browser.close()
    # reorder_expired_ads
    return advertisements


if __name__ == "__main__":
    app.debug = True
    # app.run(host = '0.0.0.0',port=443)
    app.run()
