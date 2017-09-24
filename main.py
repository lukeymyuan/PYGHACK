import requests
from bs4 import BeautifulSoup, SoupStrainer
import pyrebase

ECE_LINK = "https://www.ece.illinois.edu"

response = requests.get(ECE_LINK + "/calendar/month")
soup = BeautifulSoup(response.text, parse_only=SoupStrainer('a', href=True))

config = {
	"apiKey": "AlzaSyAJ920IR4T5sDDGJAFjofZXEHOlu5bdkj4",
	"authDomain": "uiucfreestuff.firebaseapp.com",
	"databaseURL": "https://uiucfreestuff.firebaseio.com",
	"storageBucket": "uiucfreestuff.appspot.com"
}

firebase = pyrebase.initialize_app(config)
db = firebase.database()


for link in soup.find_all('a'):
	url = link.get('href')
	if 'calendar/event' in url:
		#print(url)
		url_response = requests.get(ECE_LINK + url)
		strings = ['free snacks', 'free food', 'pizza'];
		if any(s in url_response.text.lower() for s in strings):
			new_soup = BeautifulSoup(url_response.text, parse_only=SoupStrainer('tr'))
			title = str(link.get('title'))
			date = None
			time = None
			location = None
			description = None
			for tag in new_soup.find_all('tr'):
				th = tag.th.text.encode('utf-8')
				parsed = BeautifulSoup(tag.encode('utf-8'), parse_only=SoupStrainer('td')).find_all('td')[0].text.encode('utf-8').strip()
				if b'date:' in th.lower():
					date = parsed.replace(b'\n',b'').replace(b'\r',b'').decode('utf-8')
				elif b'time:' in th.lower():
					time = parsed.replace(b'\n',b'').replace(b'\r',b'').decode('utf-8')
				elif b'location:' in th.lower():
					location = parsed.replace(b'\n',b'').replace(b'\r',b'').decode('utf-8')
				elif b'\xc2' in th.lower():
					description = parsed.decode('utf-8')
			if any(s in description.lower() for s in strings):
				print(title + " on " + date + " at " + time + " at " + location)
				print(description)
				data = {
					"Date": date,
					"Time": time,
					"Description": description,
					"Location": location,
					"Title": title
				}

				#uncomment to push to db
				#db.child("events").push(data);

