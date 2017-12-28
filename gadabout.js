$(function(){
	navigator.geolocation.getCurrentPosition(function(position) {
  		var userGeoCodes = [position.coords.latitude, position.coords.longitude];
  		GeoCodeToCityLookup(userGeoCodes);	
	});
	});
	$("#eventFinder").submit(event => {
		event.preventDefault();
		userTravelCity = $("#city").val();
		userInterest = $("#userInterest").val();
		$("#results").removeClass("hidden");
		$("#travelCityWeather").removeClass("hidden");
		googleLookupCityForLatLon(userTravelCity,userInterest);
		travelCityWeatherAPICall(userTravelCity)
		$("#userInterest").val("");
		$("#city").val("");
		$("#results").empty();
	});
   

function GeoCodeToCityLookup(geocodes){
	$.ajax({
		method: 'GET',
		url: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${geocodes[0]},${geocodes[1]}&key=AIzaSyAXjEyA_kfZE3rPEHYM6B1j1yJTZwehan4`,
		success: function(data){
			/*return city geococe later tonight*/
			var userCity = data.results[3].address_components["0"].long_name;
			$("#currentLocationWeather").html(`<h2>${userCity}'s Weather</h2>`)
			currentCityWeatherAPICall(geocodes);

        }
});
}

  function currentCityWeatherAPICall(geocodes){
    $.ajax({
      method: 'GET',
      url: `https://api.openweathermap.org/data/2.5/weather?lat=${geocodes[0]}&lon=${geocodes[1]}&mode=json&units=imperial&appid=71dd692b6e018b9ef955bdbff87a0067`,
      success: function(weather_data){
        let weatherImage = weatherImages[weather_data.weather[0].description];
        weatherImage === undefined ? weatherImage = "<img src='https://img.buzzfeed.com/buzzfeed-static/static/2015-04/22/12/enhanced/webdr12/enhanced-buzz-4479-1429721520-8.jpg'/>" : weatherImage;
        $("#currentLocationWeather").append(weatherImage);    
      }
    });
  } 

function googleLookupCityForLatLon(travelCity,userInterest){
   		$.ajax({
   			method: 'GET',
   			url: `https://maps.googleapis.com/maps/api/geocode/json?address=${travelCity}&key=AIzaSyAXjEyA_kfZE3rPEHYM6B1j1yJTZwehan4`,
   			success: function (mapData){
				 let travelCityGeoCodes = [mapData.results["0"].geometry.location.lat, mapData.results["0"].geometry.location.lng];
				 /*return travel city name*/
				 userTravelCity = mapData.results["0"].address_components["0"].long_name				
				 callMeetUPAPI(travelCityGeoCodes, userInterest);

   			},
   			/*add error handaling here*/
   			error: function(){
   				$("#results").html("<p>Please enter a valid location.</p>");
   			},
        complete: function(){
          $("#results").html("<p>Please enter a valid location or interest.</p>")
        },
        statusCode: {
            404: function() {
      $( "#results" ).html("<p>Please enter a valid location.");
    }
  }
   		});
   }

function travelCityWeatherAPICall(city){
    $.ajax({
      method: 'GET',
      url: `https://api.openweathermap.org/data/2.5/weather?q=${encodeURI(city)}&mode=json&units=imperial&appid=71dd692b6e018b9ef955bdbff87a0067`,
      success: function(weather_data){
        let image = weatherImages[weather_data.weather[0].description];
        
        image === undefined ? image = "<img src='https://img.buzzfeed.com/buzzfeed-static/static/2015-04/22/12/enhanced/webdr12/enhanced-buzz-4479-1429721520-8.jpg'/>" : image;
        $("#travelCityWeather").html(`${image}`);
        $('#travelCityWeather').find('img').before(`<h2>${weather_data.name}'s Weather</h2>`);

      }
    });
  }


function callMeetUPAPI(geocodes, interests){
  $.ajax({
    method:'GET',
    crossDomain: true,
    dataType: 'jsonp',
    url: `https://api.meetup.com/2/open_events?&sign=true&photo-host=public&lat=${geocodes[0]}&topic=${encodeURI(interests)}&lon=${geocodes[1]}&radius=50&page=3&key=434519614563187d65466f42b4e6b74`,
    success: function(meetupData){
    	
      if(meetupData.meta.count === 0) {
      	console.log(meetupData)
        $("#results").html("<h2>There are no results for that in this town.</h2>");
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
      "clear sky": "<img src='cloudsblue.jpg'/>",
      "rain": "<img src='http://www.nature.com/news/2002/020912/images/rain_160.jp'/>g",
      "sunny": "<img src='http://www.nelsoncountylife.com/weather_icons/day/sunny.jpg'/>",
      "snow":"<img src='http://png.clipart.me/graphics/thumbs/160/snowflakes-winter-frosty-snow-background_160742723.jpg'/>",
      "overcast clouds":"<img src='https://img.buzzfeed.com/buzzfeed-static/static/2015-04/22/12/enhanced/webdr12/enhanced-buzz-4479-1429721520-8.jpg'/>"
    };


function meetupTime(dataTime){
  return new Date(dataTime);
}
