$(function(){
	});
	$('#eventFinder').submit(event => {
		event.preventDefault();
		userTravelCity = $('#city').val();
		userInterest = $('#userInterest').val();
		$('#results').removeClass('hidden');
		googleLookupCityForLatLon(userTravelCity,userInterest);
		$('#userInterest').val('');
		$('#city').val('');
		$('#results').empty();
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
   		$.ajax({
   			method: 'GET',
   			url: `https://maps.googleapis.com/maps/api/geocode/json?address=${travelCity}&key=AIzaSyAXjEyA_kfZE3rPEHYM6B1j1yJTZwehan4`,
   			success: function (mapData){
          if (mapData.status!='ZERO_RESULTS'){
				 let travelCityGeoCodes = [mapData.results['0'].geometry.location.lat, mapData.results['0'].geometry.location.lng];
				 userTravelCity = mapData.results['0'].address_components['0'].long_name				
				 callMeetUPAPI(travelCityGeoCodes, userInterest);
          } else{
            $('#results').html('<p>Please enter a valid location or interest.</p>')
          }
   			},
   			error: function(){
   				$('#results').html('<p>There has been an error.</p>');
   			},
        statusCode: {
            404: function() {
      $( '#results' ).html('<p>Please enter a valid location.');
    }
  }
   		});
   }

function callMeetUPAPI(geocodes, interests){
  $.ajax({
    method:'GET',
    crossDomain: true,
    dataType: 'jsonp',//4=2
    url: `https://api.meetup.com/2/open_events?&sign=true&photo-host=public&lat=${geocodes[0]}&topic=${encodeURI(interests)}&lon=${geocodes[1]}&radius=70&page=15&key=434519614563187d65466f42b4e6b74`,
    success: function(meetupData){
      console.log('meetup data',meetupData.code)
      if (meetupData.code === 'badtopic'){
        $('#results').html(`<h2>Try searching for events like ${interests} with a common word to describe it...i.e. python for data science.</h2>`);
      }
      if(meetupData.meta.count == 0) {
        $('#results').html('<h2>There are no results for that in this town.</h2>');
      } else if (meetupData.meta.count === undefined){
        $('#results').html('<h2>There are no results for that.</h2>');
      } else {
      $('#results').html(`<h2>Events in ${userTravelCity}</h2>`);
      jQuery.each( meetupData.results, function( i ) {
        $('#results').append(`<li><a href=' ${meetupData.results[i].event_url}'> ${meetupData.results[i].name}</a> ${moment(meetupData.results[i].time).add(1,'hour').local().format('MMM DD hh:mm a')}</li>`);
          return (i < 10);
          }
        );
      }
    },
      error : function(){
        $('#results').html('<p>There is an error with the Meetup API</p>');
      }
  });
}  