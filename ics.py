import requests
import pyrebase
from icalendar import Calendar, Event
from datetime import datetime
from pytz import UTC

# Authenticate to Database
config = {
"apiKey": "AlzaSyAJ920IR4T5sDDGJAFjofZXEHOlu5bdkj4",
"authDomain": "uiucfreestuff.firebaseapp.com",
"databaseURL": "https://uiucfreestuff.firebaseio.com",
"storageBucket": "uiucfreestuff.appspot.com"
}

firebase = pyrebase.initialize_app(config)
db = firebase.database()

# Initialize calendars to scrape
CALENDAR_LINK = "http://illinois.edu/calendar/list/"

calendars = ['2622', '5529', '2568', '2654', '504', '2835', '2040', '1771', '598', '7', '1383', '1905']

for calendar in calendars:
	calendar_ical = requests.get('http://illinois.edu/calendar/ical/'+calendar+'.ics')
	gcal = Calendar.from_ical(calendar_ical.text)
	for component in gcal.subcomponents:
		description = component.decoded("DESCRIPTION").replace(b'\xc2\xa0', b' ').decode('utf-8')
		location = None
		start_time = None
		end_time = None
		summary = component.decoded("SUMMARY").decode('utf-8')
		uid = None
		# initialize strings to check
		strings = ['free snacks', 'free food', 'pizza', 'lunch on us', 'dish it up', 'food for thought', 'lunch provided'];
		if any(s in description.lower() + summary.lower() for s in strings):
			location = component.decoded("LOCATION").decode('utf-8')
			start_time = component.decoded("DTSTART").isoformat()
			end_time = component.decoded("DTEND").isoformat()
			uid = component.decoded("UID").decode('utf-8')
			data = {
					"UID": uid,
					"Start Time": start_time,
					"End Time": end_time,
					"Summary": summary,
					"Location": location,
					"Description": description
			}
			# only push to server when UID is not already in system
			if len(db.child("eventsNew").order_by_child("UID").equal_to(uid).get().pyres)==0:
				db.child("eventsNew").push(data);
			
