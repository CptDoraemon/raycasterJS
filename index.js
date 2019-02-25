const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongo = require('mongodb').MongoClient;

const app = express();
const dbUri = process.env.MONGODB_URI || 'mongodb://test:abcd1234@ds125684.mlab.com:25684/freecodecamp';

const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

app.use(express.static('client'));
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname  + '/client/raycaster0_5.html'));
});

mongo.connect(dbUri, { useNewUrlParser: true }, (err, client) => {
    let dbName = process.env.DBNAME || 'freecodecamp';
	let db = client.db(dbName);

	wss.on('connection', (ws) => {
	  ws.on('message', (message) => {
	  	message = JSON.parse(message);
	    if (message.type === 'requestJoinGame') {
	    	requestJoinGame(db, ws, message.payload)
	    }
	  });

  		ws.send(JSON.stringify({type: 'serverMessage', payload: 'Hello from the server'}));
	});
});

function requestJoinGame(db, ws, payload) {
	(async function() {
		try {
			const player = await db.collection('raycaster').insertOne({
				x: payload.x,
				y: payload.y,
				currentJumpHeight: payload.jumpHeight,
				healthPoint: payload.healthPoint
			});
			ws.send(JSON.stringify({type: 'serverMessage', payload: player.insertedId}));
		} catch (e) {

		}
	})();
}

const port = process.env.PORT || 5000;
app.listen(port);