
$(function(){ 
  let cityPositions;
  navigator.geolocation.getCurrentPosition(function(position){
   cityPositions = [position.coords.latitude, position.coords.longitude];
   
   currentCityWeatherAPICall(cityPositions);
   
  /*http://www.nelsoncountylife.com/weather_icons/day/sunny.jpg*/
  /*http://png.clipart.me/graphics/thumbs/160/snowflakes-winter-frosty-snow-background_160742723.jpg*/
   /*return weatherAPI(cityPositions);*/
   /*look at current status for weather and append*/
   
  $("#eventFinder").submit(event => {
    event.preventDefault();
    var location = $("#city").val();' replace spaces with forms'
    var interests = $("#usersInterest").val();
    $("#results").removeClass("hidden");
    $("#travelCityWeather").removeClass("hidden");
     /*api meetup call  434519614563187d65466f42b4e6b74*/
    callMeetUPAPI(location,interests);
    let cityForAPI = encodeURI(location);
    travelCityWeatherAPICall(cityForAPI);
  }); 
});

function callMeetUPAPI(city, interests){
  latLon= {Austin: ["30.307182","-97.755996"],
            Boston: ["42.33196","-71.020173"],
            Miami:["25.775163","-80.208615"],
            "Los Angeles":["34.0522","-118.2437"],
            Dallas:["32.794176","-96.765503"],
            Houston:["29.780472","-95.386342"],
            "San Francisco":["37.727239","-123.032229"],
            "San Jose":["37.296867","-121.819306"],
            "Colorado Springs":["38.867255","-104.760749"],
            Denver:["39.761849","-104.880625"]
            };
            /* names with lat and lon*/
            let coords = latLon[city];
  $.ajax({
    method:'GET',
    url: `https://api.meetup.com/2/open_events?&sign=true&photo-host=public&lat=${coords[0]}&topic=${interests}&lon=${coords[1]}&radius=10&page=5`,
    success: function(meetupData){
      console.log(meetupData)
      /*' append data list previous and next tab'*/
    }
  })
}  

function travelCityWeatherAPICall(city){
    $.ajax({
      method: 'GET',
      url: `https://api.openweathermap.org/data/2.5/weather?q=${city}&mode=json&units=imperial&appid=71dd692b6e018b9ef955bdbff87a0067`,
      success: function(weather_data){
        let image = weatherImages[weather_data.weather[0].description];
        $("#travelCityWeather").html(`${image}`);
        $('#travelCityWeather').find('img').before(`<p>${decodeURI(city)}'s  weather</p>`);
      }
    });
  }
  
  function currentCityWeatherAPICall(positions){
    
    $.ajax({
      method: 'GET',
      url: `https://api.openweathermap.org/data/2.5/weather?lat=${positions[0]}&lon=${positions[1]}&mode=json&units=imperial&appid=71dd692b6e018b9ef955bdbff87a0067`,
      success: function(weather_data){
        let image = weatherImages[weather_data.weather[0].description];
        $("#currentLocationWeather").html("<p>Current Weather Location</p>"+image);
        

      }
    });
  }
 
function formatDateForSportsAPI() {
    var today = new Date();
    var date = String(today.getFullYear()+'/'+(today.getMonth()+1)+'/'+today.getDate());
    return date;
}
  
});

const weatherImages = {
      "clear sky": "<img src='http://basictextures.com/wp-content/free-textures/2010/12/sky-clouds-blue-00172-150x150.jpg'/>",
      "rain": "<img src='http://www.nature.com/news/2002/020912/images/rain_160.jp'/>g",
      "sunny": "<img src='http://www.nelsoncountylife.com/weather_icons/day/sunny.jpg'/>",
      "snow":"<img src='http://png.clipart.me/graphics/thumbs/160/snowflakes-winter-frosty-snow-background_160742723.jpg'/>",
      "overcast clouds":"<img src='https://img.buzzfeed.com/buzzfeed-static/static/2015-04/22/12/enhanced/webdr12/enhanced-buzz-4479-1429721520-8.jpg'/>"
    };



