import pickle
import sys

def pickle_error():
    print 'Usage: python parse_responses.py picklefile'
    exit(0)

print sys.argv
if len(sys.argv) == 1:
    pickle_error()
else:
    try:
        posts = pickle.load(open(sys.argv[1], 'rb'))
    except:
        pickle_error()
count = 0
starts = ['Response',  ' Response', ' response', 'response', 'Responnse', 'Rseponse', 'r f', 'R f' 'rf']

for post in posts:
    if 'answer' in post:
        ans = post['answer']
        if not any(ans.startswith(x) for x in starts):
            print ans
            count += 1
            print '-------------------------------------'

print count
