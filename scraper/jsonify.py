import pickle, json, sys, random, string
from datetime import datetime

if len(sys.argv) == 1:
    print 'Usage: python jsonify.py picklefile'
    exit(0)

def id_generator(size=17, chars=string.ascii_letters + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))

posts = pickle.load(open(sys.argv[1], 'rb'))

for post in posts:
    post['_id'] = id_generator()
    text = post['answer']
    newdate = datetime.strptime(post['date'], '%B %d, %Y')
    post['answer'] = [{'text': text, 'name': 'Old Blog', 'date': {'$date': newdate.isoformat() + 'Z'}}]
    post['createdAt'] = {'$date': newdate.isoformat() + 'Z'}
    post['tags'] = []
    post['owner'] = 'W7iD4TTE76s8fCM4w'
    post['username'] = 'jmerali'

json.dump(posts, open(sys.argv[1][:-6] + 'json', 'w'))

