function sendMsg() {
	var msg = document.getElementById('textInput').value;
	chatChannel.publish({channel: 'Sandbox', message : msg});
	document.getElementById('textInput').value = '';
        }

function logOut() {
	chatChannel.unsubscribe({channel : 'Sandbox'});
	showView('homeView');
        }

function loadChat(user){
	if(user == 'read') {
		window.chatChannel = PUBNUB.init({
		subscribe_key: 'sub-c-ee7c4d30-e9ba-11e4-a30c-0619f8945a4f'
	});

		chatChannel.subscribe({
		channel: 'Sandbox',
		message: function(m){document.getElementById('chatWindow').value = m + '\n' + document.getElementById('chatWindow').value},
		connect: function(){console.log("Connected")},
		disconnect: function(){console.log("Disconnected")},
		reconnect: function(){console.log("Reconnected")},
		error: function(){console.log("Network Error")},         
 	});
    }

	else if (user == 'readwrite') {
		window.chatChannel = PUBNUB.init({
		publish_key: 'pub-c-c9b9bd43-e594-4146-b78a-716088b91de8',
		subscribe_key: 'sub-c-ee7c4d30-e9ba-11e4-a30c-0619f8945a4f'
		});
		chatChannel.subscribe({
        channel: 'Sandbox',
        message: function(m){document.getElementById('chatWindow').value = m + '\n' + document.getElementById('chatWindow').value},
        connect: function(){console.log("Connected")},
        disconnect: function(){console.log("Disconnected")},
        reconnect: function(){console.log("Reconnected")},
        error: function(){console.log("Network Error")},         
 	});        
    }

    showView('chatView');
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


