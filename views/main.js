function success(position) {
  
  var coords = position.coords.latitude+ ',' +position.coords.longitude;
  console.log(coords);
  $('#geocoords').val(coords);
  $('#geobutton').text("Done!")
}


function geolocate() {
	if (navigator.geolocation) {
		// console.log(navigator.geolocation)
		$('#geobutton').text("wait...")
	  navigator.geolocation.getCurrentPosition(success);
	} else {
	  error('Geo Location is not supported');
	}
}

// dont know how to send the lat-lon information back to the server to processing

if (document.cookie) {
	$('.signup-link').hide();
	$('.signin-link').hide();
	$('.logout-link').show();
	$('.alias').text(Cookies.get('name'));
	$('.alias').show();
}
else {
	$('.signup-link').show();
	$('.signin-link').show();
	$('.logout-link').hide();
	$('.alias').text('');
	$('.alias').hide();
}