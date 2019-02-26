const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
// const mongo = require('mongodb').MongoClient;
// const ObjectId = require('mongodb').ObjectID;
// const dbUri = process.env.MONGODB_URI || 'mongodb://test:abcd1234@ds125684.mlab.com:25684/freecodecamp';

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
	// 	healthPoint: 0,
	// 	currentJumpHeight: 0,
	// 	lastPing: new Date(),
	// };
	this.playersArray = [];
	this.isCheckTimeout = false;
}
const state = new State();

wss.on('connection', (ws) => {
	ws.send(JSON.stringify({type: 'serverMessage', payload: 'Greetings from the server!'}));
	
	ws.on('message', (message) => {
		message = JSON.parse(message);

		// already logged out user
		const isClientTimeout = checkAndHandleIfTimeout(message, ws);
		if (isClientTimeout) return;

		if (message.type === 'requestJoinGame') {
			newPlayerJoin(ws, wss);
		} else if (message.type === 'ping') {
			handlePing(ws, message);
		} else if (message.type === 'upLink') {
			handleUpLink(ws, message, wss);
		}
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
		state.isCheckPing = false;
	} else {
		const now = new Date();
		const timeoutMax = 30 * 1000;
		let playersArray = state.playersArray.slice();
		console.log('online player count: ' + playersArray.length);
		playersArray = playersArray.filter((playerObj) => {
			const lastPing = new Date(playerObj.lastPing);
			const timeDiff = now - lastPing;
			return timeDiff < timeoutMax;
		});
		state.playersArray = playersArray;
		// check every second
		setTimeout(checkTimeout, 1000);
	}
}

function newPlayerJoin(ws, wss) {
	// create newPlayerObj, send playerId back to client
	const playerId = (+new Date).toString(36).slice(-8);
	ws.send(JSON.stringify({type: 'playerId', payload: playerId}));
	const newPlayerObj = {
		playerId: playerId,
		x: 0,
		y: 0,
		healthPoint: 0,
		currentJumpHeight: 0,
		lastPing: new Date(),
	};
	state.playersArray.push(newPlayerObj);

	// send playerCount message
	const playerCount = state.playersArray.length;
	const message = playerCount === 1 ? 'You are the only player online at this moment' : 'There are ' + playerCount + ' players online';
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
		checkTimeout();
		state.isCheckTimeout = true;
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

function handleUpLink(ws, message, wss) {
	const playerId = message.playerId;
	const data = message.payload;
	state.playersArray.map((playerObj) => {
		if (playerObj.playerId === playerId) {
			playerObj.x = data.x;
			playerObj.y = data.y;
			playerObj.currentJumpHeight = data.currentJumpHeight;
			playerObj.healthPoint = data.healthPoint;
		}
	});
	wss.clients.forEach((client) => {
		if (client !== ws) {
			client.send(JSON.stringify({type: 'downLink', payload: state.playersArray.slice()}));
		}
	});
}
