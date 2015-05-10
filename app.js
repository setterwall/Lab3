var geocoder;
var geocoder = new google.maps.Geocoder();
var alias;
var chatChannel;
var alpha;
var beta;
var gamma;
var subscribed;

function init(){
	
		//For pubnub
	var randomID = PUBNUB.uuid();
	chatChannel = PUBNUB.init({
			publish_key: 'pub-c-c9b9bd43-e594-4146-b78a-716088b91de8',
			subscribe_key: 'sub-c-ee7c4d30-e9ba-11e4-a30c-0619f8945a4f',
			uuid: randomID
	});

	var direction = "";
	var dir = document.getElementById("directionDiv");
	
	//For mobile orientation
	if(window.DeviceOrientationEvent) {
		window.addEventListener('deviceorientation', function(event) {
			alpha = event.alpha; //the direction the device is facing according to the compass
			beta = event.beta;	// the angle in degrees the device is tilted front-to-back
			gamma = event.gamma; //the angle in degrees the device is tilted left-to-right
			
			if((325 < alpha) || (alpha < 45)){//north is 0/360 RECIEVE
				if(direction != "North" && alpha != null){
					direction = "North"
					dir.value = "<b> Pointing: "+direction+"</b>";
				}
			}
			else if(45 < alpha && alpha < 135){ //east is 90 SEND
				if(direction != "East"){
					direction = "East";
					dir.innerHTML = "<b> Pointing: "+direction+"</b>";
					if(document.getElementById('textInput').value != ""){
						sendMsg();
					}
				}
			}
			else if(135 < alpha && alpha < 225){ //south is 180 SEND
				if(direction != "South"){
				direction = "South"  
				dir.innerHTML = "<b> Pointing: "+direction+"</b>";
				if(document.getElementById('textInput').value != ""){
						sendMsg();
				}
			}
			
			else if (225 < alpha && alpha < 325){//west is 270 RECIEVE
				if(direction != "West"){
					direction = "West";
					dir.innerHTML = "<b> Pointing: "+direction+"</b>";
				}
			}
			}
		});
	}
}
 
function sendMsg() {
	var msg = alias+ ' >> ' +document.getElementById('textInput').value;
	document.getElementById('textInput').value = '';
	chatChannel.publish({channel: 'Sandbox', message : msg});
}

function logOut() {
	PUBNUB.unsubscribe;
	showView('homeView');
	document.getElementById('chatWindow').value = '';
	document.getElementById('userName').value = '';
	document.getElementById('messageText').value = '';
}


//Ett chattrum för varje riktning, subscriba till den riktningen LOGIN väderstreck (loginsidan)
//Ett chattrum som är ett område som man kan välja via geohasning LOGIN geohashing

function loadChat(){
			
	init();

 
	alias = document.getElementById('userName').value;

		if(alias == ""){
		  var message = document.getElementById('messageText');
			message.innerHTML = "Enter an alias!";
		}

		else{
		//Empty chat window
		document.getElementById('chatWindow').value = '';
		chatChannel.subscribe({
		      channel: 'Sandbox',
		      message: function(m){document.getElementById('chatWindow').value = m + '\n' + document.getElementById('chatWindow').value},
		      connect: function(){console.log("Connected"); subscribed = true},
		      disconnect: function(){console.log("Disconnected")},
		      reconnect: function(){console.log("Reconnected")},
		      error: function(){console.log("Network Error")},
	 	});
		
		showView('chatView');  
		getLocation();

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

function countUsers(){

if(subscribed){
PUBNUB.here_now({
     channel : 'my_channel',
     callback : function(m){console.log(m)
		var msg = "In chatroom: "+m.occupancy+ " people";
			alert("Number subscribed: "+m.occupancy);
			console.log(m);
			//chatChannel.publish({channel: 'Sandbox', message : msg});
	 }
 });
}
}

function convertLocation(lat, lng) {
    var latlng = new google.maps.LatLng(lat, lng);
    geocoder.geocode({'latLng': latlng}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[1]) {
		 var msg = "New guest! '" +alias+"' enter the chatroom from "+results[0].formatted_address;
		 chatChannel.publish({channel: 'Sandbox', message : msg});
		 //sendMsg(msg);

        } else {
          alert("No results found");
        }
      } else {
        alert("Geocoder failed due to: " + status);
      }
    });
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
