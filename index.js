const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
// const mongo = require('mongodb').MongoClient;
// const ObjectId = require('mongodb').ObjectID;
// const dbUri = process.env.MONGODB_URI || 'mongodb://test:abcd1234@ds125684.mlab.com:25684/freecodecamp';

const app = express();
const port = process.env.PORT || 5000;
app.listen(port);
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

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
	this.newPlayerId = 1;
	this.isCheckPing = false;
}
const state = new State();



wss.on('connection', (ws) => {
	ws.send(JSON.stringify({type: 'serverMessage', payload: 'Greetings from the server!'}));
	
	ws.on('message', (message) => {
		message = JSON.parse(message);
		if (message.type === 'requestJoinGame') {
			newPlayerJoin(ws);
		} else if (message.type === 'ping') {
			handlePing(ws, message);
		}
	});
});

function checkPing() {
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
		setTimeout(checkPing, 1000);
	}
}

function newPlayerJoin(ws) {
	// create newPlayerObj, send playerId back to client
	const playerId = state.newPlayerId;
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
	state.newPlayerId++;

	// send playerCount message
	const playerCount = state.playersArray.length;
	const message = playerCount === 1 ? 'You are the only player online at this moment' : 'There are ' + playerCount + ' players online';
	ws.send(JSON.stringify({type: 'serverMessage', payload: message}));

	// start check ping
	if (!state.isCheckPing) {
		checkPing();
		state.isCheckPing = true;
	}
}

function handlePing(ws, message) {
	const playerId = message.playerId;
	const now = new Date();

	this.playersArray.map((playerObj) => {
		if (playerObj.playerId === playerId) {
			playerObj.lastPing  = now
		}
	})
}
