
$(function(){ 
  let cityPositions;
  navigator.geolocation.getCurrentPosition(function(position){
   cityPositions = [position.coords.latitude, position.coords.longitude];
   /*pass data into currentCityWeatherAPICall*/
   /*https://maps.googleapis.com/maps/api/geocode/json?address=1309nightingaleaustintx&key=AIzaSyAXjEyA_kfZE3rPEHYM6B1j1yJTZwehan4*/
   var currentCity;
   var coords
   currentCityWeatherAPICall(cityPositions);
   
   
  $("#eventFinder").submit(event => {
    event.preventDefault();
    var location = $("#city").val();' replace spaces with forms use a better name for location variable, test city and state combos'
    var interests = $("#usersInterest").val();
    $("#results").removeClass("hidden"); 'user results for a variable'
    $("#travelCityWeather").removeClass("hidden");
     $("container").html(`<ul class="hidden" id="results"></ul>`);

    let cityForAPI = encodeURI(location);
    googleLookupCityForLatLon(cityForAPI)
    callMeetUPAPI(location,interests);
	travelCityWeatherAPICall(cityForAPI);
    
    $("#usersInterest").val("");
    $("#city").val("");
    $("#results").empty();
  }); 
});

function callMeetUPAPI(city, interests){
  
 /*run google function here and return coordinates*/
 googleLookupCityForLatLon(city);
            /*let coords = latLon[city.toUpperCase()];*/
            
  $.ajax({
    method:'GET',
    crossDomain: true,
    dataType: 'jsonp',
    url: `https://api.meetup.com/2/open_events?&sign=true&photo-host=public&lat=${coords[0]}&topic=${encodeURI(interests)}&lon=${coords[1]}&radius=40&page=3&key=434519614563187d65466f42b4e6b74`,
    success: function(meetupData){
      if(meetupData.meta.count===0) {
        $("#results").html("<h2>There are no results for that in this town.</h2>");
      } else {
      $('#results').html(`<h2>Events in ${city.toUpperCase()}</h2>`);
      jQuery.each( meetupData.results, function( i ) {
        $('#results').append(
          `<li><a href=" ${meetupData.results[i].event_url}"> ${meetupData.results[i].name}</a> ${moment(meetupData.results[i].time).add(1,'hour').local().format('MMM DD hh:mm a')}</li>`);
        /*https://stackoverflow.com/questions/26392280/using-momentjs-to-convert-date-to-epoch-then-back-to-date*/
        /*${moment.unix(meetupData.results[i].time).format('hh:mm a')*/
        /*AIzaSyAXjEyA_kfZE3rPEHYM6B1j1yJTZwehan4 google api key*/
        /*https://developers.google.com/maps/documentation/geocoding/start*/
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

function travelCityWeatherAPICall(city){
    $.ajax({
      method: 'GET',
      url: `https://api.openweathermap.org/data/2.5/weather?q=${city}&mode=json&units=imperial&appid=71dd692b6e018b9ef955bdbff87a0067`,
      success: function(weather_data){
        let image = weatherImages[weather_data.weather[0].description];
        
        image === undefined ? image = "<img src='https://img.buzzfeed.com/buzzfeed-static/static/2015-04/22/12/enhanced/webdr12/enhanced-buzz-4479-1429721520-8.jpg'/>" : image;
        $("#travelCityWeather").html(`${image}`);
        $('#travelCityWeather').find('img').before(`<p>${jsUcfirst(decodeURI(city))}'s Weather</p>`);
      }
    });
  }
  
  function currentCityWeatherAPICall(positions){
    $.ajax({
      method: 'GET',
      url: `https://api.openweathermap.org/data/2.5/weather?lat=${positions[0]}&lon=${positions[1]}&mode=json&units=imperial&appid=71dd692b6e018b9ef955bdbff87a0067`,
      success: function(weather_data){
        let image = weatherImages[weather_data.weather[0].description];
        image === undefined ? image = "<img src='https://img.buzzfeed.com/buzzfeed-static/static/2015-04/22/12/enhanced/webdr12/enhanced-buzz-4479-1429721520-8.jpg'/>" : image;
        $("#currentLocationWeather").html(`<p> Current Location's Weather </p>`+image);    

      }
    });
  } 
   	function googleLookupCityForLatLon(city){
   		$.ajax({
   			method: 'GET',
   			url: `https://maps.googleapis.com/maps/api/geocode/json?address=${city}&key=AIzaSyAXjEyA_kfZE3rPEHYM6B1j1yJTZwehan4`,
   			success: function (mapData){
				 coords = [mapData.results["0"].geometry.location.lat, mapData.results["0"].geometry.location.lng];
				return coords;
				/*append to reuslts*/
				'have coords and user interest be passed into google look up for the city in meet-up api, turn async back to true'
   			},
   			async: false
   		});
   }

});

const weatherImages = {
      "clear sky": "<img src='cloudsblue.jpg'/>",
      "rain": "<img src='http://www.nature.com/news/2002/020912/images/rain_160.jp'/>g",
      "sunny": "<img src='http://www.nelsoncountylife.com/weather_icons/day/sunny.jpg'/>",
      "snow":"<img src='http://png.clipart.me/graphics/thumbs/160/snowflakes-winter-frosty-snow-background_160742723.jpg'/>",
      "overcast clouds":"<img src='https://img.buzzfeed.com/buzzfeed-static/static/2015-04/22/12/enhanced/webdr12/enhanced-buzz-4479-1429721520-8.jpg'/>"
    };



function jsUcfirst(string){
	return string.charAt(0).toUpperCase()+string.slice(1);
}


function meetupTime(dataTime){
  return new Date(dataTime);
}