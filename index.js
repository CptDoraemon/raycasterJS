const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;
if( process.env.PORT ) {
    app.use((req, res, next) => {
        if (req.header('X-Forwarded-Proto') === 'https') {
            next();
        } else res.redirect('https://' + req.hostname + req.url);
    });
}

const WebSocket = require('ws');
const http = require("http");
const server = http.createServer(app);
server.listen(port);
const wss = new WebSocket.Server({ server: server });

app.use(express.static('./client/dist'));
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname  + '/client/dist/index.html'));
});

function State() {
	this.wsArray = [];
	this.playersArray = [];
	this.isCheckTimeout = false;
}
const state = new State();

wss.on('connection', (ws) => {
	ws.send(JSON.stringify({type: 'serverMessage', payload: 'Greetings from the server!'}));
	
	ws.on('message', (message) => {
		try {
			message = JSON.parse(message);

			if (message.what === 'upLinkRequestJoinGame') {
				handleUpLinkRequestJoinGame(ws, wss);
			} else if (message.what === 'upLinkUpdatePosition') {
				handleUpLinkUpdatePosition(message, ws, wss);
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

function handleUpLinkRequestJoinGame(ws, wss) {

	// create newPlayerObj, send playerId back to client
	const playerId = (+new Date()).toString(36).slice(-8);
	ws.send(JSON.stringify({what: 'downLinkRequestJoinGame', payload: playerId}));
	ws.send(JSON.stringify({what: 'serverMessage', payload: 'Greetings from the server! You can add more players by duplicating this tab.'}));


	// broadcast new player join to other clients
	const broadcastMessage = 'A new player: ' + playerId + ' has connected.';
	wss.clients.forEach((client) => {
		if (client !== ws) {
			client.send(JSON.stringify({what: 'serverMessage', payload: broadcastMessage}));
		}
	})
}

function handleUpLinkUpdatePosition(message, ws, wss) {
	//
	const payload = message.payload;
	const whoSentMessage = message.playerId;
	
	let isModified = 0;
	const playersArray = state.playersArray.slice();
	playersArray.map((obj) => {
		if (obj.playerId === whoSentMessage) {
			obj.x = payload.x,
			obj.y = payload.y,
			obj.accumulatedJumpHeight = payload.accumulatedJumpHeight,
			obj.healthPoint = payload.healthPoint,
			obj.death = payload.death,
			obj.latency = payload.latency,
			obj.timeSent = payload.timeSent,
			obj.isRespawning = payload.isRespawning,
			obj.lastCommunicated = new Date()

			isModified++;
		}
		if (payload.hitPlayerArray.length !== 0 && payload.hitPlayerArray.indexOf(obj.playerId) !== -1) {
			if (Array.isArray(obj.hitBy)) {
				obj.hitBy.push(whoSentMessage)
			} else {
				obj.hitBy = [whoSentMessage]
			}
		}
		// new kill
		if (payload.killedBy) {
			if (payload.killedBy === obj.playerId) {
				obj.kill++;
				obj.killerOf = whoSentMessage;
			}
		}
	});

	if (isModified === 0) {
		// player's obj doesn't exist on server yet
		payload.kill = 0;
		payload.lastCommunicated = new Date();
		playersArray.push(payload);

		state.wsArray.push({
			playerId: whoSentMessage,
			ws: ws
		})
	}


	// downLink
	ws.send(JSON.stringify({what: 'downLinkUpdatePosition', payload: playersArray}));

	// after sent
	playersArray.map((obj) => {
		if (obj.playerId === whoSentMessage) {
			obj.hitBy = [];
			obj.killerOf = null;
		}
	});

	state.playersArray = playersArray;
	//
	if (!state.isCheckTimeout) {
		state.isCheckTimeout = true;
		checkTimeout();
	}
}

function checkTimeout() {
	if (!state.playersArray.length) {
		state.isCheckTimeout = false;
		console.log('No player online');
	} else {
		const now = new Date();
		const timeoutMax = 30 * 1000;
		let playersArray = state.playersArray.slice();
		let playerCount = playersArray.length;
		console.log('online player count: ' + playerCount);
		playersArray = playersArray.filter((playerObj) => {
			const lastCommunicated = new Date(playerObj.lastCommunicated);
			const timeDiff = now - lastCommunicated;
			const isTimeout = (timeDiff > timeoutMax);
			if (isTimeout) {
				playerCount--;
				wss.clients.forEach(client => {
					client.send(JSON.stringify({what: 'serverMessage', payload: playerObj.playerId + ' left game'}));
				});
				state.wsArray.map((wsObj) => {
					if (wsObj.playerId === playerObj.playerId) {
						wsObj.ws.close()
					}
				});
				const modifiedWsArray = state.wsArray.filter((wsObj) => {
					return wsObj.playerId !== playerObj.playerId
				});
				state.wsArray = modifiedWsArray;
			}
			return !isTimeout;
		});
		state.playersArray = playersArray;
		// check every second
		setTimeout(checkTimeout, 1000);
	}
}

