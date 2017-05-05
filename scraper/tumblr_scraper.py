import os, sys
import requests
from bs4 import BeautifulSoup
import pickle
from datetime import datetime

base_url = 'https://realtalk-princeton.tumblr.com/page/'
page_number = 1
data = []

# scrape until the epoch
if len(sys.argv) == 1:
    parse_to_date = datetime.fromtimestamp(0)

# scrape until the date given on command line
else:
    try:
        parse_to_date = datetime.strptime(sys.argv[1], '%B %d, %Y')
    except:
        print 'Usage: python tumblr_scraper.py \"Month Day, YYYY\"'
        exit(0)

current_date = datetime.now()
max_pages = 1

while page_number <= max_pages and current_date > parse_to_date:
    print 'scraping https://realtalk-princeton.tumblr.com/page/%d' % page_number

    # get Pages
    r = requests.get(base_url + str(page_number))
    soup = BeautifulSoup(r.text, 'html5lib')

    # find max pages
    # [u'Page', u'2', u'of', u'129'] -> 129
    try:
        max_pages = int(soup.find("section", {'class' : 'page-info'}).text.split()[3])
    except:
        pass

    # iterate through all posts on page and save info in list
    for post in soup.find_all('article', {'class' : 'post inf-scroll-item post-answer'}):
        question = ' '.join([x.text for x in post.find('div', {'class' : 'question-box'}).find_all('p')])
        answer = '\n'.join([x.text for x in post.find('div', {'class' : 'post-content'}).find_all('p')])
        link = post.find('a', {'class' : 'post-date'}).get('href')
        date = post.find('a', {'class' : 'post-date'}).text
        current_date = datetime.strptime(date, '%B %d, %Y')
        data.append({'question': question, 'answer': answer, 'link': link, 'date': date})

    page_number += 1

def pretty_date(date):
    return datetime.strftime(date, '%Y.%m.%d')
# pickle list of scraped questions
pickle.dump(data, open('scraped_questions%s-%s.pickle' % (pretty_date(datetime.now()), pretty_date(current_date)) , 'wb'))

