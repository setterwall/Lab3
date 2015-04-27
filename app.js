function sendMsg() {
	var msg = document.getElementById('textInput').value;
	chatChannel.publish({channel: 'demo_tutorial', message : msg});
	document.getElementById('textInput').value = '';
        }

function logOut() {
	chatChannel.unsubscribe({channel : 'demo_tutorial'});
	showView('homeView');
        }

function loadChat(user){
	if(user == 'read') {
		window.chatChannel = PUBNUB.init({
		subscribe_key: 'demo'
	});

		chatChannel.subscribe({
		channel: 'demo_tutorial',
		message: function(m){document.getElementById('chatWindow').value = m + '\n' + document.getElementById('chatWindow').value},
		connect: function(){console.log("Connected")},
		disconnect: function(){console.log("Disconnected")},
		reconnect: function(){console.log("Reconnected")},
		error: function(){console.log("Network Error")},         
 	});
    }

	else if (user == 'readwrite') {
		window.chatChannel = PUBNUB.init({
		publish_key: 'demo',
		subscribe_key: 'demo'
		});

		chatChannel.subscribe({
        channel: 'demo_tutorial',
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


