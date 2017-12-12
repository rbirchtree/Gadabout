Gaudabout: Find Great Events on the Fly

By Robert Birch

This app uses two APIS, a third will be integrated later to facilitate geocodes _queries_ from the user. Currently, this API is hard coded to work
 in the following cities **Austin, Boston, Miami, Los Angeles, Dallas, Houston, San Francisco, San Jose, Colorado Springs, 
and Denver.** The three APIs that are used are from Bing, Meetup and OpenWeatherMap.

The primary objective of this app is to find events that relevant to the user that day. For example, soccer meetups in Austin or 
Python meetups in Boston and the app will spout out a short list of possible meetups.

**[https://photos.app.goo.gl/0bPlRKOvENWOyKuk2]**

Below is a note for third API for future reference

/*Al0qDlhG-ivQ9dpO0bKURjGsV01DKZel03x83RQAh3AlUMpVTqnW3ZgbmP9ua3bc bing api map*/
https://msdn.microsoft.com/en-us/library/ff701715.aspx
http://dev.virtualearth.net/REST/v1/Locations?q=sf&o=json&key=Al0qDlhG-ivQ9dpO0bKURjGsV01DKZel03x83RQAh3AlUMpVTqnW3ZgbmP9ua3bc
take the location enter into the form by the user and return the most likely value with high confidence for the meet-up api function
use the bing map api first and call the meetup api from it

