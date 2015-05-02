var alias;
var geocoder;
var numberOfPeople;

function sendMsg() {
	var msg = document.getElementById('textInput').value;
	chatChannel.publish({channel: 'Sandbox', message : msg});
	document.getElementById('textInput').value = '';
}

function newUser() {
	 geocoder = new google.maps.Geocoder();
	 getLocation();
}

function logOut() {
	chatChannel.unsubscribe({channel : 'Sandbox'});
	showView('homeView');
	document.getElementById('chatWindow').value = '';
	document.getElementById('userName').value = '';
	document.getElementById('messageText').value = '';
}


function countNumberOfPeople(){
   PUBNUB.here_now({
        channel : 'my_channel',
        callback : function(m){        
         numberOfPeople = m.occupancy;
         console.log(m.occupancy);
         var number = document.getElementById('numberOfPeople');
         number.innerHTML =  "<b>In chatroom: </b>"+numberOfPeople+ " people";
        }
   });


}

function loadChat(){
	/**if(user == 'read') {
		window.chatChannel = PUBNUB.init({
		subscribe_key: 'sub-c-ee7c4d30-e9ba-11e4-a30c-0619f8945a4f'
	});*/

	alias = document.getElementById('userName').value;

		if(alias == ""){
		  var message = document.getElementById('messageText');
			message.innerHTML = "Enter an alias!";
		}

		else{
			document.getElementById('chatWindow').value = '';
			var randomID = PUBNUB.uuid();
			

			window.chatChannel = PUBNUB.init({
			publish_key: 'pub-c-c9b9bd43-e594-4146-b78a-716088b91de8',
			subscribe_key: 'sub-c-ee7c4d30-e9ba-11e4-a30c-0619f8945a4f',
			uuid: randomID
			});

			alias.fontcolor(getRandomColor())

			chatChannel.subscribe({
		      channel: 'Sandbox',
		      message: function(m){document.getElementById('chatWindow').value = alias + ': ' + m + '\n' + document.getElementById('chatWindow').value},
		      connect: function(){console.log("Connected")},
		      disconnect: function(){console.log("Disconnected")},
		      reconnect: function(){console.log("Reconnected")},
		      error: function(){console.log("Network Error")},         
	 	});

		showView('chatView');   
		newUser();
      countNumberOfPeople();
		}

}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else { 
        alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
	 convertLocation(position.coords.latitude, position.coords.longitude);	
}

function convertLocation(lat, lng) {

    var latlng = new google.maps.LatLng(lat, lng);
    geocoder.geocode({'latLng': latlng}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[1]) {
         outputLocation(results[0].formatted_address)

        } else {
          alert("No results found");
        }
      } else {
        alert("Geocoder failed due to: " + status);
      }
    });
  }

function outputLocation(tmp){
			var msg = "New guest! '" +alias+"' enter the chatroom from "+tmp;
			chatChannel.publish({channel: 'Sandbox', message : msg});
}

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

//Toggle between the different views
function showView(goto) {
	var views = document.getElementsByClassName('views');
    for (var i=0; i < views.length; i++) {
    	views[i].style.display = 'none';
    }
    var next = document.getElementById(goto);
    next.style.display = 'block';
}
