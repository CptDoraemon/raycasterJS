const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;
//app.listen(port);
const WebSocket = require('ws');
const http = require("http");
const server = http.createServer(app);
server.listen(port);
const wss = new WebSocket.Server({ server: server });

app.use(express.static('client'));
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname  + '/client/raycaster0_5.html'));
});

function State() {
	// newPlayerObj = {
	// 	playerId: playerId,
	// 	x: 0,
	// 	y: 0,
	// 	currentJumpHeight: 0,
	// 	lastPing: new Date(),
	//	kill: 0,
	//	death: 0,
	//	latency: 0
	// };
	this.playersArray = [];
	this.isCheckTimeout = false;
}
const state = new State();

wss.on('connection', (ws) => {
	ws.send(JSON.stringify({type: 'serverMessage', payload: 'Greetings from the server!'}));
	
	ws.on('message', (message) => {
		try {
			message = JSON.parse(message);

			// already logged out user
			const isClientTimeout = checkAndHandleIfTimeout(message, ws);
			if (isClientTimeout) return;

		if (message.type === 'requestJoinGame') {
				newPlayerJoin(ws, wss);
			} else if (message.type === 'ping') {
				handlePing(ws, message);
			} else if (message.type === 'upLinkUpdatePosition') {
				handleUpLinkUpdatePosition(ws, message, wss);
			} else if (message.type === 'upLinkHit') {
				handleUpLinkHit(ws, message, wss);
			} else if (message.type === 'upLinkDeath') {
				handleUpLinkDeath(ws, message, wss);
			} else if (message.type === 'upLinkRespawn') {
				handleUpLinkRespawn(ws, message, wss);
			} 
		} catch (e) {
			console.log(e)
		}
	});

	ws.on('error', (e) => {
		console.log(e)
	});

	ws.on('close', (e) => {
		ws.close()
	});
});

function checkAndHandleIfTimeout(message, ws) {
	let result = false;
	if (message.playerId.length !== 0) {
		let playersArray = state.playersArray.slice();
		playersArray = playersArray.filter((obj) => {
			return obj.playerId === message.playerId;
		});
		if (playersArray.length === 0) {
			ws.send(JSON.stringify({type: 'serverMessage', payload: 'You were logged out by the server due to inactivity. To reconnect please refresh the page.'}));
			ws.close();
			result = true;
		}
	}
	return result
}
function checkTimeout() {
	if (!state.playersArray.length) {
		state.isCheckTimeout = false;
	} else {
		const now = new Date();
		const timeoutMax = 30 * 1000;
		let playersArray = state.playersArray.slice();
		let playerCount = playersArray.length;
		console.log('online player count: ' + playerCount);
		playersArray = playersArray.filter((playerObj) => {
			const lastPing = new Date(playerObj.lastPing);
			const timeDiff = now - lastPing;
			const isTimeout = (timeDiff > timeoutMax);
			if (isTimeout) {
				playerCount--;
				wss.clients.forEach(client => {
					if (client !== playerObj.ws) {
						client.send(JSON.stringify({type: 'downLinkSomeoneLogout', payload: playerObj.playerId}));
					}
				});
				playerObj.ws.close();
			}
			return timeDiff < timeoutMax;
		});
		state.playersArray = playersArray;
		// check every second
		setTimeout(checkTimeout, 1000);
	}
}

function newPlayerJoin(ws, wss) {

	// create newPlayerObj, send playerId back to client
	const playerId = (+new Date()).toString(36).slice(-8);
	ws.send(JSON.stringify({type: 'playerId', payload: playerId}));
	const newPlayerObj = {
		playerId: playerId,
		x: 0,
		y: 0,
		healthPoint: 100,
		currentJumpHeight: 0,
		lastPing: new Date(),
		ws: ws,
		kill: 0,
		death: 0,
		latency: 0
	};
	state.playersArray.push(newPlayerObj);

	// push state.playersArray to this new player
	const processedObjArray = [];
	state.playersArray.map(obj => {
		const processedObj = {
			playerId: obj.playerId,
			x: obj.x,
			y: obj.y,
			healthPoint: obj.healthPoint,
			currentJumpHeight: obj.currentJumpHeight,
			kill: obj.kill,
			death: obj.death,
			latency: obj.latency
		}
		processedObjArray.push(processedObj)
	});
	ws.send(JSON.stringify({type: 'downLinkInitiatePlayerObj', payload: processedObjArray}));

	// send playerCount message
	const playerCount = state.playersArray.length;
	const message = playerCount === 1 ? 
		'You are the only player online at this moment. (Wanna have some fun? You can create an another player by duplicating this tab.)' : 
		'There are ' + playerCount + ' players online';
	ws.send(JSON.stringify({type: 'serverMessage', payload: message}));

	// broadcast new player join to other clients
	const broadcastMessage = 'A new player: ' + playerId + ' has connected. There are ' + playerCount + ' players online.';
	wss.clients.forEach((client) => {
		if (client !== ws) {
			client.send(JSON.stringify({type: 'serverMessage', payload: broadcastMessage}));
		}
	})

	// start check timeout
	if (!state.isCheckTimeout) {
		state.isCheckTimeout = true;
		checkTimeout();
	}
}

function handlePing(ws, message) {
	const playerId = message.playerId;
	const now = new Date();

	state.playersArray.map((playerObj) => {
		if (playerObj.playerId === playerId) {
			playerObj.lastPing = now
		}
	});
	// ping back
	ws.send(JSON.stringify({type: 'pingBack', payload: message.payload}));
}

function handleUpLinkUpdatePosition(ws, message, wss) {
	const playerId = message.playerId;
	const received = message.payload;
	// insert into server state
	state.playersArray.map((playerObj) => {
		if (playerObj.playerId === playerId) {
			playerObj.x = received.x;
			playerObj.y = received.y;
			playerObj.currentJumpHeight = received.currentJumpHeight;
			playerObj.latency = received.latency;
			received.kill = playerObj.kill;
			received.death = playerObj.death;
		}
	});

	// broadcast, only send just updated player obj
	wss.clients.forEach((client) => {
		if (client !== ws) {
			client.send(JSON.stringify({type: 'downLinkUpdatePosition', payload: received}));
		}
	});
}

function handleUpLinkHit(ws, message, wss) {
	const damageFrom = message.playerId;
	const damageTo = message.payload.slice();
	
	state.playersArray.map(obj => {
		if (damageTo.indexOf(obj.playerId) !== -1 && !obj.isRespawning) {
			obj.ws.send(JSON.stringify({type: 'downLinkUpdateHitBy', payload: damageFrom}))
		}
	})
}

function handleUpLinkDeath(ws, message, wss) {
	const whoWasKilled = message.playerId;
	const killedBy = message.payload;
	let kill, death;

	state.playersArray.map(obj => {
		try {
			if (obj.playerId === whoWasKilled) {
				obj.isRespawning = true;
				death = ++obj.death;
			} else if (obj.playerId === killedBy) {
				kill = ++obj.kill;
				obj.ws.send(JSON.stringify({type: 'serverMessage', payload: 'You killed ' + whoWasKilled}));
				obj.ws.send(JSON.stringify({type: 'downLinkSomeoneRespawning', payload: whoWasKilled}));
			} else {
				obj.ws.send(JSON.stringify({type: 'serverMessage', payload: killedBy + ' killed ' + whoWasKilled}));
				obj.ws.send(JSON.stringify({type: 'downLinkSomeoneRespawning', payload: whoWasKilled}));
			}
		} catch (e){
			console.log(e)
		}
	})
	console.log(kill);
	const downLinkData = {
		whoWasKilled: whoWasKilled,
		death: death,
		killedBy: killedBy,
		kill: kill
	};
	wss.clients.forEach(client => {
		client.send(JSON.stringify({type: 'downLinkUpdateKillNDeath', payload: downLinkData}));
	});
}

function handleUpLinkRespawn(ws, message, wss) {
	const whoRespawned = message.playerId;
	state.playersArray.map(obj => {
		if (obj.playerId === whoRespawned) obj.isRespawning = false;
	})
	wss.clients.forEach((client) => {
		if (client !== ws) {
			client.send(JSON.stringify({type: 'downLinkSomeoneRespawned', payload: whoRespawned}));
		}
	})
}

