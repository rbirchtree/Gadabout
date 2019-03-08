$(function(){
	});
	$("#eventFinder").submit(event => {
		event.preventDefault();
		userTravelCity = $("#city").val();
		userInterest = $("#userInterest").val();
		$("#results").removeClass("hidden");
		/*$("#travelCityWeather").removeClass("hidden"); enable later*/
		googleLookupCityForLatLon(userTravelCity,userInterest);
		/*travelCityWeatherAPICall(userTravelCity) enable later*/
		$("#userInterest").val("");
		$("#city").val("");
		$("#results").empty();
	});
   

function GeoCodeToCityLookup(geocodes){
	$.ajax({
		method: 'GET',
		url: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${geocodes[0]},${geocodes[1]}&key=AIzaSyAXjEyA_kfZE3rPEHYM6B1j1yJTZwehan4`,
		success: function(data){

			var userCity = data.results[1].address_components[1].long_name;
      

        }
});
}

function googleLookupCityForLatLon(travelCity,userInterest){
  console.log('travel city',travelCity)
   		$.ajax({
   			method: 'GET',
   			url: `https://maps.googleapis.com/maps/api/geocode/json?address=${travelCity}&key=AIzaSyAXjEyA_kfZE3rPEHYM6B1j1yJTZwehan4`,
   			success: function (mapData){
          if (mapData.status!="ZERO_RESULTS"){
				 let travelCityGeoCodes = [mapData.results["0"].geometry.location.lat, mapData.results["0"].geometry.location.lng];
				 /*return travel city name map data zero results error handaling code from here when using xkcd city*/
				 console.log('what travelCityGeoCodes',travelCityGeoCodes)
				 userTravelCity = mapData.results["0"].address_components["0"].long_name				
				 callMeetUPAPI(travelCityGeoCodes, userInterest);
          } else{
            $("#results").html("<p>Please enter a valid location or interest.</p>")
          }
   			},
   			/*add error handaling here*/
   			error: function(){
   				$("#results").html("<p>There has been an error.</p>");
   			},

        statusCode: {
            404: function() {
      $( "#results" ).html("<p>Please enter a valid location.");
    }
  }
   		});
   }

/*function travelCityWeatherAPICall(city){
    $.ajax({
      method: 'GET',
      url: `https://api.openweathermap.org/data/2.5/weather?q=${encodeURI(city)}&mode=json&units=imperial&appid=71dd692b6e018b9ef955bdbff87a0067`,
      success: function(weather_data){
        let image = weatherImages[weather_data.weather[0].description];
        
        image === undefined ? image = "<img src='Images/overcast.png'/>" : image;
        $("#travelCityWeather").html(`${image}`);
        $('#travelCityWeather').find('img').before(`<h2>${weather_data.name}'s Weather</h2>`);

      }
    });
  }*/


function callMeetUPAPI(geocodes, interests){
  $.ajax({
    method:'GET',
    crossDomain: true,
    dataType: 'jsonp',
    url: `https://api.meetup.com/2/open_events?&sign=true&photo-host=public&lat=${geocodes[0]}&topic=${encodeURI(interests)}&lon=${geocodes[1]}&radius=70&page=3&key=434519614563187d65466f42b4e6b74`,
    success: function(meetupData){
      if(meetupData.meta.count == 0) {
        $("#results").html("<h2>There are no results for that in this town.</h2>");
      } else if (meetupData.meta.count === undefined){
        $("#results").html("<h2>There are no results for that.</h2>");
      } else {
      $('#results').html(`<h2>Events in ${userTravelCity}</h2>`);
      jQuery.each( meetupData.results, function( i ) {
        $('#results').append(`<li><a href=" ${meetupData.results[i].event_url}"> ${meetupData.results[i].name}</a> ${moment(meetupData.results[i].time).add(1,'hour').local().format('MMM DD hh:mm a')}</li>`);
          return (i < 6);
          }
        );
      }
    },
      error : function(){
        $("#results").html("<p>There is an error with the Meetup API</p>");
      }
  });
}  


const weatherImages = {
      "clear sky": "<img src='Images/clear-sky.png'/>",
      "rain": "<img src='Images/rain.png'/>",
      "sunny": "<img src='Images/sunny.png'/>",
      "snow":"<img src='Images/snow.png'/>",
      "overcast clouds":"<img src='Images/overcast.png'/>"
    };
